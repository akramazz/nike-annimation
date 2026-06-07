export function normalizeProductImage(raw?: string | null): string {
  const DEFAULT = "/products/default.webp";

  if (!raw || typeof raw !== "string") return DEFAULT;

  const trimmed = raw.trim();
  if (!trimmed || trimmed === "/" || trimmed === "undefined" || trimmed === "null") return DEFAULT;

  const lower = trimmed.toLowerCase();

  if (lower === "undefined" || lower === "null") return DEFAULT;

  let path = lower;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/products/")) {
    return path;
  }

  if (path.startsWith("products/")) {
    return `/${path}`;
  }

  const filename = path.startsWith("/") ? path.slice(1) : path;

  return `/products/${filename}`;
}

export function publicProductImageExists(filename: string): boolean {
  const normalized = normalizeProductImage(filename);
  if (normalized.startsWith("http")) return true;
  return true;
}
