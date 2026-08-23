"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  value?: number;
  count?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ value = 0, count = 0, onChange, readonly = false, size = 20 }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const displayValue = hover || value;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            disabled={readonly || !onChange}
            whileHover={onChange && !readonly ? { scale: 1.2 } : undefined}
            whileTap={onChange && !readonly ? { scale: 0.9 } : undefined}
            onMouseEnter={() => onChange && setHover(star)}
            onMouseLeave={() => onChange && setHover(0)}
            onClick={() => onChange && onChange(star)}
            className={`${onChange && !readonly ? "cursor-pointer" : "cursor-default"}`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                star <= displayValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/20"
              }`}
            />
          </motion.button>
        ))}
      </div>
      {count > 0 && !readonly && (
        <span className="text-white/60 text-sm ml-1">
          {value.toFixed(1)} ({count} avis{count !== 1 ? "s" : ""})
        </span>
      )}
      {count === 0 && !readonly && (
        <span className="text-white/40 text-sm ml-1">Aucun avis</span>
      )}
    </div>
  );
}
