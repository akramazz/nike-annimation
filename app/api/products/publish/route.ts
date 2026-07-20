import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import { isAdminRequest } from "@/lib/admin-auth";
import { publishProductsFromImages } from "@/lib/product-images";

export const dynamic = "force-dynamic";

/**
 * Publie des produits sur le site à partir des images dans public/products.
 * Body JSON optionnel :
 * - filenames: string[] — images ciblées
 * - updateExisting: boolean — écrase les produits existants avec le catalogue
 * - markPublished: boolean — rend visibles sur le site (défaut: true)
 */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    let body: {
      filenames?: string[];
      updateExisting?: boolean;
      markPublished?: boolean;
    } = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const result = await publishProductsFromImages({
      filenames: Array.isArray(body.filenames) ? body.filenames : undefined,
      updateExisting: Boolean(body.updateExisting),
      markPublished: body.markPublished !== false,
    });

    return NextResponse.json({
      success: true,
      ...result,
      message: `${result.created} créé(s), ${result.updated} mis à jour, ${result.skipped} ignoré(s), ${result.published} visible(s) sur le site.`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Échec de la publication des produits";
    console.error("POST /api/products/publish:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
