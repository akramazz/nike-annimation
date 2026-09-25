import { apiUrl } from "@/lib/api-client";
import { getProductImage } from "@/lib/image-utils";
import { STATIC_ACCESSORIES, FALLBACK_JACKETS, CATALOG_PRODUCTS } from "@/lib/static-products";

export interface UnifiedProduct {
  _id: string;
  id?: number;
  name: string;
  color?: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  image: string;
  images?: Array<{ url: string; isMain?: boolean }>;
  sizes: string[];
  onSale?: boolean;
  salePrice?: number;
  salePercent?: number;
  likes?: number;
}

/** Simple client-side cache so subsequent fetches in the same request don't re-query. */
const fetchCache = new Map<string, UnifiedProduct | null>();

function toUnified(p: {
  _id?: string;
  id?: number;
  name: string;
  color?: string;
  image: string;
  images?: Array<{ url: string; isMain?: boolean }>;
  price: number;
  stock: number;
  description: string;
  category: string;
  sizes?: string[];
  onSale?: boolean;
  salePrice?: number;
  salePercent?: number;
  likes?: number;
}): UnifiedProduct {
  return {
    _id: String(p._id || p.id || Math.random().toString(36).slice(2)),
    id: p.id,
    name: String(p.name ?? "").slice(0, 120),
    color: String(p.color ?? "").slice(0, 80) || undefined,
    image: getProductImage(p.image),
    images: Array.isArray(p.images)
      ? p.images.map((img) => ({
          url: getProductImage(img.url),
          isMain: img.isMain,
        }))
      : undefined,
    price: Math.max(0, Number(p.price ?? 0)),
    stock: Math.max(0, Math.floor(Number(p.stock ?? 0))),
    description: String(p.description ?? "").slice(0, 2000),
    category: String(p.category ?? "Classic").slice(0, 80),
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["XS", "S", "M", "L", "XL", "XXL"],
    onSale: p.onSale,
    salePrice: p.salePrice,
    salePercent: p.salePercent,
    likes: p.likes,
  };
}

function normalizeCatalogProduct(p: {
  name: string;
  color: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  sizes: string[];
}): UnifiedProduct {
  return toUnified({
    ...p,
    _id: `catalog-${p.image.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
    likes: 0,
  });
}

/**
 * Fetch a single product from MongoDB by _id or legacy numeric id.
 * Falls back to static catalog/accessories data when not found in DB.
 */
export async function getProduct(id: string): Promise<UnifiedProduct | null> {
  if (fetchCache.has(id)) return fetchCache.get(id) ?? null;

  try {
    const res = await fetch(apiUrl("/api/products"), { next: { revalidate: 300 } });
    const data = await res.json();

    if (data.success && Array.isArray(data.products)) {
      const found: UnifiedProduct | undefined = data.products.find(
        (p: UnifiedProduct) => p._id === id || String(p.id) === id,
      );

      if (found) {
        const normalized = { ...found, image: getProductImage(found.image) };
        fetchCache.set(id, normalized);
        return normalized;
      }
    }
  } catch {
    /* network error — fall through to static fallbacks */
  }

  const trimmedId = String(id).trim();

  const staticAccessories = STATIC_ACCESSORIES;
  if (staticAccessories) {
    const foundAcc = staticAccessories.find(
      (p) => String(p._id) === trimmedId || String(p.id) === trimmedId,
    );
    if (foundAcc) {
      const normalized = toUnified(foundAcc);
      fetchCache.set(id, normalized);
      return normalized;
    }
  }

  const catalogEntry = CATALOG_PRODUCTS.find((p) => p.image.toLowerCase() === trimmedId.toLowerCase());
  if (catalogEntry) {
    const normalized = normalizeCatalogProduct(catalogEntry);
    fetchCache.set(id, normalized);
    return normalized;
  }

  fetchCache.set(id, null);
  return null;
}

/**
 * Fetch all products — used by listing / category pages.
 * @param revalidate Seconds between revalidation (default: 300 = 5 min).
 */
export async function getAllProducts(
  revalidate: number = 300,
): Promise<UnifiedProduct[]> {
  try {
    const res = await fetch(apiUrl("/api/products"), {
      next: { revalidate },
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.products)) {
      return (data.products as UnifiedProduct[]).map((p) => ({
        ...p,
        image: getProductImage(p.image),
        images: Array.isArray(p.images)
          ? p.images.map((img) => ({
              url: getProductImage(img.url),
              isMain: img.isMain,
            }))
          : undefined,
      }));
    }
    return [];
  } catch {
    return [];
  }
}
