"use client";

import React from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlowCard from "@/components/ui/GlowCard";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { number: 50000, suffix: "+", label: "Live Channels", sub: "From 60+ countries" },
  { number: 180000, suffix: "+", label: "Movies & Series", sub: "New titles weekly" },
  { number: 1800, suffix: "+", label: "Sports Channels", sub: "Every major league" },
  { number: 40, suffix: "+", label: "Languages", sub: "Global coverage" },
];

export function LibraryStats() {
  return (
    <ScrollReveal delay={0.1} variant="fadeIn">
      <section className="relative py-24 border-y border-orange-500/10 overflow-hidden bg-[#050505]">
        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div
            className="w-[600px] h-[200px] opacity-10"
            style={{
              background: "radial-gradient(ellipse, #ff7a00, transparent)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-orange-500/10">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} variant="fadeUp" className="h-full">
                <GlowCard className="px-6 py-8 text-center group h-full">
                  {/* Number */}
                  <div
                    className="font-anton leading-none mb-3 group-hover:drop-shadow-[0_0_20px_rgba(255,122,0,0.5)] transition-all duration-300"
                    style={{
                      fontSize: "clamp(2.5rem, 7vw, 5rem)",
                      fontFamily: "var(--font-anton), Anton, sans-serif",
                      background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <CountUp target={stat.number} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-white font-bold text-lg mb-1">{stat.label}</p>

                  {/* Sub */}
                  <p className="text-gray-500 text-sm">{stat.sub}</p>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
