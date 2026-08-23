import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";
import { hashPassword, createSession, deleteUserSessions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email and password are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = crypto.randomBytes(32).toString("hex");
    await createSession(user._id.toString(), token);

    const plainUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };

    const response = NextResponse.json({ success: true, user: plainUser }, { status: 201 });
    response.cookies.set("user_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 });
  }
}
