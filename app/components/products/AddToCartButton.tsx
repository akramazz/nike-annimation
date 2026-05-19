"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ShoppingBag, Check, Loader } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { apiUrl } from "@/lib/api-client";

interface AddToCartButtonProps {
  productId: string | number | undefined;
  productName: string;
  productPrice: number;
  productImage: string;
  productColor?: string;
  selectedSize: string;
  quantity: number;
  className?: string;
  onSuccess?: () => void;
}

export default function AddToCartButton({
  productId,
  productName,
  productPrice,
  productImage,
  productColor,
  selectedSize,
  quantity,
  className = "",
  onSuccess,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // CartContext.CartItem.id must be `number`
  const numericId: number = typeof productId === "number"
    ? productId
    : typeof productId === "string"
      ? (() => {
          const digits = productId.replace(/\D/g, "");
          const num = Number(digits);
          return Number.isFinite(num) ? num : 0;
        })()
      : 0;

  const handleClick = useCallback(async () => {
    if (isAdded || isAdding) return;

    setIsAdding(true);

    // GSAP click animation
    if (typeof window !== "undefined" && btnRef.current) {
      await gsap
        .to(btnRef.current, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
        })
        .then();
      await gsap
        .to(btnRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.3)",
        })
        .then();
    }

    addItem(
      {
        id: numericId,
        name: productName,
        price: productPrice,
        image: productImage,
        color: productColor ?? "",
        size: selectedSize,
      },
      quantity
    );

    setIsAdding(false);
    setIsAdded(true);

    // Track AddToCart event (Meta Pixel)
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: productName,
        content_type: "product",
        value: productPrice,
        currency: "EUR",
      });
    }

    onSuccess?.();
    setTimeout(() => setIsAdded(false), 2000);
  }, [
    isAdded,
    isAdding,
    numericId,
    productName,
    productPrice,
    productImage,
    productColor,
    selectedSize,
    quantity,
    addItem,
    onSuccess,
  ]);

  return (
    <motion.button
      ref={btnRef}
      type="button"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={isAdded || isAdding}
      className={`
        relative overflow-hidden group flex items-center justify-center gap-2
        w-full py-3 sm:py-4 bg-white text-black font-bold rounded-full
        hover:bg-white/90 transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={`Ajouter ${productName} au panier`}
    >
      <span className="relative z-10 text-sm sm:text-base">
        {isAdding ? (
          <span className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            Ajout...
          </span>
        ) : isAdded ? (
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Ajouté au panier
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            Ajouter au panier
          </span>
        )}
      </span>
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
          -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        aria-hidden="true"
      />
    </motion.button>
  );
}
