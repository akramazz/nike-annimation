"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Clock, Check, Package } from "lucide-react";

export default function DeliveryPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const deliveryInfo = [
    {
      title: "France Métropolitaine",
      price: "Gratuit",
      time: "2-3 jours ouvrés",
      threshold: "100 DA",
      details: ["Livraison à domicile", "Point relais", "Suivi en temps réel"]
    },
    {
      title: "Europe",
      price: "9,99 DA",
      time: "3-5 jours ouvrés",
      threshold: null,
      details: ["Livraison à domicile", "Suivi international", "Douanes incluses"]
    },
    {
      title: "International",
      price: "19,99 DA",
      time: "5-10 jours ouvrés",
      threshold: null,
      details: ["Livraison express", "Assurance colis", "Suivi global"]
    }
  ];

  const steps = [
    { number: 1, title: "Commande passée", description: "Vous recevez un email de confirmation" },
    { number: 2, title: "Préparation", description: "Votre commande est préparée avec soin" },
    { number: 3, title: "Expédition", description: "Un email de suivi vous est envoyé" },
    { number: 4, title: "Livraison", description: "Recevez votre colis sous 2-5 jours" }
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
              Livraison
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Découvrez nos options de livraison et suivis de commande.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {deliveryInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-4">{info.title}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{info.price}</span>
                  {info.threshold && (
                    <span className="text-white/60 text-sm ml-2">(gratuit dès {info.threshold})</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                  <Clock className="h-4 w-4" />
                  {info.time}
                </div>
                <ul className="space-y-2">
                  {info.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                      <Check className="h-4 w-4 text-green-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Suivi de Votre Commande</h2>
            <div className="flex justify-between mb-4">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <span className="text-white font-bold">{step.number}</span>
                  </div>
                  <span className="text-white text-sm font-medium text-center">{step.title}</span>
                  <span className="text-white/60 text-xs text-center">{step.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Questions Fréquentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Que se passe-t-il si je suis absent lors de la livraison ?</h3>
                <p className="text-white/70 text-sm">Le livreur laissera un avis de passage vous permettant de reprogrammer la livraison ou de récupérer votre colis en point relais.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Puis-je modifier mon adresse de livraison ?</h3>
                <p className="text-white/70 text-sm">Vous pouvez modifier l'adresse avant l'expéditions. Contactez-nous rapidement après votre commande.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">La livraison est-elle sécurisée ?</h3>
                <p className="text-white/70 text-sm">Oui, tous nos colis sont suivis et assurés. Vous recevrez un numéro de suivi par email.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
