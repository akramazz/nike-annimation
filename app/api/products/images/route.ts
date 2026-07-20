import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  listProductImagesWithStatus,
  saveUploadedProductImage,
  deleteProductImageFile,
  MAX_UPLOAD_BYTES,
  ALLOWED_IMAGE_EXTENSIONS,
} from "@/lib/product-images";

export const dynamic = "force-dynamic";

/** Liste les images produit avec statut de publication (admin). */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const images = await listProductImagesWithStatus();
    return NextResponse.json({ success: true, images });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de lister les images";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** Upload une image produit dans public/products (admin). */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Fichier image requis (champ « file »)." },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: "Image trop volumineuse (max 5 Mo)." },
        { status: 400 },
      );
    }

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: "Format non supporté (.webp, .png, .jpg, .jpeg)." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveUploadedProductImage(file.name, buffer);

    return NextResponse.json(
      { success: true, image: saved, message: "Image téléversée." },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Échec du téléversement";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** Supprime une image non liée à un produit (admin). */
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename")?.trim();

    if (!filename) {
      return NextResponse.json(
        { success: false, error: "Paramètre « filename » requis." },
        { status: 400 },
      );
    }

    await deleteProductImageFile(filename);
    return NextResponse.json({ success: true, message: "Image supprimée." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de supprimer l'image";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
