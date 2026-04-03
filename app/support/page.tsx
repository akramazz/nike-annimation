"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Link from "next/link";
import { HelpCircle, MessageCircle, Truck, RotateCcw, Mail, Phone } from "lucide-react";

export default function SupportPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const supportOptions = [
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Trouvez réponses aux questions les plus fréquentes",
      link: "/support/faq",
      color: "blue"
    },
    {
      icon: Truck,
      title: "Livraison",
      description: "Informations sur la livraison et le suivi",
      link: "/support/delivery",
      color: "green"
    },
    {
      icon: RotateCcw,
      title: "Retours",
      description: "Politique de retours et échanges",
      link: "/support/returns",
      color: "purple"
    },
    {
      icon: MessageCircle,
      title: "Contact",
      description: "Contactez notre équipe de support",
      link: "/contact",
      color: "orange"
    }
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
              Centre d'Aide
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Comment pouvons-nous vous aider ? Trouvez toutes les informations dont vous avez besoin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={option.link}
                  className="block bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    option.color === 'blue' ? 'bg-blue-500/20' :
                    option.color === 'green' ? 'bg-green-500/20' :
                    option.color === 'purple' ? 'bg-purple-500/20' :
                    'bg-orange-500/20'
                  }`}>
                    <option.icon className={`h-7 w-7 ${
                      option.color === 'blue' ? 'text-blue-400' :
                      option.color === 'green' ? 'text-green-400' :
                      option.color === 'purple' ? 'text-purple-400' :
                      'text-orange-400'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/80 transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-white/60">{option.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Contactez-nous directement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white font-medium">support@premium.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Téléphone</p>
                  <p className="text-white font-medium">+33 1 23 45 67 89</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Envoyer un message
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
