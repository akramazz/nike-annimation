"use client";

import {
  useState,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import AddToCartButton from "./AddToCartButton";
import ProductBenefits from "./ProductBenefits";
import CategoryBadge from "./CategoryBadge";

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

interface ProductInfoProps {
  product: UnifiedProduct;
  initialSize?: string | null;
}

export default function ProductInfo({ product, initialSize = null }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    initialSize || product.sizes[0] || null
  );

  const currentPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
  const total = currentPrice * quantity;

  const handleAddToCartSuccess = useCallback(() => {
    setQuantity(1);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Nom */}
      <div className="space-y-1">
        <CategoryBadge category={product.category} />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
          {product.name}
        </h1>
        {product.color && (
          <p className="text-white/60 text-base sm:text-lg">{product.color}</p>
        )}
      </div>

      {/* Prix */}
      <PriceDisplay product={product} />

      {/* Avis */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`h-4 w-4 rounded-sm ${i < 4 ? "bg-yellow-400" : "bg-white/20"}`} />
          ))}
        </div>
        <span className="text-white/60 text-sm">
          (4.8) · {product.likes ?? 128} avis
        </span>
      </div>

      {/* Description */}
      <p className="text-white/70 text-base leading-relaxed">
        {product.description}
      </p>

      {/* Taille */}
      <SizeSelector
        sizes={product.sizes}
        value={selectedSize}
        onChange={setSelectedSize}
      />

      {/* Quantité */}
      <QuantitySelector value={quantity} onChange={setQuantity} />

      {/* Add to Cart */}
      <AddToCartButton
        productId={product._id}
        productName={product.name}
        productPrice={currentPrice}
        productImage={product.image}
        productColor={product.color}
        selectedSize={selectedSize || product.sizes[0] || "Unique"}
        quantity={quantity}
        onSuccess={handleAddToCartSuccess}
      />

      {/* Avantages */}
      <ProductBenefits />

      {/* Stock */}
      <StockIndicator stock={product.stock} />
    </div>
  );
}

// ─── Price Display ──────────────────────────────────────────────────────────
function PriceDisplay({ product }: { product: UnifiedProduct }) {
  if (product.onSale && product.salePrice) {
    return (
      <div
        className="flex flex-wrap items-center gap-3"
        aria-live="polite"
        aria-label={`Prix soldé: ${product.salePrice} euros au lieu de ${product.price}`}
      >
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.6, repeat: 2, repeatDelay: 1.5 }}
          className="text-3xl md:text-4xl font-extrabold"
        >
          €{product.salePrice.toFixed(2)}
        </motion.span>
        <span className="text-white/50 line-through text-lg md:text-xl">
          €{product.price.toFixed(2)}
        </span>
        {product.salePercent && (
          <span className="px-3 py-1 bg-red-500 text-white font-bold text-sm rounded-full">
            -{product.salePercent}%
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3" aria-label={`Prix: ${product.price} euros`}>
      <span className="text-3xl md:text-4xl font-extrabold">
        €{product.price.toFixed(2)}
      </span>
    </div>
  );
}

// ─── Size Selector ──────────────────────────────────────────────────────────
export interface SizeSelectorProps {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
}

export function SizeSelector({
  sizes,
  value,
  onChange,
}: SizeSelectorProps) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-2 sm:mb-3" id="size-label">
        Taille
      </h3>
      <div
        className="flex flex-wrap gap-2 sm:gap-3"
        role="radiogroup"
        aria-labelledby="size-label"
      >
        {sizes.map((size) => (
          <motion.button
            key={size}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(size)}
            className={`
              px-5 py-2.5 rounded-xl font-medium transition-all duration-300
              bg-white/10 text-white hover:bg-white/20
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
              ${
                value === size
                  ? "bg-white text-black"
                  : ""
              }
            `}
            aria-checked={value === size}
            role="radio"
          >
            {size}
          </motion.button>
        ))}
      </div>
      {!value && (
        <p className="text-white/60 text-sm mt-2" aria-live="polite">
          Sélectionnez une taille
        </p>
      )}
    </div>
  );
}

// ─── Quantity Selector ──────────────────────────────────────────────────────
export interface QuantitySelectorProps {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-2 sm:mb-3" id="qty-label">
        Quantité
      </h3>
      <div
        className="flex items-center gap-3 sm:gap-4"
        role="group"
        aria-labelledby="qty-label"
      >
        <QtyButton
          direction="minus"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        />
        <span
          className="text-2xl font-bold w-8 sm:w-10 text-center tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </span>
        <QtyButton
          direction="plus"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        />
      </div>
    </div>
  );
}

function QtyButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "plus" | "minus";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors
        flex items-center justify-center text-xl font-bold
        disabled:opacity-30 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      aria-label={direction === "plus" ? "Augmenter la quantité" : "Diminuer la quantité"}
      aria-disabled={disabled}
    >
      {direction === "plus" ? "+" : "−"}
    </motion.button>
  );
}

// ─── Stock Indicator ─────────────────────────────────────────────────────────
export function StockIndicator({ stock }: { stock: number }) {
  const label =
    stock > 20
      ? { text: `${stock} unités en stock`, color: "text-green-400" }
      : stock > 10
        ? { text: `Stock limité — ${stock} restants`, color: "text-yellow-400" }
        : { text: `Plus que ${stock} en stock !`, color: "text-red-400" };

  return (
    <div
      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
      role="status"
      aria-label={label.text}
    >
      <span className="text-white/60 text-sm">Stock disponible</span>
      <span className={`font-bold text-sm ${label.color}`} aria-hidden="true">
        {label.text}
      </span>
    </div>
  );
}
