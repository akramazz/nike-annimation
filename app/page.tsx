"use client";

import { useEffect, Suspense, lazy, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Dynamic imports for components
const Navigation = lazy(() => import("./components/Navigation"));
const HeroSection = lazy(() => import("./components/HeroSection"));
const ProductSection = lazy(() => import("./components/ProductSection"));
const Footer = lazy(() => import("./components/Footer"));

// Composant de chargement
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="loading-spinner"></div>
    </div>
  );
}

// Page principale
export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation GSAP - only runs on client after mount
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animation de transition entre les sections
    const sections = gsap.utils.toArray<HTMLElement>("section");
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
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

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  return (
    <div className="relative min-h-screen bg-black">
      <Suspense fallback={<div className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-xl z-50" />}>
        <Navigation />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      <section id="products">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductSection />
        </Suspense>
      </section>

      <Suspense fallback={<div className="h-64 bg-black/30" />}>
        <Footer />
      </Suspense>

      {/* Film grain effect */}
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