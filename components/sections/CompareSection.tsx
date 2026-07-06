"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import {
  FeatureMoney,
  FeatureLiveTV,
  Feature4K,
  FeatureMovies,
  FeatureSports,
  FeatureGlobe,
  FeatureFile,
  FeatureDevices,
  FeatureLightning,
  FeatureSupport,
  FeatureNoLock
} from "@/components/ui/icons";

const rows = [
  {
    icon: <FeatureMoney size="sm" />,
    feature: "Monthly Cost",
    streamb4: "From $15/month",
    cable: "$100-$150+/month",
  },
  {
    icon: <FeatureLiveTV size="sm" />,
    feature: "Live Channels",
    streamb4: "50,000+ channels",
    cable: "200-500 channels",
  },
  {
    icon: <Feature4K size="sm" />,
    feature: "4K Ultra HD",
    streamb4: "Included - free",
    cable: "Extra monthly charge",
  },
  {
    icon: <FeatureMovies size="sm" />,
    feature: "VOD Library",
    streamb4: "180,000+ titles",
    cable: "Very limited",
  },
  {
    icon: <FeatureSports size="sm" />,
    feature: "Sports Channels",
    streamb4: "1,800+ channels",
    cable: "Basic packages only",
  },
  {
    icon: <FeatureGlobe size="sm" />,
    feature: "International",
    streamb4: "60+ countries",
    cable: "Very limited",
  },
  {
    icon: <FeatureFile size="sm" />,
    feature: "Contracts",
    streamb4: "No contracts - ever",
    cable: "12-24 month lock-in",
  },
  {
    icon: <FeatureDevices size="sm" />,
    feature: "Device Support",
    streamb4: "All devices - free",
    cable: "Limited + extra fees",
  },
  {
    icon: <FeatureLightning size="sm" />,
    feature: "Activation",
    streamb4: "Instant - 60 seconds",
    cable: "Technician visit needed",
  },
  {
    icon: <FeatureSupport size="sm" />,
    feature: "24/7 Support",
    streamb4: "Real humans - always",
    cable: "Call center queues",
  },
  {
    icon: <FeatureNoLock size="sm" />,
    feature: "Works Abroad",
    streamb4: "No IP lock - anywhere",
    cable: "Region locked",
  },
];

// ─── CHECKMARK / RED X BADGES ──────────────────────────────────────────────────

function CheckCircle() {
  return (
    <div
      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #ff8a00, #ffb347)",
        boxShadow: "0 0 10px rgba(255,138,0,0.35)",
      }}
    >
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function XCircle() {
  return (
    <div
      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{
        background: "rgba(255,50,50,0.1)",
        border: "1px solid rgba(255,50,50,0.22)",
      }}
    >
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="3" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </div>
  );
}

// ─── COMPARE ROW ───────────────────────────────────────────────────────────────

