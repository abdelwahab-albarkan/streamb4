"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { League_Spartan } from "next/font/google";
import { getPopularMovies, type TMDBMedia } from "@/lib/tmdb";
import {
  IconRocket,
  IconShield,
  IconTV,
  IconHeadphones,
  IconNoContract,
  IconDiamond,
} from "@/components/ui/PremiumIcons";
import Link from "next/link";

const spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["800", "900"],
  preload: false,
});

/* ============================================
   SVG FLAG COMPONENTS (HANDCRAFTED)
============================================ */

const FlagUSA = () => (
  <svg viewBox="0 0 20 14" className="w-4 h-2.5 rounded-sm flex-shrink-0">
    <rect width="20" height="14" fill="#B22234"/>
    <rect y="1.08" width="20" height="1.08" fill="white"/>
    <rect y="3.23" width="20" height="1.08" fill="white"/>
    <rect y="5.38" width="20" height="1.08" fill="white"/>
    <rect y="7.54" width="20" height="1.08" fill="white"/>
    <rect y="9.69" width="20" height="1.08" fill="white"/>
    <rect y="11.85" width="20" height="1.08" fill="white"/>
    <rect width="8" height="7.54" fill="#3C3B6E"/>
    {[0,1,2,3,4].map(row => (
      [0,1,2,3,4,5].map(col => (
        (row % 2 === 0 ? col < 6 : col < 5) && (
          <circle key={`${row}-${col}`}
            cx={col * 1.33 + (row % 2 === 0 ? 0.67 : 1.33)}
            cy={row * 1.5 + 0.75}
            r="0.4" fill="white"/>
        )
      ))
    ))}
  </svg>
);

const FlagCanada = () => (
  <svg viewBox="0 0 20 14" className="w-4 h-2.5 rounded-sm flex-shrink-0">
    <rect width="20" height="14" fill="white"/>
    <rect width="5" height="14" fill="#FF0000"/>
    <rect x="15" width="5" height="14" fill="#FF0000"/>
    <path d="M10 2l1 2.5h2.5l-2 1.5 1 3L10 7.5 7.5 9l1-3-2-1.5H9L10 2z" fill="#FF0000"/>
    <rect x="9.3" y="9" width="1.4" height="2.5" fill="#FF0000"/>
  </svg>
);

const FlagUK = () => (
  <svg viewBox="0 0 20 14" className="w-4 h-2.5 rounded-sm flex-shrink-0">
    <rect width="20" height="14" fill="#012169"/>
    <path d="M0 0l20 14M20 0L0 14" stroke="white" strokeWidth="3"/>
    <path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.5"/>
    <path d="M10 0v14M0 7h20" stroke="white" strokeWidth="4.5"/>
    <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.5"/>
  </svg>
);

const FlagEU = () => (
  <svg viewBox="0 0 20 14" className="w-4 h-2.5 rounded-sm flex-shrink-0">
    <rect width="20" height="14" fill="#003399"/>
    {Array.from({length: 12}).map((_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const cx = 10 + 4 * Math.cos(angle)
      const cy = 7 + 4 * Math.sin(angle)
      const tx = (cx/0.6 - cx).toFixed(4)
      const ty = (cy/0.6 - cy).toFixed(4)
      const pathD = `M${cx.toFixed(4)},${(cy-1.2).toFixed(4)} l0.4,1.2 1.2,0 -1,0.8 0.4,1.2 -1-0.8 -1,0.8 0.4-1.2 -1-0.8 1.2,0z`
      return (
        <path key={i}
          d={pathD}
          fill="#FFCC00"
          transform={`scale(0.6) translate(${tx}, ${ty})`}
        />
      )
    })}
  </svg>
);

interface CountryPillProps {
  flag: React.ReactNode;
  name: string;
}

function CountryPill({ flag, name }: CountryPillProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -1 }}
      transition={{ duration: 0.2 }}
      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-default backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,122,0,0.15)]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,122,0,0.25)",
        boxShadow: "0 0 10px rgba(255,122,0,0.05), inset 0 1px 0 rgba(255,255,255,0.05)"
      }}
    >
      <div className="rounded-sm overflow-hidden shadow-[0_0_5px_rgba(255,122,0,0.2)]">
        {flag}
      </div>
      <span className="text-gray-200 text-[11px] font-semibold tracking-wider uppercase select-none group-hover:text-orange-100 transition-colors">
        {name}
      </span>
    </motion.div>
  );
}

