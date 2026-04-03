"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { apiUrl } from "@/lib/api-client";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted || !gridRef.current) return;

    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );
  }, [selectedCategory, isMounted]);

  const categories = [
    { id: "all", name: "Tous" },
    { id: "Premium", name: "Premium" },
    { id: "Luxury", name: "Luxury" },
    { id: "Classic", name: "Classic" },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
            <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Nos Produits
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Explorez notre collection complète de vestes premium et accessoires.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
                >
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-xs font-medium border border-white/20">
                      {product.category}
                    </div>
                    {product.onSale && product.salePercent && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white font-bold text-xs rounded-full">
                        -{product.salePercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-white/60 text-sm mb-2 sm:mb-3">{product.color}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.onSale && product.salePrice ? (
                          <>
                            <span className="text-lg sm:text-2xl font-bold text-white">€{product.salePrice.toFixed(2)}</span>
                            <span className="text-white/40 line-through text-xs sm:text-sm">€{product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-lg sm:text-2xl font-bold text-white">€{product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 10 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {product.stock} en stock
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">Aucun produit trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}