"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProductImg from "../components/products/ProductImg";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { apiUrl } from "@/lib/api-client";
import { normalizeProductImage } from "@/lib/product-normalize";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, Eye, Link as LinkIcon } from "lucide-react";

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
  type?: "jacket" | "accessory";
}

const accessoriesData: Product[] = [
  {
    _id: "acc-1",
    id: 1,
    name: "Casquette Noir",
    color: "Accessoires",
    description: "Casquette premium en coton avec logo brodé",
    price: 49.99,
    stock: 50,
    image: "/products/casquette.webp",
    category: "Accessoires",
    sizes: ["S/M", "L/XL"],
    likes: 12,
    type: "accessory"
  },
  {
    _id: "acc-2",
    id: 2,
    name: "Casquette Noire",
    color: "Accessoires",
    description: "Casquette anatomique avec strap arrière",
    price: 39.99,
    stock: 45,
    image: "/products/casquettenoire.png",
    category: "Accessoires",
    sizes: ["S/M", "L/XL"],
    likes: 8,
    type: "accessory"
  },
  {
    _id: "acc-3",
    id: 3,
    name: "Écharpe Rouge",
    color: "Accessoires",
    description: "Écharpe en laine premium rouge élégante",
    price: 89.99,
    stock: 30,
    image: "/products/chalrouge.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 25,
    type: "accessory"
  },
  {
    _id: "acc-4",
    id: 4,
    name: "Écharpe Vert",
    color: "Accessoires",
    description: "Écharpe超 douce en cachemire",
    price: 129.99,
    stock: 25,
    image: "/products/chal.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 18,
    type: "accessory"
  },
  {
    _id: "acc-5",
    id: 5,
    name: "Ceinture Beige",
    color: "Accessoires",
    description: "Ceinture cuir avec boucle argentée",
    price: 79.99,
    stock: 40,
    image: "/products/sinture.webp",
    category: "Accessoires",
    sizes: ["S", "M", "L", "XL"],
    likes: 15,
    type: "accessory"
  },
  {
    _id: "acc-6",
    id: 6,
    name: "Casque Audio",
    color: "Accessoires",
    description: "Casque premium sans fil avec réduction de bruit",
    price: 199.99,
    stock: 20,
    image: "/products/cascadia.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 32,
    type: "accessory"
  },
  {
    _id: "acc-7",
    id: 7,
    name: "Bob Noir",
    color: "Accessoires",
    description: "Bob léger pour l'été",
    price: 29.99,
    stock: 60,
    image: "/products/bobnoir.webp",
    category: "Accessoires",
    sizes: ["S/M", "L/XL"],
    likes: 5,
    type: "accessory"
  },
  {
    _id: "acc-8",
    id: 8,
    name: "Sac Voyage",
    color: "Accessoires",
    description: "Sac weekend en toile premium",
    price: 149.99,
    stock: 15,
    image: "/products/tavares.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 22,
    type: "accessory"
  },
  {
    _id: "acc-9",
    id: 9,
    name: "Lunettes Soleil",
    color: "Accessoires",
    description: "Lunettes premium avec Protection UV400",
    price: 159.99,
    stock: 35,
    image: "/products/facebeage.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 45,
    type: "accessory"
  },
  {
    _id: "acc-10",
    id: 10,
    name: "Montre Classic",
    color: "Accessoires",
    description: "Montre automatique avec bracelet cuir",
    price: 299.99,
    stock: 10,
    image: "/products/vertface.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 67,
    type: "accessory"
  },
  {
    _id: "acc-11",
    id: 11,
    name: "Montre Sport",
    color: "Accessoires",
    description: "Montre connectée avec GPS",
    price: 399.99,
    stock: 8,
    image: "/products/orangeface.webp",
    category: "Accessoires",
    sizes: ["Unique"],
    likes: 89,
    type: "accessory"
  },
  {
    _id: "acc-12",
    id: 12,
    name: "Bracelet Cuir",
    color: "Accessoires",
    description: "Bracelet tressé premium",
    price: 34.99,
    stock: 55,
    image: "/products/milangeface.webp",
    category: "Accessoires",
    sizes: ["S", "M", "L"],
    likes: 11,
    type: "accessory"
  },
];

