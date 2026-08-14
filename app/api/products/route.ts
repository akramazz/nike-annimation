import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import connectDB from "@/utils/mongodb";
import Product from "@/models/Product";
import { isAdminRequest } from "@/lib/admin-auth";
import { getProductImage } from "@/lib/image-utils";
import { normalizeCategory } from "@/lib/product-categories";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const includeUnpublished =
      isAdminRequest(request) &&
      new URL(request.url).searchParams.get("includeUnpublished") === "1";

    const filter = includeUnpublished ? {} : { published: { $ne: false } };
    const products = await Product.find(filter).sort({ _id: 1 }).lean();
    const plainProducts = products.map((p, index) => ({
      ...p,
      id: index + 1,
      _id: p._id.toString(),
      image: getProductImage(p.image as string | undefined),
      published: p.published !== false,
      category: normalizeCategory(p.category as string | undefined),
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

    const rawImages = Array.isArray(body.images) ? body.images : [];
    const images = rawImages
      .map((img: unknown) => {
        if (!img || typeof img !== "object") return null;
        const url = getProductImage((img as { url?: string }).url);
        if (!url) return null;
        return { url, isMain: Boolean((img as { isMain?: boolean }).isMain) };
      })
      .filter((img: { url: string; isMain: boolean } | null): img is { url: string; isMain: boolean } => img !== null)
      .slice(0, 20);

    if (images.length === 0 && image) {
      images.push({ url: image, isMain: true });
    } else if (images.length > 0 && !images.some((img: { url: string; isMain: boolean }) => img.isMain)) {
      images[0].isMain = true;
    }

    const product = await Product.create({
      name,
      color: String(body.color || "").slice(0, 80) || "Default",
      image,
      price: Number(body.price) || 0,
      stock: Number(body.stock) || 0,
      description: String(body.description || "").slice(0, 2000),
      category: normalizeCategory(String(body.category || "Classic")),
      sizes,
      published: body.published !== false,
      images,
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

    const existingImages = Array.isArray(existing.images) ? existing.images : [];
    const rawImages = Array.isArray(body.images) ? body.images : [];
    let images = rawImages
      .map((img: unknown) => {
        if (!img || typeof img !== "object") return null;
        const url = getProductImage((img as { url?: string }).url);
        if (!url) return null;
        return { url, isMain: Boolean((img as { isMain?: boolean }).isMain) };
      })
      .filter((img: { url: string; isMain: boolean } | null): img is { url: string; isMain: boolean } => img !== null)
      .slice(0, 20);

    if (images.length === 0 && rawImage) {
      images = [{ url: rawImage, isMain: true }, ...existingImages.filter((img) => img.url !== rawImage)];
    } else if (images.length > 0 && !images.some((img: { url: string; isMain: boolean }) => img.isMain)) {
      images[0].isMain = true;
    } else {
      images = [...images];
      for (const img of existingImages) {
        if (!images.some((i: { url: string }) => i.url === img.url)) {
          images.push(img);
        }
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: String(body.name || existing.name).slice(0, 120),
        color: String(body.color || existing.color).slice(0, 80),
        image: rawImage,
        price: Number(body.price) || existing.price,
        stock: Number(body.stock) || existing.stock,
        description: String(body.description || existing.description).slice(0, 2000),
        category: normalizeCategory(String(body.category || existing.category)),
        sizes,
        ...(typeof body.published === "boolean" ? { published: body.published } : {}),
        images,
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
