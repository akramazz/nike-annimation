"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Heart, Shield, Star, Truck } from "lucide-react";

export default function CommitmentsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const commitments = [
    {
      icon: Heart,
      title: "Satisfaction Client",
      description: "Nous nous engageons à offrir une expérience d'achat exceptionnelle. Votre satisfaction est notre priorité absolue.",
      details: ["Support disponible 24/7", "Échanges gratuits", "Garantie satisfait ou remboursé"]
    },
    {
      icon: Shield,
      title: "Qualité Certifiée",
      description: "Chaque produit est rigoureusement sélectionné et testé pour garantir une qualité exceptionnelle.",
      details: ["Contrôle qualité strict", "Matériaux premium", "Finition irréprochable"]
    },
    {
      icon: Star,
      title: "Service Premium",
      description: "Notre équipe est dédiée à vous offrir un service personnalisé qui dépasse vos attentes.",
      details: ["Conseils personnalisés", "Suivi de commande", "Programme fidélité"]
    },
    {
      icon: Truck,
      title: "Livraison Express",
      description: "Recevez vos commandes rapidement avec notre service de livraison premium.",
      details: ["Livraison offerte dès 100€", "Suivi en temps réel", "Livraison internationale"]
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">Nos Engagements</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Des promesses tenues à chaque commande pour une expérience d'achat inégalée.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commitments.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                <item.icon className="h-12 w-12 text-white/80 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