function CompareRow({
  row,
  index,
  isLast,
}: {
  row: (typeof rows)[0];
  index: number;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  const rowBg = isEven ? "rgba(10,10,10,0.95)" : "rgba(8,8,8,0.98)";

  const streamBg = isEven
    ? "linear-gradient(145deg, rgba(255,122,0,0.05), rgba(10,10,10,0.98))"
    : "linear-gradient(145deg, rgba(255,122,0,0.04), rgba(8,8,8,1))";

  return (
    <>
      {/* Feature cell */}
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="group flex items-center gap-4 px-8 py-5 transition-all duration-200"
        style={{
          background: hovered ? "rgba(255,255,255,0.02)" : rowBg,
          borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {row.icon}
        <span className="text-gray-400 text-sm font-semibold group-hover:text-gray-200 transition-colors duration-200">
          {row.feature}
        </span>
      </motion.div>

      {/* StreamB4 cell */}
      <div
        className="flex items-center gap-3 px-8 py-5"
        style={{
          background: streamBg,
          borderLeft: "1px solid rgba(255,138,0,0.12)",
          borderRight: "1px solid rgba(255,138,0,0.12)",
          borderBottom: isLast ? "none" : "1px solid rgba(255,138,0,0.08)",
        }}
      >
        <CheckCircle />
        <span className="text-white text-sm font-semibold">{row.streamb4}</span>
      </div>

      {/* Cable TV cell */}
      <div
        className="flex items-center gap-3 px-8 py-5"
        style={{
          background: rowBg,
          borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <XCircle />
        <span className="text-gray-500 text-sm">{row.cable}</span>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function CompareSection() {
  return (
    <section
      id="comparison"
      className="relative py-32 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Background SVG Noise */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.022] pointer-events-none" aria-hidden="true">
        <filter id="noise-cmp">
          <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-cmp)" />
      </svg>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,122,0,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,122,0,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Center radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 800, height: 600,
          background: "radial-gradient(ellipse, rgba(255,138,0,0.06) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Fades */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Eyebrow ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div
            className="h-px w-16"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,138,0,0.4))" }}
          />
          <span
            className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full"
            style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            COMPARISON
          </span>
          <div
            className="h-px w-16"
            style={{ background: "linear-gradient(90deg, rgba(255,138,0,0.4), transparent)" }}
          />
        </motion.div>

        {/* ── Headline ── */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="text-center font-anton uppercase leading-[0.92] tracking-tight mb-5 text-white"
          style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)" }}
        >
          WHY{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #ff8a00, #ffb347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(255,138,0,0.36))",
            }}
          >
            STREAMB4
          </span>{" "}
          IS{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #ff8a00, #ffb347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BETTER
          </span>{" "}
          THAN CABLE.
        </motion.h2>

        {/* ── Subtitle ── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
          className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-16"
        >
          Compare features side-by-side and discover why thousands of users choose StreamB4 for premium entertainment.
        </motion.p>

        {/* ── Table (Desktop) ── */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 66% 50%, rgba(255,138,0,0.06) 0%, transparent 60%)",
                filter: "blur(30px)",
              }}
            />

            <div
              className="grid grid-cols-[1fr_1.1fr_1fr] gap-0 rounded-[28px] overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              }}
            >
              {/* Row headers */}
              <div
                className="px-8 py-6 flex items-end"
                style={{
                  background: "rgba(10,10,10,0.95)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-gray-600 text-xs font-bold tracking-[0.2em] uppercase">FEATURES</p>
              </div>

              <div
                className="relative px-8 py-6 flex flex-col gap-2"
                style={{
                  background: "linear-gradient(145deg, rgba(255,138,0,0.08) 0%, rgba(10,10,10,0.98) 60%)",
                  borderLeft: "1px solid rgba(255,138,0,0.2)",
                  borderRight: "1px solid rgba(255,138,0,0.2)",
                  borderBottom: "1px solid rgba(255,138,0,0.15)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#ff8a00,#ffb347,transparent)" }} />
                <div className="flex items-center gap-2 w-fit">
                  <div
                    style={{
                      background: "linear-gradient(135deg,#ff8a00,#ffb347)",
                      boxShadow: "0 0 20px rgba(255,138,0,0.35)",
                    }}
                    className="px-3 py-1 rounded-full text-[10px] font-black text-black tracking-wider uppercase"
                  >
                    <span className="flex items-center gap-1">
                      <Star size={10} strokeWidth={2} fill="currentColor" />
                      BEST VALUE
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-black text-xl text-white tracking-tight leading-none">
                    STREAM<span style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>B4</span>
                  </p>
                  <p className="text-gray-600 text-xs mt-1">Premium Streaming · From $15/mo</p>
                </div>
              </div>

              <div
                className="px-8 py-6 flex flex-col justify-end gap-1"
                style={{
                  background: "rgba(10,10,10,0.95)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="font-bold text-xl text-gray-600 tracking-tight leading-none">Cable TV</p>
                <p className="text-gray-700 text-xs">Traditional · $100–150/mo</p>
              </div>

              {/* Rows */}
              {rows.map((row, i) => (
                <CompareRow key={row.feature} row={row} index={i} isLast={i === rows.length - 1} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Cards (Mobile/Tablet) ── */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* StreamB4 Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-[24px] p-6"
            style={{
              background: "linear-gradient(145deg,rgba(255,122,0,0.08),rgba(5,5,5,0.98))",
              border: "1px solid rgba(255,138,0,0.25)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <h3 className="font-black text-2xl text-white tracking-tight mb-4">
              STREAM<span style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>B4</span>
            </h3>
            <div className="divide-y divide-white/[0.04]">
              {rows.map((r) => (
                <div key={r.feature} className="flex gap-3 py-3 items-center">
                  <CheckCircle />
                  <div>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">{r.feature}</p>
                    <p className="text-white text-sm font-semibold">{r.streamb4}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cable TV Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="rounded-[24px] p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            <h3 className="font-bold text-2xl text-gray-500 tracking-tight mb-4">Cable TV</h3>
            <div className="divide-y divide-white/[0.04]">
              {rows.map((r) => (
                <div key={r.feature} className="flex gap-3 py-3 items-center">
                  <XCircle />
                  <div>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">{r.feature}</p>
                    <p className="text-gray-400 text-sm">{r.cable}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 mt-14"
        >
          <p className="text-gray-600 text-sm text-center">
            Join thousands of cord-cutters who already made the switch.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-black text-black text-xs uppercase tracking-[0.12em] cursor-pointer"
                style={{
                  background: "linear-gradient(135deg,#ff8a00,#ffb347)",
                  boxShadow: "0 0 30px rgba(255,138,0,0.35)",
                }}
              >
                ⚡ VIEW PRICING
              </motion.div>
            </Link>

            <Link href="/pricing">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="px-8 py-4 rounded-full font-bold text-white text-xs uppercase tracking-[0.12em] cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                VIEW PLANS →
              </motion.div>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

