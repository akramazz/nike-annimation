"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

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
              { opacity: 1, scale: 1, rotation: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
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
      gsap.to(linksRef.current[index], { x: 10, color: "#ffffff", duration: 0.3, ease: "power2.out" });
    }
  };

  const handleLinkLeave = (index: number) => {
    if (typeof window !== "undefined" && linksRef.current[index]) {
      gsap.to(linksRef.current[index], { x: 0, color: "rgba(255, 255, 255, 0.7)", duration: 0.3, ease: "power2.out" });
    }
  };

  const handleSocialHover = (index: number) => {
    if (typeof window !== "undefined" && socialRef.current[index]) {
      gsap.to(socialRef.current[index], { scale: 1.2, rotation: 360, duration: 0.5, ease: "back.out(1.7)" });
    }
  };

  const handleSocialLeave = (index: number) => {
    if (typeof window !== "undefined" && socialRef.current[index]) {
      gsap.to(socialRef.current[index], { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
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
    { name: "Facebook", href: "https://facebook.com/profile.php?id=61589577281978", path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" },
    { name: "TikTok", href: "https://tiktok.com/@dripbazaar_dz", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02s2.67-.01 4.02.01c1.54.06 2.65.52 3.44 1.37.8 1.31 1.07 2.78 1.05 4.18-.07 3.17-.44 5.8-1.49 7.9-.9 1.84-2.1 3.32-3.57 4.35-1.53 1.09-3.25 1.62-5.1 1.57-.77-.02-1.54-.07-2.3-.15l-1.44-.2c-.07-.04-.13-.03-.2-.01s-.09.07-.08.12c.09.42.34 1.05.81 1.91.48.87 1.11 1.65 1.89 2.33.78.68 1.66 1.26 2.59 1.72.95.47 1.98.77 3.03.87.86.08 1.72.08 2.58-.01.82-.07 1.63-.23 2.4-.48.77-.25 1.5-.6 2.18-1.04.67-.44 1.3-1 1.85-1.66.55-.66.99-1.4 1.31-2.21.32-.81.5-1.66.54-2.54.05-1.38-.21-2.65-.67-3.82-.46-1.17-1.15-2.17-2.04-2.98-.89-.81-1.89-1.43-2.97-1.85-1.09-.42-2.23-.63-3.41-.62-.72.01-1.44.09-2.15.27-.72.18-1.42.46-2.09.83-.67.37-1.3.82-1.87 1.34-.57.52-1.06 1.1-1.46 1.73-.4.63-.72 1.29-.94 1.98-.22.69-.29 1.38-.2 2.08.09.7.34 1.37.74 1.99.4.62.93 1.17 1.56 1.64.63.47 1.36.84 2.18 1.08.82.24 1.67.37 2.54.37h.07c.87.01 1.73-.12 2.55-.4.82-.28 1.6-.7 2.31-1.25.71-.55 1.35-1.2 1.9-1.93.55-.73.99-1.53 1.3-2.38.31-.85.46-1.73.44-2.63-.02-.9-.22-1.77-.57-2.58-.35-.81-.86-1.55-1.51-2.19-.65-.64-1.4-1.18-2.22-1.59-.82-.41-1.7-.72-2.6-.91-.9-.19-1.83-.24-2.77-.14-.94.1-1.85.37-2.7.81-.85.44-1.64.99-2.35 1.63-.71.64-1.34 1.35-1.87 2.11-.53.76-.96 1.55-1.28 2.37-.32.82-.52 1.67-.6 2.54-.08.87-.04 1.75.12 2.62.16.87.45 1.71.85 2.49.4.78.91 1.51 1.51 2.17.6.66 1.29 1.24 2.05 1.72.76.48 1.57.85 2.41 1.09.84.24 1.71.34 2.6.29.89-.05 1.77-.25 2.6-.6.83-.35 1.62-.82 2.34-1.39.72-.57 1.38-1.22 1.96-1.95.58-.73 1.07-1.51 1.46-2.33.39-.82.67-1.68.83-2.56.16-.88.16-1.77-.01-2.65-.17-.88-.52-1.73-1.04-2.52-.52-.79-1.17-1.52-1.93-2.17-.76-.65-1.61-1.21-2.53-1.66-.92-.45-1.88-.8-2.87-1.03-.99-.23-2.01-.33-3.04-.3-1.03.03-2.04.22-3.02.57-.98.35-1.91.84-2.77 1.46-.86.62-1.65 1.32-2.35 2.09-.7.77-1.31 1.6-1.82 2.49-.51.88-.91 1.8-1.18 2.75-.27.95-.41 1.92-.41 2.91 0 .99.15 1.95.44 2.87.29.92.74 1.79 1.32 2.59.58.8 1.3 1.53 2.13 2.16.83.63 1.74 1.17 2.71 1.6.97.43 2.01.75 3.09.94 1.08.19 2.19.25 3.32.16 1.13-.09 2.24-.36 3.3-.8 1.06-.44 2.07-1.01 3-1.7.93-.69 1.78-1.46 2.54-2.29.76-.83 1.41-1.72 1.95-2.67z" },
    { name: "Instagram", href: "https://instagram.com/dripbazaar_dz", path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" },
    { name: "LinkedIn", href: "#", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  ];

  return (
    <footer ref={footerRef} className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-black/50">
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div ref={logoRef} className="flex items-center mb-6">
              <Link href="/" className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                  <Image src="/logo.png" alt="DripBazzarDZ" fill className="object-cover" />
                </div>
                <span className="ml-3 text-white font-bold text-2xl">DripBazzarDZ</span>
              </Link>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Découvrez notre collection exclusive de vestes haut de gamme. 
              Qualité exceptionnelle, design intemporel et confort absolu 
              pour un style unique.
            </p>
            
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a key={social.name} href={social.href} ref={(el) => { socialRef.current[index] = el; }} onMouseEnter={() => handleSocialHover(index)} onMouseLeave={() => handleSocialLeave(index)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300" target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d={social.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, sectionIndex) => (
            <div key={section.title} ref={(el) => { linksRef.current[sectionIndex] = el; }}>
              <h3 className="text-white font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.href}>
                    <Link href={link.href} onMouseEnter={() => handleLinkHover(sectionIndex * 4 + linkIndex)} onMouseLeave={() => handleLinkLeave(sectionIndex * 4 + linkIndex)} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">
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
            <p ref={copyrightRef} className="text-white/50 text-sm text-center md:text-left">
              © 2026 DripBazzarDZ. Tous droits réservés.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm">
              <Link href="/support/delivery" className="hover:text-white transition-colors">Livraison gratuite dès €100</Link>
              <span>•</span>
              <Link href="/support/returns" className="hover:text-white transition-colors">Retour sous 30 jours</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-white transition-colors">Service H24 7/7</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
