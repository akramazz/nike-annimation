import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_API_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Admin authentication is not configured. Set ADMIN_API_SECRET in the environment.",
      },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (typeof body.password !== "string" || body.password !== secret) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 },
    );
  }

  const token = createAdminSessionToken(secret);
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
