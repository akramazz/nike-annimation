import { apiUrl } from "@/lib/api-client";
import { getProductImage } from "@/lib/image-utils";

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
  sizes: string[];
  onSale?: boolean;
  salePrice?: number;
  salePercent?: number;
  likes?: number;
}

/** Simple client-side cache so subsequent fetches in the same request don't re-query. */
const fetchCache = new Map<string, UnifiedProduct | null>();

/**
 * Fetch a single product from MongoDB by _id or legacy numeric id.
 * Returns null if the product cannot be found.
 */
export async function getProduct(id: string): Promise<UnifiedProduct | null> {
  if (fetchCache.has(id)) return fetchCache.get(id) ?? null;

  try {
    const res = await fetch(apiUrl("/api/products"), { next: { revalidate: 300 } });
    const data = await res.json();

    if (!data.success || !Array.isArray(data.products)) {
      fetchCache.set(id, null);
      return null;
    }

    const found: UnifiedProduct | undefined = data.products.find(
      (p: UnifiedProduct) => p._id === id || String(p.id) === id,
    );

    const normalized = found ? { ...found, image: getProductImage(found.image) } : undefined;

    fetchCache.set(id, normalized ?? null);
    return normalized ?? null;
  } catch {
    return null;
  }
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
      }));
    }
    return [];
  } catch {
    return [];
  }
}
