"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Suspense } from "react";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 100, scale: 0.8, rotationX: -90 },
      { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1.2 }
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
      "-=0.6"
    );

    if (statsRef.current) {
      tl.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15 },
        "-=0.4"
      );
    }
  }, [isMounted]);

  const teamMembers = [
    { name: "Alexandre Dubois", role: "Fondateur & CEO", description: "Visionnaire passionné par l'innovation et le design premium.", emoji: "👨‍💼" },
    { name: "Marie Laurent", role: "Directrice Créative", description: "Experte en tendances mode et expérience client.", emoji: "👩‍🎨" },
    { name: "Thomas Martin", role: "Directeur Technique", description: "Architecte de solutions digitales innovantes.", emoji: "👨‍💻" },
    { name: "Sophie Bernard", role: "Responsable Marketing", description: "Stratège marketing avec une vision globale.", emoji: "👩‍💼" }
  ];

  const values = [
    { icon: "Excellence", title: "Excellence", description: "Nous visons l'excellence dans chaque détail." },
    { icon: "Innovation", title: "Innovation", description: "Nous repoussons les limites de la créativité." },
    { icon: "Qualité", title: "Qualité", description: "Des matériaux premium et finition impeccable." },
    { icon: "Confiance", title: "Confiance", description: "Une relation transparente avec nos clients." },
    { icon: "Durabilité", title: "Durabilité", description: "Engagés pour une mode responsable." },
    { icon: "Créativité", title: "Créativité", description: "L'inspiration au cœur de chaque création." }
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <Navigation />

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10" />

        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2" />
            <span className="text-white/90 text-sm font-medium">Notre Histoire</span>
          </motion.div>

          <h1 ref={titleRef} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight">
            <span className="block">À Propos</span>
            <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">De Nous</span>
          </h1>

          <p ref={subtitleRef} className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Découvrez l'histoire et les valeurs qui font de DripBazzarDZ une marque unique dans l'univers de la mode urbaine et haut de gamme.
          </p>

          <motion.div ref={statsRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "2018", label: "Année de création" },
              { value: "50+", label: "Employés" },
              { value: "50K+", label: "Clients satisfaits" },
              { value: "25", label: "Pays" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Nos Valeurs</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">Les principes qui guident chacune de nos actions.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Notre Équipe</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">Des professionnels passionnés qui travaillent ensemble pour vous offrir le meilleur.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all text-center">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <div className="text-white/60 text-sm mb-3">{member.role}</div>
                <p className="text-white/70 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
