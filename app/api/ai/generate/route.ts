import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface GenerateRequest {
  prompt: string;
  color?: string;
  style?: string;
  logoText?: string;
  productCategory?: string;
}

function buildFullPrompt(body: GenerateRequest): string {
  const { prompt, color = "black", style = "", logoText = "" } = body;

  const styleMap: Record<string, string> = {
    minimalist: "minimalist design with clean lines and simple shapes",
    urban: "streetwear aesthetic with urban graffiti influences",
    anime: "anime/manga inspired illustration style",
    abstract: "abstract geometric composition",
    graffiti: "bold graffiti/tagging style with street art flair",
    vintage: "vintage retro design with distressed textures",
    tribal: "tribal patterns with Amazigh/Berber symbolic motifs",
  };

  const styleInstruction = style ? styleMap[style] || style : "versatile design";

  const colorInstruction = `Color scheme: ${color}.`;

  let fullPrompt = `${prompt}. ${colorInstruction} Style: ${styleInstruction}.`;

  if (logoText) {
    fullPrompt += ` Include the text "${logoText}" in the design as the central logo element, integrated naturally into the artwork.`;
  }

  fullPrompt += ` High quality, isolated on transparent background, centered composition, PNG format with transparency, suitable for direct printing on a sweatshirt/apparel. Sharp edges, clean vector-style illustration, no background, no additional text, no watermark.`;

  return fullPrompt;
}

function mockImages(prompt: string): string[] {
  const mockPrompts = [
    `mock-design-1-${prompt.slice(0, 20)}`,
    `mock-design-2-${prompt.slice(0, 20)}`,
    `mock-design-3-${prompt.slice(0, 20)}`,
  ];
  return mockPrompts.map((seed) => `https://dummyimage.com/512x512/1a1a1a/ffffff&text=${encodeURIComponent(seed)}`);
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const prompt: string = String(body.prompt || "").trim();
    const color: string = String(body.color || "black").trim();
    const style: string = String(body.style || "").trim();
    const logoText: string = String(body.logoText || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 },
      );
    }

    const apiKey =
      process.env.AI_API_KEY?.trim() ||
      process.env.OPENAI_API_KEY?.trim() ||
      process.env.HF_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: true,
          images: mockImages(prompt),
          mock: true,
          message:
            "HF_API_KEY is not configured. Displaying mock preview images for development.",
        },
        { status: 200 },
      );
    }

    const fullPrompt = buildFullPrompt({ prompt, color, style, logoText });

    const provider = process.env.AI_PROVIDER?.trim() || "huggingface";

    if (provider === "openai" || provider === "dalle") {
      const images = await generateWithOpenAI(apiKey, fullPrompt);
      return NextResponse.json({ success: true, images, mock: false });
    }

    if (provider === "huggingface" || provider === "hf") {
      const images = await generateWithHuggingFace(apiKey, fullPrompt);
      return NextResponse.json({ success: true, images, mock: false });
    }

    return NextResponse.json(
      { success: false, error: "Unsupported AI provider" },
      { status: 400 },
    );
    } catch (error: any) {
    console.error("AI generation error:", error);
    const detail = typeof error?.message === "string" ? error.message : "Failed to generate images";
    return NextResponse.json(
      { success: false, error: detail },
      { status: 500 },
    );
  }
}

async function generateWithOpenAI(
  apiKey: string,
  prompt: string,
): Promise<string[]> {
  const images: string[] = [];
  const numGenerations = 3;

  for (let i = 0; i < numGenerations; i++) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: "gpt-image-1",
        n: 1,
        size: "1024x1024",
        quality: "auto",
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await res.json();
    if (data.data && data.data[0] && data.data[0].b64_json) {
      images.push(`data:image/png;base64,${data.data[0].b64_json}`);
    }
  }

  return images;
}

async function generateWithHuggingFace(
  apiKey: string,
  prompt: string,
): Promise<string[]> {
  const images: string[] = [];
  const numGenerations = 3;
  const model =
    process.env.HF_MODEL?.trim() ||
    "stabilityai/stable-diffusion-3-medium-diffusers";

  const url = `https://router.huggingface.co/hf-inference/models/${model}`;

  for (let i = 0; i < numGenerations; i++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 512,
          height: 512,
          seed: Math.floor(Math.random() * 2147483647),
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      let errorDetail = "HuggingFace API error";
      try {
        const errJson = JSON.parse(errorText);
        errorDetail = errJson.error || errJson.detail || errJson.message || errorDetail;
      } catch {
        if (errorText) errorDetail = errorText;
      }
      throw new Error(`${errorDetail} (HTTP ${res.status})`);
    }

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("image/")) {
      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mime = contentType.split(";")[0].trim();
      images.push(`data:${mime};base64,${base64}`);
    } else {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        if (data[0].image) {
          images.push(data[0].image);
        } else if (data[0].b64_json) {
          const mime = contentType.includes("png") ? "image/png" : "image/jpeg";
          images.push(`data:${mime};base64,${data[0].b64_json}`);
        } else if (typeof data[0] === "string") {
          images.push(data[0]);
        }
      }
    }
  }

  return images;
}
