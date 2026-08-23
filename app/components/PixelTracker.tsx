"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/facebookPixel";

export default function PixelTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pageview();
  }, [pathname]);

  return null;
}
