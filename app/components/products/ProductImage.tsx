"use client";

import { useState, useCallback } from "react";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/image-utils";

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
}

export default function ProductImage({
  src: rawSrc,
  alt = "",
  width,
  height,
  className,
  onError,
  ...rest
}: ProductImageProps) {
  const resolved = getProductImage(rawSrc);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setFailed(true);
      onError?.(e);
    },
    [onError],
  );

  const finalSrc = failed ? DEFAULT_PRODUCT_IMAGE : resolved;

  const style: React.CSSProperties = {};
  if (typeof width === "number" && typeof height === "number") {
    style.width = `${width}px`;
    style.height = `${height}px`;
  }

  const imgClassName = [
    "product-image",
    typeof className === "string" ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={imgClassName || undefined}
      style={Object.keys(style).length > 0 ? style : undefined}
      {...rest}
      onError={handleError}
    />
  );
}

