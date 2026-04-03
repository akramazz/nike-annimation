"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import GarageScene from "./GarageScene";

// Composant de section héro avec animation 3D du garage
export default function HeroSection() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation GSAP au chargement de la page
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === "undefined" || !isMounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation du titre avec effet de machine à écrire
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
      },
    );

    // Animation du sous-titre
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
      "-=0.6",
    );

    // Animation du bouton CTA
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.5, rotation: -180 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.4",
    );

    // Animation de l'indicateur de scroll
    tl.fromTo(
      scrollIndicatorRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.2",
    );

    // Animation continue de l'indicateur de scroll
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, [isMounted]);

  // Animation GSAP au hover du bouton CTA
  const handleCtaHover = () => {
    if (typeof window !== "undefined" && ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 1.1,
        boxShadow: "0 0 40px rgba(255, 255, 255, 0.5)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleCtaLeave = () => {
    if (typeof window !== "undefined" && ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 1,
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  // Animation GSAP au clic du bouton CTA
  const handleCtaClick = () => {
    if (typeof window !== "undefined" && ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(ctaRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)",
          });
        },
      });

      router.push("/category");
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Scène 3D du garage en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <GarageScene />
      </div>

      {/* Overlay de gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

      {/* Contenu principal */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge animé */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
          <span className="text-white/90 text-sm font-medium">
            Nouvelle Collection 2024
          </span>
        </motion.div>

        {/* Titre principal avec animation GSAP */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight"
        >
          <span className="block">L'Excellence</span>
          <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Automobile
          </span>
        </h1>

        {/* Sous-titre avec animation GSAP */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Découvrez notre collection exclusive de vestes premium, inspirées par
          l'élégance et la performance des plus grandes marques automobiles.
        </p>

        {/* Bouton CTA avec animation GSAP */}
        <motion.button
          ref={ctaRef}
          onMouseEnter={handleCtaHover}
          onMouseLeave={handleCtaLeave}
          onClick={handleCtaClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full shadow-2xl hover:bg-white/90 transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10">Explorer la Collection</span>
          {/* Effet de brillance au hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </motion.button>

        {/* Statistiques animées */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "500+", label: "Modèles" },
            { value: "50K+", label: "Clients" },
            { value: "100%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicateur de scroll animé */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center">
          <span className="text-white/60 text-sm mb-2">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />
          </div>
        </div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
    </section>
  );
}
