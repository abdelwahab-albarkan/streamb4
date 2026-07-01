"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

// ─── ICONS ─────────────────────
// ICONS
import {
  FeatureMoney,
  FeatureWhatsApp,
  FeatureLightning,
  FeatureShield,
  FeatureDevices,
  FeatureSupport,
  FeatureFile,
  FeatureDiamond
} from "@/components/ui/icons";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Choose Your Plan",
    desc: "Select the subscription that fits your needs. Monthly, quarterly or yearly — from $15/month.",
    icon: <FeatureMoney />,
    phone: "iPhone-14-PRO- (2).png",
  },
  {
    number: "02",
    title: "Chat on WhatsApp",
    desc: "Our team confirms your order and provides secure payment instructions instantly.",
    icon: <FeatureWhatsApp />,
    phone: "iPhone-14-PRO- (3).png",
  },
  {
    number: "03",
    title: "Start Streaming",
    desc: "Receive your credentials immediately after payment and start watching within minutes.",
    icon: <FeatureLightning />,
    phone: "iPhone-14-PRO- (4).png",
  },
];

const bottomFeatures = [
  { icon: <FeatureLightning />, title: "Instant Activation", sub: "Get started in seconds" },
  { icon: <FeatureShield />, title: "99.99% Uptime", sub: "Reliable & stable servers" },
  { icon: <FeatureDevices />, title: "Works On All Devices", sub: "TV, Mobile, PC & more" },
  { icon: <FeatureSupport />, title: "24/7 Customer Support", sub: "We're here anytime" },
  { icon: <FeatureFile />, title: "No Contracts", sub: "Cancel anytime" },
  { icon: <FeatureDiamond />, title: "Premium Streaming", sub: "4K Â· HDR Â· No Buffering" },
];
// (phone screen components removed — using real iPhone images)

// ─── ARROW CONNECTOR ───────────────────────────────────────────────────────────

