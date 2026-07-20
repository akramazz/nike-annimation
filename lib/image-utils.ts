export const DEFAULT_PRODUCT_IMAGE = "/products/default.webp";

/**
 * Normalise un chemin d'image produit pour le navigateur.
 * - Chemins locaux → /products/xxx.webp (minuscules)
 * - URLs http(s) → inchangées (casse préservée)
 */
export function getProductImage(input?: string | null): string {
  if (input == null || typeof input !== "string") {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const trimmed = input.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return DEFAULT_PRODUCT_IMAGE;
  }

  // URLs externes : ne pas altérer la casse
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  let path = trimmed.replace(/\\/g, "/");

  // Enlever un éventuel origin si collé par erreur
  path = path.replace(/^https?:\/\/[^/]+/i, "");

  if (path.startsWith("products/")) {
    path = `/${path}`;
  }

  if (!path.startsWith("/")) {
    path = `/products/${path}`;
  }

  if (!path.startsWith("/products/")) {
    // Autre chemin local (ex. /logo.png) — garder tel quel
    return path;
  }

  // Normaliser le nom de fichier en minuscules (fichiers du repo sont en minuscules)
  const filename = path.slice("/products/".length).split("?")[0].split("#")[0];
  if (!filename || filename === "undefined" || filename === "null") {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const lower = filename.toLowerCase();
  const withExt = lower.includes(".") ? lower : `${lower}.webp`;
  return `/products/${withExt}`;
}

export function isDefaultProductImage(src: string): boolean {
  return getProductImage(src) === DEFAULT_PRODUCT_IMAGE;
}
