"use client";

import { useEffect, Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api-client";
import { formatPriceDA } from "@/lib/price-utils";
import ProductImage from "./components/products/ProductImage";

// Dynamic imports for components
const Navigation = lazy(() => import("./components/Navigation"));
const HeroSection = lazy(() => import("./components/HeroSection"));
const ProductSection = lazy(() => import("./components/ProductSection"));
const Footer = lazy(() => import("./components/Footer"));

interface Product {
  _id: string;
  id?: number;
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
  averageRating?: number;
  ratingCount?: number;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="loading-spinner"></div>
    </div>
  );
}

function StarRating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= Math.round(value)
                ? "text-yellow-400"
                : "text-white/20"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      {count > 0 && (
        <span className="text-white/60 text-xs ml-1">
          {value.toFixed(1)} ({count} avis{count !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}

function BestProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl("/api/products?sortBy=rating&limit=8"), { next: { revalidate: 300 } });
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Meilleurs produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Meilleurs produits
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => window.location.href = `/products/${product.id || product._id}`}
              className="group relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-white/5">
                <ProductImage src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                <span className="text-lg font-bold">{formatPriceDA(product.price)}</span>
                {product.averageRating && product.averageRating > 0 ? (
                  <StarRating value={product.averageRating} count={product.ratingCount || 0} />
                ) : (
                  <span className="text-white/40 text-xs">Aucun avis</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const router = useRouter();

  const categories = [
    {
      id: "sweat",
      name: "SWEAT",
      description: "Vestes, sweats et pièces streetwear premium",
      image: "/products/rouge.webp",
      route: "/products/jackets",
    },
    {
      id: "tshirt",
      name: "TSHIRT",
      description: "T-shirts et accessoires tendance",
      image: "/products/casquette.webp",
      route: "/products/accessories",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Nos catégories
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onClick={() => router.push(category.route)}
              className="group relative aspect-video rounded-3xl overflow-hidden cursor-pointer"
            >
              <ProductImage src={category.image} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/70 mb-4">{category.description}</p>
                <span className="inline-flex items-center px-6 py-3 bg-white text-black font-bold rounded-full w-fit group-hover:bg-white/90 transition-colors">
                  Explorer la collection
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const sections = gsap.utils.toArray<HTMLElement>("section");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  return (
    <div className="relative min-h-screen bg-black">
      <Suspense fallback={<div className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-xl z-50" />}>
        <Navigation />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      <CategoriesSection />

      <BestProducts />

      <section id="products">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductSection />
        </Suspense>
      </section>

      <Suspense fallback={<div className="h-64 bg-black/30" />}>
        <Footer />
      </Suspense>

      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
