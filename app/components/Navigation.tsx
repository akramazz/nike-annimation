"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import Cart from "./Cart";

// Composant de navigation animée avec GSAP
export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Éléments de navigation
  const navItems = [
    { name: "Produits", href: "#products" },
    { name: "À propos", href: "/about" },
    { name: "Catégorie", href: "/category" },
    { name: "Contact", href: "/contact" },
  ];

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation GSAP au chargement de la navigation
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === "undefined" || !isMounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation du logo
    tl.fromTo(
      logoRef.current,
      { opacity: 0, x: -50, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.8 },
    );

    // Animation des éléments de navigation avec stagger
    tl.fromTo(
      navItemsRef.current,
      { opacity: 0, y: -20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
      },
      "-=0.4",
    );
  }, [isMounted]);

  // Animation GSAP au hover des éléments de navigation
  const handleNavHover = (index: number) => {
    if (typeof window !== "undefined" && navItemsRef.current[index]) {
      gsap.to(navItemsRef.current[index], {
        scale: 1.1,
        color: "#ffffff",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleNavLeave = (index: number) => {
    if (typeof window !== "undefined" && navItemsRef.current[index]) {
      gsap.to(navItemsRef.current[index], {
        scale: 1,
        color: "rgba(255, 255, 255, 0.8)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo avec animation GSAP */}
          <div ref={logoRef} className="flex items-center">
            <a href="/" className="flex items-center">
              <svg
                className="h-8 w-auto text-white"
                viewBox="0 0 69 32"
                fill="currentColor"
              >
                <path d="M68.56 4.58c-.2-.2-.5-.3-.8-.2-3.2 1.1-6.5 2.3-9.7 3.4-7.2 2.5-14.4 5-21.6 7.5-4.6 1.6-9.2 3.2-13.8 4.8-2.3.8-4.6 1.6-6.9 2.4-1.2.4-2.3.8-3.5 1.2-.6.2-1.1.4-1.7.6-.3.1-.5.2-.8.3-.1 0-.2.1-.3.1-.1 0-.2 0-.3.1-.3.1-.6.1-.9.1-.3 0-.6 0-.9-.1-.3-.1-.6-.2-.8-.4-.3-.2-.5-.4-.7-.7-.2-.3-.3-.6-.3-.9 0-.3 0-.6.1-.9.1-.3.2-.6.4-.8.2-.3.4-.5.7-.7.3-.2.6-.3.9-.3.3 0 .6 0 .9.1.3.1.6.2.8.3.1 0 .2.1.3.1.1 0 .2 0 .3.1.3.1.5.2.8.3.6.2 1.1.4 1.7.6 1.2.4 2.3.8 3.5 1.2 2.3.8 4.6 1.6 6.9 2.4 4.6 1.6 9.2 3.2 13.8 4.8 7.2 2.5 14.4 5 21.6 7.5 3.2 1.1 6.5 2.3 9.7 3.4.3.1.6.1.9 0 .3-.1.6-.3.8-.5.2-.2.3-.5.3-.8 0-.3 0-.6-.1-.9-.1-.3-.2-.6-.4-.8-.2-.3-.4-.5-.7-.7-.3-.2-.6-.3-.9-.3-.3 0-.6 0-.9.1-.3.1-.6.2-.8.3-.1 0-.2.1-.3.1-.1 0-.2 0-.3.1-.3.1-.5.2-.8.3-.6.2-1.1.4-1.7.6-1.2.4-2.3.8-3.5 1.2-2.3.8-4.6 1.6-6.9 2.4-4.6 1.6-9.2 3.2-13.8 4.8-7.2 2.5-14.4 5-21.6 7.5-3.2 1.1-6.5 2.3-9.7 3.4-.3.1-.6.1-.9 0-.3-.1-.6-.3-.8-.5-.2-.2-.3-.5-.3-.8 0-.3 0-.6.1-.9.1-.3.2-.6.4-.8.2-.3.4-.5.7-.7.3-.2.6-.3.9-.3.3 0 .6 0 .9.1z" />
              </svg>
              <span className="ml-2 text-white font-bold text-xl hidden sm:block">
                PREMIUM
              </span>
            </a>
          </div>

          {/* Navigation desktop avec animations GSAP */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                ref={(el) => {
                  navItemsRef.current[index] = el;
                }}
                onMouseEnter={() => handleNavHover(index)}
                onMouseLeave={() => handleNavLeave(index)}
                className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium relative group"
              >
                {item.name}
                {/* Ligne animée sous l'élément au hover */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Panier et menu mobile */}
          <div className="flex items-center space-x-4">
            {/* Composant Panier */}
            <Cart />

            {/* Bouton menu mobile */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menu mobile animé avec Framer Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 overflow-hidden bg-black/50 backdrop-blur-xl"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, color: "#ffffff" }}
                  className="text-white/80 hover:text-white transition-colors duration-200 text-lg font-medium py-2 border-b border-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
