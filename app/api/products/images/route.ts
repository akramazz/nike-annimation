import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const productsDir = path.join(process.cwd(), "public", "products");
    const files = await fs.readdir(productsDir, { withFileTypes: true });

    const images = files
      .filter((file) => file.isFile() && /\.(webp|jpg|jpeg|png|gif|avif)$/i.test(file.name))
      .map((file) => file.name)
      .sort();

    return NextResponse.json({ success: true, images });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to list product images" },
      { status: 500 },
    );
  }
}
