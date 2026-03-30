"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";

// Product data
const products = [
  {
    id: 1,
    name: "Beige Puffer",
    color: "Beige",
    image: "/products/beage.webp",
    gradient: "from-[#d6c6b8] to-[#b8a897]",
    price: 59.99,
  },
  {
    id: 2,
    name: "Brown Puffer",
    color: "Brown",
    image: "/products/maron.webp",
    gradient: "from-[#5b3a29] to-[#2e1c12]",
    price: 59.99,
  },
  {
    id: 3,
    name: "Black Puffer",
    color: "Black",
    image: "/products/noir.webp",
    gradient: "from-[#2b2b2b] to-[#000000]",
    price: 59.99,
  },
  {
    id: 4,
    name: "Green Puffer",
    color: "Green",
    image: "/products/vert.webp",
    gradient: "from-[#3d5a40] to-[#1b2d1d]",
    price: 59.99,
  },
];

export default function Page() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ["Products", "About", "Category", "Contact"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dynamic Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${selectedProduct.gradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8">
        {/* Glassmorphism Card */}
        <motion.div
          className="w-full max-w-6xl rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <header className="flex items-center justify-between p-6 md:p-8 border-b border-white/10">
            {/* Logo */}
            <div className="flex items-center">
              <svg
                className="h-8 w-auto text-white"
                viewBox="0 0 69 32"
                fill="currentColor"
              >
                <path d="M68.56 4.58c-.2-.2-.5-.3-.8-.2-3.2 1.1-6.5 2.3-9.7 3.4-7.2 2.5-14.4 5-21.6 7.5-4.6 1.6-9.2 3.2-13.8 4.8-2.3.8-4.6 1.6-6.9 2.4-1.2.4-2.3.8-3.5 1.2-.6.2-1.1.4-1.7.6-.3.1-.5.2-.8.3-.1 0-.2.1-.3.1-.1 0-.2 0-.3.1-.3.1-.6.1-.9.1-.3 0-.6 0-.9-.1-.3-.1-.6-.2-.8-.4-.3-.2-.5-.4-.7-.7-.2-.3-.3-.6-.3-.9 0-.3 0-.6.1-.9.1-.3.2-.6.4-.8.2-.3.4-.5.7-.7.3-.2.6-.3.9-.3.3 0 .6 0 .9.1.3.1.6.2.8.3.1 0 .2.1.3.1.1 0 .2 0 .3.1.3.1.5.2.8.3.6.2 1.1.4 1.7.6 1.2.4 2.3.8 3.5 1.2 2.3.8 4.6 1.6 6.9 2.4 4.6 1.6 9.2 3.2 13.8 4.8 7.2 2.5 14.4 5 21.6 7.5 3.2 1.1 6.5 2.3 9.7 3.4.3.1.6.1.9 0 .3-.1.6-.3.8-.5.2-.2.3-.5.3-.8 0-.3 0-.6-.1-.9-.1-.3-.2-.6-.4-.8-.2-.3-.4-.5-.7-.7-.3-.2-.6-.3-.9-.3-.3 0-.6 0-.9.1-.3.1-.6.2-.8.3-.1 0-.2.1-.3.1-.1 0-.2 0-.3.1-.3.1-.5.2-.8.3-.6.2-1.1.4-1.7.6-1.2.4-2.3.8-3.5 1.2-2.3.8-4.6 1.6-6.9 2.4-4.6 1.6-9.2 3.2-13.8 4.8-7.2 2.5-14.4 5-21.6 7.5-3.2 1.1-6.5 2.3-9.7 3.4-.3.1-.6.1-.9 0-.3-.1-.6-.3-.8-.5-.2-.2-.3-.5-.3-.8 0-.3 0-.6.1-.9.1-.3.2-.6.4-.8.2-.3.4-.5.7-.7.3-.2.6-.3.9-.3.3 0 .6 0 .9.1z" />
              </svg>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-white/80 hover:text-white transition-colors duration-200">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-xs font-bold text-black flex items-center justify-center">
                  0
                </span>
              </button>
              <button
                className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </header>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-b border-white/10 overflow-hidden"
              >
                <div className="flex flex-col p-4 space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex flex-col lg:flex-row items-center justify-between p-6 md:p-8 lg:p-12 gap-8 lg:gap-12">
            {/* Title */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Wear your
                <br />
                Style with
                <br />
                Comfort
              </h1>
              <p className="mt-4 text-white/70 text-sm md:text-base max-w-md mx-auto lg:mx-0">
                Experience the perfect blend of style and comfort with our
                premium puffer jacket collection.
              </p>
            </motion.div>

            {/* Product Image */}
            <div className="flex-1 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProduct.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5,
                  }}
                  className="relative w-full max-w-md aspect-square"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </motion.div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${selectedProduct.gradient} opacity-30 blur-3xl rounded-full -z-10`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <motion.div
              className="flex lg:flex-col gap-4 lg:gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {products.map((product) => (
                <motion.button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedProduct.id === product.id
                      ? "border-white shadow-lg shadow-white/30"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-contain p-2"
                    />
                  </div>
                  {selectedProduct.id === product.id && (
                    <motion.div
                      layoutId="activeThumbnail"
                      className="absolute inset-0 border-2 border-white rounded-2xl"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 border-t border-white/10 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-white/60 text-sm">Price</p>
              <p className="text-white text-2xl md:text-3xl font-bold">
                ${selectedProduct.price}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-full transition-colors duration-200 shadow-lg"
            >
              Buy Now
            </motion.button>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}