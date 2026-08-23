"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { normalizeCategory, PRODUCT_CATEGORIES } from "@/lib/product-categories";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const hasFilters = category !== "all" || minPrice || maxPrice || minRating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Filtres</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Catégorie</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tous" },
            { id: PRODUCT_CATEGORIES.SWEAT, label: PRODUCT_CATEGORIES.SWEAT },
            { id: PRODUCT_CATEGORIES.T_SHIRT, label: PRODUCT_CATEGORIES.T_SHIRT },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                category === cat.id
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Prix (DA)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
          />
          <span className="text-white/40">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Note minimale */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Note minimale</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "", label: "Toutes" },
            { id: "4", label: "4+ étoiles" },
            { id: "3", label: "3+ étoiles" },
          ].map((rating) => (
            <button
              key={rating.id}
              onClick={() => updateFilter("minRating", rating.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                minRating === rating.id
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
