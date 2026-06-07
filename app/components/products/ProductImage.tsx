"use client";

import { useState, useCallback } from "react";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/image-utils";

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null | undefined;
  alt?: string;
}

export default function ProductImage({
  src: rawSrc,
  alt = "",
  className,
  onError,
  width,
  height,
  style,
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

  const mergedStyle: React.CSSProperties = { ...style };
  if (typeof width === "number") mergedStyle.width = `${width}px`;
  if (typeof height === "number") mergedStyle.height = `${height}px`;

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
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      {...rest}
      onError={handleError}
    />
  );
}

