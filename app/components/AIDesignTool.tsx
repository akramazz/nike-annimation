"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, ShoppingBag, Palette, Shirt, Type } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { apiUrl } from "@/lib/api-client";

const AI_COLORS = [
  { value: "black", label: "Noir", hex: "#000000" },
  { value: "white", label: "Blanc", hex: "#ffffff" },
  { value: "red", label: "Rouge", hex: "#ef4444" },
  { value: "navy", label: "Bleu marine", hex: "#1e3a8a" },
  { value: "gray", label: "Gris", hex: "#6b7280" },
  { value: "green", label: "Vert", hex: "#16a34a" },
];

const AI_STYLES = [
  { value: "minimalist", label: "Minimaliste" },
  { value: "urban", label: "Streetwear urbain" },
  { value: "anime", label: "Anime / Manga" },
  { value: "abstract", label: "Abstrait géométrique" },
  { value: "graffiti", label: "Graffiti / Street art" },
  { value: "vintage", label: "Vintage / Rétro" },
  { value: "tribal", label: "Tribal / Amazigh" },
];

const SWEATSHIRT_MODELS = [
  { value: "sweatblack", name: "Sweat Noir", image: "/products/sweatblack.webp" },
  { value: "sweatwhite", name: "Sweat Blanc", image: "/products/sweatwhite.webp" },
];

interface AIDesignToolProps {
  initialPrompt?: string;
  productId?: string;
  productName?: string;
  productPrice?: number;
}

export default function AIDesignTool({
  initialPrompt = "Logo DripBazzarDZ stylisé",
  productId,
  productName,
  productPrice,
}: AIDesignToolProps) {
  const { addItem } = useCart();

  const [prompt, setPrompt] = useState(initialPrompt);
  const [color, setColor] = useState("black");
  const [style, setStyle] = useState("");
  const [logoText, setLogoText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [selectedSweatshirt, setSelectedSweatshirt] = useState("sweatblack");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDesigns = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Veuillez entrer une description pour votre design.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedDesign(null);

    try {
      const res = await fetch(apiUrl("/api/ai/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, color, style, logoText }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.mock || data.images.length === 0) {
          setError(
            data.message ||
              "L'API AI n'est pas configurée. Configuez HF_API_KEY sur le serveur pour générer des designs.",
          );
        } else {
          setGeneratedImages(data.images);
          if (data.images.length > 0) {
            setSelectedDesign(data.images[0]);
          }
        }
      } else {
        setError(data.error || "Échec de la génération d'image.");
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, color, style, logoText]);

  const handleAddToCart = useCallback(() => {
    if (!selectedDesign) return;

    setIsAddingToCart(true);
    const cartItemName = productName || "Design personnalisé";
    addItem(
      {
        _id: productId || `custom-design-${Date.now()}`,
        productId: productId || `custom-design-${Date.now()}`,
        name: `${cartItemName} - ${prompt.slice(0, 40)}`,
        price: productPrice || 79.99,
        image: SWEATSHIRT_MODELS.find((s) => s.value === selectedSweatshirt)?.image || "/products/sweatblack.webp",
        color: color,
        size: "Unique",
        category: "Sweat",
        customDesign: selectedDesign,
        designPrompt: prompt,
      },
      1,
    );

    setTimeout(() => setIsAddingToCart(false), 2000);
  }, [selectedDesign, color, selectedSweatshirt, prompt, addItem, productId, productName, productPrice]);

  const handleDownload = useCallback(() => {
    if (!selectedDesign) return;
    const a = document.createElement("a");
    a.href = selectedDesign.startsWith("data:")
      ? selectedDesign
      : selectedDesign;
    a.download = `dripbazzar-design-${Date.now()}.png`;
    a.click();
  }, [selectedDesign]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Type className="h-4 w-4" />
            Description du design
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez votre design... ex: 'Logo en forme d'aigle avec des motifs amazighs'"
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Palette className="h-4 w-4" />
            Couleur principale
          </label>
          <div className="flex flex-wrap gap-2">
            {AI_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  color === c.value
                    ? "ring-2 ring-white text-black bg-white/20"
                    : "bg-white/5 hover:bg-white/10 text-white/80"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border-2 border-white/30"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-sm">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <span className="w-4 h-4">&#940;</span>
            Style artistique
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
          >
            <option value="" className="bg-black">Aucun style spécifique</option>
            {AI_STYLES.map((s) => (
              <option key={s.value} value={s.value} className="bg-black">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Type className="h-4 w-4" />
            Texte du logo (optionnel)
          </label>
          <input
            type="text"
            value={logoText}
            onChange={(e) => setLogoText(e.target.value)}
            placeholder="ex: AKRAM, DripBazzarDZ..."
            maxLength={30}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
          />
          <p className="text-xs text-white/50 mt-1">
            Si renseigné, le texte sera intégré au design généré.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Shirt className="h-4 w-4" />
            Modèle de vêtement
          </label>
          <div className="flex gap-4">
            {SWEATSHIRT_MODELS.map((model) => (
              <button
                key={model.value}
                type="button"
                onClick={() => setSelectedSweatshirt(model.value)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  selectedSweatshirt === model.value
                    ? "ring-2 ring-white bg-white/10"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-sm font-medium">{model.name}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          onClick={generateDesigns}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Générer mon design avec l&apos;IA
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {generatedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Choisissez votre design</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {generatedImages.map((img, idx) => (
                <button
                  key={`gen-${idx}`}
                  type="button"
                  onClick={() => setSelectedDesign(img)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    selectedDesign === img
                      ? "border-white ring-2 ring-white"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Design généré ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Aperçu sur le sweatshirt</h3>
            <div className="relative aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8">
              <img
                src={SWEATSHIRT_MODELS.find((s) => s.value === selectedSweatshirt)?.image || "/products/sweatblack.webp"}
                alt="Sweatshirt"
                className="absolute inset-4 sm:inset-8 w-full h-full object-contain z-0"
              />
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  transform: "scale(0.8)",
                }}
              >
                <img
                  src={selectedDesign}
                  alt="Design personnalisé"
                  className="max-w-[60%] max-h-[60%] object-contain drop-shadow-2xl filter saturate-100 brightness-110"
                  style={{
                    filter: color === "white" ? "brightness(0) invert(1)" : "none",
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-white/90 flex items-center gap-2 transition-colors"
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                ) : (
                  <ShoppingBag className="h-4 w-4" />
                )}
                {isAddingToCart ? "Ajout..." : "Ajouter au panier"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
