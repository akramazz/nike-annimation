"use client";

import { useEffect } from "react";

export default function MetaPixelInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("init", "1668719870942213");
      window.fbq("track", "PageView");
    }
  }, []);

  return null;
}
