"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CookiesPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cookieTypes = [
    {
      name: "Cookies essentiels",
      description: "Nécessaires au fonctionnement du site. Ils permettent notamment de mémoriser vos préférences, sécuriser votre connexion et accéder aux fonctionnalités de base.",
      examples: ["Session utilisateur", "Panier", "Préférences langue"],
      required: true
    },
    {
      name: "Cookies analytiques",
      description: "Nous aident à comprendre comment vous utilisez notre site pour l'améliorer. Ces cookies collectent des informations anonymes sur votre navigation.",
      examples: ["Pages visitées", "Temps passé sur le site", "Origine du trafic"],
      required: false
    },
    {
      name: "Cookies marketing",
      description: "Utilisés pour vous proposer des publicités personnalisées en fonction de vos intérêts et limiter le nombre d'affichages.",
      examples: ["Publicités personnalisées", "Remarketing"],
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Politique des Cookies
            </h1>
            <p className="text-white/70 text-lg">
              Comprendre comment nous utilisons les cookies.
            </p>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Qu'est-ce qu'un cookie ?</h2>
            <p className="text-white/70 leading-relaxed">
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations relatives à votre navigation pour améliorer votre expérience.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {cookieTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{type.name}</h3>
                  {type.required ? (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Obligatoire</span>
                  ) : (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Optionnel</span>
                  )}
                </div>
                <p className="text-white/70 mb-4">{type.description}</p>
                <div>
                  <span className="text-white/60 text-sm">Exemples: </span>
                  <span className="text-white/80 text-sm">{type.examples.join(", ")}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Gérer vos cookies</h2>
            <p className="text-white/70 mb-4">
              Vous pouvez à tout moment modifier vos préférences concernant les cookies en configurant votre navigateur. Voici comment procéder :
            </p>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• <strong>Chrome</strong> : Paramètres &gt; Confidentialité &gt; Cookies</li>
              <li>• <strong>Firefox</strong> : Options &gt; Vie privée &gt; Cookies</li>
              <li>• <strong>Safari</strong> : Préférences &gt; Confidentialité &gt; Cookies</li>
              <li>• <strong>Edge</strong> : Paramètres &gt; Cookies et autorisations</li>
            </ul>
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white/70 text-sm text-center">
               Dernière mise à jour : Avril 2026. Pour toute question, contactez-nous à azzouzakram357@gmail.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
