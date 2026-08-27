"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductImage from "./components/products/ProductImage";
import { apiUrl } from "@/lib/api-client";
import { formatPriceDA } from "@/lib/price-utils";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { FALLBACK_JACKETS } from "@/lib/static-products";

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

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black z-10" />
      <div className="absolute inset-0">
        <ProductImage
          src="/products/db-styke.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-40"
        />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight"
        >
          DRIPBAZZARDZ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto"
        >
          Streetwear premium. Des pièces sélectionnées pour votre style.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/products"
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all text-lg"
          >
            Explorer les produits
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all text-lg border border-white/20"
          >
            Voir les catégories
          </Link>
        </motion.div>
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
      route: "/products?category=sweat",
    },
    {
      id: "tshirt",
      name: "TSHIRT",
      description: "T-shirts et accessoires tendance",
      image: "/products/casquette.webp",
      route: "/products?category=tshirt",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
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
              className="group relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden cursor-pointer"
            >
              <ProductImage
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/70 mb-4 text-sm md:text-base">{category.description}</p>
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

function ProductGrid({ title, products, href }: { title: string; products: Product[]; href?: string }) {
  if (products.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            {title}
          </motion.h2>
          {href && (
            <Link href={href} className="text-white/60 hover:text-white transition-colors">
              Voir tout →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products/${product._id}`}
                className="group block rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-white/5">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
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
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-white/10 to-white/5 border border-white/10 p-8 md:p-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Découvrez notre collection
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Des pièces uniques sélectionnées pour les amateurs de streetwear.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all text-lg"
          >
            Explorer maintenant
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [bestRes, newRes] = await Promise.all([
          fetch(apiUrl("/api/products?sortBy=rating&limit=8"), { next: { revalidate: 300 } }),
          fetch(apiUrl("/api/products?sortBy=newest&limit=8"), { next: { revalidate: 300 } }),
        ]);

        const [bestData, newData] = await Promise.all([bestRes.json(), newRes.json()]);

        if (bestData.success && Array.isArray(bestData.products)) {
          setBestProducts(bestData.products);
        }
        if (newData.success && Array.isArray(newData.products)) {
          setNewProducts(newData.products);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <CategoriesSection />
      <ProductGrid title="Produits populaires" products={bestProducts} href="/products" />
      <ProductGrid title="Nouveautés" products={newProducts} href="/products?sort=newest" />
      <CtaSection />
    </div>
  );
}
