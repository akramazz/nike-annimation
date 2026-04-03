"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import gsap from "gsap";
import Cart from "./Cart";
import Link from "next/link";

interface NavItem {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const navItems: NavItem[] = [
    { 
      name: "Produits", 
      children: [
        { name: "Tous les produits", href: "/products" },
        { name: "Vestes", href: "/products/jackets" },
        { name: "Accessoires", href: "/products/accessories" },
        { name: "Nouveautés", href: "/products/new" },
        { name: "Promotions", href: "/products/sales" },
      ]
    },
    { name: "Catégorie", href: "/category" },
    { 
      name: "À propos", 
      children: [
        { name: "Notre histoire", href: "/about/history" },
        { name: "Engagements", href: "/about/commitments" },
        { name: "Durabilité", href: "/about/sustainability" },
        { name: "Carrières", href: "/about/careers" },
      ]
    },
    { 
      name: "Support", 
      children: [
        { name: "Centre d'aide", href: "/support" },
        { name: "FAQ", href: "/support/faq" },
        { name: "Livraison", href: "/support/delivery" },
        { name: "Retours", href: "/support/returns" },
      ]
    },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, x: -50, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.8 },
    );

    tl.fromTo(
      navItemsRef.current,
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
      "-=0.4",
    );
  }, [isMounted]);

  const handleNavHover = (index: number) => {
    if (typeof window !== "undefined" && navItemsRef.current[index]) {
      gsap.to(navItemsRef.current[index], {
        scale: 1.05,
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
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div ref={logoRef} className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-auto text-white" viewBox="0 0 69 32" fill="currentColor">
                <path d="M68.56 4.58c-.2-.2-.5-.3-.8-.2-3.2 1.1-6.5 2.3-9.7 3.4-7.2 2.5-14.4 5-21.6 7.5-4.6 1.6-9.2 3.2-13.8 4.8-2.3.8-4.6 1.6-6.9 2.4-1.2.4-2.3.8-3.5 1.2-.6.2-1.1.4-1.7.6-.3.1-.5.2-.8.3-.1 0-.2.1-.3.1-.1 0-.2 0-.3.1-.3.1-.6.1-.9.1-.3 0-.6 0-.9-.1-.3-.1-.6-.2-.8-.4-.3-.2-.5-.4-.7-.7-.2-.3-.3-.6-.3-.9 0-.3 0-.6.1-.9.1-.3.2-.6.4-.8.2-.3.4-.5.7-.7.3-.2.6-.3.9-.3.3 0 .6 0 .9.1.3.1.6.2.8.3.1 0 .2.1.3.1.1 0 .2 0 .3.1.3.1.5.2.8.3.6.2 1.1.4 1.7.6 1.2.4 2.3.8 3.5 1.2 2.3.8 4.6 1.6 6.9 2.4 4.6 1.6 9.2 3.2 13.8 4.8 7.2 2.5 14.4 5 21.6 7.5 3.2 1.1 6.5 2.3 9.7 3.4.3.1.6.1.9 0 .3-.1.6-.3.8-.5.2-.2.3-.5.3-.8 0-.3 0-.6-.1-.9-.1-.3-.2-.6-.4-.8-.2-.3-.4-.5-.7-.7-.3-.2-.6-.3-.9-.3-.3 0-.6 0-.9.1-.3.1-.6.2-.8.3-.1 0-.2.1-.3.1-.1 0-.2 0-.3.1-.3.1-.5.2-.8.3-.6.2-1.1.4-1.7.6-1.2.4-2.3.8-3.5 1.2-2.3.8-4.6 1.6-6.9 2.4-4.6 1.6-9.2 3.2-13.8 4.8-7.2 2.5-14.4 5-21.6 7.5-3.2 1.1-6.5 2.3-9.7 3.4-.3.1-.6.1-.9 0-.3-.1-.6-.3-.8-.5-.2-.2-.3-.5-.3-.8 0-.3 0-.6.1-.9.1-.3.2-.6.4-.8.2-.3.4-.5.7-.7.3-.2.6-.3.9-.3.3 0 .6 0 .9.1z" />
              </svg>
              <span className="ml-2 text-white font-bold text-xl hidden sm:block">PREMIUM</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative" onMouseEnter={() => item.children && setOpenDropdown(item.name)} onMouseLeave={() => setOpenDropdown(null)}>
                {item.href && !item.children ? (
                  <Link href={item.href} ref={(el) => { navItemsRef.current[index] = el; }} onMouseEnter={() => handleNavHover(index)} onMouseLeave={() => handleNavLeave(index)} className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium px-3 py-2 relative group flex items-center gap-1">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                  </Link>
                ) : (
                  <button ref={(el) => { navItemsRef.current[index] = el; }} onMouseEnter={() => handleNavHover(index)} onMouseLeave={() => handleNavLeave(index)} className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium px-3 py-2 relative group flex items-center gap-1">
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                  </button>
                )}

                <AnimatePresence>
                  {item.children && openDropdown === item.name && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 text-sm" onClick={() => setOpenDropdown(null)}>
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Cart />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-200" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="md:hidden border-t border-white/10 overflow-hidden bg-black/50 backdrop-blur-xl">
            <div className="flex flex-col px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.href && !item.children ? (
                    <Link href={item.href} className="text-white/80 hover:text-white transition-colors duration-200 text-lg font-medium py-3 border-b border-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <button className="flex items-center justify-between w-full text-white/80 hover:text-white transition-colors duration-200 text-lg font-medium py-3 border-b border-white/10" onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}>
                        {item.name}
                        <ChevronDown className={`h-5 w-5 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {item.children && openDropdown === item.name && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4 space-y-1">
                            {item.children.map((child) => (
                              <Link key={child.href} href={child.href} className="block text-white/60 hover:text-white transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
