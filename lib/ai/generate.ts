import type { AIProvider, GenerateResult, ImageGenOptions } from "./types";
import { PollinationsProvider, HuggingFaceProvider, OpenAIProvider } from "./providers";

export interface GenerateOptions {
  prompt: string;
  color?: string;
  style?: string;
  logoText?: string;
  productCategory?: string;
}

function buildFullPrompt(body: GenerateOptions): string {
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

  fullPrompt += ` High quality, isolated on transparent background, centered composition, PNG format with transparency, suitable for direct printing on a sweatshirt/apparel. Sharp edges, clean vector-style illustration, no background, no watermark.`;

  return fullPrompt;
}

function isQuotaError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("402") ||
    msg.includes("quota") ||
    msg.includes("billing") ||
    msg.includes("credits") ||
    msg.includes("rate limit") ||
    msg.includes("insufficient")
  );
}

function buildProviderChain(): AIProvider[] {
  const chain: AIProvider[] = [];
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase() || "pollinations";

  if (provider === "pollinations") {
    chain.push(new PollinationsProvider());
  } else if (provider === "huggingface" || provider === "hf") {
    const hfKey = process.env.HF_API_KEY?.trim();
    if (hfKey) {
      const model = process.env.HF_MODEL?.trim();
      chain.push(new HuggingFaceProvider(hfKey, model));
    }
  } else if (provider === "openai" || provider === "dalle") {
    const openaiKey = process.env.OPENAI_API_KEY?.trim() || process.env.AI_API_KEY?.trim();
    if (openaiKey) {
      chain.push(new OpenAIProvider(openaiKey));
    }
  }

  if (provider !== "pollinations") {
    chain.push(new PollinationsProvider());
  }

  const hfKey = process.env.HF_API_KEY?.trim();
  if (hfKey && provider !== "huggingface" && provider !== "hf") {
    const model = process.env.HF_MODEL?.trim();
    chain.push(new HuggingFaceProvider(hfKey, model));
  }

  const openaiKey = process.env.OPENAI_API_KEY?.trim() || process.env.AI_API_KEY?.trim();
  if (openaiKey && provider !== "openai" && provider !== "dalle") {
    chain.push(new OpenAIProvider(openaiKey));
  }

  return chain;
}

function mockImages(prompt: string): string[] {
  const seeds = [`mock-design-1-${prompt.slice(0, 20)}`, `mock-design-2-${prompt.slice(0, 20)}`, `mock-design-3-${prompt.slice(0, 20)}`];
  return seeds.map((seed) => `https://dummyimage.com/512x512/1a1a1a/ffffff&text=${encodeURIComponent(seed)}`);
}

export async function generateImages(
  body: GenerateOptions,
  numImages: number = 3,
): Promise<GenerateResult> {
  const fullPrompt = buildFullPrompt(body);

  const chain = buildProviderChain();

  let lastError: string | null = null;
  const errors: string[] = [];

  for (const provider of chain) {
    try {
      const promises: Promise<string | null>[] = [];
      for (let i = 0; i < numImages; i++) {
        const seed = i > 0 ? Math.floor(Math.random() * 2147483647) : undefined;
        const opts: ImageGenOptions = { width: 512, height: 512, seed };
        promises.push(
          Promise.race([
            provider.generateImage(fullPrompt, opts),
            new Promise<string | null>((resolve) =>
              setTimeout(() => resolve(null), 30000),
            ),
          ]).catch(() => null),
        );
      }

      const results = await Promise.all(promises);
      const images = results.filter(
        (img): img is string => img != null && img.length > 0,
      );

      if (images.length === 0) {
        throw new Error("No images were generated");
      }

      return {
        images,
        mock: false,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      errors.push(`[${provider.name}] ${msg}`);
      lastError = msg;

      if (isQuotaError(error)) {
        break;
      }
    }
  }

  return {
    images: mockImages(fullPrompt),
    mock: true,
    message:
      "Aucun provider d'IA disponible ou quota épuisé. Images de prévisualisation générées localement.",
    error: errors.length ? errors.join("; ") : lastError || "Tous les providers ont échoué",
  };
}
