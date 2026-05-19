"use client";

import { Truck, Shield, RefreshCw } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Livraison gratuite",
    description: "2-3 jours ouvrés",
    color: "text-green-400",
  },
  {
    icon: Shield,
    title: "Garantie 2 ans",
    description: "Satisfait ou remboursé",
    color: "text-blue-400",
  },
  {
    icon: RefreshCw,
    title: "Retour gratuit",
    description: "Sous 30 jours",
    color: "text-purple-400",
  },
];

interface ProductBenefitsProps {
  className?: string;
}

export default function ProductBenefits({
  className = "",
}: ProductBenefitsProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 ${className}`}
      aria-label="Avantages du produit"
    >
      {benefits.map(({ icon: Icon, title, description, color }) => (
        <div
          key={title}
          className="flex items-center gap-3"
          aria-label={`${title} — ${description}`}
        >
          <div
            className={`p-2 rounded-xl bg-white/5 ${color}`}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-white/60 text-xs">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
