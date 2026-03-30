"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  color: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
}

// Composant de carte produit avec Glassmorphism
function ProductCard({
  product,
  isSelected,
  onClick,
  index,
}: {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const viewButtonRef = useRef<HTMLButtonElement>(null);
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Animation GSAP au hover de la carte
  const handleCardHover = () => {
    if (typeof window !== "undefined" && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleCardLeave = () => {
    if (typeof window !== "undefined" && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        y: 0,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  // Animation GSAP au hover du bouton
  const handleButtonHover = () => {
    if (typeof window !== "undefined" && buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        backgroundColor: "#ffffff",
        color: "#000000",
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }
  };

  const handleButtonLeave = () => {
    if (typeof window !== "undefined" && buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "#ffffff",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  // Animation GSAP au clic du bouton
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (typeof window !== "undefined" && buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "elastic.out(1, 0.3)",
          });
        },
      });
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      size: "M",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Animation GSAP au hover du bouton voir
  const handleViewButtonHover = () => {
    if (typeof window !== "undefined" && viewButtonRef.current) {
      gsap.to(viewButtonRef.current, {
        scale: 1.1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }
  };

  const handleViewButtonLeave = () => {
    if (typeof window !== "undefined" && viewButtonRef.current) {
      gsap.to(viewButtonRef.current, {
        scale: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
      onClick={onClick}
      className={`relative p-6 rounded-3xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer ${
        isSelected
          ? "bg-white/20 border-white/40 shadow-2xl"
          : "bg-white/10 border-white/20 shadow-xl hover:bg-white/15"
      }`}
    >
      {/* Badge de sélection */}
      {isSelected && (
        <motion.div
          layoutId="selectedBadge"
          className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg
            className="w-4 h-4 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}

      {/* Image du produit */}
      <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

        {/* Bouton voir */}
        <motion.button
          ref={viewButtonRef}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={handleViewButtonHover}
          onMouseLeave={handleViewButtonLeave}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/products/${product.id}`;
          }}
          className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Eye className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Informations du produit */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{product.name}</h3>
        <p className="text-white/60 text-sm">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-white">
            €{product.price}
          </span>
          <motion.button
            ref={buttonRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onClick={handleButtonClick}
            disabled={isAdded}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
          >
            <span>{isAdded ? "Ajouté !" : "Acheter"}</span>
            <ShoppingBag className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Composant principal de la section produits
export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success && data.products.length > 0) {
          setProducts(data.products);
          setSelectedProduct(data.products[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Animation GSAP au scroll
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animation du titre
            gsap.fromTo(
              titleRef.current,
              { opacity: 0, y: 50, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
            );

            // Animation du sous-titre
            gsap.fromTo(
              subtitleRef.current,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.2,
                ease: "power3.out",
              },
            );
          }
        });
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation GSAP au clic sur "Ajouter au panier"
  const handleAddToCart = () => {
    if (!selectedProduct) return;

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

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      color: selectedProduct.color,
      size: "M",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des produits...</div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-white text-xl">Aucun produit disponible</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Background dynamique */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[#FF4C4C] to-[#FF1F1F] opacity-30 transition-all duration-1000`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <motion.h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4"
          >
            Collection Premium
          </motion.h2>
          <motion.p
            ref={subtitleRef}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Découvrez notre sélection exclusive de vestes haut de gamme, alliant
            style, confort et qualité exceptionnelle.
          </motion.p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onClick={() => setSelectedProduct(product)}
              index={index}
            />
          ))}
        </div>

        {/* Section informations produit */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Informations du produit sélectionné */}
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white">
                  {selectedProduct.name}
                </h3>
                <p className="text-white/70 text-lg">
                  {selectedProduct.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-white">
                    €{selectedProduct.price}
                  </span>
                  <span className="text-white/50 line-through text-xl">
                    €{(selectedProduct.price * 1.3).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">
                    Livraison gratuite
                  </span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">
                    Retour 30 jours
                  </span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">
                    Garantie 2 ans
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className="add-to-cart-btn px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{isAdded ? "Ajouté !" : "Ajouter au panier"}</span>
                    <ShoppingBag className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      (window.location.href = `/products/${selectedProduct.id}`)
                    }
                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors duration-300 border border-white/20"
                  >
                    Voir le produit
                  </motion.button>
                </div>
              </div>

              {/* Image du produit sélectionné */}
              <div className="h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedProduct.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
