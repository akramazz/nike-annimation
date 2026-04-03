"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function TermsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sections = [
    {
      title: "Objet",
      content: "Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les modalités et conditions de vente entre PREMIUM et tout client personne physique ou morale souhaitant acquérir les produits proposés sur notre site e-commerce."
    },
    {
      title: "Commande",
      content: "La commande est passée lorsque vous sélectionnez vos produits, ajoutez au panier et validez le paiement. La confirmation de commande vous sera envoyée par email. PREMIUM se réserve le droit de refuser toute commande en cas de litige précédent ou de paiement non honoré."
    },
    {
      title: "Prix",
      content: "Les prix sont indiqués en euros TTC. Ils ne comprennent pas les frais de livraison ajoutés au moment du paiement. PREMIUM se réserve le droit de modifier les prix à tout moment, mais les commandes déjà confirmées ne seront pas affectées."
    },
    {
      title: "Paiement",
      content: "Le paiement s'effectue par carte bancaire, PayPal ou autre moyen sécurisé. La commande est considérée comme effective après validation du paiement. En cas de paiement par virement, la commande sera traitée après réception des fonds."
    },
    {
      title: "Livraison",
      content: "Les produits sont livrés à l'adresse de livraison indiquée lors de la commande. Les délais de livraison sont de 2 à 5 jours ouvrés pour la France métropolitaine. Les risques sont transférés au client à réception du colis."
    },
    {
      title: "Droit de retractation",
      content: "Conformément au Code de la Consommation, vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation sans justification. Les frais de retour sont à notre charge pour la France métropolitaine."
    },
    {
      title: "Garanties",
      content: "Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. En cas de produit défectueux, nous procèderons à sa réparation, son remplacement ou son remboursement."
    },
    {
      title: "Responsabilité",
      content: "PREMIUM ne peut être tenue responsable des dommages résultant d'une mauvaise utilisation des produits ou du non-respect des consignes d'entretien. La responsabilité maximale est limitée au montant de la commande."
    },
    {
      title: "Propriété intellectuelle",
      content: "Tous les éléments du site (textes, images, logos, vidéos) sont protégés par les droits de propriété intellectuelle. Toute reproduction ou utilisation non autorisée est interdite."
    },
    {
      title: "Litiges",
      content: "Les présentes CGV sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents. Une solution amiable sera privilégiée avant toute action judiciaire."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Conditions Générales de Vente
            </h1>
            <p className="text-white/70 text-lg">
              Les règles qui encadrent vos achats sur PREMIUM.
            </p>
          </motion.div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              >
                <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>
                <p className="text-white/70 text-sm leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white/70 text-sm text-center">
              Dernière mise à jour : Avril 2026. Pour toute question, contactez-nous à legal@premium.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}