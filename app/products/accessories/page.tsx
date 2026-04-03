"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { apiUrl } from "@/lib/api-client";
import { ShoppingBag, Heart, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Accessory {
  _id?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];
  likes?: number;
}

export default function AccessoriesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Accessory | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({});
  const { addItem } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const staticAccessories: Accessory[] = [
      {
        id: 1,
        name: "Casquette Noir",
        description: "Casquette premium en coton avec logo brodé",
        price: 49.99,
        image: "/products/casquette.webp",
        category: "Accessoires",
        sizes: ["S/M", "L/XL"],
        likes: 12
      },
      {
        id: 2,
        name: "Casquette Noire",
        description: "Casquette anatomique avec strap arrière",
        price: 39.99,
        image: "/products/casquettenoire.png",
        category: "Accessoires",
        sizes: ["S/M", "L/XL"],
        likes: 8
      },
      {
        id: 3,
        name: "Écharpe Rouge",
        description: "Écharpe en laine premium rouge elegant",
        price: 89.99,
        image: "/products/chalrouge.webp",
        category: "Accessoires",
        sizes: ["Unique"],
        likes: 25
      },
      {
        id: 4,
        name: "Écharpe Vert",
        description: "Écharpe超 douce en cachemire",
        price: 129.99,
        image: "/products/chal.webp",
        category: "Accessoires",
        sizes: ["Unique"],
        likes: 18
      },
      {
        id: 5,
        name: "Ceinture Beige",
        description: "Ceinture cuir avec boucle argentée",
        price: 79.99,
        image: "/products/sinture.webp",
        category: "Accessoires",
        sizes: ["S", "M", "L", "XL"],
        likes: 15
      },
      {
        id: 6,
        name: "Casque Audio",
        description: "Casque premium sans fil avec réduction de bruit",
        price: 199.99,
        image: "/products/cascadia.webp",
        category: "Accessoires",
        sizes: ["Unique"],
        likes: 32
      },
      {
        id: 7,
        name: "Bob Noir",
        description: "Bob léger pour l'été",
        price: 29.99,
        image: "/products/bobnoir.webp",
        category: "Accessoires",
        sizes: ["S/M", "L/XL"],
        likes: 5
      },
      {
        id: 8,
        name: "Sacs Voyage",
        description: "Sac weekend en toile premium",
        price: 149.99,
        image: "/products/tavares.webp",
        category: "Accessoires",
        sizes: ["Unique"],
        likes: 22
      },
      {
        id: 9,
        name: "Lunettes Soleil",
        description: "Lunettes premium avec Protection UV400",
        price: 159.99,
        image: "/products/facebeage.webp",
        category: "Accessoires",
        sizes: ["Unique"],
        likes: 45
      },
      {
        id: 10,
        name: "Montre Classic",
        description: "Montre automatique avec bracelet cuir",
        price: 299.99,
        image: "/products/vertface.webp",
        category: "Accessoires",
        sizes: ["Unique"],
        likes: 67
      },
      {
        id: 11,
        name: "Montre Sport",
        description: "Montre connectée avec GPS",
        price: 399.99,
        image: "/products/orangeface.webp",
        category: "Accessoires",
        sizes: ["Unique"],
        likes: 89
      },
      {
        id: 12,
        name: "Bracelet Cuir",
        description: "Bracelet tressé premium",
        price: 34.99,
        image: "/products/milangeface.webp",
        category: "Accessoires",
        sizes: ["S", "M", "L"],
        likes: 11
      },
    ];

    setProducts(staticAccessories);
    setLoading(false);
  }, []);

  const handleAddToCart = (product: Accessory) => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      setSelectedProduct(product);
      return;
    }
    const size = selectedSize || product.sizes?.[0] || "Unique";
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.category,
      size,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleLike = async (productId: number) => {
    const action = isLiked[productId] ? "unlike" : "like";
    setIsLiked(prev => ({ ...prev, [productId]: action === "like" }));
    setLikes(prev => ({ 
      ...prev, 
      [productId]: action === "like" 
        ? (prev[productId] || products.find(p => p.id === productId)?.likes || 0) + 1 
        : Math.max(0, (prev[productId] || products.find(p => p.id === productId)?.likes || 0) - 1)
    }));
    try {
      await fetch(apiUrl("/api/products/likes"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, action }),
      });
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Accessoires
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Complétez votre style avec nos accessoires premium.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleLike(product.id)}
                      className={`p-2 rounded-full backdrop-blur-xl transition-colors ${
                        isLiked[product.id] 
                          ? "bg-red-500/20 text-red-400" 
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked[product.id] ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-xl rounded-full">
                    <Heart className="h-3 w-3 text-white/60" />
                    <span className="text-xs text-white/60">{likes[product.id] || product.likes || 0}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-base font-bold text-white mb-1 truncate">{product.name}</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg sm:text-xl font-bold text-white">€{product.price.toFixed(2)}</span>
                  </div>

                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            selectedSize === size
                              ? "bg-white text-black border-white"
                              : "text-white/60 border-white/20 hover:border-white/40"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdded}
                      className="flex-1 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>{isAdded ? "Ajouté!" : "Ajouter"}</span>
                    </button>
                    <Link
                      href={`/products/accessories/${product.id}`}
                      className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
