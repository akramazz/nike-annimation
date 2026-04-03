"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Calendar, Award, Globe, Users } from "lucide-react";

export default function HistoryPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const timeline = [
    {
      year: "2018",
      title: "La Création",
      description: " PREMIUM voit le jour avec une vision simple : créer des vestes qui allient élégance et performance."
    },
    {
      year: "2019",
      title: "Première Collection",
      description: "Lancement de notre première collection de vestes Premium qui rencontre un succès immédiat."
    },
    {
      year: "2020",
      title: "Expansion Internationale",
      description: "Nous expandons nos activités à travers l'Europe et atteignons 10 000 clients."
    },
    {
      year: "2021",
      title: "Certification Qualité",
      description: "Obtention de la certification ISO 9001 pour notre système de gestion de qualité."
    },
    {
      year: "2022",
      title: "Durabilité",
      description: "Lancement de notre ligne Eco-Premium avec des matériaux 100% recyclés."
    },
    {
      year: "2024",
      title: "50K+ Clients",
      description: "Nous célébrons nos 50 000 clients satisfaits à travers le monde."
    },
    {
      year: "2026",
      title: "Expansion Mondiale",
      description: "Nous étendons notre présence à l'échelle mondiale avec de nouveaux marchés."
    }
  ];

  const stats = [
    { icon: Calendar, value: "2018", label: "Année de création" },
    { icon: Users, value: "50K+", label: "Clients" },
    { icon: Globe, value: "25+", label: "Pays" },
    { icon: Award, value: "500+", label: "Modèles" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Notre Histoire
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Découvrez comment PREMIUM est devenue une référence dans l'univers du vêtement premium.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-white/10" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-white/60" />
                        <span className="text-white/60 text-sm">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/70 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, value: "2018", label: "Année de création" },
              { icon: Users, value: "50K+", label: "Clients" },
              { icon: Globe, value: "25+", label: "Pays" },
              { icon: Award, value: "500+", label: "Modèles" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white/5 rounded-2xl border border-white/10"
              >
                <stat.icon className="h-8 w-8 mx-auto text-white/60 mb-2" />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}