"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import { apiUrl } from "@/lib/api-client";
import { ShoppingBag, Heart, Share2, Check, Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductImage from "./products/ProductImage";
import { normalizeProductImage } from "@/lib/product-normalize";
import { formatPriceDA } from "@/lib/price-utils";
import { normalizeCategory, PRODUCT_CATEGORIES } from "@/lib/product-categories";

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
  isSelected,
  onClick,
  index,
}: {
  product: Product;
  isSelected: boolean;
  onClick?: () => void;
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
      onClick={onClick}
      className={`group relative p-6 rounded-3xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer ${
        isSelected ? "bg-white/20 border-white/40 shadow-2xl" : "bg-white/10 border-white/20 shadow-xl hover:bg-white/15"
      }`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl("/api/products"));
        const data = await response.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setSelectedProduct(data.products[0]);
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

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    if (!selectedSize) { alert("Veuillez sélectionner une taille"); return; }
    const productId = selectedProduct.id || 0;
    addItem({ id: productId, name: selectedProduct.name, price: selectedProduct.price, image: normalizeProductImage(selectedProduct.image), color: selectedProduct.color, size: selectedSize });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center"><div className="text-white text-xl">Chargement des produits...</div></section>;
  }

  if (products.length === 0) {
    return <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center"><div className="text-white text-xl">Aucun produit disponible</div></section>;
  }

  const getBackgroundGradient = (category: string) => {
     switch (normalizeCategory(category)) {
       case PRODUCT_CATEGORIES.SWEAT: return 'from-indigo-950 via-slate-900 to-black';
       case PRODUCT_CATEGORIES.T_SHIRT: return 'from-amber-950 via-orange-950/50 to-black';
       default: return 'from-gray-950 via-slate-900 to-black';
     }
   };

  return (
    <section ref={sectionRef} className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      {/* Background dynamique simple et économique */}
      {selectedProduct && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient(selectedProduct.category)}`} />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">Collection DripBazzarDZ</motion.h2>
          <motion.p ref={subtitleRef} className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">Découvrez notre sélection exclusive de vestes haut de gamme.</motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product._id || product.id} product={product} isSelected={selectedProduct?._id === product._id} onClick={() => setSelectedProduct(product)} index={index} />
          ))}
        </div>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-16 p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white">{selectedProduct.name}</h3>
                <p className="text-white/70 text-lg">{selectedProduct.description}</p>
                <div className="flex items-center space-x-4">
                  {selectedProduct.onSale && selectedProduct.salePrice ? (
                      <>
                        <span className="text-4xl font-bold text-white">{formatPriceDA(selectedProduct.salePrice)}</span>
                        <span className="text-white/50 line-through text-xl">{formatPriceDA(selectedProduct.price)}</span>
                      {selectedProduct.salePercent && (
                        <span className="px-3 py-1 bg-red-500 text-white font-bold text-sm rounded-full">
                          -{selectedProduct.salePercent}%
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-white">{formatPriceDA(selectedProduct.price)}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${selectedProduct.stock > 20 ? "bg-green-500/20 text-green-400" : selectedProduct.stock > 10 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{selectedProduct.stock} unités en stock</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Taille</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.sizes.map((size) => (
                      <motion.button key={size} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedSize(size)} className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${selectedSize === size ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>{size}</motion.button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Livraison gratuite</span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Retour 30 jours</span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Garantie 2 ans</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddToCart} disabled={isAdded} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                    <span>{isAdded ? "Ajouté !" : "Ajouter au panier"}</span>
                    <ShoppingBag className="h-5 w-5" />
                  </motion.button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target as HTMLFormElement);
                    const qty = parseInt((fd.get("qty") as string) || "1", 10);
                    if (!selectedSize) { return; }
                    for (let i = 0; i < qty; i++) {
                      addItem({ id: selectedProduct.id || 0, name: selectedProduct.name, price: selectedProduct.price, image: normalizeProductImage(selectedProduct.image), color: selectedProduct.color, size: selectedSize });
                    }
                    setIsAdded(true);
                    setTimeout(() => setIsAdded(false), 2000);
                    (e.target as HTMLFormElement).reset();
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                >
                  <p className="text-white/60 text-sm font-bold">Commander maintenant</p>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      name="qty"
                      min="1"
                      max={selectedProduct.stock}
                      defaultValue="1"
                      placeholder="Quantité"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/50 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!selectedSize}
                      className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Commander</span>
                    </motion.button>
                  </div>
                </form>
              </div>
              <div className="h-[300px] sm:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <ProductImage
                    key={normalizeProductImage(selectedProduct.image)}
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-contain p-4 sm:p-8"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
