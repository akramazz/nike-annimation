"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "../../../context/CartContext";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Check,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Minus,
  Plus,
} from "lucide-react";

function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

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

const accessoriesData: Accessory[] = [
  {
    id: 1,
    name: "Casquette Noir",
    description: "Casquette premium en coton avec logo brodé. Style urbain moderne avec ajustement confortable.",
    price: 49.99,
    image: "/products/casquette.webp",
    category: "Accessoires",
    sizes: ["S/M", "L/XL"],
    likes: 12
  },
  {
    id: 2,
    name: "Casquette Noire",
    description: "Casquette anatomique avec strap arrière pour un ajustement parfait. Tissu respirant.",
    price: 39.99,
    image: "/products/casquettenoire.png",
    category: "Accessoires",
    sizes: ["S/M", "L/XL"],
    likes: 8
  },
  {
    id: 3,
    name: "Écharpe Rouge",
    description: "Écharpe en laine premium rouge élégante. Douce et chaude pour l'hiver.",
    price: 89.99,
    image: "/products/chalrouge.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 25
  },
  {
    id: 4,
    name: "Écharpe Vert",
    description: "Écharpe超 douce en cachemire. Confort luxueux pour toutes les saisons.",
    price: 129.99,
    image: "/products/chal.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 18
  },
  {
    id: 5,
    name: "Ceinture Beige",
    description: "Ceinture cuir avec boucle argentée. Classique et élégante.",
    price: 79.99,
    image: "/products/sinture.webp",
    category: "Accessoires",
    sizes: ["S", "M", "L", "XL"],
    likes: 15
  },
  {
    id: 6,
    name: "Casque Audio",
    description: "Casque premium sans fil avec réduction de bruit active. Son haute fidélité.",
    price: 199.99,
    image: "/products/cascadia.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 32
  },
  {
    id: 7,
    name: "Bob Noir",
    description: "Bob léger pour l'été. Protection UV et tissu respirant.",
    price: 29.99,
    image: "/products/bobnoir.webp",
    category: "Accessoires",
    sizes: ["S/M", "L/XL"],
    likes: 5
  },
  {
    id: 8,
    name: "Sac Voyage",
    description: "Sac weekend en toile premium. Spacieux et résistant.",
    price: 149.99,
    image: "/products/tavares.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 22
  },
  {
    id: 9,
    name: "Lunettes Soleil",
    description: "Lunettes premium avec Protection UV400. Style et protection.",
    price: 159.99,
    image: "/products/facebeage.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 45
  },
  {
    id: 10,
    name: "Montre Classic",
    description: "Montre automatique avec bracelet cuir. Élégance intemporelle.",
    price: 299.99,
    image: "/products/vertface.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 67
  },
  {
    id: 11,
    name: "Montre Sport",
    description: "Montre connectée avec GPS. Pour les sportifs exigeants.",
    price: 399.99,
    image: "/products/orangeface.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 89
  },
  {
    id: 12,
    name: "Bracelet Cuir",
    description: "Bracelet tressé premium. Style rustique et élégant.",
    price: 34.99,
    image: "/products/milangeface.webp",
    category: "Accessoires",
    sizes: ["S", "M", "L"],
    likes: 11
  },
];

export default function AccessoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Accessory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const productId = String(params.id);
    const foundProduct = accessoriesData.find(
      (p) => String(p.id) === productId
    );
    setProduct(foundProduct || null);
    
    if (foundProduct) {
      setLikes(foundProduct.likes || 0);
      const savedIsLiked = localStorage.getItem(`product_liked_${foundProduct.id}`);
      if (savedIsLiked) setIsLiked(savedIsLiked === "true");
    }
    
    setIsLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("Veuillez sélectionner une taille");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.category,
      size: selectedSize || product.sizes?.[0] || "Unique",
    }, quantity);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleLike = async () => {
    if (!product) return;
    
    const action = isLiked ? "unlike" : "like";
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
    
    localStorage.setItem(`product_liked_${product.id}`, (!isLiked).toString());

    try {
      await fetch(apiUrl("/api/products/likes"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, action }),
      });
    } catch { /* ignore */ }
  };

  const handleShare = (platform: string) => {
    if (!product) return;
    
    const url = window.location.href;
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
          <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
          <button
            onClick={() => router.push("/products/accessories")}
            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
          >
            Retour aux accessoires
          </button>
        </div>
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
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4 sm:p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium">
                {product.category}
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
                        {copySuccess ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        <span>{copySuccess ? "Copié!" : "Copier"}</span>
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

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {product.name}
                </h1>
                <p className="text-white/60 text-base sm:text-lg mt-2">{product.category}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl sm:text-4xl font-bold text-white">€{product.price.toFixed(2)}</span>
              </div>

              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>

              {product.sizes && product.sizes.length > 0 && (
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
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3">Quantité</h3>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.button>
                  <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isAdded}
                className="w-full py-3 sm:py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm sm:text-base">{isAdded ? "Ajouté !" : "Ajouter au panier"}</span>
              </motion.button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-green-400" />
                  <div>
                    <p className="font-medium text-sm">Livraison gratuite</p>
                    <p className="text-white/60 text-xs">2-3 jours ouvrés</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-medium text-sm">Garantie 2 ans</p>
                    <p className="text-white/60 text-xs">Satisfait ou remboursé</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="font-medium text-sm">Retour gratuit</p>
                    <p className="text-white/60 text-xs">Sous 30 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
