"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const faqs = [
    {
      question: "Comment passer une commande ?",
      answer: "Parcourez notre collection, sélectionnez vos produits préférés, Choisissez la taille et la couleur souhaitées, Ajoutez au panier, Validez votre commande en suivant les étapes de paiement."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Nos délais de livraison sont de 2 à 5 jours ouvrés en France métropolitaine. La livraison est gratuite pour toute commande supérieure à 100 DA."
    },
    {
      question: "Quelle est la politique de retour ?",
      answer: "Vous disposez de 30 jours pour retourner votre commande. Les articles doivent être non portés et dans leur emballage d'origine. Les retours sont gratuits pour les commandes françaises."
    },
    {
      question: "Comment puis-je suivre ma commande ?",
      answer: "Une fois votre commande expédiée, vous recevrez un email avec un lien de suivi. Vous pouvez également suivre votre commande depuis votre compte client."
    },
    {
      question: "Comment connaître ma taille ?",
      answer: "Consultez notre guide des tailles disponible sur chaque page produit. Si vous avez un doute, n'hésitez pas à contacter notre service client qui vous conseillera personnellement."
    },
    {
      question: "Les articles sont-ils authentiques ?",
      answer: "Oui, tous nos produits sont 100% authentiques. Nous travaillons directement avec les meilleures manufactures et garantissons la qualité de chaque article."
    },
    {
      question: "Comment contacter le service client ?",
      answer: "Vous pouvez nous contacter par email à azzouzakram357@gmail.com, par téléphone au +213 792 259 216 ou +213 552 815 537 (du lundi au vendredi, 9h-18h) ou via le formulaire de contact."
    },
    {
      question: "Proposez-vous des tailles grandes ?",
      answer: "Oui, nous proposons une large gamme de tailles du XS au XXL. Certaines pièces sont disponibles en tailles spéciales. Consultez notre guide pour plus d'informations."
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
              Foire Aux Questions
            </h1>
            <p className="text-white/70 text-lg">
              Trouvez réponses à vos questions sur nos produits et services.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-medium text-white pr-4">{faq.question}</span>
                  {openQuestion === index ? (
                    <Minus className="h-5 w-5 text-white/60 flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-white/60 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openQuestion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6">
                        <p className="text-white/70">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white mb-4">Vous n'avez pas trouvé votre réponse ?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
