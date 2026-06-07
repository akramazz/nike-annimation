"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { normalizeProductImage } from "@/lib/image-normalize";

function toLowerIfRelative(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return src.toLowerCase();
}

export default function ProductImage(props: React.ComponentProps<typeof Image>) {
  const { src, alt, onError, ...rest } = props;
  const fallback = "/products/default.webp";
  const normalizedBase = normalizeProductImage(typeof src === "string" ? src : undefined);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setFailed(true);
      onError?.(e);
    },
    [onError],
  );

  const resolved = failed
    ? fallback
    : (() => {
        if (normalizedBase.startsWith("http://") || normalizedBase.startsWith("https://")) {
          return normalizedBase;
        }
        return normalizedBase.toLowerCase();
      })();

  const isOptimized = !(
    resolved.startsWith("http://") || resolved.startsWith("https://")
  );

  return (
    <Image
      src={resolved}
      alt={alt}
      {...rest}
      unoptimized={!isOptimized}
      onError={handleError}
    />
  );
}
