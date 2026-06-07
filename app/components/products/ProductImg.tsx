"use client";

import { useCallback } from "react";
import ProductImage from "@/app/components/products/ProductImage";
import { getProductImage } from "@/lib/image-utils";

interface ProductImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null | undefined;
  alt?: string;
}

export default function ProductImg({ src, alt, className, onError, ...rest }: ProductImgProps) {
  const resolved = getProductImage(src);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      (e.target as HTMLImageElement).src = "/products/default.webp";
      onError?.(e);
    },
    [onError],
  );

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
