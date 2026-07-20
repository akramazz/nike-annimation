import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import connectDB from "@/utils/mongodb";
import Product from "@/models/Product";
import { isAdminRequest } from "@/lib/admin-auth";
import { getProductImage } from "@/lib/image-utils";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ _id: 1 }).lean();
    const plainProducts = products.map((p, index) => ({
      ...p,
      id: index + 1,
      _id: p._id.toString(),
      image: getProductImage(p.image as string | undefined),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));
    return NextResponse.json({ success: true, products: plainProducts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    console.error("GET /api/products:", message);
    return NextResponse.json(
      { success: false, error: message },
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

    const image = getProductImage(body.image as string | undefined);

    const product = await Product.create({
      name,
      color: String(body.color || "").slice(0, 80) || "Default",
      image,
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

    const rawImage = getProductImage(
      (body.image as string | undefined) ?? (existing.image as string | undefined),
    );

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: String(body.name || existing.name).slice(0, 120),
        color: String(body.color || existing.color).slice(0, 80),
        image: rawImage,
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
