import { NextRequest, NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const publicDir = join(process.cwd(), "public", "products");
    const files = await readdir(publicDir);
    const allowedExt = new Set([".webp", ".png", ".jpg", ".jpeg"]);
    const images = files
      .filter((file) => {
        const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
        return allowedExt.has(ext);
      })
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
