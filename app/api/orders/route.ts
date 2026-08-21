import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["pending", "confirmed", "shipped", "delivered", "cancelled"]);

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
      items: sanitizedItems,
    });

    for (const item of sanitizedItems) {
      const product = await Product.findOne({ name: item.name });
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

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
    const status = String(body.status || "").trim();

    if (!id || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ success: false, error: "Valid order id and status are required" }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const plain = {
      ...updated,
      _id: updated._id.toString(),
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, order: plain });
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

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}