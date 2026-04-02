import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { isAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { clampStr, parsePositiveInt, parsePrice } from "@/lib/sanitize";
import { orderToJson } from "@/lib/serialize-db";

export const dynamic = "force-dynamic";

const ALLOWED_ORDER_STATUS = new Set([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      orders: orders.map(orderToJson),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must include at least one item" },
        { status: 400 },
      );
    }

    const sanitizedItems = items.map((raw) => {
      const item = raw as Record<string, unknown>;
      return {
        productId: parsePositiveInt(item.productId, -1),
        name: clampStr(item.name, 200),
        price: parsePrice(item.price),
        quantity: parsePositiveInt(item.quantity, 0),
        color: clampStr(item.color, 80),
        size: clampStr(item.size, 32),
        image: clampStr(item.image, 500),
      };
    });

    if (sanitizedItems.some((i) => i.productId < 1 || i.quantity < 1)) {
      return NextResponse.json(
        { success: false, error: "Each item needs a valid product and quantity" },
        { status: 400 },
      );
    }

    const computedTotal = sanitizedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const clientTotal = parsePrice(body.total);
    const total =
      Math.abs(clientTotal - computedTotal) < 0.02 ? clientTotal : computedTotal;

    const customerName = clampStr(body.customerName, 120);
    const email = clampStr(body.email, 254);
    if (!customerName || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 },
      );
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
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
          items: {
            create: sanitizedItems.map((i) => ({
              productId: i.productId,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              color: i.color,
              size: i.size,
              image: i.image,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of sanitizedItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (product) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: Math.max(0, product.stock - item.quantity),
            },
          });
        }
      }

      return created;
    });

    return NextResponse.json(
      { success: true, order: orderToJson(order) },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: "Failed to create order" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    let body: { id?: unknown; status?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const id = parsePositiveInt(body.id, -1);
    const status = String(body.status ?? "");
    if (id < 1 || !ALLOWED_ORDER_STATUS.has(status)) {
      return NextResponse.json(
        { success: false, error: "Valid order id and status are required" },
        { status: 400 },
      );
    }

    try {
      await prisma.order.update({
        where: { id },
        data: { status },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 },
        );
      }
      throw e;
    }

    const full = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!full) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, order: orderToJson(full) });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0", 10);
    if (!Number.isFinite(id) || id < 1) {
      return NextResponse.json(
        { success: false, error: "Valid order id is required" },
        { status: 400 },
      );
    }

    try {
      await prisma.order.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 },
        );
      }
      throw e;
    }

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 },
    );
  }
}
