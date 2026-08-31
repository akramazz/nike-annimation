import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "8", 10) || 8));

    if (!q) {
      return NextResponse.json({ success: true, products: [] });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const products = await Product.find({ published: { $ne: false } })
      .or([{ name: { $regex: regex } }, { category: { $regex: regex } }])
      .limit(limit)
      .lean();

    const plain = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));

    return NextResponse.json({ success: true, products: plain });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to search products" }, { status: 500 });
  }
}