/* ============================================
   FEATURE CARD COMPONENT
============================================ */

interface FeatureCardProps {
  icon: React.ReactNode;
  number?: string;
  title: string;
  subtitle: string;
}

function FeatureCard({ icon, number, title, subtitle }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -1.5,
        borderColor: "rgba(255,122,0,0.25)",
        boxShadow: "0 0 25px rgba(255,122,0,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden flex items-center gap-3 p-3 rounded-[14px] transition-colors duration-300"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, #ff7a00, transparent)",
        }}
      />
      <div
        className="relative w-9 h-9 flex-shrink-0 rounded-[10px] flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,122,0,0.12), rgba(255,179,0,0.06))",
          border: "1px solid rgba(255,122,0,0.2)",
          boxShadow: "0 0 12px rgba(255,122,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="scale-75">{icon}</div>
      </div>
      <div>
        <p className="text-white font-black text-xs md:text-sm leading-none mb-0.5">
          {number && <span className="text-orange-400">{number} </span>}
          {title}
        </p>
        <p className="text-gray-500 text-[10px] md:text-xs leading-none">{subtitle}</p>
      </div>
    </motion.div>
  );
}

/* ============================================
   MAIN HERO COMPONENT
============================================ */

export function HeroSection() {
  const [movies, setMovies] = useState<TMDBMedia[]>([]);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const tvY = useTransform(scrollY, [0, 500], [0, -40]);

  useEffect(() => {
    async function loadHeroData() {
      try {
        const data = await getPopularMovies();
        setMovies(data.slice(0, 26));
      } catch (err) {
        console.error("Mockup fetch err", err);
      }
    }
    loadHeroData();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] pt-[72px] px-4 sm:px-6 lg:px-8 pb-24">
      {/* ============================================
         BACKGROUND SYSTEM
      ============================================ */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none select-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noisy" />
            <feColorMatrix type="linear" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,122,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,122,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orange glow behind TV mockup (RIGHT) */}
        <div
          className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.15] blur-[80px]"
          style={{
            background: "radial-gradient(circle, rgba(255,122,0,0.15) 0%, rgba(255,149,0,0.06) 45%, transparent 70%)",
          }}
        />

        <div
          className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px]"
          style={{
            background: "radial-gradient(circle, rgba(255,122,0,0.05), transparent 60%)",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-500/15 blur-[0.5px]"
              style={{
                top: `${15 + i * 8}%`,
                left: `${10 + (i * 17) % 80}%`,
                animation: `particleFloat ${4 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      {/* ============================================
         HERO LAYOUT
      ============================================ */}
      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-grow py-8 lg:py-16">

        {/* LEFT COLUMN */}
        <motion.div className="w-full max-w-[540px] mx-auto lg:mx-0 flex flex-col justify-center text-center lg:text-left" style={{ y: heroY, opacity: heroOpacity }}>
          {/* 1. Country Badges Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5 max-w-full"
          >
            <CountryPill flag={<FlagUSA />} name="USA" />
            <CountryPill flag={<FlagCanada />} name="CANADA" />
            <CountryPill flag={<FlagUK />} name="UK" />
            <CountryPill flag={<FlagEU />} name="EUROPE" />
          </motion.div>

          {/* 2. Headline */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h1
              className={`${spartan.className} uppercase leading-[0.92] font-black text-white`}
              style={{
                fontSize: "clamp(2.1rem, 6.5vw, 4.25rem)",
                letterSpacing: "clamp(-0.5px, -0.03em, -2px)"
              }}
            >
              <motion.span
                className="block text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                THE BEST IPTV
              </motion.span>
              <motion.span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #ff7a00 0%, #ff9500 50%, #ffb300 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 25px rgba(255,122,0,0.3))",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                SUBSCRIPTION
              </motion.span>
              <motion.span
                className="block text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                IN{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  USA & CANADA
                </span>
              </motion.span>
            </h1>
          </motion.div>

          {/* Orange Accent Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 60, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-[3px] mt-3 mb-5 rounded-full"
            style={{
              background: "linear-gradient(90deg, #ff7a00, #ffb300)",
              boxShadow: "0 0 15px rgba(255,122,0,0.5)",
            }}
          />

          {/* 3. Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-xs md:text-sm leading-[1.6] mb-6 max-w-[460px]"
          >
            Enjoy premium IPTV with lightning-fast servers,{" "}
            <span className="text-gray-200 font-semibold">zero buffering</span>,
            crystal-clear <span className="text-gray-200 font-semibold">4K streaming</span>{" "}
            and instant activation on every device.
          </motion.p>

          {/* 4. Feature Badges 2x2 Grid (Compact) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 w-full max-w-[500px] mx-auto lg:mx-0"
          >
            <FeatureCard
              icon={<IconTV />}
              number="50K+"
              title="Live Channels"
              subtitle="Every league & match"
            />
            <FeatureCard
              icon={<IconDiamond />}
              number="180K+"
              title="Movies & Series"
              subtitle="New titles weekly"
            />
            <FeatureCard
              icon={<IconShield />}
              title="4K Ultra HD"
              subtitle="HDR10+ quality"
            />
            <FeatureCard
              icon={<IconRocket />}
              title="Instant Setup"
              subtitle="Ready in 60 seconds"
            />
          </motion.div>

          {/* 5. CTA Buttons (Reduced spacing, compact buttons) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 mb-6 w-full"
          >
            <Link href="/free-trial" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-1.5 py-3.5 px-8 rounded-full font-black text-black text-xs md:text-sm uppercase tracking-wide cursor-pointer relative overflow-hidden select-none w-full"
                style={{
                  background: "linear-gradient(135deg, #ff7a00 0%, #ff9500 50%, #ffb300 100%)",
                  boxShadow: "0 0 25px rgba(255,122,0,0.3), 0 3px 10px rgba(255,122,0,0.2)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shimmer"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                  }}
                />
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                </svg>
                START FREE TRIAL
              </motion.div>
            </Link>

            <Link href="/pricing" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-1.5 py-3 px-7 rounded-full font-bold text-white text-xs md:text-sm uppercase tracking-wide cursor-pointer w-full"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                VIEW PLANS
                <span>→</span>
              </motion.div>
            </Link>
          </motion.div>

          {/* 6. Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-3"
          >
            {/* Real avatar photos */}
            <div className="flex -space-x-2.5">
              {[
                '/avatars/marcus.png',
                '/avatars/diana.png', 
                '/avatars/ahmed.png',
                '/avatars/jessica.png',
              ].map((src, i) => (
                <div key={i}
                  className="relative w-9 h-9 rounded-full 
                    overflow-hidden flex-shrink-0"
                  style={{
                    border: '2px solid #050505',
                    boxShadow: '0 0 8px rgba(255,122,0,0.2)'
                  }}>
                  <Image
                    src={src}
                    alt="Happy customer"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              
              {/* +50k badge */}
              <div className="w-9 h-9 rounded-full 
                flex items-center justify-center
                text-[9px] font-black text-black"
                style={{
                  background: 'linear-gradient(135deg,#ff7a00,#ffb300)',
                  border: '2px solid #050505'
                }}>
                50K+
              </div>
            </div>

            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="#ffb300"
                  >
                    <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1z" />
                  </motion.svg>
                ))}
              </div>
              <p className="text-gray-400 text-[11px] font-medium leading-none">
                <span className="text-white font-bold">50,000+</span> happy customers worldwide
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN - 3D TV MOCKUP (Fitted, aligned to top) */}
        <motion.div className="hidden lg:flex items-start justify-center relative w-full h-full self-start mt-0" style={{ y: tvY }}>
          {movies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="relative w-full max-w-[420px] z-10"
              style={{ perspective: "1400px" }}
            >
              {/* Floating side posters LEFT */}
              <div className="absolute -left-16 top-10 z-20 flex flex-col gap-2.5 pointer-events-none select-none">
                {movies.slice(18, 22).map((m, i) => (
                  <motion.div
                    key={m.id}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.25,
                    }}
                    className="w-[56px] rounded-lg overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.5)]"
                    style={{ opacity: 0.45 + i * 0.08 }}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                      alt=""
                      width={56}
                      height={84}
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                ))}
              </div>

              {/* MAIN TV BODY */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[20px] overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
                  border: "1.5px solid rgba(255,255,255,0.05)",
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.02),
                    0 40px 80px rgba(0,0,0,0.85),
                    0 20px 40px rgba(0,0,0,0.65),
                    0 0 60px rgba(255,122,0,0.06),
                    inset 0 1px 0 rgba(255,255,255,0.06)
                  `,
                }}
              >
                {/* Screen bezel top */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 select-none"
                  style={{
                    background: "#0a0a0a",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />

                  <div className="flex gap-3.5 ml-3">
                    {["LIVE TV", "MOVIES", "SERIES", "KIDS", "SPORTS"].map((t, i) => (
                      <span
                        key={t}
                        className={`text-[9px] font-bold tracking-wider pb-0.5 transition-colors cursor-pointer ${
                          i === 0
                            ? "text-[#ff7a00] border-b border-orange-500"
                            : "text-gray-500 hover:text-gray-400"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="ml-auto opacity-30">
                    <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8.5" cy="8.5" r="5.5" />
                      <path d="m13 13 3.5 3.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Movie grid */}
                <div className="grid grid-cols-4 gap-1.5 p-2" style={{ background: "#080808" }}>
                  {movies.slice(0, 8).map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.04 }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      className="relative rounded-lg overflow-hidden aspect-[2/3] cursor-pointer shadow-[0_3px_12px_rgba(0,0,0,0.5)] bg-[#141414]"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                        alt={m.title || m.name || "Movie Poster"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5 transition-opacity duration-200">
                        <p className="text-white text-[7px] font-bold line-clamp-2 leading-tight">
                          {m.title || m.name}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom category bar */}
                <div
                  className="grid grid-cols-4 border-t border-white/[0.03] select-none"
                  style={{ background: "#0a0a0a" }}
                >
                  {[
                    { name: "LIVE TV", sub: "50,000+ Ch" },
                    { name: "MOVIES", sub: "180,000+" },
                    { name: "SERIES", sub: "Top Rated" },
                    { name: "SPORTS", sub: "Live Matches" },
                  ].map((cat, i) => (
                    <div
                      key={cat.name}
                      className={`py-2 px-1 text-center border-r border-white/[0.03] last:border-r-0 ${
                        i === 0 ? "text-orange-400" : "text-gray-500"
                      } hover:text-gray-300 transition-colors cursor-pointer`}
                    >
                      <p className="text-[8px] font-black tracking-wider leading-none">{cat.name}</p>
                      <p className="text-[7px] text-gray-600 mt-0.5 leading-none">{cat.sub}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* TV STAND */}
              <div className="flex flex-col items-center select-none pointer-events-none">
                <div className="w-0.5 h-5 bg-gradient-to-b from-[#1a1a1a] to-[#111]" />
                <div className="w-28 h-1 rounded-full bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent" />
                <div
                  className="w-40 h-2.5 mt-0.5 rounded-full blur-lg opacity-15"
                  style={{ background: "radial-gradient(ellipse, #ff7a00, transparent)" }}
                />
              </div>

              {/* Floating posters RIGHT */}
              <div className="absolute -right-16 top-6 z-20 flex flex-col gap-2.5 pointer-events-none select-none">
                {movies.slice(22, 26).map((m, i) => (
                  <motion.div
                    key={m.id}
                    animate={{ y: [0, 5, 0] }}
                    transition={{
                      duration: 3.5 + i * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                    className="w-[56px] rounded-lg overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.5)]"
                    style={{ opacity: 0.3 + i * 0.1 }}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                      alt=""
                      width={56}
                      height={84}
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ============================================
         BOTTOM TRUST BAR (Sticky/fixed along bottom)
      ============================================ */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 w-full border-t border-white/[0.05] hidden md:block"
        style={{
          background: "rgba(5,5,5,0.85)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -1px 0 rgba(255,255,255,0.02)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
          {[
            { icon: <IconRocket />, title: "Instant Activation", sub: "Get started in seconds" },
            { icon: <IconShield />, title: "99.9% Uptime", sub: "Reliable & stable servers" },
            { icon: <IconTV />, title: "Works On All Devices", sub: "TV, Mobile, PC & more" },
            { icon: <IconHeadphones />, title: "24/7 Support", sub: "We're here anytime" },
            { icon: <IconNoContract />, title: "No Contracts", sub: "Cancel anytime" },
            { icon: <IconDiamond />, title: "Premium Streaming", sub: "4K UHD – No Buffering" },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 group cursor-pointer select-none"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,122,0,0.3)]"
                style={{
                  background: "rgba(255,122,0,0.08)",
                  border: "1px solid rgba(255,122,0,0.15)",
                }}
              >
                <div className="scale-[0.6]">{item.icon}</div>
              </div>

              <div>
                <p className="text-white font-bold text-[11px] leading-none">{item.title}</p>
                <p className="text-gray-500 text-[9px] mt-0.5 leading-none">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
