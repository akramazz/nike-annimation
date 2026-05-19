"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { apiUrl } from "@/lib/api-client";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Check,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  User,
  Mail,
  Phone,
  MapPin,
  Loader,
} from "lucide-react";

interface Product {
  _id: string;
  id?: number;
  name: string;
  color: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  onSale?: boolean;
  salePrice?: number;
  salePercent?: number;
  likes?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [productLikes, setProductLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formPostal, setFormPostal] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const productRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(apiUrl("/api/products"));
        const data = await response.json();
        if (data.success && Array.isArray(data.products)) {
          const productId = String(params.id);
          const foundProduct = data.products.find(
            (p: Product) => p._id === productId || String(p.id) === productId,
          );
          setProduct(foundProduct ?? null);

          if (foundProduct) {
            if (foundProduct.likes) setProductLikes(foundProduct.likes);
            const savedIsLiked = localStorage.getItem(`product_liked_${foundProduct._id}`);
            if (savedIsLiked) setLiked(savedIsLiked === "true");
          }
        }
      } catch {
        setProduct(null);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  // Animation GSAP au chargement
  useEffect(() => {
    if (typeof window !== "undefined" && product && productRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        imageRef.current,
        { opacity: 0, x: -50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8 }
      );

      tl.fromTo(
        infoRef.current?.children || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.4"
      );
    }
  }, [product]);

  // Animation GSAP au hover de l'image
  const handleImageHover = () => {
    if (typeof window !== "undefined" && imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.05,
        rotation: 2,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleImageLeave = () => {
    if (typeof window !== "undefined" && imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  // Animation GSAP au clic sur "Ajouter au panier"
  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      alert("Veuillez sélectionner une taille");
      return;
    }

    if (typeof window !== "undefined") {
      const btn = document.querySelector(".add-to-cart-btn");
      if (btn) {
        gsap.to(btn, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(btn, {
              scale: 1,
              duration: 0.3,
              ease: "elastic.out(1, 0.3)",
            });
          },
        });
      }
    }

    addItem(
      {
        id: Number(product._id) || product.id!,
        name: product.name,
        price: product.onSale && product.salePrice ? product.salePrice : product.price,
        image: product.image,
        color: product.color,
        size: selectedSize,
      },
      quantity,
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Commande directe (sans passer par le panier)
  const handleDirectOrder = async () => {
    if (!product) return;

    setOrderError("");

    if (!selectedSize) {
      setOrderError("Veuillez sélectionner une taille");
      return;
    }

    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      setOrderError("Veuillez remplir toutes les informations obligatoires");
      return;
    }

    if (!formAddress.trim() || !formCity.trim() || !formPostal.trim() || !formCountry.trim()) {
      setOrderError("Veuillez remplir l'adresse de livraison complète");
      return;
    }

    setOrderSubmitting(true);

    try {
      const unitPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
      const total = unitPrice * quantity;

      const orderData = {
        customerName: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim(),
        city: formCity.trim(),
        postalCode: formPostal.trim(),
        country: formCountry.trim(),
        items: [
          {
            productId: product._id,
            name: product.name,
            price: unitPrice,
            quantity,
            color: product.color,
            size: selectedSize,
            image: product.image,
          },
        ],
        total,
      };

      const response = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        setOrderSuccess(true);
        // Track Purchase event
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Purchase", {
            content_name: product.name,
            content_type: "product",
            value: total,
            currency: "EUR",
          });
        }
      } else {
        setOrderError(typeof data.error === "string" ? data.error : "La commande a échoué. Réessayez.");
      }
    } catch {
      setOrderError("Erreur réseau. Réessayez dans un instant.");
    }

    setOrderSubmitting(false);
  };

  // Handle Like
  const handleLike = async () => {
    if (!product) return;

    if (typeof window !== "undefined") {
      const btn = document.querySelector(".like-btn");
      if (btn) {
        gsap.to(btn, {
          scale: 1.3,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(btn, {
              scale: 1,
              duration: 0.3,
              ease: "elastic.out(1, 0.3)",
            });
          },
        });
      }
    }

    const action = liked ? "unlike" : "like";
    try {
      const res = await fetch(apiUrl("/api/products/likes"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product._id, action }),
      });
      const data = await res.json();
      if (data.success) {
        setProductLikes(data.likes);
        setLiked(action === "like");
      }
    } catch { /* ignore */ }
  };

  // Handle Share
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez ${product?.name} - ${product?.description}`;

    let shareUrl = "";
    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
        shareUrl = `https://www.linkeding/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
        break;
    }

    setShareOpen(false);
  };

  // Animation GSAP au hover du bouton
  const handleButtonHover = () => {
    if (typeof window !== "undefined") {
      const btn = document.querySelector(".add-to-cart-btn");
      if (btn) {
        gsap.to(btn, {
          scale: 1.02,
          boxShadow: "0 0 40px rgba(255, 255, 255, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  const handleButtonLeave = () => {
    if (typeof window !== "undefined") {
      const btn = document.querySelector(".add-to-cart-btn");
      if (btn) {
        gsap.to(btn, {
          scale: 1,
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-1 sm:space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Retour</span>
            </button>
             <div className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="DripBazzarDZ"
                width={48}
                height={48}
                className="h-6 sm:h-8 w-6 sm:w-8 rounded-full object-cover border-2 border-white/20"
              />
              <span className="text-white font-bold text-lg sm:text-xl">DripBazzarDZ</span>
            </div>
          </div>
        </div>
      </header>

      <div ref={productRef} className="pt-20 pb-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Image du produit */}
            <div
              ref={imageRef}
              onMouseEnter={handleImageHover}
              onMouseLeave={handleImageLeave}
              className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 cursor-pointer"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={
                  product.image.startsWith("http://") ||
                  product.image.startsWith("https://")
                }
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium">
                  {product.category}
                </span>
                {product.onSale && product.salePercent && (
                  <span className="px-3 py-1 bg-red-500 text-white font-bold text-xs">
                    -{product.salePercent}%
                  </span>
                )}
                {product.stock < 10 && (
                  <span className="px-3 py-1 bg-red-500/20 backdrop-blur-xl rounded-full text-xs font-medium text-red-400">
                    Stock limité
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`like-btn p-3 backdrop-blur-xl rounded-full transition-colors ${
                    liked
                      ? "bg-red-500/20 text-red-400"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                </motion.button>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShareOpen(!shareOpen)}
                    className="p-3 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>

                  {/* Share Menu */}
                  {shareOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 top-14 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-2 space-y-1 min-w-[160px]"
                    >
                      <button
                        onClick={() => handleShare("copy")}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span>{copied ? "Copié!" : "Copier le lien"}</span>
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                      >
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Likes Counter */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-xl rounded-full">
                <Heart className={`h-4 w-4 ${liked ? "text-red-400 fill-red-400" : "text-white/60"}`} />
                <span className="text-sm font-medium">{productLikes}</span>
              </div>
            </div>

            {/* Informations du produit */}
            <div ref={infoRef} className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">
                  {product.name}
                </h1>
                <p className="text-white/60 text-base sm:text-lg">{product.color}</p>
              </div>

              {/* Prix */}
              <div className="flex flex-wrap items-center gap-3">
                {product.onSale && product.salePrice ? (
                  <>
                    <span className="text-3xl md:text-4xl font-bold">€{product.salePrice}</span>
                    <span className="text-white/50 line-through text-lg md:text-xl">
                      €{product.price}
                    </span>
                    {product.salePercent && (
                      <span className="px-3 py-1 bg-red-500 text-white font-bold text-sm rounded-full">
                        -{product.salePercent}%
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-3xl md:text-4xl font-bold">€{product.price}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-white/70 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Note */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/60">(4.8) · 128 avis</span>
              </div>

              {/* Tailles */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Taille</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-white/60 text-sm mt-2">Veuillez sélectionner une taille</p>
                )}
              </div>

              {/* Quantité */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantité</h3>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </motion.button>
                  <span className="text-2xl font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                  disabled={isAdded}
                  className="add-to-cart-btn flex-1 py-3 sm:py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex items-center justify-center space-x-2"
                >
                  <span className="relative z-10 text-sm sm:text-base">
                    {isAdded ? "Ajouté !" : "Ajouter au panier"}
                  </span>
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>

                {/* Commande directe */}
                {!isAdded && quantity > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowOrderForm(!showOrderForm)}
                    className="w-full py-3 sm:py-4 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span className="text-sm sm:text-base">Commander maintenant</span>
                  </motion.button>
                )}
              </div>

              {/* Formulaire de commande directe */}
              {showOrderForm && !isAdded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  {/* Récapitulatif rapide */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        unoptimized={
                          product.image.startsWith("http://") ||
                          product.image.startsWith("https://")
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{product.name}</h3>
                      <p className="text-white/60 text-sm">{product.color} • Taille: {selectedSize || "—"}</p>
                      <p className="text-white/60 text-sm">Quantité: {quantity}</p>
                    </div>
                    <p className="font-bold whitespace-nowrap">
                      €{((product.onSale && product.salePrice ? product.salePrice : product.price) * quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Informations personnelles */}
                  <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-bold mb-4">Informations personnelles</h2>
                    <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Nom complet"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <input
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="Email"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <input
                          type="tel"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="Téléphone"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-bold mb-4">Adresse de livraison</h2>
                    <div className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-white/40" />
                        <textarea
                          value={formAddress}
                          onChange={(e) => setFormAddress(e.target.value)}
                          placeholder="Adresse"
                          required
                          rows={2}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={formCity}
                            onChange={(e) => setFormCity(e.target.value)}
                            placeholder="Ville"
                            required
                            className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={formPostal}
                            onChange={(e) => setFormPostal(e.target.value)}
                            placeholder="Code postal"
                            required
                            className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={formCountry}
                          onChange={(e) => setFormCountry(e.target.value)}
                          placeholder="Pays"
                          required
                          className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {orderError && (
                    <p className="text-red-400 text-sm text-center" role="alert">{orderError}</p>
                  )}

                  {/* Bouton de soumission */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDirectOrder}
                    disabled={orderSubmitting || orderSuccess}
                    className="submit-btn w-full py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex items-center justify-center space-x-2"
                  >
                    <span className="relative z-10">
                      {orderSuccess
                        ? "Commande envoyée !"
                        : orderSubmitting
                        ? "Envoi en cours..."
                        : `Confirmer la commande • €${((product.onSale && product.salePrice ? product.salePrice : product.price) * quantity).toFixed(2)}`
                      }
                    </span>
                    {orderSubmitting && <Loader className="h-5 w-5 animate-spin relative z-10" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.button>
                </motion.div>
              )}

              {/* Avantages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-green-400" />
                  <div>
                    <p className="font-medium">Livraison gratuite</p>
                    <p className="text-white/60 text-sm">2-3 jours ouvrés</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-medium">Garantie 2 ans</p>
                    <p className="text-white/60 text-sm">
                      Satisfait ou remboursé
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="font-medium">Retour gratuit</p>
                    <p className="text-white/60 text-sm">Sous 30 jours</p>
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Stock disponible</span>
                  <span
                    className={`font-bold ${
                      product.stock > 20
                        ? "text-green-400"
                        : product.stock > 10
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {product.stock} unités
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
