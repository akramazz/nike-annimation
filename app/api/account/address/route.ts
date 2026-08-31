import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";
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

    const address = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      country: user.country || "",
    };

    return NextResponse.json({ success: true, address });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch address" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("user_session")?.value;
    const currentUser = await getCurrentUserFromToken(token);
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.firstName !== undefined) updates.firstName = String(body.firstName).trim() || undefined;
    if (body.lastName !== undefined) updates.lastName = String(body.lastName).trim() || undefined;
    if (body.phone !== undefined) updates.phone = String(body.phone).trim() || undefined;
    if (body.address !== undefined) updates.address = String(body.address).trim() || undefined;
    if (body.city !== undefined) updates.city = String(body.city).trim() || undefined;
    if (body.postalCode !== undefined) updates.postalCode = String(body.postalCode).trim() || undefined;
    if (body.country !== undefined) updates.country = String(body.country).trim() || undefined;

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updates },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Failed to update address" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: { id: updatedUser._id.toString() } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update address" }, { status: 500 });
  }
}
