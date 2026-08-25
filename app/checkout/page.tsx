"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import ProductImage from "../components/products/ProductImage";
import { normalizeProductImage } from "@/lib/product-normalize";
import { formatPriceDA } from "@/lib/price-utils";
import { useCart } from "../context/CartContext";
import { apiUrl } from "@/lib/api-client";
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react";
export default function CheckoutPage() {
  const { items, total, clearCart, isHydrated } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (items.length === 0 && !isSuccess) {
      router.replace("/");
    }
  }, [isHydrated, items.length, isSuccess, router]);

  // Animation GSAP au chargement
  useEffect(() => {
    if (typeof window !== "undefined" && formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    }
  }, []);

  // Animation GSAP au succès
  useEffect(() => {
    if (isSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      );
    }
  }, [isSuccess]);

  // Animation GSAP au focus des inputs
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    gsap.to(e.target, {
      borderColor: "rgba(255, 255, 255, 0.5)",
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    gsap.to(e.target, {
      borderColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "none",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Animation GSAP au hover du bouton
  const handleButtonHover = () => {
    if (typeof window !== "undefined") {
      const btn = document.querySelector(".submit-btn");
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
      const btn = document.querySelector(".submit-btn");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customerName: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: normalizeProductImage(item.image),
        category: item.category,
      })),
      total,
    };

    try {
      const response = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

       if (data.success) {
         setIsSuccess(true);
         clearCart();

         // Track Purchase event
         if (typeof window !== 'undefined' && window.fbq) {
           window.fbq('track', 'Purchase', {
             value: total,
             currency: 'EUR'
           });
         }

         if (typeof window !== "undefined") {
           gsap.to(".checkout-form", {
             opacity: 0,
             y: -50,
             duration: 0.5,
             ease: "power2.in",
           });
         }
      } else {
        setSubmitError(
          typeof data.error === "string" ? data.error : "La commande a échoué.",
        );
      }
    } catch {
      setSubmitError("Erreur réseau. Réessayez dans un instant.");
    }

    setIsSubmitting(false);
  };

  if (!isHydrated || (items.length === 0 && !isSuccess)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          ref={successRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
          <p className="text-white/70 mb-6">
            Merci pour votre commande. Vous recevrez un email de confirmation
            sous peu.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            className="w-full py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
          >
            Retour à l'accueil
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </motion.button>
            <div className="flex items-center space-x-2">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                <img src="/logo.png" alt="DripBazzarDZ" className="w-9 h-9 object-cover rounded-full" />
              </div>
              <span className="text-white font-bold text-xl">DripBazzarDZ</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Paiement</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="checkout-form space-y-6"
            >
              {/* Informations personnelles */}
              <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-4">
                  Informations personnelles
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom complet"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Adresse de livraison */}
              <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="Ville"
                      required
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Code postal"
                      required
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Pays"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Bouton de paiement */}
              {submitError && (
                <p className="text-red-400 text-sm text-center" role="alert">
                  {submitError}
                </p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || items.length === 0}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                className="submit-btn w-full py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isSubmitting
                    ? "Traitement..."
                    : `Payer ${formatPriceDA(total)}`}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>

              {/* Sécurité */}
              <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Livraison gratuite</span>
                </div>
              </div>
            </form>

            {/* Résumé de la commande */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 sticky top-24">
                <h2 className="text-xl font-bold mb-4">
                  Résumé de la commande
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={`${item._id}-${item.size}`}
                      className="flex items-center space-x-4"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-white/60 text-sm">
                          {item.color} • Taille: {item.size}
                        </p>
                        <p className="text-white/60 text-sm">
                          Qté: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">
                        {formatPriceDA(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-white/60">
                    <span>Sous-total</span>
                    <span>{formatPriceDA(total)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Livraison</span>
                    <span className="text-green-400">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>{formatPriceDA(total)}</span>
                  </div>
                </div>

                {/* Avantages */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-white/80">
                    <Truck className="h-5 w-5 text-green-400" />
                    <span className="text-sm">
                      Livraison gratuite en 2-3 jours
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/80">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Garantie 2 ans</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/80">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                    <span className="text-sm">
                      Retour gratuit sous 30 jours
                    </span>
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
