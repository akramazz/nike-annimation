
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const socialRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const copyrightRef = useRef<HTMLParagraphElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
              logoRef.current,
              { opacity: 0, y: 30, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8 }
            );

            tl.fromTo(
              linksRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
              "-=0.5"
            );

            tl.fromTo(
              socialRef.current,
              { opacity: 0, scale: 0.5, rotation: -180 },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)",
              },
              "-=0.3"
            );

            tl.fromTo(
              copyrightRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5 },
              "-=0.2"
            );
          }
        });
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [isMounted]);

  const handleLinkHover = (index: number) => {
    if (typeof window !== "undefined" && linksRef.current[index]) {
      gsap.to(linksRef.current[index], {
        x: 10,
        color: "#ffffff",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleLinkLeave = (index: number) => {
    if (typeof window !== "undefined" && linksRef.current[index]) {
      gsap.to(linksRef.current[index], {
        x: 0,
        color: "rgba(255, 255, 255, 0.7)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleSocialHover = (index: number) => {
    if (typeof window !== "undefined" && socialRef.current[index]) {
      gsap.to(socialRef.current[index], {
        scale: 1.2,
        rotation: 360,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }
  };

  const handleSocialLeave = (index: number) => {
    if (typeof window !== "undefined" && socialRef.current[index]) {
      gsap.to(socialRef.current[index], {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const footerLinks = [
    {
      title: "Produits",
      links: [
        { name: "Tous les produits", href: "/products" },
        { name: "Vestes", href: "/products/jackets" },
        { name: "Accessoires", href: "/products/accessories" },
        { name: "Nouveautés", href: "/products/new" },
        { name: "Promotions", href: "/products/sales" },
      ],
    },
    {
      title: "À propos",
      links: [
        { name: "Notre histoire", href: "/about/history" },
        { name: "Engagements", href: "/about/commitments" },
        { name: "Durabilité", href: "/about/sustainability" },
        { name: "Carrières", href: "/about/careers" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Centre d'aide", href: "/support" },
        { name: "FAQ", href: "/support/faq" },
        { name: "Livraison", href: "/support/delivery" },
        { name: "Retours", href: "/support/returns" },
      ],
    },
    {
      title: "Légal",
      links: [
        { name: "Mentions légales", href: "/legal" },
        { name: "Confidentialité", href: "/legal/privacy" },
        { name: "CGV", href: "/legal/terms" },
        { name: "Cookies", href: "/legal/cookies" },
      ],
    },
  ];

  const socialIcons = [
    {
      name: "Facebook",
      href: "https://facebook.com/profile.php?id=61589577281978",
      path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.024 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.02 1.792-4.688 4.533-4.688 1.312 0 2.686.236 2.686.236v2.953h-1.514c-1.491 0-1.956.93-1.956 1.885v2.256h3.328l-.532 3.47h-2.796v8.385C19.612 23.097 24 18.092 24 12.073Z",
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@az_drip_",
      path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.5v13.67a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 1 1 2.9-2.9V12.1a6.4 6.4 0 1 0 3.5 5.72V10.8a8.3 8.3 0 0 0 4.86 1.56V8.87a4.85 4.85 0 0 1-1.09-.18Z",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/az_drip_",
      path: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z",
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/213552815537",
      path: "M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.48 0 .11 5.36.11 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.23-1.63a11.94 11.94 0 0 0 5.85 1.52h.01c6.6 0 11.97-5.36 11.97-11.96a11.9 11.9 0 0 0-3.54-8.45ZM12.09 21.86a9.9 9.9 0 0 1-5.05-1.38l-.36-.22-3.7.97.99-3.61-.24-.37a9.85 9.85 0 0 1-1.52-5.29c0-5.46 4.45-9.9 9.9-9.9a9.84 9.84 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.9-9.92 9.9Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-black/50"
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div ref={logoRef} className="flex items-center mb-6">
              <Link href="/" className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                  <Image
                    src="/Logo premium A&Z Streetwear.png"
                    alt="A&Z drip"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="ml-3 text-white font-bold text-2xl">
                  A&Z drip
                </span>
              </Link>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Découvrez notre collection exclusive de vestes haut de gamme.
              Qualité exceptionnelle, design intemporel et confort absolu
              pour un style unique.
            </p>

            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={social.name}
                  href={social.href}
                  ref={(el) => {
                    socialRef.current[index] = el;
                  }}
                  onMouseEnter={() => handleSocialHover(index)}
                  onMouseLeave={() => handleSocialLeave(index)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, sectionIndex) => (
            <div
              key={section.title}
              ref={(el) => {
                linksRef.current[sectionIndex] = el;
              }}
            >
              <h3 className="text-white font-semibold text-lg mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onMouseEnter={() =>
                        handleLinkHover(sectionIndex * 4 + linkIndex)
                      }
                      onMouseLeave={() =>
                        handleLinkLeave(sectionIndex * 4 + linkIndex)
                      }
                      className="text-white/70 hover:text-red-500 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              ref={copyrightRef}
              className="text-white/50 text-sm text-center md:text-left"
            >
              © 2026 AZ DripStreetwear - Tous droits réservés.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm">
              <span>•</span>
              <Link
                href="/support/returns"
                className="hover:text-red-500 transition-colors"
              >
                Retour sous 30 jours
              </Link>
              <span>•</span>
              <Link
                href="/contact"
                className="hover:text-red-500 transition-colors"
              >
                Service H24 7/7
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
