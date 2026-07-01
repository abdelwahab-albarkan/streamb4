"use client";

import { useEffect } from "react";

/**
 * TawkChat — Loads the Tawk.to widget script.
 *
 * Uses ONLY officially documented Tawk.to JS API:
 *   https://developer.tawk.to/jsapi/
 *
 * onLoad fires when the widget has fully rendered and is ready for API calls.
 * All other interaction (maximize, setAttributes, addTags) is handled by
 * openTawkChat() in lib/hooks/useTawk.ts, called from Buy Now buttons.
 */
export default function TawkChat() {
  useEffect(() => {
    // Prevent double-loading
    if ((window as any).Tawk_API) {
      console.log("[Tawk] Widget already initialized — skipping load.");
      return;
    }

    console.log("[Tawk] Initializing Tawk_API object...");
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    // ── onLoad: fired once the widget has fully rendered ──────────────────
    // This is the correct hook for all post-load setup per official docs.
    (window as any).Tawk_API.onLoad = function () {
      console.log("[Tawk] ✅ onLoad fired — widget is ready.");
      console.log("[Tawk] Available API methods:", Object.keys((window as any).Tawk_API));
    };

    // ── Inject the Tawk.to embed script ───────────────────────────────────
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/6a403850bf47421d4a0ca885/1js5dnusa";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    s1.onload = () => console.log("[Tawk] Script tag loaded.");
    s1.onerror = () => console.log("[Tawk] ❌ Failed to load Tawk.to script.");

    s0.parentNode?.insertBefore(s1, s0);
    console.log("[Tawk] Script tag injected into DOM.");
  }, []);

  return null;
}
