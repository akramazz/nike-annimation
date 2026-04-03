"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Briefcase, MapPin, Clock, Send } from "lucide-react";

export default function CareersPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openPositions = [
    { title: "Designer Senior", department: "Design", location: "Paris, France", type: "CDI", description: "Vous concevrez les collections premium de demain avec une vision créatif et innovative." },
    { title: "Responsable Marketing Digital", department: "Marketing", location: "Paris, France", type: "CDI", description: "Vous développerez notre présence digitale et gérerez nos campagnes marketing." },
    { title: "Développeur Frontend", department: "Technique", location: "Remote", type: "CDI", description: "Vous maintiendrez et améliorerez notre plateforme e-commerce." },
    { title: "Service Client", department: "Support", location: "Paris, France", type: "CDD", description: "Vous accompagnerez nos clients dans leur expérience d'achat premium." }
  ];

  const benefits = ["Salaire compétitif", "Mutuelle premium", "Tickets restaurant", "Transport remboursé", "Formation continue", "Horaire flexible", "Télétravail possible", "Événements équipe"];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">Carrières</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Rejoignez une équipe passionnée et contribuez à l'excellence de PREMIUM.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Postes Ouverts</h2>
              <div className="space-y-4">
                {openPositions.map((position, index) => (
                  <motion.div key={position.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{position.title}</h3>
                      <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">{position.type}</span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{position.description}</p>
                    <div className="flex items-center gap-4 text-white/50 text-sm">
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{position.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{position.location}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Nos Avantages</h2>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-white/70 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">Vous n'avez pas trouvé votre poste ?</h3>
                <p className="text-white/70 text-sm mb-4">Envoyez-nous votre CV spontané, nous sommes toujours à la recherche de talents.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors">
                  <Send className="h-4 w-4" />
                  Envoyer ma candidature
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
