import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Order from "@/models/Order";
import { getCurrentUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("user_session")?.value;
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const plainOrders = orders.map((o) => ({
      ...o,
      _id: o._id.toString(),
      createdAt: o.createdAt?.toISOString(),
      updatedAt: o.updatedAt?.toISOString(),
    }));

    return NextResponse.json({ success: true, orders: plainOrders });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
