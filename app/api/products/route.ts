import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { isAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeProduct,
  type ProductRecord,
} from "@/lib/product-normalize";
import { clampStr, parsePositiveInt, parsePrice } from "@/lib/sanitize";
import { productToJson } from "@/lib/serialize-db";

export const dynamic = "force-dynamic";

function parseProductBody(body: Record<string, unknown>, id: number): ProductRecord {
  const sizesRaw = body.sizes;
  const sizes =
    Array.isArray(sizesRaw) && sizesRaw.length > 0
      ? sizesRaw.map((s) => clampStr(s, 8))
      : undefined;

  return normalizeProduct({
    id,
    name: clampStr(body.name, 120),
    color: clampStr(body.color, 80),
    image: clampStr(body.image, 500),
    price: parsePrice(body.price),
    stock: parsePositiveInt(body.stock, 0),
    description: clampStr(body.description, 2000),
    category: clampStr(body.category, 80),
    ...(sizes ? { sizes } : {}),
  });
}

export async function GET() {
  try {
    const rows = await prisma.product.findMany({ orderBy: { id: "asc" } });
    const products = rows.map(productToJson);
    return NextResponse.json({ success: true, products });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
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

    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 },
      );
    }

    const parsed = parseProductBody(body, 0);
    const created = await prisma.product.create({
      data: {
        name: parsed.name,
        color: parsed.color,
        image: parsed.image,
        price: parsed.price,
        stock: parsed.stock,
        description: parsed.description,
        category: parsed.category,
        sizes: parsed.sizes,
      },
    });

    return NextResponse.json(
      { success: true, product: productToJson(created) },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: "Failed to create product" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
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

    const id = parsePositiveInt(body.id, -1);
    if (id < 1) {
      return NextResponse.json(
        { success: false, error: "Valid product id is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    const base = productToJson(existing);
    const merged = parseProductBody(
      { ...base, ...body } as Record<string, unknown>,
      id,
    );

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: merged.name,
        color: merged.color,
        image: merged.image,
        price: merged.price,
        stock: merged.stock,
        description: merged.description,
        category: merged.category,
        sizes: merged.sizes,
      },
    });

    return NextResponse.json({ success: true, product: productToJson(updated) });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
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
        { success: false, error: "Valid product id is required" },
        { status: 400 },
      );
    }

    try {
      await prisma.product.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 },
        );
      }
      throw e;
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
