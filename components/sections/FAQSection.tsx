"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

const faqs = [
  {
    q: "Is STREAMB4 legal in the USA and Canada?",
    a: "STREAMB4 operates as a licensed streaming service utilizing global CDN edge-caching delivery grids. We do not host illegal streams and operate under standard digital distribution compliance frameworks.",
  },
  {
    q: "How fast is account activation?",
    a: "Instant. Your account is fully provisioned and activated within 60 seconds of checkout. An email containing login credentials, M3U playlists, and install guides is dispatched automatically.",
  },
  {
    q: "Do I need a VPN?",
    a: "No VPN is required. Our servers use direct routing over HTTPS protocols that bypass ISP throttling. If you prefer to use one, we fully support all major VPN providers with no connection issues.",
  },
  {
    q: "What's the minimum internet speed?",
    a: "We recommend at least 10 Mbps for stable High Definition (HD) streams, and 25 Mbps or higher for uninterrupted 4K Ultra HD HDR content delivery.",
  },
  {
    q: "Can I use on multiple devices?",
    a: "Yes. Depending on your active subscription plan connection tier, you can run from 1 up to 6 devices simultaneously on any network layout without IP restrictions.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major cryptocurrencies (Bitcoin, USDT, Ethereum) for instant secure checkouts, as well as credit/debit options routed through our G2G marketplace gateways.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative py-28 overflow-hidden bg-[#050505]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal variant="fadeUp">
          <div className="text-center mb-16">
            <span className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-4 block select-none">
              FAQ
            </span>
            <h2 className="font-anton text-white uppercase leading-tight" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}>
              EVERYTHING YOU <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                WANTED TO ASK.
              </span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Accordion Layout */}
        <div className="divide-y divide-white/[0.05]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <div key={i} className="border-b border-white/[0.05]">
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex items-center justify-between py-6 text-left group cursor-pointer"
                >
                  <span
                    className={`font-bold text-[16px] md:text-lg transition-colors duration-200 ${
                      isOpen ? "text-[#ff7a00]" : "text-white group-hover:text-orange-200"
                    }`}
                  >
                    {faq.q}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-200"
                    style={
                      isOpen
                        ? {
                            background: "rgba(255,122,0,0.15)",
                            borderColor: "rgba(255,122,0,0.4)",
                            boxShadow: "0 0 15px rgba(255,122,0,0.2)",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.08)",
                          }
                    }
                  >
                    <svg
                      className="w-4 h-4 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 text-[15px] leading-relaxed pb-6 max-w-3xl">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
