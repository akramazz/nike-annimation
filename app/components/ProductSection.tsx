"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { apiUrl } from "@/lib/api-client";
import { ShoppingBag, Heart, Share2, Check, Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductImage from "./products/ProductImage";
import { normalizeProductImage } from "@/lib/product-normalize";
import { formatPriceDA } from "@/lib/price-utils";
import { normalizeCategory, PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { useCart } from "../context/CartContext";

interface Product {
  _id?: string;
  id: number;
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

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { addItem } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [likes, setLikes] = useState(0);
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
    const productId = product.id || 0;
    if (!selectedSize) {
      setShowSizeSelector(true);
      return;
    }
    addItem({ id: productId, name: product.name, price: product.price, image: normalizeProductImage(product.image), color: product.color, size: selectedSize });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const productId = product.id || product._id || 0;
    const url = `${window.location.origin}/products/${productId}`;
    const text = `Découvrez ${product.name}`;
    let shareUrl = "";
    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
      onClick={handleCardClick}
      className="group relative p-6 rounded-3xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer bg-white/10 border-white/20 shadow-xl hover:bg-white/15"
    >
      <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
        <ProductImage
          key={normalizeProductImage(product.image)}
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLike} className={`p-2 backdrop-blur-xl rounded-full transition-colors ${isLiked ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20"}`}>
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
          <div className="relative">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }} className="p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors">
              <Share2 className="h-5 w-5" />
            </motion.button>
            {showShareMenu && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-0 top-14 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-2 space-y-1 min-w-[160px] z-10">
                <button onClick={(e) => handleShare("copy", e)} className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  {copySuccess ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copySuccess ? "Copié!" : "Copier le lien"}</span>
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
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-xl rounded-full">
          <Heart className={`h-4 w-4 ${isLiked ? "text-red-400 fill-red-400" : "text-white/60"}`} />
          <span className="text-sm font-medium">{likes}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{product.name}</h3>
        <p className="text-white/60 text-sm">{product.description}</p>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 20 ? "bg-green-500/20 text-green-400" : product.stock > 10 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
            {product.stock} en stock
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Livraison gratuite</span>
          <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Retour 30 jours</span>
          <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Garantie 2 ans</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-white">{formatPriceDA(product.price)}</span>
          <motion.button ref={buttonRef} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleButtonClick} disabled={isAdded} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2">
            <span>{isAdded ? "Ajouté !" : "Acheter"}</span>
            <ShoppingBag className="h-4 w-4" />
          </motion.button>
        </div>
        {showSizeSelector && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-3">
            <p className="text-white/60 text-sm mb-2">Sélectionnez une taille:</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <motion.button key={size} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); setSelectedSize(size); setShowSizeSelector(false); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedSize === size ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>
                  {size}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {selectedSize && !showSizeSelector && (
          <div className="pt-2">
            <span className="text-white/60 text-sm">Taille: </span>
            <span className="text-white font-medium">{selectedSize}</span>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            const formData = new FormData(e.target as HTMLFormElement);
            const qty = parseInt((formData.get("qty") as string) || "1", 10);
            if (!selectedSize) { setShowSizeSelector(true); return; }
            const productId = product.id || 0;
            for (let i = 0; i < qty; i++) {
              addItem({ id: productId, name: product.name, price: product.price, image: normalizeProductImage(product.image), color: product.color, size: selectedSize });
            }
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
            (e.target as HTMLFormElement).reset();
          }}
          className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-white/60 text-xs font-medium mb-1">Commander ce produit</p>
          <div className="flex gap-2">
            <input
              type="number"
              name="qty"
              min="1"
              max={product.stock}
              defaultValue="1"
              placeholder="Qté"
              className="w-16 px-2 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-1.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-1"
            >
              <ShoppingBag className="h-4 w-4" />
              Commander
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl("/api/products"));
        const data = await response.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch { /* network error */ }
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(titleRef.current, { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center"><div className="text-white text-xl">Chargement des produits...</div></section>;
  }

  if (products.length === 0) {
    return <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center"><div className="text-white text-xl">Aucun produit disponible</div></section>;
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">Collection DripBazzarDZ</motion.h2>
          <motion.p ref={subtitleRef} className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">Découvrez notre sélection exclusive.</motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product._id || product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