// Fallback jackets data - used when MongoDB is not available
const fallbackJackets: Product[] = [
  { _id: "j-1", id: 101, name: "Veste Rouge", color: "Rouge", price: 69.99, stock: 25, image: "/products/rouge.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Élégance audacieuse", type: "jacket", likes: 45 },

  { _id: "j-2", id: 102, name: "Veste Gris", color: "Gris", price: 220.99, stock: 15, image: "/products/gris.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Sophistication absolue", type: "jacket", likes: 32 },

  { _id: "j-3", id: 103, name: "Veste Bleue", color: "Bleu", price: 59.99, stock: 30, image: "/products/blue.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Style moderne", type: "jacket", likes: 28 },

  { _id: "j-4", id: 104, name: "Veste Marron", color: "Marron", price: 33.99, stock: 40, image: "/products/maron.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Chaleur naturelle", type: "jacket", likes: 19 },

  { _id: "j-5", id: 105, name: "Veste Beige", color: "Beige", price: 59.99, stock: 20, image: "/products/beage.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Minimalisme élégant", type: "jacket", likes: 41 },

  { _id: "j-6", id: 106, name: "Veste Noire", color: "Noir", price: 59.99, stock: 35, image: "/products/noir.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Intemporelle", type: "jacket", likes: 67 },

  { _id: "j-7", id: 107, name: "Veste Verte", color: "Vert", price: 88.99, stock: 18, image: "/products/vert.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Fraîcheur originale", type: "jacket", likes: 23 },

  { _id: "j-8", id: 108, name: "Veste Pistache", color: "Pistache", price: 69.99, stock: 22, image: "/products/pistache.webp", category: "Vestes", sizes: ["XS","S","M","L","XL","XXL"], description: "Couleur vibrante", type: "jacket", likes: 36 },

  { _id: "j-9", id: 109, name: "Algeria Cœur", color: "Noir", price: 79.99, stock: 20, image: "/products/akgeria-ceuor.webp", category: "Premium", sizes: ["XS","S","M","L","XL"], description: "Design Algeria édition limitée", type: "jacket", likes: 15 },

  { _id: "j-10", id: 110, name: "Alg16 Vert", color: "Vert", price: 84.99, stock: 18, image: "/products/alg16vert.webp", category: "Premium", sizes: ["XS","S","M","L","XL"], description: "Collection streetwear Algérie", type: "jacket", likes: 21 },

  { _id: "j-11", id: 111, name: "Alger Rose", color: "Rose", price: 74.99, stock: 25, image: "/products/algerrose.webp", category: "Luxury", sizes: ["XS","S","M","L","XL"], description: "Style urbain premium", type: "jacket", likes: 19 },

  { _id: "j-12", id: 112, name: "Alger Soleil", color: "Orange", price: 89.99, stock: 12, image: "/products/algersoliel.webp", category: "Luxury", sizes: ["XS","S","M","L","XL"], description: "Édition soleil streetwear", type: "jacket", likes: 26 },

  { _id: "j-13", id: 113, name: "Anime Sezare", color: "Noir", price: 99.99, stock: 10, image: "/products/anime-sezare.webp", category: "Premium", sizes: ["XS","S","M","L","XL"], description: "Inspiration anime moderne", type: "jacket", likes: 41 },

  { _id: "j-14", id: 114, name: "Casbah", color: "Beige", price: 69.99, stock: 20, image: "/products/casbah.webp", category: "Classic", sizes: ["XS","S","M","L","XL"], description: "Inspiré de la Casbah d’Alger", type: "jacket", likes: 33 },

  { _id: "j-15", id: 115, name: "Free Palestine", color: "Noir", price: 79.99, stock: 30, image: "/products/freepalastine.webp", category: "Premium", sizes: ["XS","S","M","L","XL"], description: "Design engagé premium", type: "jacket", likes: 58 },

  { _id: "j-16", id: 116, name: "Marvel Edition", color: "Rouge", price: 109.99, stock: 14, image: "/products/marvel.webp", category: "Luxury", sizes: ["XS","S","M","L","XL"], description: "Collection inspirée comics", type: "jacket", likes: 64 },

  { _id: "j-17", id: 117, name: "Oran Street", color: "Orange", price: 72.99, stock: 17, image: "/products/oran.webp", category: "Classic", sizes: ["XS","S","M","L","XL"], description: "Style inspiré d’Oran", type: "jacket", likes: 22 },

  { _id: "j-18", id: 118, name: "Sekiro", color: "Noir", price: 119.99, stock: 9, image: "/products/sekiro.webp", category: "Premium", sizes: ["XS","S","M","L","XL"], description: "Design gaming japonais", type: "jacket", likes: 77 },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCart();
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [showSizeError, setShowSizeError] = useState<Record<string, boolean>>({});

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product._id}`);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl("/api/products"));
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const jackets = data.products.map((p: Product) => ({ ...p, type: "jacket" as const }));
          setProducts([...accessoriesData, ...jackets]);
          
          const likesMap: Record<string, number> = {};
          const isLikedMap: Record<string, boolean> = {};
          accessoriesData.forEach(acc => {
            likesMap[acc._id] = acc.likes || 0;
            if (typeof window !== "undefined") {
              isLikedMap[acc._id] = localStorage.getItem(`product_liked_${acc.id}`) === "true";
            }
          });
          setLikes(likesMap);
          setIsLiked(isLikedMap);
        } else {
          // Use fallback data if API returns empty
          setProducts([...accessoriesData, ...fallbackJackets]);
        }
      } catch {
        // Use fallback data if API fails
        setProducts([...accessoriesData, ...fallbackJackets]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const productId = product._id;
    const selectedSize = selectedSizes[productId];
    
    // Check if size selection is required
    if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique" && !selectedSize) {
      setShowSizeError(prev => ({ ...prev, [productId]: true }));
      return;
    }
    
    // Clear error and add to cart
    setShowSizeError(prev => ({ ...prev, [productId]: false }));
    const size = selectedSize || product.sizes?.[0] || "Unique";
    const productNumericId = product.id || 1;
    addItem({
      id: productNumericId,
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

  const getProductLink = (product: Product) => {
    if (product.type === "accessory") {
      return `/products/accessories/${product.id}`;
    }
    return `/products/${product._id}`;
  };

  const categories = [
    { id: "all", name: "Tous" },
    { id: "Accessoires", name: "Accessoires" },
    { id: "Premium", name: "DripBazzarDZ" },
    { id: "Luxury", name: "Luxury" },
    { id: "Classic", name: "Classic" },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
            <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Nos Produits
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Explorez notre collection complète de vestes premium et accessoires.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                  selectedCategory === cat.id
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => handleProductClick(product)}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <ProductImg
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-xs font-medium border border-white/20">
                      {product.category}
                    </div>
                    {product.onSale && product.salePercent && (
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 bg-red-500 text-white font-bold text-xs rounded-full">
                        -{product.salePercent}%
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 flex flex-col gap-1 sm:gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(product); }}
                        className={`p-1.5 sm:p-2 rounded-full backdrop-blur-xl transition-colors ${
                          isLiked[product._id] 
                            ? "bg-red-500/20 text-red-400" 
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isLiked[product._id] ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-xl rounded-full">
                      <Heart className="h-3 w-3 text-white/60" />
                      <span className="text-xs text-white/60">{likes[product._id] || product.likes || 0}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate">{product.name}</h3>
                    <p className="text-white/60 text-xs sm:text-sm mb-2 line-clamp-2">{product.description || product.color}</p>
                    
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex flex-col">
                        {product.onSale && product.salePrice ? (
                          <>
                            <span className="text-base sm:text-lg font-bold text-white">€{product.salePrice.toFixed(2)}</span>
                            <span className="text-white/40 line-through text-xs">€{product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-base sm:text-lg font-bold text-white">€{product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 10 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {product.stock} en stock
                      </span>
                    </div>

                    {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unique" && (
                      <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                        {product.sizes.slice(0, 4).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeSelect(product._id, size)}
                            className={`px-1.5 py-0.5 text-xs rounded border transition-colors ${
                              selectedSizes[product._id] === size
                                ? "bg-white text-black border-white"
                                : "border-white/20 text-white/60 hover:border-white/40"
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

                    {(!product.sizes || product.sizes.length === 0 || product.sizes[0] === "Unique") && (
                      <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                        <span className="px-1.5 py-0.5 text-xs rounded border border-white/20 text-white/60">
                          Taille unique
                        </span>
                      </div>
                    )}
                   
                    <div className="flex gap-2">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); addItem({ id: product.id || 1, name: product.name, price: product.price, image: normalizeProductImage(product.image), color: product.color, size: selectedSizes[product._id] || 'Unique' }); }}
                        className="flex-1 py-2 bg-white text-black text-xs sm:text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Ajouter</span>
                      </motion.button>
                      <Link
                        href={getProductLink(product)}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </div>

                      <form
                        onSubmit={(e) => {
                          e.stopPropagation();
                        e.preventDefault();
                        const fd = new FormData(e.target as HTMLFormElement);
                        const qty = parseInt((fd.get("qty") as string) || "1", 10);
                        const size = selectedSizes[product._id] || product.sizes?.[0] || "Unique";
                        for (let i = 0; i < qty; i++) {
                          addItem({ id: product.id || 1, name: product.name, price: product.price, image: product.image, color: product.color, size });
                        }
                        (e.target as HTMLFormElement).reset();
                      }}
                      className="mt-2 p-2 rounded-lg bg-white/5 border border-white/10 space-y-1"
                    >
                      <p className="text-white/50 text-[10px] font-medium">Commander</p>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          name="qty"
                          min="1"
                          max={product.stock}
                          defaultValue="1"
                          placeholder="Qté"
                          className="flex-1 min-w-0 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:border-white/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-white text-black font-bold text-xs rounded-lg hover:bg-white/90 transition-colors"
                        >
                          OK
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">Aucun produit trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
