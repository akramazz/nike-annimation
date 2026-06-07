"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CategoryScene from "../components/CategoryScene";
import { apiUrl } from "@/lib/api-client";
import { DEFAULT_SIZES, normalizeProductImage } from "@/lib/product-normalize";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

// Enregistrement du plugin ScrollTrigger de GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Composant de chargement
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="loading-spinner"></div>
    </div>
  );
}

// Interface pour les produits
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
}

// Page Catégorie avec animations 3D
export default function CategoryPage() {
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/products"));
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.products)) {
          setProducts(
            data.products.map((p: Product) => ({
              ...p,
              sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : [...DEFAULT_SIZES],
            })),
          );
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

   // Catégories disponibles
   const categories = [
      { id: "all", name: "Tous" },
      { id: "Premium", name: "DripBazzarDZ" },
      { id: "Luxury", name: "Luxury" },
      { id: "Classic", name: "Classic" },
    ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Animation GSAP au chargement de la page
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation du titre principal
    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.2,
      }
    );

    // Animation du sous-titre
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
      "-=0.6"
    );

    // Animation des catégories avec stagger
    if (categoriesRef.current) {
      tl.fromTo(
        categoriesRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.4"
      );
    }

    // Animation des produits avec ScrollTrigger
    if (productsRef.current) {
      const productCards = productsRef.current.querySelectorAll(".product-card");
      productCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    // Nettoyage des animations
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted, selectedCategory]);

  // Animation GSAP au hover d'un produit
  const handleProductHover = (productId: number) => {
    setHoveredProduct(productId);
  };

  const handleProductLeave = () => {
    setHoveredProduct(null);
  };

  // Animation GSAP au clic sur un produit
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Fermer la modal
  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
    setIsAdded(false);
  };

  // Ajouter au panier depuis la modal
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (!selectedSize) {
      alert("Veuillez sélectionner une taille");
      return;
    }

    addItem(
      {
        id: Number(selectedProduct._id) || selectedProduct.id!,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: normalizeProductImage(selectedProduct.image),
        color: selectedProduct.color,
        size: selectedSize,
      },
      1,
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navigation fixe animée */}
      <Navigation />

      {/* Section héro avec scène 3D */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Scène 3D en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryScene />
          </Suspense>
        </div>

        {/* Overlay de gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10" />

        {/* Contenu principal */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Badge animé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse mr-2" />
            <span className="text-white/90 text-sm font-medium">
              Collection Exclusive
            </span>
          </motion.div>

          {/* Titre principal avec animation GSAP */}
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight"
          >
            <span className="block">Nos</span>
            <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Catégories
            </span>
          </h1>

          {/* Sous-titre avec animation GSAP */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Explorez notre collection exclusive de vestes premium, organisée par
            catégorie pour faciliter votre shopping.
          </p>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </section>

      {/* Section Filtres par catégorie */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div
            ref={categoriesRef}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-white text-black shadow-lg shadow-white/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Section Produits */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Grille de produits */}
              <div
                ref={productsRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                  {productsLoading && (
                  <div className="col-span-full text-center py-20 text-white/80">
                    Chargement des produits…
                  </div>
                )}
                {!productsLoading &&
                  filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    className="product-card group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer"
                    onMouseEnter={() => handleProductHover(Number(product._id) || product.id!)}
                    onMouseLeave={handleProductLeave}
                    onClick={() => handleProductClick(product)}
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    {/* Image du produit avec effet 3D */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/products/default.webp"; }}
                      />
                      
                      {/* Overlay avec effet de brillance */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Badge de catégorie */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-xs font-medium border border-white/20">
                        {product.category}
                      </div>

                      {/* Icône 3D interactive */}
                      <motion.div
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{
                          rotate: hoveredProduct === product.id ? 360 : 0,
                          scale: hoveredProduct === product.id ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-white text-lg">👁️</span>
                      </motion.div>

                      {/* Prix */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-2xl font-bold text-white mb-1">
                          {product.price.toFixed(2)} €
                        </div>
                        <div className="text-white/60 text-sm">
                          {product.stock} en stock
                        </div>
                      </div>
                    </div>

                    {/* Informations du produit */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Couleur */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-white/60 text-sm">Couleur:</span>
                        <span className="text-white font-medium">{product.color}</span>
                      </div>

                      {/* Tailles disponibles */}
                      <div className="flex flex-wrap gap-2">
                        {(product.sizes ?? [...DEFAULT_SIZES]).slice(0, 5).map((size) => (
                          <span
                            key={size}
                            className="px-2 py-1 bg-white/10 rounded text-white/70 text-xs"
                          >
                            {size}
                          </span>
                        ))}
                        {(product.sizes ?? [...DEFAULT_SIZES]).length > 5 && (
                          <span className="px-2 py-1 bg-white/10 rounded text-white/70 text-xs">
                            +{(product.sizes ?? [...DEFAULT_SIZES]).length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Effet de brillance au hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  </motion.div>
                ))}
              </div>

              {/* Message si aucun produit */}
              {!productsLoading && filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-white/70">
                    Essayez de sélectionner une autre catégorie.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Modal de détails du produit */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white/10 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton fermer */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                <span className="text-white text-xl">✕</span>
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image du produit */}
                <div className="relative h-80 md:h-full rounded-2xl overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/products/default.webp"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Badge de catégorie */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-sm font-medium border border-white/20">
                    {selectedProduct.category}
                  </div>
                </div>

                {/* Informations du produit */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {selectedProduct.name}
                  </h2>
                  
                  <p className="text-white/70 text-lg mb-6 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Prix</span>
                      <span className="text-3xl font-bold text-white">
                        {selectedProduct.price.toFixed(2)} €
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Couleur</span>
                      <span className="text-white font-medium">{selectedProduct.color}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Stock</span>
                      <span className="text-white font-medium">{selectedProduct.stock} disponibles</span>
                    </div>
                  </div>

                  {/* Tailles disponibles */}
                  <div className="mb-8">
                    <span className="text-white/60 text-sm mb-3 block">Tailles disponibles</span>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProduct.sizes ?? [...DEFAULT_SIZES]).map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg text-white font-medium border transition-colors duration-300 ${
                            selectedSize === size
                              ? "bg-white text-black border-white"
                              : "border-white/20 hover:bg-white/20"
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

                  {/* Bouton d'achat */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className="w-full py-4 bg-white text-black font-bold text-lg rounded-full shadow-2xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {isAdded ? "Ajouté !" : "Ajouter au Panier"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Statistiques */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Des chiffres qui parlent d'eux-mêmes et témoignent de notre engagement
              envers la qualité et la satisfaction client.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Modèles Uniques", icon: "👔" },
              { value: "50K+", label: "Clients Satisfaits", icon: "😊" },
              { value: "99%", label: "Taux de Satisfaction", icon: "⭐" },
              { value: "24/7", label: "Support Client", icon: "💬" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à Découvrir ?
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Explorez notre collection complète et trouvez la veste parfaite pour vous.
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-5 bg-white text-black font-bold text-lg rounded-full shadow-2xl hover:bg-white/90 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Voir Tous les Produits</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Pied de page */}
      <Footer />

      {/* Effet de grain de film */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
