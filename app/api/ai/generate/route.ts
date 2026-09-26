import { NextRequest, NextResponse } from "next/server";
import { generateImages } from "../../../../lib/ai/generate";
import type { GenerateOptions } from "../../../../lib/ai/generate";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateOptions = await request.json();

    const prompt = String(body.prompt || "").trim();
    const color = String(body.color || "black").trim();
    const style = String(body.style || "").trim();
    const logoText = String(body.logoText || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 },
      );
    }

    const result = await generateImages(
      { prompt, color, style, logoText },
      3,
    );

    if (!result.images || result.images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to generate images",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      images: result.images,
      mock: result.mock,
      ...(result.message ? { message: result.message } : {}),
    });
  } catch (error: any) {
    console.error("AI generation error:", error);
    const detail =
      typeof error?.message === "string"
        ? error.message
        : "Failed to generate images";
    return NextResponse.json(
      {
        success: false,
        error: detail,
      },
      { status: 500 },
    );
  }
}
