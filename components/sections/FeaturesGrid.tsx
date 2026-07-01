"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlowCard from "@/components/ui/GlowCard";
import FloatingElement from "@/components/ui/FloatingElement";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  Feature4K,
  FeatureNoBuffer,
  FeatureGlobe,
  FeatureNoLock,
  FeatureSupport,
  FeatureDevices,
} from "@/components/ui/icons";

const features = [
  {
    icon: <Feature4K />,
    title: "True 4K Ultra HD",
    desc: "HDR10+ on every supported channel. Picture quality that actually justifies your TV.",
  },
  {
    icon: <FeatureNoBuffer />,
    title: "Anti-Buffering Tech",
    desc: "26 dedicated edge servers with smart geo-routing across North America and Europe.",
  },
  {
    icon: <FeatureGlobe />,
    title: "Global Channel Library",
    desc: "50,000+ channels from 60+ countries. Sports, news, entertainment in every language.",
  },
  {
    icon: <FeatureNoLock />,
    title: "No IP Lock",
    desc: "Same login works from hotels in 12 countries. Travel free, stream anywhere.",
  },
  {
    icon: <FeatureSupport />,
    title: "24/7 Real Support",
    desc: "Human agents answer within minutes. Day or night, weekday or weekend.",
  },
  {
    icon: <FeatureDevices />,
    title: "Every Device Works",
    desc: "Fire TV, Smart TV, Android, iOS, MAG Box, Windows, Mac. One subscription.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative py-28 overflow-hidden bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal variant="fadeUp">
          <div className="text-center mb-20">
            <span className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-4 block select-none">
              WHY STREAMB4
            </span>
            <h2 className="font-anton text-white uppercase leading-tight" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}>
              BUILT FOR PEOPLE WHO{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CARE ABOUT QUALITY.
              </span>
            </h2>
          </div>
        </ScrollReveal>

        {/* 3x2 Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {features.map((feature, i) => (
            <motion.div key={feature.title} variants={staggerItem} className="h-full">
              <GlowCard
                className="relative p-7 rounded-[24px] overflow-hidden group cursor-default h-full"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {/* Hover glow corner */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at top right, rgba(255,122,0,0.12), transparent)",
                  }}
                />

                {/* Icon */}
                <div className="mb-6">
                  <FloatingElement duration={3} delay={i * 0.5} distance={6}>
                    {feature.icon}
                  </FloatingElement>
                </div>

                {/* Title */}
                <h3 className="text-white font-black text-xl mb-3 group-hover:text-orange-50 transition-colors">
                  {feature.title}
                </h3>

                {/* Desc */}
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  {feature.desc}
                </p>

                {/* Bottom gradient line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.4), transparent)",
                  }}
                />
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
