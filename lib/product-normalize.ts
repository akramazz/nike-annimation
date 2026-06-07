export const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export { getProductImage as normalizeProductImage } from "./image-utils";

export function normalizeProduct<T extends { id?: number; name?: string; color?: string; image?: string; price?: number; stock?: number; description?: string; category?: string; sizes?: string[] }>(data: T) {
  return {
    id: data.id ?? 0,
    name: String(data.name ?? "").slice(0, 120),
    color: String(data.color ?? "").slice(0, 80),
    image: normalizeProductImage(data.image),
    price: Math.max(0, Number(data.price ?? 0)),
    stock: Math.max(0, Math.floor(Number(data.stock ?? 0))),
    description: String(data.description ?? "").slice(0, 2000),
    category: String(data.category ?? "Classic").slice(0, 80),
    sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : DEFAULT_SIZES,
  };
}

export type ProductRecord = ReturnType<typeof normalizeProduct>;

export { getProductImage, DEFAULT_PRODUCT_IMAGE } from "./image-utils";
