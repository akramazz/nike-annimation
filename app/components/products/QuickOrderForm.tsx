"use client";

import {
  useState,
  useCallback,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Loader,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ── Algeria wilayas ──────────────────────────────────────────────────────────
const ALGERIAN_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna",
  "Béjaïa", "Biskra", "Béchar", "Blida", "Bouïra",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou",
  "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine",
  "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès",
  "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
  "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt",
  "Djanet", "El M'Ghair", "El Menia",
];

// ── Shared order types ────────────────────────────────────────────────────────
import { apiUrl } from "@/lib/api-client";

interface OrderFormFields {
  name: string;
  firstName: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
}

export interface OrderFormProps {
  productName: string;
  productPrice: number;
  totalAmount: number;
  productId: string | number;
  productColor?: string;
  selectedSize: string;
  quantity: number;
  productImage: string;
  compact?: boolean;
  onSuccess?: (orderNumber: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function QuickOrderForm({
  productName,
  productPrice,
  totalAmount,
  productId,
  productColor,
  selectedSize,
  quantity,
  productImage,
  compact = false,
  onSuccess,
}: OrderFormProps) {
  const [form, setForm] = useState<OrderFormFields>({
    name: "",
    firstName: "",
    email: "",
    phone: "",
    address: "",
    wilaya: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  // Prefill from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("dripbazzar_orderform");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch { /* ignore */ }
  }, []);

  const updateField = (field: keyof OrderFormFields) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Persist non-sensitive fields
    if (field !== "email" && field !== "phone") {
      try {
        const saved = JSON.parse(
          localStorage.getItem("dripbazzar_orderform") || "{}"
        );
        saved[field] = value;
        localStorage.setItem("dripbazzar_orderform", JSON.stringify(saved));
      } catch { /* ignore */ }
    }
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setOrderStatus("idle");
      setErrorMsg("");

      // ─── Validation ────────────────────────────────────────────────────
      const errors: string[] = [];
      if (!form.name.trim())       errors.push("Nom requis");
      if (!form.firstName.trim())  errors.push("Prénom requis");
      if (!form.phone.trim())      errors.push("Téléphone requis");
      else if (!/^[\d\s+\-]+$/.test(form.phone))
        errors.push("Téléphone invalide");
      if (!form.address.trim())    errors.push("Adresse requise");
      if (!form.wilaya.trim())     errors.push("Wilaya requise");
      // Email is optional for quick orders
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errors.push("Email invalide");

      if (errors.length) {
        setErrorMsg(errors[0]);
        return;
      }

      setSubmitting(true);

      try {
        const numericId =
          typeof productId === "string" ? Number(productId) || 0 : productId;

        const orderData = {
          customerName: `${form.firstName} ${form.name}`.trim(),
          email: form.email || "no-reply@order.local",
          phone: form.phone,
          address: form.address,
          city: form.wilaya,
          postalCode: "",
          country: "Algérie",
          items: [
            {
              productId: productId,
              name: productName,
              price: productPrice,
              quantity,
              color: productColor || "",
              size: selectedSize,
              image: productImage,
            },
          ],
          total: totalAmount,
        };

        const res = await fetch(apiUrl("/api/orders"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (data.success) {
          setOrderStatus("success");
          setOrderNumber(data.order?.orderNumber || "");
          onSuccess?.(data.order?.orderNumber || "");
        } else {
          setOrderStatus("error");
          setErrorMsg(data.error || "La commande a échoué");
        }
      } catch {
        setOrderStatus("error");
        setErrorMsg("Erreur réseau. Réessayez.");
      }

      setSubmitting(false);
    },
    [form, productId, productName, productPrice, quantity, productColor, selectedSize, productImage, totalAmount, onSuccess]
  );

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setOrderStatus("idle");
    setForm({ name: "", firstName: "", email: "", phone: "", address: "", wilaya: "" });
    localStorage.removeItem("dripbazzar_orderform");
  };

  // ── Success View ───────────────────────────────────────────────────────────
  if (orderStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-3xl backdrop-blur-xl bg-green-500/10 border border-green-500/30 p-6 sm:p-10 text-center space-y-5 ${
          compact ? "p-5" : ""
        }`}
        role="alert"
        aria-live="polite"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-green-400">
          Commande confirmée !
        </h3>
        <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Merci pour votre commande. Vous recevrez un email de confirmation
          sous peu.
        </p>
        <div className="pt-2 space-y-3">
          <a
            href="/"
            className="inline-block px-8 py-3 sm:py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 text-sm sm:text-base"
          >
            Retour à l&#39;accueil
          </a>
          <button
            onClick={handleReset}
            className="block w-full px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all text-sm"
          >
            Commander à nouveau
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Form View ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden ${
        compact ? "" : "p-4 sm:p-6"
      }`}
    >
      {/* Récapitulatif compact */}
      {!compact && (
        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-contain p-1.5"
              unoptimized={
                productImage.startsWith("http://") ||
                productImage.startsWith("https://")
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base truncate">
              {productName}
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              {productColor || ""}{" "}
              {selectedSize ? `· Taille: ${selectedSize}` : "· Taille unique"}
            </p>
            <p className="text-white/60 text-xs sm:text-sm">
              Quantité: {quantity}
            </p>
          </div>
          <p className="font-bold text-sm sm:text-base whitespace-nowrap">
            €{totalAmount.toFixed(2)}
          </p>
        </div>
      )}

      <h2 className="text-base sm:text-lg font-bold mb-4">
        Commande directe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Nom + Prénom */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
              aria-hidden="true"
            />
            <input
              type="text"
              value={form.name}
              onChange={updateField("name")}
              placeholder="Nom *"
              required
              maxLength={80}
              autoComplete="family-name"
              className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              value={form.firstName}
              onChange={updateField("firstName")}
              placeholder="Prénom *"
              required
              maxLength={80}
              autoComplete="given-name"
              className="w-full px-3 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="relative">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
            aria-hidden="true"
          />
          <input
            type="tel"
            value={form.phone}
            onChange={updateField("phone")}
            placeholder="Téléphone *"
            required
            maxLength={20}
            autoComplete="tel"
            className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>

        {/* Adresse */}
        <div className="relative">
          <MapPin
            className="absolute left-3 top-3 h-4 w-4 text-white/40"
            aria-hidden="true"
          />
          <textarea
            value={form.address}
            onChange={updateField("address")}
            placeholder="Adresse *"
            required
            rows={2}
            maxLength={500}
            className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none"
          />
        </div>

        {/* Wilaya */}
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none"
            aria-hidden="true"
          />
          <select
            value={form.wilaya}
            onChange={updateField("wilaya")}
            required
            className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all appearance-none cursor-pointer"
            aria-label="Sélectionner une wilaya"
          >
            <option value="" className="bg-zinc-900 text-black">
              {/* Wilaya * */}Wilaya *
            </option>
            {ALGERIAN_WILAYAS.map((w) => (
              <option key={w} value={w} className="bg-zinc-900 text-black">
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Email (optional) */}
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
            aria-hidden="true"
          />
          <input
            type="email"
            value={form.email}
            onChange={updateField("email")}
            placeholder="Email (optionnel)"
            maxLength={254}
            autoComplete="email"
            className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 text-red-400 text-sm"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={submitting}
          className="w-full py-3 sm:py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex items-center justify-center gap-2"
        >
          <span>
            {submitting
              ? "Envoi en cours..."
              : `Commander maintenant · €${totalAmount.toFixed(2)}`}
          </span>
          {submitting && <Loader className="h-5 w-5 animate-spin" />}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            aria-hidden="true"
          />
        </motion.button>
      </form>
    </div>
  );
}
