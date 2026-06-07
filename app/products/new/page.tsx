"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { apiUrl } from "@/lib/api-client";
import { Sparkles } from "lucide-react";
import ProductImg from "../../components/products/ProductImg";

interface Product {
  _id: string;
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
}

export default function NewProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl("/api/products"));
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const recentProducts = data.products.slice(0, 8);
          setProducts(recentProducts);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">NOUVEAUTÉS</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Nouveautés
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
             Découvrez nos dernières créations et restez à la pointe de la mode.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-purple-500/20 backdrop-blur-xl rounded-full text-purple-400 text-xs font-medium border border-purple-500/30 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Nouveau
                    </div>
                      <ProductImg
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-white/60 text-sm mb-3">{product.color}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">€{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">Aucune nouveautés pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}