"use client";

import React from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AmbientGlow from "@/components/ui/AmbientGlow";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden bg-[#050505]">
      {/* Background radial gradient layers */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,122,0,0.08) 0%, rgba(5,5,5,1) 50%, rgba(255,179,0,0.05) 100%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none select-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,122,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <AmbientGlow position="center" opacity={0.1} />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-8">
        {/* Subtitle pill tag */}
        <ScrollReveal delay={0.1}>
          <span className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-6 block select-none">
            #1 PREMIUM IPTV IN 2026
          </span>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.2}>
          <h2 className="font-anton text-white uppercase leading-[0.92] tracking-tight mb-6" style={{ fontSize: "clamp(2rem, 7vw, 5rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}>
            READY TO SWITCH? <br />
            <span
              style={{
                background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TRY FREE.
            </span>
          </h2>
        </ScrollReveal>

        {/* Description text */}
        <ScrollReveal delay={0.3}>
          <p className="text-gray-400 text-lg mb-10">
            No contracts · Cancel anytime · Setup in 5 minutes · Instant access
          </p>
        </ScrollReveal>

        {/* CTA Buttons */}
        <ScrollReveal delay={0.4}>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Primary Button */}
            <Link href="/pricing">
              <MagneticButton
                className="px-10 py-5 rounded-full font-black text-black text-lg uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_60px_rgba(255,122,0,0.6)] transition-all duration-300 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                  boxShadow: "0 0 40px rgba(255,122,0,0.4)",
                }}
              >
                ⚡ VIEW PRICING PLANS
              </MagneticButton>
            </Link>

            {/* Secondary Button */}
            <Link href="/pricing">
              <MagneticButton
                className="px-10 py-5 rounded-full font-bold text-white text-lg uppercase tracking-wide border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:scale-105 transition-all duration-300 cursor-pointer">
                COMPARE PLANS →
              </MagneticButton>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
