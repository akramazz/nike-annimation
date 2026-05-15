"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const PIXEL_ID = "517991158551582";
const FB_SCRIPT = "https://connect.facebook.net/en_US/fbevents.js";

let pixelInitialized = false;

function loadFbqScript(): void {
  if (typeof window === "undefined" || window.fbq) return;

  const fbq = function (...args: unknown[]) {
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
  } as FacebookPixel;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = FB_SCRIPT;

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    (document.head || document.documentElement).appendChild(script);
  }
}

export default function MetaPixelClient() {
  const pathname = usePathname();
  const loggedRef = useRef(false);

  useEffect(() => {
    loadFbqScript();

    const fbq = window.fbq;
    if (!fbq) return;

    if (!pixelInitialized) {
      fbq("init", PIXEL_ID);
      pixelInitialized = true;

      if (!loggedRef.current) {
        console.log("META PIXEL LOADED");
        console.log("FBQ STATUS:", window.fbq);
        loggedRef.current = true;
      }
    }

    fbq("track", "PageView");
  }, [pathname]);

  return null;
}
