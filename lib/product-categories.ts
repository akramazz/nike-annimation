export const PRODUCT_CATEGORIES = {
  SWEAT: "Sweat",
  T_SHIRT: "T-shirt",
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES];

export const ALLOWED_CATEGORIES = Object.values(PRODUCT_CATEGORIES);

export function isProductCategory(value: unknown): value is ProductCategory {
  return typeof value === "string" && ALLOWED_CATEGORIES.includes(value as ProductCategory);
}

export function normalizeCategory(input?: string | null): ProductCategory {
  const raw = String(input ?? "").trim();
  if (!raw) return PRODUCT_CATEGORIES.SWEAT;

  const lower = raw.toLowerCase();
  if (lower.includes("veste") || lower.includes("jacket") || lower.includes("sweat")) {
    return PRODUCT_CATEGORIES.SWEAT;
  }
  if (lower.includes("accessoire") || lower.includes("t-shirt") || lower.includes("tshirt") || lower.includes("tee")) {
    return PRODUCT_CATEGORIES.T_SHIRT;
  }
  return PRODUCT_CATEGORIES.SWEAT;
}
