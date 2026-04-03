"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Leaf, Recycle, Droplets, Sun } from "lucide-react";

export default function SustainabilityPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initiatives = [
    {
      icon: Leaf,
      title: "Matériaux Durables",
      description: "Nous utilisons des matériaux écologiques et durables pour minimiser notre impact environnemental.",
      impact: "40% de réduction d'empreinte carbone"
    },
    {
      icon: Recycle,
      title: "Économie Circulaire",
      description: "Notre programme de reprise permet de recycler vos anciens vêtements pour une mode responsable.",
      impact: "5000+ pièces recyclées"
    },
    {
      icon: Droplets,
      title: "Gestion de l'Eau",
      description: "Nous avons mis en place des processus de fabrication basse consommation d'eau.",
      impact: "60% d'eau économisée"
    },
    {
      icon: Sun,
      title: "Énergie Verte",
      description: "Nos partenaires utilisent des énergies renouvelables pour la production.",
      impact: "100% énergie propre"
    }
  ];

  const goals = [
    { year: "2026", target: "Carbon neutral" },
    { year: "2030", target: "100% matériaux recyclés" },
    { year: "2035", target: "Production zéro déchet" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 mb-4">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">RESPONSABLE</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">Durabilité</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Notre engagement pour une mode plus respectueuse de l'environnement.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {initiatives.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                <item.icon className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 mb-4">{item.description}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
                  <Leaf className="h-3 w-3" />
                  {item.impact}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Nos Objectifs 2035</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <div key={goal.year} className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{goal.year}</div>
                  <p className="text-white/70">{goal.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
