export const DEFAULT_PRODUCT_IMAGE = "/products/default.webp";

export function getProductImage(input?: string | null): string {
  if (!input || typeof input !== "string") {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const lower = trimmed.toLowerCase();

  if (lower === "undefined" || lower === "null") {
    return DEFAULT_PRODUCT_IMAGE;
  }

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
  const final = filename.includes(".") ? filename : `${filename}.webp`;
  return `/products/${final}`;
}
