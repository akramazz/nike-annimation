export const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function normalizeProduct<T extends { id?: number; name?: string; color?: string; image?: string; price?: number; stock?: number; description?: string; category?: string; sizes?: string[] }>(data: T) {
  return {
    id: data.id ?? 0,
    name: String(data.name ?? "").slice(0, 120),
    color: String(data.color ?? "").slice(0, 80),
    image: String(data.image ?? "/products/default.webp").slice(0, 500),
    price: Math.max(0, Number(data.price ?? 0)),
    stock: Math.max(0, Math.floor(Number(data.stock ?? 0))),
    description: String(data.description ?? "").slice(0, 2000),
    category: String(data.category ?? "Classic").slice(0, 80),
    sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : DEFAULT_SIZES,
  };
}

export type ProductRecord = ReturnType<typeof normalizeProduct>;