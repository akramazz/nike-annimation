import type { AIProvider, ImageGenOptions } from "./types";

/**
 * Pollinations.ai — free image generation, no API key required.
 * Docs: https://pollinations.ai/
 */
export class PollinationsProvider implements AIProvider {
  name = "pollinations";
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || "https://image.pollinations.ai/prompt/").replace(/\/$/, "");
  }

  private buildUrl(prompt: string, opts?: ImageGenOptions): string {
    const params = new URLSearchParams();
    params.set("width", String(opts?.width || 512));
    params.set("height", String(opts?.height || 512));
    params.set("nologo", "true");
    params.set("private", "true");
    if (opts?.seed !== undefined && opts.seed > 0) {
      params.set("seed", String(opts.seed));
    }
    const encoded = encodeURIComponent(prompt);
    return `${this.baseUrl}/${encoded}?${params.toString()}`;
  }

  async generateImage(prompt: string, opts?: ImageGenOptions): Promise<string> {
    const url = this.buildUrl(prompt, opts);
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      throw new Error(`Pollinations API error (HTTP ${res.status})`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("image/")) {
      const text = await res.text().catch(() => "");
      throw new Error(`Unexpected response from Pollinations: ${text.slice(0, 200)}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mime = contentType.split(";")[0].trim();
    return `data:${mime};base64,${base64}`;
  }
}

/**
 * HuggingFace Inference Providers — requires HF_API_KEY.
 * Kept as fallback only; does NOT retry on HTTP 402 (quota exhausted).
 */
export class HuggingFaceProvider implements AIProvider {
  name = "huggingface";
  private readonly apiKey: string;
  private readonly model: string;

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    this.model = model || "stabilityai/stable-diffusion-3-medium-diffusers";
  }

  async generateImage(prompt: string, opts?: ImageGenOptions): Promise<string> {
    const url = `https://router.huggingface.co/hf-inference/models/${this.model}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: opts?.width || 512,
          height: opts?.height || 512,
          seed: opts?.seed ?? Math.floor(Math.random() * 2147483647),
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
      return `data:${mime};base64,${base64}`;
    }

    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      if (data[0].image) return data[0].image;
      if (data[0].b64_json) {
        const mime = contentType.includes("png") ? "image/png" : "image/jpeg";
        return `data:${mime};base64,${data[0].b64_json}`;
      }
      if (typeof data[0] === "string") return data[0];
    }
    throw new Error("HuggingFace returned unexpected response format");
  }
}

/**
 * OpenAI DALL·E — requires OPENAI_API_KEY (or AI_API_KEY).
 */
export class OpenAIProvider implements AIProvider {
  name = "openai";
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
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
      throw new Error(error.error?.message || `OpenAI API error (HTTP ${res.status})`);
    }

    const data = await res.json();
    if (data.data && data.data[0] && data.data[0].b64_json) {
      return `data:image/png;base64,${data.data[0].b64_json}`;
    }
    throw new Error("OpenAI returned unexpected response format");
  }
}
