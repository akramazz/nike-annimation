"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sections = [
    {
      title: "Collecte des données",
      content: "Nous collectons les données personnelles que vous nous fournissez volontairement lors de votre inscription, commande ou demande de contact. Cela peut inclure votre nom, adresse email, adresse de livraison, numéro de téléphone et informations de paiement."
    },
    {
      title: "Utilisation des données",
      content: "Vos données sont utilisées pour traiter vos commandes, améliorer nos services, vous envoyer des informations sur nos produits et promotions, et répondre à vos demandes. Nous ne partageons vos données avec aucun tiers sans votre consentement explicite."
    },
    {
      title: "Cookies",
      content: "Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site."
    },
    {
      title: "Sécurité",
      content: "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction. Toutes les données sensibles sont chiffrées."
    },
    {
      title: "Vos droits",
      content: "Conformément au RGPD, vous avez le droit d'accéder, de rectifier, de supprimer et de vous opposer au traitement de vos données personnelles. Vous pouvez exercer ces droits en nous contactant à privacy@dripbazzardz.com."
    },
    {
      title: "Conservation des données",
      content: "Nous conservons vos données personnelles aussi longtemps que nécessaire pour fulfill les purposes pour lesquels elles ont été collectées, sauf obligation légale de conservation plus longue."
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
              Politique de Confidentialité
            </h1>
            <p className="text-white/70 text-lg">
              Comment nous protégeons vos données personnelles.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
              >
                <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                <p className="text-white/70 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white/70 text-sm text-center">
               Dernière mise à jour : Avril 2026. Pour toute question, contactez-nous à privacy@dripbazzardz.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
