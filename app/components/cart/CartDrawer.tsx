"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CreditCard } from "lucide-react";
import { useCart, cartKey } from "@/app/context/CartContext";
import ProductImage from "@/app/components/products/ProductImage";
import { formatPriceDA } from "@/lib/price-utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const router = useRouter();
  const shipping = total >= 100 ? 0 : 9.99;
  const grandTotal = total + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Votre Panier</h2>
                    <p className="text-white/50 text-sm">
                      {itemCount} article{itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Fermer le panier"
                >
                  <X className="h-5 w-5 text-white/70" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-white/20" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Panier vide</h3>
                  <p className="text-white/50 mb-6">
                    Votre panier est actuellement vide.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClose();
                      router.push("/products");
                    }}
                    className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors"
                  >
                    Découvrir la collection
                  </motion.button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={cartKey(item)}
                    layout
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-white/50 text-sm">
                        {item.color} · Taille {item.size}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-white/10 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(cartKey(item), item.quantity - 1)
                            }
                            className="p-1 hover:bg-white/10 rounded-l-lg transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="h-3 w-3 text-white/70" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(cartKey(item), item.quantity + 1)
                            }
                            className="p-1 hover:bg-white/10 rounded-r-lg transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="h-3 w-3 text-white/70" />
                          </button>
                        </div>
                        <span className="font-bold text-white">
                          {formatPriceDA(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(cartKey(item))}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                      aria-label="Supprimer l'article"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4 bg-black/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Sous-total</span>
                    <span className="text-white font-medium">{formatPriceDA(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Livraison</span>
                    <span className={shipping === 0 ? "text-green-400" : "text-white/80"}>
                      {shipping === 0 ? "Gratuite" : formatPriceDA(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-white/40">
                      Livraison gratuite à partir de 100 DA
                    </p>
                  )}
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl font-bold text-white">
                      {formatPriceDA(grandTotal)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    router.push("/checkout");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-full hover:shadow-lg hover:shadow-white/20 transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Passer la commande
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full py-3 bg-transparent border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium rounded-full transition-colors text-sm text-center"
                >
                  Voir le panier
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
