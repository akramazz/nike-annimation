import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shirt, Tag } from "lucide-react";
import AIDesignTool from "@/app/components/AIDesignTool";

export const metadata: Metadata = {
  title: "Créer mon design - DripBazzarDZ",
  description:
    "Créez votre propre design unique avec notre outil de génération d'images IA. Choisissez un prompt, une couleur et un style, puis prévisualisez sur un sweatshirt avant d'ajouter au panier.",
  keywords: [
    "design personnalisé",
    "générateur IA",
    "sweat personnalisé",
    "DripBazzarDZ",
    "mode urbaine",
    "créer design",
  ],
};

export default function DesignerPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mb-8">
          <Link
            href="/products"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux produits
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              Créateur de design IA
            </h1>
          </div>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Décrivez votre idée, choisissez une couleur et un style, puis
            laissez l&apos;IA générer des designs uniques. Prévisualisez le
            résultat sur un sweatshirt et ajoutez-le directement au panier.
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-white/60" />
                  Options
                </h3>
                <ul className="space-y-3 text-sm text-white/70">
                  <li>
                    <strong className="text-white/90">1.</strong> Entrez votre
                    prompt décrivant le design souhaité.
                  </li>
                  <li>
                    <strong className="text-white/90">2.</strong> Choisissez la
                    couleur principale et le style artistique.
                  </li>
                  <li>
                    <strong className="text-white/90">3.</strong> Sélectionnez un
                    modèle de sweatshirt (noir ou blanc).
                  </li>
                  <li>
                    <strong className="text-white/90">4.</strong> Cliquez sur
                    &quot;Générer&quot; pour créer votre design avec l&apos;IA.
                  </li>
                  <li>
                    <strong className="text-white/90">5.</strong> Choisissez l&apos;un
                    des designs générés et ajoutez au panier.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-white/60" />
                  Info
                </h3>
                <p className="text-sm text-white/70">
                  Les designs sont générés via l&apos;API IA. Assurez-vous que
                  la clé API est configurée côté serveur pour une génération
                  complète. En mode démo, des exemples sont affichés.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <AIDesignTool
                  initialPrompt="Logo DripBazzarDZ stylisé en graffiti"
                  productName="Sweat Personnalisé"
                  productPrice={89.99}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
