import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["pending", "confirmed", "shipped", "delivered", "cancelled"]);

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function clampStr(str: unknown, maxLen: number): string {
  return String(str || "").slice(0, maxLen).trim();
}

function parsePrice(val: unknown): number {
  const num = Number(val);
  return isNaN(num) || num < 0 ? 0 : Math.round(num * 100) / 100;
}

function parseIntSafely(val: unknown, fallback: number): number {
  const num = Number(val);
  return Number.isFinite(num) ? Math.floor(num) : fallback;
}

async function findProductByIdentifier(identifier: string | number | undefined) {
  if (!identifier) return null;
  const strId = String(identifier).trim();
  if (!strId) return null;

  let product = await Product.findById(strId);
  if (!product && !isNaN(Number(strId))) {
    product = await Product.findOne({ id: Number(strId) });
  }
  return product;
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = status && ALLOWED_STATUSES.has(status) ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    const plainOrders = orders.map((o) => ({
      ...o,
      _id: o._id.toString(),
      createdAt: o.createdAt?.toISOString(),
      updatedAt: o.updatedAt?.toISOString(),
    }));

    return NextResponse.json({ success: true, orders: plainOrders });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Order must include at least one item" }, { status: 400 });
    }

    const sanitizedItems = items.map((raw: unknown) => {
      const item = raw as Record<string, unknown>;
      return {
        productId: item.productId != null ? String(item.productId) : undefined,
        name: clampStr(item.name, 200),
        price: parsePrice(item.price),
        quantity: Math.max(1, parseIntSafely(item.quantity, 1)),
        color: clampStr(item.color, 80),
        size: clampStr(item.size, 32),
        image: clampStr(item.image, 500),
        category: clampStr(item.category, 80),
      };
    });

    const computedTotal = sanitizedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const clientTotal = parsePrice(body.total);
    const total = Math.abs(clientTotal - computedTotal) < 0.02 ? clientTotal : computedTotal;

    const customerName = clampStr(body.customerName, 120);
    const email = clampStr(body.email, 254);

    if (!customerName || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      customerName,
      email,
      phone: clampStr(body.phone, 40),
      address: clampStr(body.address, 500),
      city: clampStr(body.city, 120),
      postalCode: clampStr(body.postalCode, 32),
      country: clampStr(body.country, 120),
      total,
      status: "pending",
      stockAdjusted: false,
      items: sanitizedItems,
    });

    const plain = {
      ...order.toObject(),
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, order: plain }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    const id = String(body.id || "").trim();
    const newStatus = String(body.status || "").trim();

    if (!id || !ALLOWED_STATUSES.has(newStatus)) {
      return NextResponse.json({ success: false, error: "Valid order id and status are required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.status;
    if (previousStatus === newStatus) {
      const plain = {
        ...order.toObject(),
        _id: order._id.toString(),
        createdAt: order.createdAt?.toISOString(),
        updatedAt: order.updatedAt?.toISOString(),
      };
      return NextResponse.json({ success: true, order: plain });
    }

    const allowedNext = ALLOWED_TRANSITIONS[previousStatus];
    if (!allowedNext || !allowedNext.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Transition invalide: ${previousStatus} → ${newStatus}` },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (previousStatus === "pending" && newStatus === "confirmed") {
        if (order.stockAdjusted) {
          throw new Error("Le stock a déjà été déduit pour cette commande.");
        }

        for (const item of order.items) {
          const productId = item.productId;
          if (!productId) {
            throw new Error(`Produit introuvable pour l'article: ${item.name}`);
          }
          const product = await findProductByIdentifier(productId);
          if (!product) {
            throw new Error(`Produit introuvable: ${item.name}`);
          }
          if (product.stock < item.quantity) {
            throw new Error(`Stock insuffisant pour ${item.name}: ${product.stock} restants, ${item.quantity} demandés`);
          }
        }

        for (const item of order.items) {
          const productId = item.productId;
          if (!productId) {
            throw new Error(`Produit introuvable pour l'article: ${item.name}`);
          }
          const product = await findProductByIdentifier(productId);
          if (!product) {
            throw new Error(`Produit introuvable: ${item.name}`);
          }
          await Product.findByIdAndUpdate(
            product._id,
            { $inc: { stock: -item.quantity } },
            { session, new: true }
          );
        }

        order.stockAdjusted = true;
      } else if (previousStatus === "confirmed" && newStatus === "cancelled") {
        if (!order.stockAdjusted) {
          throw new Error("Le stock n'a pas été déduit, rien à restaurer.");
        }

        for (const item of order.items) {
          const product = await findProductByIdentifier(item.productId || item.name);
          if (product) {
            await Product.findByIdAndUpdate(
              product._id,
              { $inc: { stock: item.quantity } },
              { session, new: true }
            );
          }
        }

        order.stockAdjusted = false;
      }

      order.status = newStatus;
      await order.save({ session });

      await session.commitTransaction();

      const plain = {
        ...order.toObject(),
        _id: order._id.toString(),
        createdAt: order.createdAt?.toISOString(),
        updatedAt: order.updatedAt?.toISOString(),
      };

      return NextResponse.json({ success: true, order: plain });
    } catch (error) {
      await session.abortTransaction();
      const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    } finally {
      session.endSession();
    }
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";

    if (!id) {
      return NextResponse.json({ success: false, error: "Valid order id is required" }, { status: 400 });
    }

    const deleted = await Order.findById(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (deleted.status === "delivered") {
      return NextResponse.json(
        { success: false, error: "Une commande livrée ne peut pas être supprimée." },
        { status: 400 }
      );
    }

    if (deleted.status === "confirmed" && deleted.stockAdjusted) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        for (const item of deleted.items) {
          const product = await findProductByIdentifier(item.productId || item.name);
          if (product) {
            await Product.findByIdAndUpdate(
              product._id,
              { $inc: { stock: item.quantity } },
              { session, new: true }
            );
          }
        }
        await Order.findByIdAndDelete(id, { session });
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
        return NextResponse.json({ success: false, error: message }, { status: 400 });
      } finally {
        session.endSession();
      }
    } else {
      await Order.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}
