export interface StaticProduct {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: Array<{ url: string; isMain?: boolean }>;
  category: string;
  sizes: string[];
  likes?: number;
  stock: number;
  color: string;
}

export const STATIC_ACCESSORIES: StaticProduct[] = [
  { _id: "acc-1", id: 1, name: "Casquette Noir", description: "Casquette premium en coton avec logo brodé. Style urbain moderne avec ajustement confortable.", price: 49.99, image: "/products/casquette.webp", category: "T-shirt", sizes: ["S/M", "L/XL"], likes: 12, stock: 50, color: "T-shirt" },
  { _id: "acc-2", id: 2, name: "Casquette Noire", description: "Casquette anatomique avec strap arrière pour un ajustement parfait. Tissu respirant.", price: 39.99, image: "/products/casquettenoire.png", category: "T-shirt", sizes: ["S/M", "L/XL"], likes: 8, stock: 45, color: "T-shirt" },
  { _id: "acc-3", id: 3, name: "Écharpe Rouge", description: "Écharpe en laine premium rouge élégante. Douce et chaude pour l'hiver.", price: 89.99, image: "/products/chalrouge.webp", category: "T-shirt", sizes: ["Unique"], likes: 25, stock: 30, color: "T-shirt" },
  { _id: "acc-4", id: 4, name: "Écharpe Vert", description: "Écharpe douce en cachemire. Confort luxueux pour toutes les saisons.", price: 129.99, image: "/products/chal.webp", category: "T-shirt", sizes: ["Unique"], likes: 18, stock: 25, color: "T-shirt" },
  { _id: "acc-5", id: 5, name: "Ceinture Beige", description: "Ceinture cuir avec boucle argentée. Classique et élégante.", price: 79.99, image: "/products/sinture.webp", category: "T-shirt", sizes: ["S", "M", "L", "XL"], likes: 15, stock: 40, color: "T-shirt" },
  { _id: "acc-6", id: 6, name: "Casque Audio", description: "Casque premium sans fil avec réduction de bruit active. Son haute fidélité.", price: 199.99, image: "/products/cascadia.webp", category: "T-shirt", sizes: ["Unique"], likes: 32, stock: 20, color: "T-shirt" },
  { _id: "acc-7", id: 7, name: "Bob Noir", description: "Bob léger pour l'été. Protection UV et tissu respirant.", price: 29.99, image: "/products/bobnoir.webp", category: "T-shirt", sizes: ["S/M", "L/XL"], likes: 5, stock: 60, color: "T-shirt" },
  { _id: "acc-8", id: 8, name: "Sac Voyage", description: "Sac weekend en toile premium. Spacieux et résistant.", price: 149.99, image: "/products/tavares.webp", category: "T-shirt", sizes: ["Unique"], likes: 22, stock: 15, color: "T-shirt" },
  { _id: "acc-9", id: 9, name: "Lunettes Soleil", description: "Lunettes premium avec Protection UV400. Style et protection.", price: 159.99, image: "/products/facebeage.webp", category: "T-shirt", sizes: ["Unique"], likes: 45, stock: 35, color: "T-shirt" },
  { _id: "acc-10", id: 10, name: "Montre Classic", description: "Montre automatique avec bracelet cuir. Élégance intemporelle.", price: 299.99, image: "/products/vertface.webp", category: "T-shirt", sizes: ["Unique"], likes: 67, stock: 10, color: "T-shirt" },
  { _id: "acc-11", id: 11, name: "Montre Sport", description: "Montre connectée avec GPS. Pour les sportifs exigeants.", price: 399.99, image: "/products/orangeface.webp", category: "T-shirt", sizes: ["Unique"], likes: 39, stock: 8, color: "T-shirt" },
];

