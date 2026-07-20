"use client";

import {
  useState,
  useCallback,
  useEffect,
  type ImgHTMLAttributes,
  type CSSProperties,
  type SyntheticEvent,
} from "react";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/image-utils";

export interface ProductImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt?: string;
  /** Remplit le parent `position: relative` (équivalent next/image fill) */
  fill?: boolean;
  /** Ignoré (compat next/image) */
  sizes?: string;
  /** Ignoré (compat next/image) */
  priority?: boolean;
  /** Callback quand l'image a chargé (compat next/image) */
  onLoadingComplete?: () => void;
}

/**
 * Affiche une image produit de façon fiable avec <img>.
 * Gère fill, fallback default.webp, et reset d'erreur au changement de src.
 */
export default function ProductImage({
  src: rawSrc,
  alt = "",
  className = "",
  onError,
  onLoad,
  width,
  height,
  style,
  fill = false,
  sizes: _sizes,
  priority: _priority,
  onLoadingComplete,
  ...rest
}: ProductImageProps) {
  const resolved = getProductImage(rawSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;
      // Évite une boucle infinie si default.webp manque aussi
      if (img.src.endsWith(DEFAULT_PRODUCT_IMAGE) || failed) {
        onError?.(e);
        return;
      }
      setFailed(true);
      onError?.(e);
    },
    [failed, onError],
  );

  const handleLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      onLoadingComplete?.();
      onLoad?.(e);
    },
    [onLoad, onLoadingComplete],
  );

  const finalSrc = failed ? DEFAULT_PRODUCT_IMAGE : resolved;

  const mergedStyle: CSSProperties = { ...(style || {}) };
  if (fill) {
    mergedStyle.position = "absolute";
    mergedStyle.inset = 0;
    mergedStyle.width = "100%";
    mergedStyle.height = "100%";
  } else {
    if (typeof width === "number") mergedStyle.width = `${width}px`;
    if (typeof height === "number") mergedStyle.height = `${height}px`;
  }

  const imgClassName = [
    "product-image",
    fill ? "absolute inset-0 h-full w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      className={imgClassName || undefined}
      style={mergedStyle}
      width={fill ? undefined : typeof width === "number" ? width : undefined}
      height={fill ? undefined : typeof height === "number" ? height : undefined}
      loading="eager"
      decoding="async"
      {...rest}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
