import { DEFAULT_SIZES } from "./product-normalize";

export type CatalogProduct = {
  name: string;
  color: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  sizes: string[];
};

/**
 * Métadonnées par défaut pour chaque image réelle dans public/products
 * (default.webp exclu — image de secours uniquement).
 */
export const PRODUCT_CATALOG: CatalogProduct[] = [
  {
    name: "Algeria Cœur",
    color: "Noir",
    image: "/products/akgeria-ceuor.webp",
    price: 79.99,
    stock: 20,
    description: "Design Algeria édition limitée",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Alg16 Vert",
    color: "Vert",
    image: "/products/alg16vert.webp",
    price: 84.99,
    stock: 18,
    description: "Collection streetwear Algérie",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Alger Rose",
    color: "Rose",
    image: "/products/algerrose.webp",
    price: 74.99,
    stock: 25,
    description: "Style urbain premium",
    category: "Luxury",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Alger Soleil",
    color: "Orange",
    image: "/products/algersoliel.webp",
    price: 89.99,
    stock: 12,
    description: "Édition soleil streetwear",
    category: "Luxury",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Anime Sezare",
    color: "Noir",
    image: "/products/anime-sezare.webp",
    price: 99.99,
    stock: 10,
    description: "Inspiration anime moderne",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Beige",
    color: "Beige",
    image: "/products/beage.webp",
    price: 59.99,
    stock: 20,
    description: "Minimalisme sophistiqué",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Beige 2",
    color: "Beige",
    image: "/products/beage2.webp",
    price: 59.99,
    stock: 22,
    description: "Minimalisme sophistiqué",
    category: "Classic",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Bleue",
    color: "Bleu",
    image: "/products/blue.webp",
    price: 59.99,
    stock: 30,
    description: "Style moderne et dynamique",
    category: "Classic",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Casbah",
    color: "Beige",
    image: "/products/casbah.webp",
    price: 69.99,
    stock: 20,
    description: "Inspiré de la Casbah d’Alger",
    category: "Classic",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Free Palestine",
    color: "Noir",
    image: "/products/freepalastine.webp",
    price: 79.99,
    stock: 30,
    description: "Design engagé premium",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Gris",
    color: "Gris",
    image: "/products/gris.webp",
    price: 220.99,
    stock: 15,
    description: "Sophistication et confort absolu",
    category: "Luxury",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Marron",
    color: "Marron",
    image: "/products/maron.webp",
    price: 33.99,
    stock: 40,
    description: "Chaleur et élégance naturelle",
    category: "Classic",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Marvel Edition",
    color: "Rouge",
    image: "/products/marvel.webp",
    price: 109.99,
    stock: 14,
    description: "Collection inspirée comics",
    category: "Luxury",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Noire",
    color: "Noir",
    image: "/products/noir.webp",
    price: 59.99,
    stock: 35,
    description: "Intemporelle et raffinée",
    category: "Classic",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Pistache",
    color: "Pistache",
    image: "/products/pistache.webp",
    price: 69.99,
    stock: 22,
    description: "Couleur vive et esprit jeune",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Rouge",
    color: "Rouge",
    image: "/products/rouge.webp",
    price: 69.99,
    stock: 25,
    description: "Élégance audacieuse pour un style unique",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Sekiro",
    color: "Noir",
    image: "/products/sekiro.webp",
    price: 119.99,
    stock: 9,
    description: "Design gaming japonais",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
  {
    name: "Veste Verte",
    color: "Vert",
    image: "/products/vert.webp",
    price: 88.99,
    stock: 18,
    description: "Fraîcheur et originalité",
    category: "Premium",
    sizes: [...DEFAULT_SIZES],
  },
];

/** Génère un produit par défaut à partir d’un nom de fichier inconnu. */
export function catalogFromFilename(filename: string): CatalogProduct {
  const known = PRODUCT_CATALOG.find(
    (p) => p.image === `/products/${filename.toLowerCase()}`,
  );
  if (known) return { ...known, sizes: [...known.sizes] };

  const base = filename.replace(/\.[^.]+$/, "");
  const label = base
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  return {
    name: label || "Produit",
    color: "Multicolore",
    image: `/products/${filename.toLowerCase()}`,
    price: 69.99,
    stock: 20,
    description: `${label} — collection DripBazzarDZ`,
    category: "Classic",
    sizes: [...DEFAULT_SIZES],
  };
}
