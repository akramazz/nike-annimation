import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const id = String(body.id || "").trim();
    const action = String(body.action || "").trim();

    if (!id || !["like", "unlike"].includes(action)) {
      return NextResponse.json({ success: false, error: "Valid product id and action required" }, { status: 400 });
    }

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const newLikes = action === "like" 
      ? (existing.likes || 0) + 1 
      : Math.max(0, (existing.likes || 0) - 1);

    const updated = await Product.findByIdAndUpdate(
      id,
      { likes: newLikes },
      { new: true }
    ).lean();

    const plain = {
      ...updated,
      _id: updated!._id.toString(),
      createdAt: updated!.createdAt?.toISOString(),
      updatedAt: updated!.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, product: plain, likes: newLikes });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update likes" }, { status: 500 });
  }
}
