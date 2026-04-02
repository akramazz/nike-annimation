export const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export type ProductRecord = {
  id: number;
  name: string;
  color: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  sizes: string[];
  createdAt?: string;
  updatedAt?: string;
};

export function normalizeProduct(p: Partial<ProductRecord> & { id: number }): ProductRecord {
  const sizes = Array.isArray(p.sizes) && p.sizes.length > 0
    ? p.sizes.map(String)
    : [...DEFAULT_SIZES];

  return {
    id: p.id,
    name: String(p.name ?? "").trim() || "Produit",
    color: String(p.color ?? "").trim() || "—",
    image: String(p.image ?? "").trim() || "/products/noir.webp",
    price: typeof p.price === "number" && !Number.isNaN(p.price) ? p.price : 0,
    stock: typeof p.stock === "number" && p.stock >= 0 ? Math.floor(p.stock) : 0,
    description: String(p.description ?? "").trim() || "",
    category: String(p.category ?? "Classic").trim() || "Classic",
    sizes,
    ...(p.createdAt ? { createdAt: p.createdAt } : {}),
    ...(p.updatedAt ? { updatedAt: p.updatedAt } : {}),
  };
}
