"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function PageTemplate({ title, subtitle, children }: PageTemplateProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8 }
    );

    tl.fromTo(
      contentRef.current?.children || [],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      "-=0.4"
    );
  }, [isMounted]);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          <div ref={contentRef} className="space-y-8">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}