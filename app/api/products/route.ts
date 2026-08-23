import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import connectDB from "@/utils/mongodb";
import Product from "@/models/Product";
import Rating from "@/models/Rating";
import { isAdminRequest } from "@/lib/admin-auth";
import { getProductImage } from "@/lib/image-utils";
import { normalizeCategory } from "@/lib/product-categories";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeUnpublished =
      isAdminRequest(request) &&
      searchParams.get("includeUnpublished") === "1";

    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10) || 12));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = includeUnpublished ? {} : { published: { $ne: false } };

    if (category) {
      filter.category = normalizeCategory(category);
    }
    if (minPrice !== null && minPrice !== "") {
      filter.price = { ...(filter.price as Record<string, number> | undefined), $gte: Math.max(0, Number(minPrice)) };
    }
    if (maxPrice !== null && maxPrice !== "") {
      filter.price = { ...(filter.price as Record<string, number> | undefined), $lte: Math.max(0, Number(maxPrice)) };
    }

    const sort: any = { createdAt: -1 };
    if (sortBy === "price_asc") sort.price = 1;
    else if (sortBy === "price_desc") sort.price = -1;
    else if (sortBy === "name") sort.name = 1;
    else if (sortBy === "rating") sort._id = 1;

    const useAggregation = minRating !== null && minRating !== "" && !includeUnpublished;

    let products: any[];
    let total: number;

    if (useAggregation) {
      const pipeline: any[] = [
        { $match: filter },
        {
          $addFields: {
            _idStr: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "ratings",
            localField: "_idStr",
            foreignField: "productId",
            as: "ratings",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$ratings.rating" },
            ratingCount: { $size: "$ratings" },
          },
        },
        { $match: { averageRating: { $gte: Number(minRating) } } },
      ];

      if (sortBy === "rating") {
        pipeline.push({ $sort: { averageRating: -1, ratingCount: -1, createdAt: -1 } });
      } else if (sortBy === "price_asc") {
        pipeline.push({ $sort: { price: 1 } });
      } else if (sortBy === "price_desc") {
        pipeline.push({ $sort: { price: -1 } });
      } else if (sortBy === "name") {
        pipeline.push({ $sort: { name: 1 } });
      } else {
        pipeline.push({ $sort: { createdAt: -1 } });
      }

      pipeline.push({ $skip: skip }, { $limit: limit });

      const [aggregated, countResult] = await Promise.all([
        Product.aggregate(pipeline),
        Product.aggregate([
          { $match: filter },
          {
            $addFields: {
              _idStr: { $toString: "$_id" },
            },
          },
          {
            $lookup: {
              from: "ratings",
              localField: "_idStr",
              foreignField: "productId",
              as: "ratings",
            },
          },
          { $addFields: { averageRating: { $avg: "$ratings.rating" } } },
          { $match: { averageRating: { $gte: Number(minRating) } } },
          { $count: "count" },
        ]),
      ]);

      products = aggregated;
      total = countResult.length > 0 ? countResult[0].count : 0;
    } else {
      const [dbProducts, dbTotal] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter),
      ]);

      products = dbProducts;
      total = dbTotal;
    }

    const plainProducts = products.map((p: any, index: number) => {
      const base: Record<string, unknown> = {
        ...p,
        id: includeUnpublished ? index + 1 : (p.id || index + 1),
        _id: p._id.toString(),
        image: getProductImage(p.image as string | undefined),
        published: p.published !== false,
        category: normalizeCategory(p.category as string | undefined),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
      };

      if (p.ratings && p.ratings.length > 0) {
        base.averageRating = Math.round((p.averageRating || 0) * 10) / 10;
        base.ratingCount = p.ratingCount || p.ratings.length;
      } else {
        base.averageRating = 0;
        base.ratingCount = 0;
      }

      return base;
    });

    return NextResponse.json({
      success: true,
      products: plainProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
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
