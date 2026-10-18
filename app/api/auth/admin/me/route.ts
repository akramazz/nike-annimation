import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authRequired =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.ADMIN_API_SECRET?.trim());
  const authenticated = isAdminRequest(request);
  const res = NextResponse.json({
    success: true,
    authenticated,
    authRequired,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}