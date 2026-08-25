"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { apiUrl } from "@/lib/api-client";
import { Tag, Flame } from "lucide-react";
import ProductImage from "@/app/components/products/ProductImage";
import { formatPriceDA } from "@/lib/price-utils";
import { normalizeCategory } from "@/lib/product-categories";

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

export default function SalesPage() {
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
          setProducts(data.products);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const calculateDiscount = (price: number) => {
    return Math.round(price * 0.23);
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 mb-4">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-medium">SOLDE EXCEPTIONNEL</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Promotions
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Profitez de nos offres spéciales et faites des économies sur vos achats.
            </p>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full mb-8">
            <Tag className="h-5 w-5 text-red-400" />
            <span className="text-white font-medium">jusqu'à -40%</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const discount = calculateDiscount(product.price);
                const originalPrice = product.price + discount;
                
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-red-500/20 backdrop-blur-xl rounded-full text-red-400 text-xs font-medium border border-red-500/30">
                        -{Math.round((discount / originalPrice) * 100)}%
                      </div>
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                      <p className="text-white/60 text-sm mb-3">{product.color}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{formatPriceDA(product.price)}</span>
                        <span className="text-white/50 line-through">{formatPriceDA(originalPrice)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">Aucune promotion disponible pour le moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}