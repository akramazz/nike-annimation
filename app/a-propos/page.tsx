"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AProposPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
            <span className="text-white/90 text-sm font-medium">À PROPOS</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            DRIPBAZZARDZ
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Notre style. Notre identité.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            DripBazzardz, c’est une approche du streetwear premium : des pièces assumées, un univers cohérent et une identité visuelle forte.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">NOTRE HISTOIRE</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
              DripBazzardz est né d’une envie simple : proposer un streetwear identifiable, sans surproduction ni remplissage. Chaque pièce est pensée pour s’inscrire dans un univers cohérent, entre identité et modernité.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Identité",
                text: "Exprimer son style et sa personnalité à travers des pièces affirmées.",
              },
              {
                title: "Qualité",
                text: "Des choix pensés, des coupes et des matières qui tiennent.",
              },
              {
                title: "Univers",
                text: "Un imaginaire streetwear continu, du détail au packaging.",
              },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">NOTRE UNIVERS</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
              DripBazzardz est un univers streetwear moderne, reconnaissable et assumé. Il se construit autour de pièces marquées, d’une direction artistique précise et d’une communauté qui participe à son évolution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Style",
                text: "Un langage visuel constant entre minimalisme et codes urbains.",
              },
              {
                title: "Communauté",
                text: "Une marque qui avance avec ceux qui la portent.",
              },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">NOS VALEURS</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">Les principes qui guident la marque.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "IDENTITÉ",
                text: "Exprimer son style et sa personnalité.",
              },
              {
                title: "QUALITÉ",
                text: "Des pièces choisies avec attention.",
              },
              {
                title: "STYLE",
                text: "Un univers streetwear moderne et reconnaissable.",
              },
              {
                title: "COMMUNAUTÉ",
                text: "Une marque qui évolue avec sa communauté.",
              },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all">
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            PRÊT À DÉCOUVRIR NOTRE UNIVERS ?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Découvrez la collection et trouvez les pièces qui correspondent à votre style.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors">
              DÉCOUVRIR LA COLLECTION
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
              NOUS CONTACTER
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
