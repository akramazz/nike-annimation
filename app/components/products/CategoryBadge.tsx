"use client";

import { useRouter } from "next/navigation";
import { normalizeCategory, PRODUCT_CATEGORIES } from "@/lib/product-categories";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export default function CategoryBadge({
  category,
  className = "",
}: CategoryBadgeProps) {
  const router = useRouter();

  const categoryPaths: Record<string, string> = {
    [PRODUCT_CATEGORIES.SWEAT]: "/products/jackets",
    [PRODUCT_CATEGORIES.T_SHIRT]: "/products/accessories",
    Accessoires: "/products/accessories",
    Veste: "/products/jackets",
    Vestes: "/products/jackets",
    "Nouveautés": "/products/new",
    Promotions: "/products/sales",
  };

  const path = categoryPaths[category] || categoryPaths[normalizeCategory(category)];
  const isClickable = !!path;

  const content = (
    <span
      className={`px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium transition-colors ${
        isClickable
          ? "hover:bg-white/20 cursor-pointer underline-offset-2 hover:underline"
          : ""
      } ${className}`}
    >
      {category}
    </span>
  );

  if (isClickable && path) {
    return (
      <button
        onClick={() => router.push(path)}
        className="inline-block"
        aria-label={`Voir tous les produits dans la catégorie ${category}`}
      >
        {content}
      </button>
    );
  }

  return content;
}
