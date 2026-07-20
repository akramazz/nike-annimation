"use client";

import { useState, useCallback } from "react";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/image-utils";

interface ProductImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  src?: string | null | undefined;
  alt?: string;
  /** Comme next/image : remplit le parent `relative` */
  fill?: boolean;
  sizes?: string;
  onLoadingComplete?: () => void;
}

export default function ProductImage({
  src: rawSrc,
  alt = "",
  className,
  onError,
  onLoad,
  width,
  height,
  style,
  fill = false,
  sizes: _sizes,
  onLoadingComplete,
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

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      onLoadingComplete?.();
      onLoad?.(e);
    },
    [onLoad, onLoadingComplete],
  );

  const finalSrc = failed ? DEFAULT_PRODUCT_IMAGE : resolved;

  const mergedStyle: React.CSSProperties = { ...style };
  if (!fill) {
    if (typeof width === "number") mergedStyle.width = `${width}px`;
    if (typeof height === "number") mergedStyle.height = `${height}px`;
  }

  const imgClassName = [
    "product-image",
    fill ? "absolute inset-0 h-full w-full" : "",
    typeof className === "string" ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      className={imgClassName || undefined}
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      {...rest}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
