export interface AIProvider {
  name: string;
  generateImage(prompt: string, options?: ImageGenOptions): Promise<string>;
}

export interface ImageGenOptions {
  width?: number;
  height?: number;
  seed?: number;
  numGenerations?: number;
}

export interface GenerateResult {
  images: string[];
  mock: boolean;
  message?: string;
  error?: string;
}
