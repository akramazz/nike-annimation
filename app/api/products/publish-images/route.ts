import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import { isAdminRequest } from "@/lib/admin-auth";
import { publishProductsFromImages } from "@/lib/product-images";

export const dynamic = "force-dynamic";

/** @deprecated Utiliser POST /api/products/publish */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const result = await publishProductsFromImages({
      updateExisting: true,
      markPublished: true,
    });

    return NextResponse.json({
      success: true,
      created: result.created,
      updated: result.updated,
      total: result.total,
      products: result.products,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish products from images";
    console.error("publish-images:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
