"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, ChevronDown, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import CartDrawer from "@/app/components/cart/CartDrawer";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";

interface NavItem {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { itemCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Accueil", href: "/" },
    {
      name: "Produits",
      children: [
        { name: "Tous les produits", href: "/products" },
        { name: PRODUCT_CATEGORIES.SWEAT, href: "/products?category=sweat" },
        { name: PRODUCT_CATEGORIES.T_SHIRT, href: "/products?category=tshirt" },
        { name: "Nouveautés", href: "/products?sortBy=createdAt" },
        { name: "Promotions", href: "/products?onSale=true" },
      ],
    },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
<div className="relative w-20 h-20 md:w-24 md:h-24">
                  <Image src="/logo.png" alt="DripBazzardz" fill className="object-contain" />
              </div>
              <span className="text-white font-bold text-xl md:text-2xl hidden sm:block">
                DripBazzardz
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.href && !item.children ? (
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium px-3 py-2 relative group flex items-center gap-1"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                  </Link>
                ) : (
                  <button className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium px-3 py-2 relative group flex items-center gap-1">
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                  </button>
                )}

                <AnimatePresence>
                  {item.children && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 text-sm"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 hidden md:block"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <Link
                href="/account/profile"
                className="p-2 text-white/80 hover:text-white transition-colors duration-200 hidden md:block"
                aria-label="Mon compte"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2 text-white/80 hover:text-white transition-colors duration-200 hidden md:block"
                aria-label="Compte"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white/80 hover:text-white transition-colors duration-200"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
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

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 overflow-hidden bg-black/95 backdrop-blur-xl"
          >
            <div className="flex flex-col px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.href && !item.children ? (
                    <Link
                      href={item.href}
                      className="text-white/80 hover:text-white transition-colors duration-200 text-lg font-medium py-3 border-b border-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        className="flex items-center justify-between w-full text-white/80 hover:text-white transition-colors duration-200 text-lg font-medium py-3 border-b border-white/10"
                        onClick={() =>
                          setOpenDropdown(openDropdown === item.name ? null : item.name)
                        }
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            openDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {item.children && openDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block text-white/60 hover:text-white transition-colors duration-200 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
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
              <div className="pt-2">
                {user ? (
                  <Link
                    href="/account/profile"
                    className="block text-white/80 hover:text-white transition-colors duration-200 text-lg font-medium py-3 border-b border-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mon compte
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block text-white/80 hover:text-white transition-colors duration-200 text-lg font-medium py-3 border-b border-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
