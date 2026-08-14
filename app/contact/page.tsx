"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { apiUrl } from "@/lib/api-client";
import Image from "next/image";

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

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
        }
      );
    }
  }, []);

  // Animation GSAP au succès
  useEffect(() => {
    if (isSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, [isSuccess]);

  // Animation GSAP au focus des inputs
  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    gsap.to(e.target, {
      borderColor: "rgba(255, 255, 255, 0.5)",
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const messageData = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(apiUrl("/api/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);

        if (typeof window !== "undefined") {
          gsap.to(".contact-form", {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "power2.in",
          });
        }
      }
    } catch {
      /* network error — form stays visible */
    }

    setIsSubmitting(false);
  };

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
          <h1 className="text-3xl font-bold mb-4">Message envoyé !</h1>
          <p className="text-white/70 mb-6">
            Merci pour votre message. Nous vous répondrons dans les plus brefs
            délais.
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
                <Image src="/logo.png" alt="DripBazzarDZ" fill className="object-cover" />
              </div>
              <span className="text-white font-bold text-xl">DripBazzarDZ</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Contactez-nous</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form space-y-6"
            >
              <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-4">
                  Envoyez-nous un message
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Sujet"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  />
                  <textarea
                    name="message"
                    placeholder="Votre message"
                    required
                    rows={6}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                className="submit-btn w-full py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex items-center justify-center space-x-2"
              >
                <span className="relative z-10">
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </span>
                <Send className="h-5 w-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </form>

            {/* Informations de contact */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
              >
                <h2 className="text-xl font-bold mb-4">Nos coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <Mail className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a href="mailto:azzouzakram357@gmail.com" className="text-white/60 hover:text-white transition-colors">
                        azzouzakram357@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <Phone className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <a href="tel:+213792259216" className="text-white/60 hover:text-white transition-colors">
                        +213 792 259 216
                      </a>
                      <br />
                      <a href="tel:+213552815537" className="text-white/60 hover:text-white transition-colors">
                        +213 552 815 537
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <MapPin className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-medium">Adresse</h3>
                      <p className="text-white/60">
                        Alger-Centre, Algérie
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
              >
                <h2 className="text-xl font-bold mb-4">Horaires d'ouverture</h2>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Disponible</span>
                    <span className="text-green-400 font-bold">H24 — 7/7</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
              >
                <h2 className="text-xl font-bold mb-4">FAQ</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">
                      Quels sont les délais de livraison ?
                    </h3>
                    <p className="text-white/60 text-sm">
                      Livraison gratuite en 2-3 jours ouvrés.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">
                      Puis-je retourner un produit ?
                    </h3>
                    <p className="text-white/60 text-sm">
                      Oui, retour gratuit sous 30 jours.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">
                      Quelle est la garantie ?
                    </h3>
                    <p className="text-white/60 text-sm">
                      Garantie 2 ans sur tous nos produits.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
