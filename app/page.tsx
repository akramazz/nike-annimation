"use client";

import { useEffect, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Dynamic imports for components that use GSAP
const Navigation = lazy(() => import("./components/Navigation"));
const HeroSection = lazy(() => import("./components/HeroSection"));
const ProductSection = lazy(() => import("./components/ProductSection"));
const Footer = lazy(() => import("./components/Footer"));

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

// Page principale ultra premium avec animations GSAP
export default function Page() {
  // Animation GSAP pour les transitions entre sections
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === "undefined") return;

    // Animation de transition entre les sections
    const sections = gsap.utils.toArray<HTMLElement>("section");
    
    sections.forEach((section, index) => {
      // Animation de fade-in et slide-up pour chaque section
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Animation de parallaxe pour le background
    gsap.to("body", {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // Nettoyage des animations
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navigation fixe animée */}
      <Suspense fallback={<div className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-xl z-50" />}>
        <Navigation />
      </Suspense>

      {/* Section héro avec scène 3D du garage */}
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      {/* Section produits avec glassmorphism et 3D */}
      <section id="products">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductSection />
        </Suspense>
      </section>

      {/* Pied de page animé */}
      <Suspense fallback={<div className="h-64 bg-black/30" />}>
        <Footer />
      </Suspense>

      {/* Effet de grain de film pour un look premium */}
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