export const FALLBACK_JACKETS: StaticProduct[] = [
  { _id: "j-1", id: 101, name: "Veste Rouge", description: "Élégance audacieuse", price: 69.99, image: "/products/rouge.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 45, stock: 25, color: "Rouge" },
  { _id: "j-2", id: 102, name: "Veste Gris", description: "Sophistication absolue", price: 220.99, image: "/products/gris.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 32, stock: 15, color: "Gris" },
  { _id: "j-3", id: 103, name: "Veste Bleue", description: "Style moderne", price: 59.99, image: "/products/blue.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 28, stock: 30, color: "Bleu" },
  { _id: "j-4", id: 104, name: "Veste Marron", description: "Chaleur naturelle", price: 33.99, image: "/products/maron.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 19, stock: 40, color: "Marron" },
  { _id: "j-5", id: 105, name: "Veste Beige", description: "Minimalisme élégant", price: 59.99, image: "/products/beage.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 41, stock: 20, color: "Beige" },
  { _id: "j-6", id: 106, name: "Veste Noire", description: "Intemporelle", price: 59.99, image: "/products/noir.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 67, stock: 35, color: "Noir" },
  { _id: "j-7", id: 107, name: "Veste Verte", description: "Fraîcheur originale", price: 88.99, image: "/products/vert.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 23, stock: 18, color: "Vert" },
  { _id: "j-8", id: 108, name: "Veste Pistache", description: "Couleur vibrante", price: 69.99, image: "/products/pistache.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 36, stock: 22, color: "Pistache" },
  { _id: "j-9", id: 109, name: "Algeria Cœur", description: "Design Algeria édition limitée", price: 79.99, image: "/products/akgeria-ceuor.webp", images: [{ url: "/products/akgeria-ceuor.webp", isMain: true }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 15, stock: 20, color: "Noir" },
  { _id: "j-10", id: 110, name: "Alg16 Vert", description: "Collection streetwear Algérie", price: 84.99, image: "/products/alg16vert.webp", images: [{ url: "/products/alg16vert.webp", isMain: true }, { url: "/products/alg16.sweatblack.webp" }, { url: "/products/alg16.sweatblanc.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 21, stock: 18, color: "Vert" },
  { _id: "j-11", id: 111, name: "Alger Rose", description: "Style urbain premium", price: 74.99, image: "/products/algerrose.webp", images: [{ url: "/products/algerrose.webp", isMain: true }, { url: "/products/algrose.sweatblack.webp" }, { url: "/products/algrose.sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 19, stock: 25, color: "Rose" },
  { _id: "j-12", id: 112, name: "Alger Soleil", description: "Édition soleil streetwear", price: 89.99, image: "/products/algersoliel.webp", images: [{ url: "/products/algersoliel.webp", isMain: true }, { url: "/products/soliel.sweatblackjpg.webp" }, { url: "/products/soliel.sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 26, stock: 12, color: "Orange" },
  { _id: "j-13", id: 113, name: "Anime Sezare", description: "Inspiration anime moderne", price: 99.99, image: "/products/anime-sezare.webp", images: [{ url: "/products/anime-sezare.webp", isMain: true }, { url: "/products/anime-sweatblack..webp" }, { url: "/products/anime-sweat.white.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 41, stock: 10, color: "Noir" },
  { _id: "j-14", id: 114, name: "Casbah", description: "Inspiré de la Casbah d'Alger", price: 69.99, image: "/products/casbah.webp", images: [{ url: "/products/casbah.webp", isMain: true }, { url: "/products/casbah.sweatblack.webp" }, { url: "/products/casbah.sweat.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 33, stock: 20, color: "Beige" },
  { _id: "j-15", id: 115, name: "Free Palestine", description: "Design engagé premium", price: 79.99, image: "/products/freepalastine.webp", images: [{ url: "/products/freepalastine.webp", isMain: true }, { url: "/products/free-palastine.sweatblack.webp" }, { url: "/products/palastine-sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 58, stock: 30, color: "Noir" },
  { _id: "j-16", id: 116, name: "Marvel Edition", description: "Collection inspirée comics", price: 109.99, image: "/products/marvel.webp", images: [{ url: "/products/marvel.webp", isMain: true }, { url: "/products/marvel.sweatblack.webp" }, { url: "/products/marvel.sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 64, stock: 14, color: "Rouge" },
  { _id: "j-17", id: 117, name: "Oran Street", description: "Style inspiré d'Oran", price: 72.99, image: "/products/oran.webp", images: [{ url: "/products/oran.webp", isMain: true }, { url: "/products/oran.sweatblack.webp" }, { url: "/products/oran.sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 22, stock: 17, color: "Orange" },
  { _id: "j-18", id: 118, name: "Sekiro", description: "Design gaming japonais", price: 119.99, image: "/products/sekiro.webp", images: [{ url: "/products/sekiro.webp", isMain: true }, { url: "/products/sekiro.sweatblack.webp" }, { url: "/products/sekiro.sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL"], likes: 77, stock: 9, color: "Noir" },
];

export const CATALOG_PRODUCTS: StaticProduct[] = [
  { _id: "c-1", id: 201, name: "Algeria Cœur", description: "Design Algeria édition limitée", price: 79.99, image: "/products/akgeria-ceuor.webp", images: [{ url: "/products/akgeria-ceuor.webp", isMain: true }], category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 15, stock: 20, color: "Noir" },
  { _id: "c-2", id: 202, name: "Alg16 Vert", description: "Collection streetwear Algérie", price: 84.99, image: "/products/alg16vert.webp", images: [{ url: "/products/alg16vert.webp", isMain: true }, { url: "/products/alg16.sweatblack.webp" }, { url: "/products/alg16.sweatblanc.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 21, stock: 18, color: "Vert" },
  { _id: "c-3", id: 203, name: "Alger Rose", description: "Style urbain premium", price: 74.99, image: "/products/algerrose.webp", images: [{ url: "/products/algerrose.webp", isMain: true }, { url: "/products/algrose.sweatblack.webp" }, { url: "/products/algrose.sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 19, stock: 25, color: "Rose" },
  { _id: "c-4", id: 204, name: "Alger Soleil", description: "Édition soleil streetwear", price: 89.99, image: "/products/algersoliel.webp", images: [{ url: "/products/algersoliel.webp", isMain: true }, { url: "/products/soliel.sweatblackjpg.webp" }, { url: "/products/soliel.sweatwhite.webp" }], category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], likes: 26, stock: 12, color: "Orange" },
];

export const ALL_STATIC_PRODUCTS: StaticProduct[] = [
  ...STATIC_ACCESSORIES,
  ...FALLBACK_JACKETS,
  ...CATALOG_PRODUCTS,
];
