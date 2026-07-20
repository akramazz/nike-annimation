import { NextRequest, NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";
import connectDB from "@/utils/mongodb";
import Product from "@/models/Product";
import { isAdminRequest } from "@/lib/admin-auth";
import { catalogFromFilename, PRODUCT_CATALOG } from "@/lib/product-catalog";

export const dynamic = "force-dynamic";

/**
 * Publie un produit pour chaque image dans public/products (sauf default.webp).
 * Upsert par chemin d’image : crée si absent, met à jour stock/prix/etc. si présent.
 */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const publicDir = join(process.cwd(), "public", "products");
    const allowedExt = new Set([".webp", ".png", ".jpg", ".jpeg"]);
    let files: string[] = [];

    try {
      files = await readdir(publicDir);
    } catch {
      files = PRODUCT_CATALOG.map((p) => p.image.replace("/products/", ""));
    }

    const imageFiles = files.filter((file) => {
      const lower = file.toLowerCase();
      if (lower === "default.webp") return false;
      const ext = lower.slice(lower.lastIndexOf("."));
      return allowedExt.has(ext);
    });

    let created = 0;
    let updated = 0;

    for (const file of imageFiles) {
      const data = catalogFromFilename(file);
      const existing = await Product.findOne({ image: data.image });

      if (existing) {
        existing.name = data.name;
        existing.color = data.color;
        existing.price = data.price;
        existing.stock = data.stock;
        existing.description = data.description;
        existing.category = data.category;
        existing.sizes = data.sizes;
        await existing.save();
        updated += 1;
      } else {
        await Product.create(data);
        created += 1;
      }
    }

    const products = await Product.find({}).sort({ _id: 1 }).lean();

    return NextResponse.json({
      success: true,
      created,
      updated,
      total: products.length,
      products: products.map((p, index) => ({
        ...p,
        id: index + 1,
        _id: p._id.toString(),
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish products from images";
    console.error("publish-images:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
