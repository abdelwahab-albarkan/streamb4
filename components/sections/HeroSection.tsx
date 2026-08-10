"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
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

// Framer Motion (and TMDB poster images) only needed on desktop — lazy load
// so the full framer-motion bundle is never shipped to mobile visitors.
const HeroDesktopMockup = dynamic(
  () => import("@/components/sections/HeroDesktopMockup"),
  { ssr: false }
);

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
    <div
      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-default backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,122,0,0.15)] hover:scale-105"
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
    </div>
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
    <div
      className="relative overflow-hidden flex items-center gap-3 p-3 rounded-[14px] transition-all duration-200 hover:border-[rgba(255,122,0,0.25)] hover:shadow-[0_0_25px_rgba(255,122,0,0.05)]"
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
    </div>
  );
}

/* ============================================
   MAIN HERO COMPONENT
============================================ */

export function HeroSection({ initialMovies = [] }: { initialMovies?: TMDBMedia[] }) {
  const [movies, setMovies] = useState<TMDBMedia[]>(initialMovies.slice(0, 26));
  // isDesktop gates the TV mockup — only rendered on large screens to avoid
  // shipping Framer Motion + TMDB image requests to mobile
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    if (initialMovies.length === 0) {
      async function loadHeroData() {
        try {
          const data = await getPopularMovies();
          setMovies(data.slice(0, 26));
        } catch (err) {
          console.error("Mockup fetch err", err);
        }
      }
      loadHeroData();
    }
  }, [initialMovies]);

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
        <div className="w-full max-w-[540px] mx-auto lg:mx-0 flex flex-col justify-center text-center lg:text-left">
          {/* 1. Country Badges Row */}
          <div
            style={{ animation: "fadeInPage 0.4s ease-out 0.05s both" }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5 max-w-full"
          >
            <CountryPill flag={<FlagUSA />} name="USA" />
            <CountryPill flag={<FlagCanada />} name="CANADA" />
            <CountryPill flag={<FlagUK />} name="UK" />
            <CountryPill flag={<FlagEU />} name="EUROPE" />
          </div>

          {/* 2. Headline */}
          <div>
            <h1
              className="font-spartan uppercase leading-[0.92] font-black text-white"
              style={{
                fontSize: "clamp(2.1rem, 6.5vw, 4.25rem)",
                letterSpacing: "clamp(-0.5px, -0.03em, -2px)"
              }}
            >
              <span className="block text-white animate-slide-in-1">
                THE BEST IPTV
              </span>
              <span
                className="block animate-slide-in-2"
                style={{
                  background: "linear-gradient(90deg, #ff7a00 0%, #ff9500 50%, #ffb300 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 25px rgba(255,122,0,0.3))",
                }}
              >
                SUBSCRIPTION
              </span>
              <span className="block text-white animate-slide-in-3">
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
              </span>
            </h1>
          </div>

          {/* Orange Accent Line */}
          <div
            style={{
              animation: "fadeInPage 0.5s ease-out 0.3s both",
              background: "linear-gradient(90deg, #ff7a00, #ffb300)",
              boxShadow: "0 0 15px rgba(255,122,0,0.5)",
            }}
            className="h-[3px] mt-3 mb-5 rounded-full"
          />

          {/* 3. Description */}
          <p
            style={{ animation: "fadeInPage 0.4s ease-out 0.2s both" }}
            className="text-gray-400 text-xs md:text-sm leading-[1.6] mb-6 max-w-[460px]"
          >
            Enjoy premium IPTV with lightning-fast servers,{" "}
            <span className="text-gray-200 font-semibold">zero buffering</span>,
            crystal-clear <span className="text-gray-200 font-semibold">4K streaming</span>{" "}
            and instant activation on every device.
          </p>

          {/* 4. Feature Badges 2x2 Grid (Compact) */}
          <div
            style={{ animation: "fadeInPage 0.4s ease-out 0.25s both" }}
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
          </div>

          {/* 5. CTA Buttons (Reduced spacing, compact buttons) */}
          <div
            style={{ animation: "fadeInPage 0.4s ease-out 0.3s both" }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 mb-6 w-full"
          >
            <Link href="/pricing" className="w-full sm:w-auto">
              <div
                className="flex items-center justify-center gap-1.5 py-3.5 px-8 rounded-full font-black text-black text-xs md:text-sm uppercase tracking-wide cursor-pointer relative overflow-hidden select-none w-full hover:scale-[1.03] hover:-translate-y-px active:scale-[0.98] transition-transform duration-200"
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
                VIEW PRICING
              </div>
            </Link>

            <Link href="/pricing" className="w-full sm:w-auto">
              <div
                className="flex items-center justify-center gap-1.5 py-3 px-7 rounded-full font-bold text-white text-xs md:text-sm uppercase tracking-wide cursor-pointer w-full hover:scale-[1.03] hover:-translate-y-px active:scale-[0.98] transition-transform duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                VIEW PLANS
                <span>→</span>
              </div>
            </Link>
          </div>

          {/* 6. Social Proof */}
          <div
            style={{ animation: "fadeInPage 0.4s ease-out 0.35s both" }}
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
                  className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    border: '2px solid #050505',
                    boxShadow: '0 0 8px rgba(255,122,0,0.2)'
                  }}>
                  <Image
                    src={src}
                    alt="Happy customer"
                    fill
                    sizes="36px"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}

              {/* +50k badge */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[9px] font-black text-black"
                style={{
                  background: 'linear-gradient(135deg,#ff7a00,#ffb300)',
                  border: '2px solid #050505'
                }}>
                50K+
              </div>
            </div>

            <div>
              <div className="flex gap-0.5 mb-0.5" aria-label="5 stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3" viewBox="0 0 24 24" fill="#ffb300" aria-hidden="true">
                    <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-400 text-[11px] font-medium leading-none">
                <span className="text-white font-bold">230K+</span> happy customers worldwide
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - 3D TV MOCKUP — desktop only, dynamically loaded
            so Framer Motion is never shipped to mobile visitors */}
        {isDesktop && (
          <div className="hidden lg:flex items-start justify-center relative w-full h-full self-start mt-0">
            <HeroDesktopMockup movies={movies} />
          </div>
        )}
      </div>

      {/* ============================================
         BOTTOM TRUST BAR — CSS hover replaces Framer whileHover
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
            <div
              key={item.title}
              className="flex items-center gap-2 group cursor-pointer select-none hover:scale-[1.03] transition-transform duration-200"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
