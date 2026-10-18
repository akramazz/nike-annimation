import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-auth";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

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

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  const expectedUsername = process.env.ADMIN_USERNAME?.trim() || "";
  const usernameOk = expectedUsername ? safeEqual(username, expectedUsername) : true;
  const passwordOk = safeEqual(password, secret);

  if (!usernameOk || !passwordOk) {
    return NextResponse.json(
      { success: false, error: "Identifiants invalides." },
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
