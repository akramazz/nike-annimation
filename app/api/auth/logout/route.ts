import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/utils/mongodb";
import { getCurrentUserFromToken, deleteSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("user_session")?.value;
    if (!token) {
      return NextResponse.json({ success: true });
    }
    await deleteSession(token);
    const response = NextResponse.json({ success: true });
    response.cookies.delete("user_session");
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Failed to logout" }, { status: 500 });
  }
}
