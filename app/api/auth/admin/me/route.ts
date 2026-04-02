import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authRequired = Boolean(process.env.ADMIN_API_SECRET?.trim());
  const authenticated = isAdminRequest(request);
  return NextResponse.json({
    success: true,
    authenticated,
    authRequired,
  });
}
