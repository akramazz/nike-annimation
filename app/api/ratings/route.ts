import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Rating from "@/models/Rating";
import { getCurrentUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

function parseProductId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  if (!productId || typeof productId !== "string") return null;
  const trimmed = productId.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const productId = parseProductId(request);
    if (!productId) {
      return NextResponse.json({ success: false, error: "productId is required" }, { status: 400 });
    }

    const [countResult, avgResult, userRating] = await Promise.all([
      Rating.countDocuments({ productId }),
      Rating.aggregate([
        { $match: { productId } },
        { $group: { _id: null, average: { $avg: "$rating" } } },
      ]),
      (async () => {
        const token = request.cookies.get("user_session")?.value;
        const user = await getCurrentUserFromToken(token);
        if (!user) return null;
        const r = await Rating.findOne({ userId: user._id, productId }).lean();
        return r ? { rating: r.rating } : null;
      })(),
    ]);

    const average = avgResult.length > 0 ? Math.round(avgResult[0].average * 10) / 10 : 0;

    return NextResponse.json({ success: true, average, count: countResult, userRating });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch ratings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("user_session")?.value;
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const productId = String(body.productId || "").trim();
    const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating))));

    if (!productId) {
      return NextResponse.json({ success: false, error: "productId is required" }, { status: 400 });
    }

    const updated = await Rating.findOneAndUpdate(
      { userId: user._id, productId },
      { userId: user._id, productId, rating, updatedAt: new Date() },
      { new: true, upsert: true }
    ).lean();

    const plain = {
      ...updated,
      _id: updated._id.toString(),
      userId: updated.userId,
      productId: updated.productId,
      rating: updated.rating,
    };

    return NextResponse.json({ success: true, rating: plain }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save rating" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const productId = parseProductId(request);
    if (!productId) {
      return NextResponse.json({ success: false, error: "productId is required" }, { status: 400 });
    }

    const token = request.cookies.get("user_session")?.value;
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await Rating.deleteOne({ userId: user._id, productId });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete rating" }, { status: 500 });
  }
}