function ArrowConnector() {
  return (
    <div className="flex items-center gap-1">
      <div
        className="w-16 h-px"
        style={{
          background: "linear-gradient(90deg, rgba(255,138,0,0.5), rgba(255,179,0,0.3))",
          maskImage: "repeating-linear-gradient(90deg, black 0px, black 4px, transparent 4px, transparent 8px)",
          WebkitMaskImage: "repeating-linear-gradient(90deg, black 0px, black 4px, transparent 4px, transparent 8px)",
        }}
      />
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="hiw-arrowG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff8a00" />
            <stop offset="100%" stopColor="#ffb347" />
          </linearGradient>
        </defs>
        <path d="M5 12h14M13 6l6 6-6 6"
          stroke="url(#hiw-arrowG)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── STEP CARD ─────────────────────────────────────────────────────────────────

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      className="relative flex flex-col"
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,138,0,0.1), transparent 70%)",
          filter: "blur(18px)",
          transform: "scale(1.06)",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Card */}
      <div
        className="relative rounded-[28px] p-7 flex flex-col h-full overflow-hidden transition-all duration-300"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
          border: hovered ? "1px solid rgba(255,138,0,0.25)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,138,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Top edge shimmer */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-all duration-500"
          style={{
            background: hovered
              ? "linear-gradient(90deg, transparent, rgba(255,138,0,0.4), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />

        {/* Corner ambient */}
        <div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at top right, rgba(255,138,0,0.08), transparent 60%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* ── Phone image ── */}
        <div className="relative flex justify-center mb-7">
          {/* Ambient glow behind phone */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none -z-10"
            style={{
              width: 192,
              height: 64,
              background: "radial-gradient(ellipse, rgba(255,138,0,0.3), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Floating iPhone */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
            whileHover={{ y: -14, transition: { duration: 0.4 } }}
            className="relative"
          >
            <Image
              src={`/devices/${step.phone}`}
              alt={`StreamB4 ${step.title} on iPhone`}
              width={160}
              height={320}
              className="object-contain relative z-10 w-[130px] lg:w-[160px]"
              style={{
                height: 'auto',
                filter:
                  "drop-shadow(0 20px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(255,138,0,0.15))",
              }}
            />

            {/* Bottom orange glow */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              style={{
                width: 96,
                height: 12,
                background: "radial-gradient(ellipse, rgba(255,138,0,0.5), transparent)",
                filter: "blur(8px)",
              }}
            />

            {/* Sharp floor line */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px rounded-full"
              style={{
                width: 64,
                background: "linear-gradient(90deg, transparent, #ff8a00, transparent)",
                opacity: 0.7,
              }}
            />
          </motion.div>
        </div>

        {/* ── Number + icon ── */}
        <div className="flex items-center gap-4 mb-4">
          {/* Step number */}
          <div className="relative w-11 h-11 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full opacity-55"
              style={{
                background: "linear-gradient(135deg, #ff8a00, #ffb347)",
                filter: "blur(10px)",
              }}
            />
            <div
              className="relative w-full h-full rounded-full flex items-center justify-center font-black text-black text-[15px]"
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                background: "linear-gradient(135deg, #ff8a00, #ffb347)",
                boxShadow: "0 0 16px rgba(255,138,0,0.36)",
              }}
            >
              {step.number}
            </div>
          </div>

          {/* Icon badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(255,138,0,0.12), rgba(255,179,0,0.06))",
              border: "1px solid rgba(255,138,0,0.2)",
              boxShadow: hovered ? "0 0 20px rgba(255,138,0,0.28)" : "none",
            }}
          >
            {step.icon}
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-anton text-2xl xl:text-[28px] uppercase tracking-tight mb-3 transition-colors duration-200"
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            color: hovered ? "rgb(255,243,230)" : "#ffffff",
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-[14px] leading-relaxed">
          {step.desc}
        </p>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-5 right-5 h-px rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,138,0,0.4), transparent)",
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── SECTION ───────────────────────────────────────────────────────────────────

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-32 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* ── Background ── */}

      {/* Noise */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.022] pointer-events-none" aria-hidden="true">
        <filter id="hiw-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hiw-noise)" />
      </svg>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,122,0,0.027) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,122,0,0.027) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Left glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: 0, transform: "translateY(-50%)",
          width: 520, height: 520,
          background: "radial-gradient(circle, rgba(255,138,0,0.07), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Right glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", right: 0, transform: "translateY(-50%)",
          width: 520, height: 520,
          background: "radial-gradient(circle, rgba(255,138,0,0.05), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Fades */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div
            className="h-px w-16 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,138,0,0.4))" }}
          />
          <span
            className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full"
            style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            HOW IT WORKS
          </span>
          <div
            className="h-px w-16 rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(255,138,0,0.4), transparent)" }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="text-center font-anton uppercase leading-[0.88] tracking-tight mb-5"
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "clamp(46px, 7.5vw, 96px)",
          }}
        >
          <span className="text-white">GET STARTED IN </span>
          <span
            style={{
              background: "linear-gradient(135deg, #ff8a00, #ffb347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 28px rgba(255,138,0,0.36))",
            }}
          >
            3 SIMPLE STEPS.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
          className="text-center text-gray-500 text-lg mb-20"
        >
          Subscribe, activate your account, and start watching in just a few minutes.
        </motion.p>

        {/* ── Cards + arrows ── */}
        <div className="relative mb-12">

          {/* Arrow 1→2 */}
          <div
            className="absolute z-20 hidden lg:flex items-center"
            style={{ top: 192, left: "calc(33.333% - 28px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            >
              <ArrowConnector />
            </motion.div>
          </div>

          {/* Arrow 2→3 */}
          <div
            className="absolute z-20 hidden lg:flex items-center"
            style={{ top: 192, left: "calc(66.666% - 28px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            >
              <ArrowConnector />
            </motion.div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* ── Bottom features strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="rounded-[20px] px-4 py-4 md:px-8 md:py-5"
          style={{
            background: "rgba(15,15,15,0.8)",
            border: "1px solid rgba(255,138,0,0.1)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-orange-500/10">
            {bottomFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-2 md:gap-3 px-2.5 py-2.5 md:px-6 md:py-3 lg:py-0 md:first:pl-0 md:last:pr-0"
              >
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden md:overflow-visible transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,138,0,0.35)]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,138,0,0.13), rgba(255,179,0,0.07))",
                    border: "1px solid rgba(255,138,0,0.22)",
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-[10px] md:text-sm leading-tight md:leading-none mb-0.5 md:mb-1 group-hover:text-orange-100 transition-colors duration-200">
                    {feature.title}
                  </p>
                  <p className="text-[#bdbdbd] text-[9px] md:text-xs">{feature.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
