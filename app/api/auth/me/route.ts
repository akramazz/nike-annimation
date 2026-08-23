import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import { getCurrentUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("user_session")?.value;
    const user = await getCurrentUserFromToken(token);
    return NextResponse.json({ success: true, user: user || null });
  } catch {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
