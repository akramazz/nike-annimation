"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Scale, FileText, Shield, Cookie } from "lucide-react";

export default function LegalPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const legalSections = [
    {
      icon: FileText,
      title: "Mentions Légales",
      description: "Informations légales sur l'entreprise",
      link: "/legal"
    },
    {
      icon: Shield,
      title: "Politique de Confidentialité",
      description: "Comment nous protégeons vos données",
      link: "/legal/privacy"
    },
    {
      icon: Scale,
      title: "Conditions Générales de Vente",
      description: "Conditions régissant vos achats",
      link: "/legal/terms"
    },
    {
      icon: Cookie,
      title: "Politique des Cookies",
      description: "Gestion des cookies et traceurs",
      link: "/legal/cookies"
    }
  ];

  const companyInfo = {
    name: "DripBazzarDZ",
    address: "Alger-Centre, Algérie",
    phone: "+213 792 259 216",
    email: "azzouzakram357@gmail.com",
    siret: "123 456 789 00001",
    tva: "DZ12345678901",
    capital: "50 000 DA",
    director: "Zakram Azzouz"
  };

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
              Informations Légales
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Toutes les informations légales relatives à notre entreprise et à vos achats.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {legalSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={section.link}
                  className="block bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <section.icon className="h-10 w-10 text-white/60 mb-4 group-hover:text-white transition-colors" />
                  <h3 className="text-lg font-bold text-white mb-2">{section.title}</h3>
                  <p className="text-white/60 text-sm">{section.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Informations de l'Entreprise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white/60 text-sm mb-1">Raison sociale</h3>
                <p className="text-white font-medium mb-4">{companyInfo.name}</p>
                
                <h3 className="text-white/60 text-sm mb-1">Adresse</h3>
                <p className="text-white font-medium mb-4">{companyInfo.address}</p>
                
                <h3 className="text-white/60 text-sm mb-1">Téléphone</h3>
                <p className="text-white font-medium mb-4">{companyInfo.phone}</p>
                
                <h3 className="text-white/60 text-sm mb-1">Email</h3>
                <p className="text-white font-medium">{companyInfo.email}</p>
              </div>
              <div>
                <h3 className="text-white/60 text-sm mb-1">SIRET</h3>
                <p className="text-white font-medium mb-4">{companyInfo.siret}</p>
                
                <h3 className="text-white/60 text-sm mb-1">Numéro TVA</h3>
                <p className="text-white font-medium mb-4">{companyInfo.tva}</p>
                
                <h3 className="text-white/60 text-sm mb-1">Capital social</h3>
                <p className="text-white font-medium mb-4">{companyInfo.capital}</p>
                
                <h3 className="text-white/60 text-sm mb-1">Directeur de la publication</h3>
                <p className="text-white font-medium">{companyInfo.director}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-white/60 text-sm">
            <p>Le site est hébergé par un prestataire tiers. Pour toute question légale, contactez-nous à {companyInfo.email}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
