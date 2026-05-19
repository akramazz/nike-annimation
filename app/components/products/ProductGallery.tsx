"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X, ZoomIn } from "lucide-react";

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [bgZoom, setBgZoom] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const currentImage = product.image;

  const handleNext = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  const handleZoomToggle = useCallback(() => {
    if (bgZoom) {
      setBgZoom(false);
    } else {
      setIsZoomed(true);
    }
  }, [bgZoom]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      if (e.key === "Escape") {
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
  };

  const isExternal =
    product.image.startsWith("http://") ||
    product.image.startsWith("https://");

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div
        ref={imageRef}
        className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 cursor-pointer"
        onClick={handleZoomToggle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className={`object-contain p-6 sm:p-8 transition-transform duration-700 ${
            bgZoom ? "scale-155" : "hover:scale-105"
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoadingComplete={() => setIsLoading(false)}
          unoptimized={isExternal}
        />

        {/* Zoom Badge */}
        <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-xl rounded-full">
          <ZoomIn className="h-5 w-5 text-white" />
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center"
            >
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium">
            {product.category}
          </span>
          {product.onSale && product.salePercent && (
            <span className="px-3 py-1 bg-red-500 text-white font-bold text-xs">
              -{product.salePercent}%
            </span>
          )}
          {product.stock < 10 && (
            <span className="px-3 py-1 bg-red-500/20 backdrop-blur-xl rounded-full text-xs font-medium text-red-400">
              Stock limité
            </span>
          )}
        </div>

        {/* Price Overlay (Desktop) */}
        <div className="absolute bottom-4 left-4 hidden md:block">
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

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled
          className="p-2 rounded-full bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Image précédente"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="text-white/60 text-sm" aria-live="polite">
          {selectedIndex + 1}/1
        </span>

        <button
          onClick={handleNext}
          disabled
          className="p-2 rounded-full bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Image suivante"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
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
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative w-[90vw] h-[90vh] max-w-5xl">
              <Image
                src={currentImage}
                alt={`${product.name} en plein écran`}
                fill
                className="object-contain"
                unoptimized={isExternal}
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
