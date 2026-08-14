"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import ProductImage from "@/app/components/products/ProductImage";
import { getProductImage } from "@/lib/image-utils";
import { formatPriceDA } from "@/lib/price-utils";
import { normalizeCategory } from "@/lib/product-categories";

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
  images?: Array<{ url: string; isMain?: boolean }>;
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  const imageList = (() => {
    const main = getProductImage(product.image);
    if (Array.isArray(product.images) && product.images.length > 0) {
      const sorted = product.images
        .map((img) => getProductImage(img.url))
        .filter(Boolean);
      if (!sorted.includes(main)) {
        sorted.unshift(main);
      }
      return sorted;
    }
    return [main];
  })();

  const currentImage = imageList[selectedImageIndex] || imageList[0] || getProductImage(product.image);

  useEffect(() => {
    setIsZoomed(false);
    setBgZoom(false);
    setSelectedImageIndex(0);
  }, [product._id, product.image]);

  useEffect(() => {
    if (!isZoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isZoomed]);

  useEffect(() => {
    const container = thumbnailScrollRef.current;
    if (!container) return;
    const activeThumb = container.querySelector(`[data-thumb-index="${selectedImageIndex}"]`);
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedImageIndex]);

  const scrollThumbnails = useCallback((direction: "left" | "right") => {
    const container = thumbnailScrollRef.current;
    if (!container) return;
    const amount = 180;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

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
            {normalizeCategory(product.category)}
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
                  {formatPriceDA(product.salePrice)}
                </span>
                <span className="text-sm text-white/60 line-through mt-1 px-3">
                  {formatPriceDA(product.price)}
                </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-white px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full">
              {formatPriceDA(product.price)}
            </span>
          )}
        </div>
      </div>

      {imageList.length > 1 && (
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollThumbnails("left")}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
            aria-label="Images précédentes"
          >
            ‹
          </button>

          <div
            ref={thumbnailScrollRef}
            className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {imageList.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                data-thumb-index={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all snap-center flex-shrink-0 ${
                  selectedImageIndex === idx ? "border-white" : "border-white/20"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbnails("right")}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
            aria-label="Images suivantes"
          >
            ›
          </button>
        </div>
      )}

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
