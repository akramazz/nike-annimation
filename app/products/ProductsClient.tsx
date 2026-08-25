"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import { apiUrl } from "@/lib/api-client";
import { normalizeProductImage } from "@/lib/product-normalize";
import { normalizeCategory, PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { useCart } from "../context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
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
  averageRating?: number;
  ratingCount?: number;
}

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
          setProducts(data.products);
          setPagination(data.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 });
        } else {
          setProducts([]);
          setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
        }
      } catch {
        setProducts([]);
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
     addItem({
       _id: product._id,
       productId: product._id,
       name: product.name,
       price: product.price,
       image: normalizeProductImage(product.image),
       color: product.color,
       size,
       category: product.category,
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
    if (product._id) {
      try {
        await fetch(apiUrl("/api/products/likes"), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: product._id, action }),
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
