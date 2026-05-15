"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function MetaPixelClient() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fbq = window.fbq;
    if (!fbq) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log("META PIXEL LOADED");
      console.log("FBQ STATUS:", window.fbq);
      return;
    }

    fbq("track", "PageView");
  }, [pathname]);

  return null;
}
