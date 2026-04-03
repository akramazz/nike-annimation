import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Product from "@/models/Product";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ _id: 1 }).lean();
    const plainProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));
    return NextResponse.json({ success: true, products: plainProducts });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();

    const name = String(body.name || "").trim().slice(0, 120);
    if (!name) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    const sizes = Array.isArray(body.sizes) && body.sizes.length > 0
      ? body.sizes.slice(0, 10).map((s: string) => String(s).slice(0, 8))
      : ["XS", "S", "M", "L", "XL", "XXL"];

    const product = await Product.create({
      name,
      color: String(body.color || "").slice(0, 80) || "Default",
      image: String(body.image || "").slice(0, 500) || `/products/default.webp`,
      price: Number(body.price) || 0,
      stock: Number(body.stock) || 0,
      description: String(body.description || "").slice(0, 2000),
      category: String(body.category || "Classic").slice(0, 80),
      sizes,
    });

    const plain = {
      ...product.toObject(),
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, product: plain }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ success: false, error: "Valid product id is required" }, { status: 400 });
    }

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const sizes = Array.isArray(body.sizes) && body.sizes.length > 0
      ? body.sizes.slice(0, 10).map((s: string) => String(s).slice(0, 8))
      : existing.sizes;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: String(body.name || existing.name).slice(0, 120),
        color: String(body.color || existing.color).slice(0, 80),
        image: String(body.image || existing.image).slice(0, 500),
        price: Number(body.price) || existing.price,
        stock: Number(body.stock) || existing.stock,
        description: String(body.description || existing.description).slice(0, 2000),
        category: String(body.category || existing.category).slice(0, 80),
        sizes,
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const plain = {
      ...updated,
      _id: updated._id.toString(),
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, product: plain });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "Valid product id is required" }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}