"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import ProductImage from "@/app/components/products/ProductImage";
import { getProductImage } from "@/lib/image-utils";

interface Product {
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

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [bgZoom, setBgZoom] = useState(false);

  const currentImage = getProductImage(product.image);

  useEffect(() => {
    setIsZoomed(false);
    setBgZoom(false);
  }, [currentImage]);

  useEffect(() => {
    if (!isZoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isZoomed]);

  const handleZoomToggle = useCallback(() => {
    if (bgZoom) {
      setBgZoom(false);
    } else {
      setIsZoomed(true);
    }
  }, [bgZoom]);

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 cursor-pointer"
        onClick={handleZoomToggle}
      >
        <ProductImage
          key={currentImage}
          src={currentImage}
          alt={product.name}
          fill
          className={`object-contain p-6 sm:p-8 transition-transform duration-700 ${
            bgZoom ? "scale-150" : "hover:scale-105"
          }`}
        />

        <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-xl rounded-full pointer-events-none">
          <ZoomIn className="h-5 w-5 text-white" />
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium">
            {product.category}
          </span>
          {product.onSale && product.salePercent ? (
            <span className="px-3 py-1 bg-red-500 text-white font-bold text-xs">
              -{product.salePercent}%
            </span>
          ) : null}
          {product.stock < 10 ? (
            <span className="px-3 py-1 bg-red-500/20 backdrop-blur-xl rounded-full text-xs font-medium text-red-400">
              Stock limité
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-4 left-4 hidden md:block pointer-events-none">
          {product.onSale && product.salePrice ? (
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full">
                €{product.salePrice.toFixed(2)}
              </span>
              <span className="text-sm text-white/60 line-through mt-1 px-3">
                €{product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-white px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full">
              €{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isZoomed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-zoom-out"
            role="dialog"
            aria-label="Image en plein écran"
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative w-[90vw] h-[90vh] max-w-5xl">
              <ProductImage
                key={`zoom-${currentImage}`}
                src={currentImage}
                alt={`${product.name} en plein écran`}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
