"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Animation GSAP pour ouvrir/fermer le panier
  useEffect(() => {
    if (typeof window !== "undefined" && cartRef.current) {
      if (isOpen) {
        gsap.fromTo(
          cartRef.current,
          { x: "100%", opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        );
      }
    }
  }, [isOpen]);

  // Animation GSAP pour les items du panier
  useEffect(() => {
    if (typeof window !== "undefined" && itemsRef.current && isOpen) {
      const itemElements = itemsRef.current.children;
      gsap.fromTo(
        itemElements,
        { opacity: 0, x: 50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      );
    }
  }, [items, isOpen]);

  // Animation GSAP au hover d'un item
  const handleItemHover = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleItemLeave = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Animation GSAP au clic sur supprimer
  const handleRemoveClick = (
    id: number,
    size: string,
    element: HTMLElement,
  ) => {
    gsap.to(element, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => removeItem(id, size),
    });
  };

  // Animation GSAP au clic sur le bouton de commande
  const handleCheckoutClick = () => {
    if (typeof window !== "undefined") {
      const checkoutBtn = document.querySelector(".checkout-btn");
      if (checkoutBtn) {
        gsap.to(checkoutBtn, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(checkoutBtn, {
              scale: 1,
              duration: 0.3,
              ease: "elastic.out(1, 0.3)",
            });
          },
        });
      }
    }

    // Redirect to checkout
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      {/* Bouton panier */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-white/80 hover:text-white transition-colors duration-200"
      >
        <ShoppingBag className="h-6 w-6" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-xs font-bold text-black flex items-center justify-center"
          >
            {itemCount}
          </motion.span>
        )}
      </motion.button>

      {/* Panier slide-in */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panier */}
            <motion.div
              ref={cartRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Panier</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
                <p className="text-white/60 mt-1">{itemCount} article(s)</p>
              </div>

              {/* Items */}
              <div
                ref={itemsRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 mx-auto text-white/20 mb-4" />
                    <p className="text-white/60">Votre panier est vide</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      onMouseEnter={(e) => handleItemHover(e.currentTarget)}
                      onMouseLeave={(e) => handleItemLeave(e.currentTarget)}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-white/60 text-sm">
                          {item.color} • Taille: {item.size}
                        </p>
                        <p className="text-lg font-bold mt-1">€{item.price}</p>
                      </div>

                      {/* Quantité */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </motion.button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>

                      {/* Supprimer */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) =>
                          handleRemoveClick(
                            item.id,
                            item.size,
                            e.currentTarget.parentElement!,
                          )
                        }
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-white/60">Total</span>
                    <span className="font-bold text-2xl">
                      €{total.toFixed(2)}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckoutClick}
                    className="checkout-btn w-full py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors relative overflow-hidden group"
                  >
                    <span className="relative z-10">Passer la commande</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearCart}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-colors"
                  >
                    Vider le panier
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
