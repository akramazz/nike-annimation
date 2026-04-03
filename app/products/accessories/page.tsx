"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Package, Zap, Percent, Gift } from "lucide-react";

export default function AccessoriesPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const accessories = [
    {
      id: 1,
      name: "Ceinture Cuir Premium",
      description: "Ceinture en cuir véritable avec boucle en métal premium",
      price: 79.99,
      image: "/products/default.webp",
      category: "Accessoires"
    },
    {
      id: 2,
      name: "Écharpe en Soie",
      description: "Écharpe premium en soie pour un look élégant",
      price: 129.99,
      image: "/products/default.webp",
      category: "Accessoires"
    },
    {
      id: 3,
      name: "Gants en Cuir",
      description: "Gants en cuir haut de gamme pour l'hiver",
      price: 89.99,
      image: "/products/default.webp",
      category: "Accessoires"
    },
    {
      id: 4,
      name: "Casquette Premium",
      description: "Casquette anatomique avec logo brodé",
      price: 49.99,
      image: "/products/default.webp",
      category: "Accessoires"
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Accessoires
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Complétez votre style avec nos accessoires premium.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accessories.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    <Package className="h-16 w-16 text-white/20" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-white/60 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">€{item.price.toFixed(2)}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      En stock
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-white/60">Plus d'accessoires à venir...</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
