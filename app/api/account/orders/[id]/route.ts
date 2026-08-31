import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Order from "@/models/Order";
import { getCurrentUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const token = request.cookies.get("user_session")?.value;
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (String(order.userId) !== String(user._id)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const plain = {
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, order: plain });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}
