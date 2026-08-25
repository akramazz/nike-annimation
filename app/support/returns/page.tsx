"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Package, CreditCard, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ReturnsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const processSteps = [
    { number: 1, title: "Initier le retour", description: "Depuis votre compte ou email" },
    { number: 2, title: "Préparer le colis", description: "Emballez l'article avec soin" },
    { number: 3, title: "Envoyer le retour", description: "Utilisez l'étiquette fournie" },
    { number: 4, title: "Remboursement", description: "Sous 14 jours ouvrés" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Retours & Échanges
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Notre politique de retour flexible pour votre tranquillité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <RotateCcw className="h-10 w-10 text-white/80 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">30 Jours</h3>
              <p className="text-white/70 text-sm">Vous avez 30 jours pour retourner votre commande sans justification.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <Package className="h-10 w-10 text-white/80 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Gratuit</h3>
              <p className="text-white/70 text-sm">Les retours sont gratuits pour la France métropolitaine.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <CreditCard className="h-10 w-10 text-white/80 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Remboursement Rapide</h3>
              <p className="text-white/70 text-sm">Remboursement sous 14 jours ouvrés après réception.</p>
            </motion.div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Comment retourner un article</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Conditions de Retour</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                <div>
                  <h3 className="text-white font-medium">Articles non portés</h3>
                  <p className="text-white/70 text-sm">Les articles doivent être dans leur état d'origine, non portés et non lavés.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                <div>
                  <h3 className="text-white font-medium">Emballage intact</h3>
                  <p className="text-white/70 text-sm">Les articles doivent être retournés dans leur emballage d'origine avec toutes les étiquettes.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                <div>
                  <h3 className="text-white font-medium">Preuve d'achat</h3>
                  <p className="text-white/70 text-sm">Incluez votre bon de livraison ou facture dans le colis de retour.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Vous avez besoin d'aide ?</h2>
            <p className="text-white/70 mb-6">Notre équipe est disponible pour vous accompagner dans votre démarche de retour.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Nous contacter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
