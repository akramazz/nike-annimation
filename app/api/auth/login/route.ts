import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";
import { verifyPassword, createSession, deleteUserSessions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    await deleteUserSessions(user._id.toString());

    const token = crypto.randomBytes(32).toString("hex");
    await createSession(user._id.toString(), token);

    const plainUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };

    const response = NextResponse.json({ success: true, user: plainUser });
    response.cookies.set("user_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Failed to login" }, { status: 500 });
  }
}
