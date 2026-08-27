import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();

    const plainUsers = users.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    }));

    return NextResponse.json({ success: true, users: plainUsers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    console.error("GET /api/admin/users:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
