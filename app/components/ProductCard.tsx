"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ShoppingBag, Heart, Share2, Check, Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductImage from "./products/ProductImage";
import { normalizeProductImage } from "@/lib/product-normalize";
import { formatPriceDA } from "@/lib/price-utils";
import { useCart } from "@/app/context/CartContext";
import { apiUrl } from "@/lib/api-client";
import StarRating from "./StarRating";

export interface ProductCardData {
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

interface ProductCardProps {
  product: ProductCardData;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { addItem } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [likes, setLikes] = useState(product.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (product.likes) {
      setLikes(product.likes);
    }
    if (typeof window !== "undefined") {
      const savedIsLiked = localStorage.getItem(`product_liked_${product.id}`);
      if (savedIsLiked) setIsLiked(savedIsLiked === "true");
    }
  }, [product.id, product.likes]);

  const handleCardClick = useCallback(() => {
    const productId = product.id || product._id || 0;
    router.push(`/products/${productId}`);
  }, [product.id, product._id, router]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const action = isLiked ? "unlike" : "like";
    try {
      const res = await fetch(apiUrl("/api/products/likes"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, action }),
      });
      const data = await res.json();
      if (data.success) {
        setLikes(data.likes);
        setIsLiked(action === "like");
        if (typeof window !== "undefined") {
          localStorage.setItem(`product_liked_${product.id}`, (action === "like").toString());
        }
      }
    } catch { /* ignore */ }
  };

  const handleCardHover = () => {
    if (typeof window !== "undefined" && cardRef.current) {
      gsap.to(cardRef.current, { scale: 1.05, y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", duration: 0.4, ease: "power2.out" });
    }
  };

  const handleCardLeave = () => {
    if (typeof window !== "undefined" && cardRef.current) {
      gsap.to(cardRef.current, { scale: 1, y: 0, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)", duration: 0.4, ease: "power2.out" });
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize && product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique") {
      setShowSizeSelector(true);
      return;
    }
    const size = selectedSize || product.sizes?.[0] || "Unique";
    addItem(
      {
        id: product.id || Number(product._id) || 0,
        name: product.name,
        price: product.price,
        image: normalizeProductImage(product.image),
        color: product.color || product.category,
        size,
      },
      1,
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product._id}`;
    const text = `Découvrez ${product.name}`;
    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
      onClick={handleCardClick}
      className="group relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <ProductImage src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`p-2 backdrop-blur-xl rounded-full transition-colors ${
              isLiked ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-2 space-y-1 min-w-[140px] z-10"
              >
                <button onClick={(e) => handleShare("copy", e)} className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  {copySuccess ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copySuccess ? "Copié !" : "Copier"}</span>
                </button>
                <button onClick={(e) => handleShare("twitter", e)} className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <Twitter className="h-4 w-4" /><span>Twitter</span>
                </button>
                <button onClick={(e) => handleShare("facebook", e)} className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <Facebook className="h-4 w-4" /><span>Facebook</span>
                </button>
                <button onClick={(e) => handleShare("linkedin", e)} className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <Linkedin className="h-4 w-4" /><span>LinkedIn</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {product.onSale && product.salePercent && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white font-bold text-xs rounded-full">
            -{product.salePercent}%
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{product.name}</h3>
          <p className="text-white/60 text-xs sm:text-sm line-clamp-1">{product.color}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{formatPriceDA(product.price)}</span>
          <div className="flex items-center gap-1">
            <Heart className={`h-4 w-4 ${isLiked ? "text-red-400 fill-red-400" : "text-white/40"}`} />
            <span className="text-xs text-white/60">{likes}</span>
          </div>
        </div>

        <StarRating value={product.averageRating || 0} count={product.ratingCount || 0} readonly size={14} />

        {product.stock <= 0 && (
          <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Rupture de stock</span>
        )}

        {showSizeSelector && product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique" && (
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => { e.stopPropagation(); setSelectedSize(size); setShowSizeSelector(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSize === size ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleButtonClick}
          disabled={isAdded || product.stock <= 0}
          className="w-full py-2.5 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingBag className="h-4 w-4" />
          {isAdded ? "Ajouté !" : product.stock <= 0 ? "Rupture" : "Ajouter"}
        </motion.button>
      </div>
    </motion.div>
  );
}
