import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_token";
const COOKIE_PAYLOAD = "admin-session";

function expectedAdminToken(secret: string): string {
  return createHmac("sha256", secret).update(COOKIE_PAYLOAD).digest("hex");
}

/**
 * When ADMIN_API_SECRET is unset, admin mutations stay open (local dev).
 * When set, valid httpOnly cookie (from POST /api/auth/admin/login) is required.
 */
export function isAdminRequest(request: NextRequest): boolean {
  const secret = process.env.ADMIN_API_SECRET?.trim();
  if (!secret) return true;

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;

  try {
    const expected = Buffer.from(expectedAdminToken(secret), "utf8");
    const actual = Buffer.from(token, "utf8");
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createAdminSessionToken(secret: string): string {
  return expectedAdminToken(secret);
}
