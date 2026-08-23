"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import { apiUrl } from "@/lib/api-client";
import { normalizeProductImage } from "@/lib/product-normalize";
import { normalizeCategory, PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { useCart } from "../context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Heart } from "lucide-react";
import { STATIC_ACCESSORIES } from "@/lib/static-accessories";
import { formatPriceDA } from "@/lib/price-utils";

interface Product {
  _id: string;
  id?: number;
  name: string;
  color: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  sizes: string[];
  onSale?: boolean;
  salePrice?: number;
  salePercent?: number;
  likes?: number;
  type?: "jacket" | "accessory";
  averageRating?: number;
  ratingCount?: number;
}

const accessoriesData: Product[] = STATIC_ACCESSORIES.map((acc) => ({
  ...acc,
  color: "T-shirt",
  type: "accessory" as const,
  averageRating: 0,
  ratingCount: 0,
}));

const fallbackJackets: Product[] = [
  { _id: "j-1", id: 101, name: "Veste Rouge", color: "Rouge", price: 69.99, stock: 25, image: "/products/rouge.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Élégance audacieuse", type: "jacket", likes: 45, averageRating: 0, ratingCount: 0 },
  { _id: "j-2", id: 102, name: "Veste Gris", color: "Gris", price: 220.99, stock: 15, image: "/products/gris.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Sophistication absolue", type: "jacket", likes: 32, averageRating: 0, ratingCount: 0 },
  { _id: "j-3", id: 103, name: "Veste Bleue", color: "Bleu", price: 59.99, stock: 30, image: "/products/blue.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Style moderne", type: "jacket", likes: 28, averageRating: 0, ratingCount: 0 },
  { _id: "j-4", id: 104, name: "Veste Marron", color: "Marron", price: 33.99, stock: 40, image: "/products/maron.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Chaleur naturelle", type: "jacket", likes: 19, averageRating: 0, ratingCount: 0 },
  { _id: "j-5", id: 105, name: "Veste Beige", color: "Beige", price: 59.99, stock: 20, image: "/products/beage.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Minimalisme élégant", type: "jacket", likes: 41, averageRating: 0, ratingCount: 0 },
  { _id: "j-6", id: 106, name: "Veste Noire", color: "Noir", price: 59.99, stock: 35, image: "/products/noir.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Intemporelle", type: "jacket", likes: 67, averageRating: 0, ratingCount: 0 },
  { _id: "j-7", id: 107, name: "Veste Verte", color: "Vert", price: 88.99, stock: 18, image: "/products/vert.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Fraîcheur originale", type: "jacket", likes: 23, averageRating: 0, ratingCount: 0 },
  { _id: "j-8", id: 108, name: "Veste Pistache", color: "Pistache", price: 69.99, stock: 22, image: "/products/pistache.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Couleur vibrante", type: "jacket", likes: 36, averageRating: 0, ratingCount: 0 },
  { _id: "j-9", id: 109, name: "Algeria Cœur", color: "Noir", price: 79.99, stock: 20, image: "/products/akgeria-ceuor.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Design Algeria édition limitée", type: "jacket", likes: 15, averageRating: 0, ratingCount: 0 },
  { _id: "j-10", id: 110, name: "Alg16 Vert", color: "Vert", price: 84.99, stock: 18, image: "/products/alg16vert.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Collection streetwear Algérie", type: "jacket", likes: 21, averageRating: 0, ratingCount: 0 },
  { _id: "j-11", id: 111, name: "Alger Rose", color: "Rose", price: 74.99, stock: 25, image: "/products/algerrose.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Style urbain premium", type: "jacket", likes: 19, averageRating: 0, ratingCount: 0 },
  { _id: "j-12", id: 112, name: "Alger Soleil", color: "Orange", price: 89.99, stock: 12, image: "/products/algersoliel.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Édition soleil streetwear", type: "jacket", likes: 26, averageRating: 0, ratingCount: 0 },
  { _id: "j-13", id: 113, name: "Anime Sezare", color: "Noir", price: 99.99, stock: 10, image: "/products/anime-sezare.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Inspiration anime moderne", type: "jacket", likes: 41, averageRating: 0, ratingCount: 0 },
  { _id: "j-14", id: 114, name: "Casbah", color: "Beige", price: 69.99, stock: 20, image: "/products/casbah.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Inspiré de la Casbah d'Alger", type: "jacket", likes: 33, averageRating: 0, ratingCount: 0 },
  { _id: "j-15", id: 115, name: "Free Palestine", color: "Noir", price: 79.99, stock: 30, image: "/products/freepalastine.webp", category: "Sweat", sizes: ["XS","S","M","L","XL","XXL"], description: "Design engagé premium", type: "jacket", likes: 58, averageRating: 0, ratingCount: 0 },
  { _id: "j-16", id: 116, name: "Marvel Edition", color: "Rouge", price: 109.99, stock: 14, image: "/products/marvel.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Collection inspirée comics", type: "jacket", likes: 64, averageRating: 0, ratingCount: 0 },
  { _id: "j-17", id: 117, name: "Oran Street", color: "Orange", price: 72.99, stock: 17, image: "/products/oran.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Style inspiré d'Oran", type: "jacket", likes: 22, averageRating: 0, ratingCount: 0 },
  { _id: "j-18", id: 118, name: "Sekiro", color: "Noir", price: 119.99, stock: 9, image: "/products/sekiro.webp", category: "Sweat", sizes: ["XS","S","M","L","XL"], description: "Design gaming japonais", type: "jacket", likes: 77, averageRating: 0, ratingCount: 0 },
];

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCart();
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [showSizeError, setShowSizeError] = useState<Record<string, boolean>>({});

  const category = searchParams.get("category") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category && category !== "all") params.set("category", category);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (minRating) params.set("minRating", minRating);
        if (sortBy && sortBy !== "createdAt") params.set("sortBy", sortBy);
        params.set("page", String(page));
        params.set("limit", "12");

        const res = await fetch(apiUrl(`/api/products?${params.toString()}`), { next: { revalidate: 60 } });
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const jackets = data.products.map((p: Product) => ({ ...p, type: "jacket" as const }));
          setProducts([...accessoriesData, ...jackets]);
          setPagination(data.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 });
        } else {
          setProducts([...accessoriesData, ...fallbackJackets]);
          setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
        }
      } catch {
        setProducts([...accessoriesData, ...fallbackJackets]);
        setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
      }
      setLoading(false);
    };
    fetchProducts();
  }, [category, minPrice, maxPrice, minRating, sortBy, page]);

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id ?? product._id}`);
  };

  const handleAddToCart = (product: Product) => {
    const productId = product._id;
    const selectedSize = selectedSizes[productId];
    if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique" && !selectedSize) {
      setShowSizeError((prev) => ({ ...prev, [productId]: true }));
      return;
    }
    setShowSizeError((prev) => ({ ...prev, [productId]: false }));
    const size = selectedSize || product.sizes?.[0] || "Unique";
    const productNumericId = product.id || 1;
    addItem({
      id: productNumericId,
      name: product.name,
      price: product.price,
      image: normalizeProductImage(product.image),
      color: product.color,
      size,
    });
  };

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
    setShowSizeError((prev) => ({ ...prev, [productId]: false }));
  };

  const handleLike = async (product: Product) => {
    const productId = product.id?.toString() || product._id;
    const action = isLiked[productId] ? "unlike" : "like";
    setIsLiked((prev) => ({ ...prev, [productId]: action === "like" }));
    setLikes((prev) => ({
      ...prev,
      [product._id]: action === "like" ? (prev[product._id] || 0) + 1 : Math.max(0, (prev[product._id] || 0) - 1),
    }));
    if (product.id) {
      try {
        await fetch(apiUrl("/api/products/likes"), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: product.id, action }),
        });
      } catch { /* ignore */ }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
          Nos Produits
        </h1>
        <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
          Explorez notre collection complète de vestes premium et accessoires.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>
        <div className="lg:col-span-3">
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>

          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">Aucun produit trouvé.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
