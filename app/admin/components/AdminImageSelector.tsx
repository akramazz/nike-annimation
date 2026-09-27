"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import Image from "next/image";
import { getProductImage } from "@/lib/image-utils";

interface AdminImageSelectorProps {
  availableImages: string[];
  selectedImages: string[];
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (imagePath: string) => void;
}

export default function AdminImageSelector({
  availableImages,
  selectedImages,
  isOpen,
  onClose,
  onAddImage,
}: AdminImageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const selectedPaths = useMemo(
    () =>
      selectedImages.map((img) =>
        img.startsWith("/products/") ? img : getProductImage(img),
      ),
    [selectedImages],
  );

  const filteredImages = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return availableImages;
    return availableImages.filter((img) => img.toLowerCase().includes(query));
  }, [availableImages, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] bg-black/60 border border-white/20 rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Sélectionner une image
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une image..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              </div>

              <p className="text-white/60 text-sm mt-2">
                {filteredImages.length} image(s) trouvée(s)
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-8 w-8 text-white/20 mb-3" />
                  <p className="text-white/40">Aucune image trouvée</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredImages.map((img) => {
                    const path = `/products/${img}`;
                    const isSelected = selectedPaths.includes(path);
                    const displayImage = getProductImage(path);

                    return (
                      <motion.div
                        key={img}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => {
                          if (!isSelected) {
                            onAddImage(displayImage);
                          }
                        }}
                        className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-white opacity-100"
                            : "border-white/20 hover:border-white/40 hover:scale-105"
                        } ${isSelected ? "cursor-not-allowed opacity-60" : ""}`}
                        title={isSelected ? "Déjà sélectionnée" : img}
                      >
                        <div className="relative w-full aspect-[3/4] bg-white/5">
                          <Image
                            src={displayImage}
                            alt={img}
                            fill
                            sizes="(max-width: 640px) 120px, (max-width: 1024px) 144px, 160px"
                            className="object-contain p-2"
                            loading="lazy"
                            decoding="async"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white/80 text-xs font-medium">
                                Sélectionnée
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                          <p className="text-xs text-white/70 truncate">
                            {img}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
