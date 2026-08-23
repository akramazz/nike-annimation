"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import ProductImage from "@/app/components/products/ProductImage";
import ProductGallery from "@/app/components/products/ProductGallery";
import QuickOrderForm from "@/app/components/products/QuickOrderForm";
import ProductBenefits from "@/app/components/products/ProductBenefits";
import { useCart } from "@/app/context/CartContext";
import { getProduct, UnifiedProduct } from "@/app/lib/get-product";
import { apiUrl } from "@/lib/api-client";
import {
  ArrowLeft,
  Heart,
  Share2,
  Check,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  ChevronDown,
} from "lucide-react";
import { formatPriceDA } from "@/lib/price-utils";
import { normalizeCategory } from "@/lib/product-categories";
import StarRating from "@/app/components/StarRating";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const id = String(params?.id ?? "");

  const [product, setProduct] = useState<UnifiedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProduct(null);
    setOrderSuccess(false);
    setShowQuickOrder(false);

    getProduct(id).then((p) => {
      if (cancelled) return;
      setProduct(p);
      setLoading(false);
      if (p) {
        setLikes(p.likes || 0);
        const saved = localStorage.getItem(`product_liked_${p._id}`);
        if (saved) setIsLiked(saved === "true");
        const savedSize = localStorage.getItem(`product_size_${p._id}`);
        if (savedSize) setSelectedSize(savedSize);

        fetch(apiUrl(`/api/ratings?productId=${encodeURIComponent(p._id)}`))
          .then((res) => res.json())
          .then((data) => {
            if (!cancelled && data.success) {
              setAverageRating(data.average || 0);
              setRatingCount(data.count || 0);
            }
          })
          .catch(() => {});
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleLike = useCallback(async () => {
    if (!product) return;
    const action = isLiked ? "unlike" : "like";
    setLikes((v) => (isLiked ? Math.max(0, v - 1) : v + 1));
    setIsLiked((v) => !v);
    localStorage.setItem(`product_liked_${product._id}`, (!isLiked).toString());

    try {
      await fetch(apiUrl("/api/products/likes"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id || product._id, action }),
      });
    } catch {
      /* ignore */
    }
  }, [product, isLiked]);

  const handleShare = useCallback(
    (platform: string) => {
      if (!product) return;
      const url = `${window.location.origin}/products/${product._id}`;
      const text = `Découvrez ${product.name}`;

      switch (platform) {
        case "copy":
          navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            "_blank",
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            "_blank",
          );
          break;
      }
      setShowShareMenu(false);
    },
    [product],
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (!selectedSize && product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique") {
      return;
    }
    const size = selectedSize || product.sizes?.[0] || "Unique";
    addItem(
      {
        id: product.id || Number(product._id) || 0,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.color || product.category,
        size,
      },
      quantity,
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [product, selectedSize, quantity, addItem]);

  if (loading) {
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
          <h1 className="text-2xl font-bold text-white mb-4">Produit introuvable</h1>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
  const defaultSize = selectedSize || product.sizes[0] || null;

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "back.out(1.7)" as unknown as import("framer-motion").Easing }}
          className="max-w-md w-full p-8 sm:p-10 rounded-3xl backdrop-blur-xl bg-green-500/10 border border-green-500/30 text-center space-y-5"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-green-400">
            Commande confirmée !
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
          </p>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                setOrderSuccess(false);
                setSelectedSize(defaultSize);
                setQuantity(1);
              }}
              className="block w-full px-8 py-3 sm:py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all text-sm sm:text-base"
            >
              Commander à nouveau
            </button>
            <button
              onClick={() => router.push("/products")}
              className="block w-full px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all text-sm"
            >
              Retour aux produits
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
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
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                <Image src="/logo.png" alt="DripBazzarDZ" fill className="object-cover" />
              </div>
              <span className="text-white font-bold text-lg sm:text-xl">DripBazzarDZ</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery product={product} />

              <div className="relative mt-4 aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
                <ProductImage src={product.image} alt={product.name} fill className="object-contain p-4" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium">
                  {normalizeCategory(product.category)}
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`p-3 backdrop-blur-xl rounded-full transition-colors ${
                      isLiked ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </motion.button>

                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-3 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>

                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-14 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-2 space-y-1 min-w-[160px] z-10"
                      >
                        <button
                          onClick={() => handleShare("copy")}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                        >
                          {copySuccess ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span>{copySuccess ? "Copié !" : "Copier"}</span>
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

                <div className="absolute bottom-4 left-4 flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-xl rounded-full">
                  <Heart className={`h-4 w-4 ${isLiked ? "text-red-400 fill-red-400" : "text-white/60"}`} />
                  <span className="text-sm font-medium">{likes}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-medium px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-white/90 inline-block border border-white/20">
                  {normalizeCategory(product.category)}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
                  {product.name}
                </h1>
                {product.color && (
                  <p className="text-white/60 text-base sm:text-lg">{product.color}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-extrabold text-white">
                  {formatPriceDA(currentPrice)}
                </span>
                {product.onSale && product.salePrice && (
                  <span className="text-white/50 line-through text-lg md:text-xl">
                    {formatPriceDA(product.price)}
                  </span>
                )}
                {product.salePercent && (
                  <span className="px-3 py-1 bg-red-500 text-white font-bold text-sm rounded-full">
                    -{product.salePercent}%
                  </span>
                )}
              </div>

              <StarRating value={averageRating} count={ratingCount} />

              <p className="text-white/70 text-base leading-relaxed">{product.description}</p>

              <div>
                <h3 className="text-base font-semibold mb-2 sm:mb-3">Taille</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedSize(size);
                        localStorage.setItem(`product_size_${product._id}`, size);
                      }}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-2 sm:mb-3">Quantité</h3>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold"
                  >
                    −
                  </motion.button>
                  <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isAdded}
                className="w-full py-3 sm:py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAdded ? "Ajouté au panier !" : "Ajouter au panier"}
              </motion.button>

              <div className="space-y-4">
                <button
                  onClick={() => setShowQuickOrder(!showQuickOrder)}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-base font-semibold">Commander rapidement</span>
                  <motion.div
                    animate={{ rotate: showQuickOrder ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: showQuickOrder ? "auto" : 0, opacity: showQuickOrder ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {showQuickOrder && (
                    <QuickOrderForm
                      productId={product.id || product._id}
                      productName={product.name}
                      productPrice={currentPrice}
                      totalAmount={currentPrice * quantity}
                      productColor={product.color || product.category}
                      productCategory={normalizeCategory(product.category)}
                      selectedSize={defaultSize || "Unique"}
                      quantity={quantity}
                      productImage={product.image}
                      onSuccess={() => setOrderSuccess(true)}
                    />
                  )}
                </motion.div>
              </div>

              <ProductBenefits />

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/60 text-sm">Stock disponible</span>
                <span
                  className={`font-bold text-sm ${
                    product.stock > 20
                      ? "text-green-400"
                      : product.stock > 10
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {product.stock > 20
                    ? `${product.stock} unités en stock`
                    : product.stock > 10
                      ? `Stock limité — ${product.stock} restants`
                      : `Plus que ${product.stock} en stock !`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
