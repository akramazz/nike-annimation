"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductImg from "@/app/components/products/ProductImg";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { apiUrl } from "@/lib/api-client";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STATIC_ACCESSORIES } from "@/lib/static-accessories";

interface Product {
  _id: string;
  id?: number;
  name: string;
  color: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];
  likes?: number;
}

// Static accessories data as fallback
const staticAccessories: Product[] = STATIC_ACCESSORIES.map((acc) => ({
  ...acc,
  color: acc.category,
  type: "accessory" as const,
}));

export default function AccessoriesPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [showSizeError, setShowSizeError] = useState<Record<string, boolean>>({});
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();

  const handleProductClick = (product: Product) => {
    const productId = product.id ?? product._id;
    router.push(`/products/${productId}`);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        // Fetch products from MongoDB
        const res = await fetch(apiUrl("/api/products"));
        const data = await res.json();
        
        if (data.success && Array.isArray(data.products)) {
          // Filter for accessories category or use static data if no DB accessories
          const accessoriesFromDB = data.products.filter(
            (p: Product) => p.category === "Accessoires" || p.category === "Accessoires"
          );
          
          if (accessoriesFromDB.length > 0) {
            setProducts([...staticAccessories, ...accessoriesFromDB]);
          } else {
            setProducts(staticAccessories);
          }
          
          // Setup likes
          const likesMap: Record<string, number> = {};
          staticAccessories.forEach(acc => {
            likesMap[acc._id] = acc.likes || 0;
          });
          accessoriesFromDB.forEach((acc: Product) => {
            if (acc.likes) likesMap[acc._id] = acc.likes;
          });
          setLikes(likesMap);
        } else {
          setProducts(staticAccessories);
        }
      } catch {
        setProducts(staticAccessories);
      }
      setLoading(false);
    };
    fetchAccessories();
  }, []);

  const handleAddToCart = (product: Product) => {
    const productId = product._id;
    const selectedSize = selectedSizes[productId];
    
    if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique" && !selectedSize) {
      setShowSizeError(prev => ({ ...prev, [productId]: true }));
      return;
    }
    
    setShowSizeError(prev => ({ ...prev, [productId]: false }));
    const size = selectedSize || product.sizes?.[0] || "Unique";
    const productIdNum = product.id || 1;
    addItem({
      id: productIdNum,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      size,
    });
  };

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
    setShowSizeError(prev => ({ ...prev, [productId]: false }));
  };

  const handleLike = async (product: Product) => {
    const productId = product.id?.toString() || product._id;
    const action = isLiked[productId] ? "unlike" : "like";
    
    setIsLiked(prev => ({ ...prev, [productId]: action === "like" }));
    setLikes(prev => ({ 
      ...prev, 
      [product._id]: action === "like" 
        ? (prev[product._id] || 0) + 1 
        : Math.max(0, (prev[product._id] || 0) - 1)
    }));

    if (product.id) {
      try {
        await fetch(apiUrl("/api/products/likes"), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: product.id, action }),
        });
      } catch { /* ignore */ }
    }
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
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleProductClick(product)}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                  <ProductImg
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(product); }}
                        className={`p-2 rounded-full backdrop-blur-xl transition-colors ${
                        isLiked[product.id?.toString() || product._id] 
                          ? "bg-red-500/20 text-red-400" 
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked[product.id?.toString() || product._id] ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-xl rounded-full">
                    <Heart className="h-3 w-3 text-white/60" />
                    <span className="text-xs text-white/60">{likes[product._id] || product.likes || 0}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-base font-bold text-white mb-1 truncate">{product.name}</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg sm:text-xl font-bold text-white">€{product.price.toFixed(2)}</span>
                  </div>

                  {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique" && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => { e.stopPropagation(); handleSizeSelect(product._id, size); }}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            selectedSizes[product._id] === size
                              ? "bg-white text-black border-white"
                              : "text-white/60 border-white/20 hover:border-white/40"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                      {showSizeError[product._id] && (
                        <p className="text-red-400 text-xs w-full">Sélectionnez une taille</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className="flex-1 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Ajouter</span>
                    </button>
                      <Link
                        href={`/products/${product.id ?? product._id}`}
                        onClick={(e) => e.stopPropagation()}
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
