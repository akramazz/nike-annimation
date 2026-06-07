"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { getProductImage } from "@/lib/image-utils";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/image-utils";

export default function ProductImage(props: React.ComponentProps<typeof Image>) {
  const { src, alt, onError, ...rest } = props;
  const resolved = getProductImage(src);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setFailed(true);
      onError?.(e);
    },
    [onError],
  );

  const finalSrc = failed || resolved === src ? DEFAULT_PRODUCT_IMAGE : resolved;

  const isOptimized = !(
    finalSrc.startsWith("http://") ||
    finalSrc.startsWith("https://")
  );

  return (
    <Image
      src={finalSrc}
      alt={alt}
      {...rest}
      unoptimized={!isOptimized}
      onError={handleError}
    />
  );
}
