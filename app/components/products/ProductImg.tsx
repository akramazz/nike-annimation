"use client";

import { useCallback } from "react";
import { normalizeProductImage } from "@/lib/image-normalize";

export default function ProductImg({
  src,
  alt,
  className,
  onError,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const fallback = "/products/default.webp";
  const base = normalizeProductImage(src);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      (e.target as HTMLImageElement).src = fallback;
      onError?.(e);
    },
    [onError],
  );

  const resolved = (() => {
    if (base.startsWith("http://") || base.startsWith("https://")) return base;
    return base.toLowerCase();
  })();

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      {...rest}
      onError={handleError}
    />
  );
}
