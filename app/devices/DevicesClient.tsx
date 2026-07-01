"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Flame, Monitor, Radio, Cpu, Smartphone, type LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Player {
  id: string;
  name: string;
  recommended: boolean;
  featured: boolean;
  enabled: boolean;
  downloaderCode: string;
  website: string;
  apkUrl: string;
  logo: string;
  version: string;
  lastUpdated: string;
  platforms: string[];
  order: number;
  isNew?: boolean;
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is an IPTV Downloader code?",
    a: "A Downloader code is a 6-digit shortcode used inside the AFTVnews Downloader app. Instead of typing a long URL with your TV remote, you enter this short code and the app automatically fetches and installs the IPTV player APK for you.",
  },
  {
    q: "Which IPTV player app is the best for Firestick in 2026?",
    a: "IPTV Smarters Pro v5 is our top recommendation for Amazon Firestick. It supports Xtream Codes, M3U playlists, and EPG (TV guide). The Downloader code is 6468112.",
  },
  {
    q: "How do I fix 'Downloader App Installation Blocked' on Firestick?",
    a: "Go to Settings → My Fire TV → Developer Options and enable 'Apps from Unknown Sources' and 'ADB Debugging'. Then try installing again through the Downloader app.",
  },
  {
    q: "Is IBO Player free to use?",
    a: "Yes, IBO Player and IBO Player Pro are free to download and use. You only need your STREAMB4 subscription credentials (server URL, username, password or MAC address) to start streaming.",
  },
  {
    q: "What is a Mac Address and Device Key for IBO Player?",
    a: "When you open IBO Player on a Samsung or LG Smart TV, it shows a unique MAC address. You send this address to STREAMB4 support, and we activate your subscription to that specific TV — no username/password needed.",
  },
];

// ─── Full Installation Guide links ───────────────────────────────────────────
const GUIDES: { label: string; Icon: LucideIcon; color: string; href: string }[] = [
  { label: "Amazon Firestick", Icon: Flame,      color: "#ff7a00", href: "/install" },
  { label: "Samsung Smart TV", Icon: Monitor,    color: "#ff7a00", href: "/install" },
  { label: "LG Smart TV",      Icon: Radio,      color: "#ff7a00", href: "/install" },
  { label: "Android TV / Box", Icon: Cpu,        color: "#ff7a00", href: "/install" },
  { label: "Mobile Phone",     Icon: Smartphone, color: "#ff7a00", href: "/install" },
];

const FILTERS = ["All", "Firestick", "Android TV", "Samsung", "LG", "Windows", "Mac", "Android", "iPhone"];

// ─── Toast ────────────────────────────────────────────────────────────────────
function CopyToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
            flex items-center gap-3 px-6 py-3.5 rounded-2xl
            text-sm font-bold shadow-2xl whitespace-nowrap"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,122,0,0.45)",
            color: "#ff7a00",
            boxShadow: "0 0 30px rgba(255,122,0,0.25)",
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-400">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Downloader Code Copied Successfully
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-white/[0.05]">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-white/[0.05]">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
            >
              <span
                className={`font-semibold text-sm md:text-base transition-colors duration-200 ${
                  isOpen ? "text-[#ff7a00]" : "text-white group-hover:text-orange-200"
                }`}
              >
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-200"
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
                  className="w-3.5 h-3.5 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-400 text-sm leading-relaxed pb-5 pr-4">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Player Card ──────────────────────────────────────────────────────────────
function PlayerCard({
  player,
  onCopy,
}: {
  player: Player;
  onCopy: (code: string) => void;
}) {
  const isBrowser = player.downloaderCode === "Browser";
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-[20px] p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(15, 15, 15, 0.6)",
        border: hovered ? "1px solid rgba(255, 138, 0, 0.45)" : "1px solid rgba(255, 138, 0, 0.15)",
        boxShadow: hovered 
          ? "0 0 30px rgba(255, 138, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.06)" 
          : "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      }}
    >
      {/* Recommended badge */}
      {player.recommended && (
        <div className="absolute -top-px left-4 select-none z-10">
          <span
            className="inline-block px-3 py-1 rounded-b-[8px] text-[10px]
              font-black uppercase tracking-widest text-black"
            style={{
              background: "linear-gradient(135deg,#ff7a00,#ffb300)",
              boxShadow: "0 2px 8px rgba(255,122,0,0.3)",
            }}
          >
            RECOMMENDED
          </span>
        </div>
      )}

      {/* New App badge */}
      {!player.recommended && player.isNew && (
        <div className="absolute -top-px left-4 select-none z-10">
          <span
            className="inline-block px-3 py-1 rounded-b-[8px] text-[10px]
              font-black uppercase tracking-widest text-white"
            style={{
              background: "linear-gradient(135deg,#00d27a,#00e5a0)",
              boxShadow: "0 2px 8px rgba(0,210,120,0.3)",
            }}
          >
            NEW APP
          </span>
        </div>
      )}

      {/* Background glow when hovered */}
      <div
        className="absolute inset-0 rounded-[20px] -z-10 opacity-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at bottom, rgba(255, 122, 0, 0.08) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* App name row */}
      <div className="flex items-center gap-2.5 mt-3">
        <div 
          className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: "linear-gradient(145deg, rgba(255, 122, 0, 0.12) 0%, rgba(255, 179, 0, 0.05) 100%)",
            border: hovered ? "1px solid rgba(255, 122, 0, 0.4)" : "1px solid rgba(255, 122, 0, 0.2)",
            boxShadow: hovered ? "0 0 10px rgba(255, 122, 0, 0.2)" : "none",
          }}
        >
          {player.logo ? (
            <Image
              src={player.logo}
              alt={player.name}
              width={20}
              height={20}
              className="object-contain rounded-[4px]"
              unoptimized
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff7a00"
              strokeWidth="2"
              className="w-4 h-4"
              style={{
                filter: "drop-shadow(0 0 4px rgba(255, 122, 0, 0.35))",
              }}
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <h3 className="font-bold text-white text-[15px] leading-tight">
          {player.name}
        </h3>
      </div>

      {/* Downloader Code */}
      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Downloader Code
        </p>
        <motion.button
          onClick={() => !isBrowser && onCopy(player.downloaderCode)}
          whileHover={!isBrowser ? { scale: 1.02, borderColor: "rgba(255, 122, 0, 0.55)" } : {}}
          whileTap={!isBrowser ? { scale: 0.98 } : {}}
          className="w-full text-left px-4 py-3 rounded-[12px] font-mono
            font-black text-xl tracking-widest transition-all duration-200"
          style={{
            background: "rgba(10, 10, 10, 0.8)",
            border: isBrowser
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(255,122,0,0.22)",
            color: isBrowser ? "#666" : "#ff7a00",
            cursor: isBrowser ? "default" : "pointer",
            letterSpacing: "0.12em",
            boxShadow: !isBrowser && hovered ? "0 0 15px rgba(255, 122, 0, 0.1)" : "none",
          }}
          title={isBrowser ? "" : "Click to copy"}
        >
          {player.downloaderCode}
        </motion.button>
      </div>

      {/* Direct URL / APK */}
      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>
          Direct URL / APK
        </p>
        <div
          className="w-full px-4 py-2.5 rounded-[12px] text-xs text-gray-400
            font-mono truncate"
          style={{
            background: "rgba(10, 10, 10, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          {player.apkUrl
            ? player.apkUrl.replace(/^https?:\/\//, "")
            : player.website
            ? player.website.replace(/^https?:\/\//, "")
            : isBrowser
            ? "For Android TVs & Set-Top Boxes"
            : "—"}
        </div>
      </div>

      {/* Website link */}
      {player.website && (
        <a
          href={player.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-gray-500
            hover:text-orange-400 transition-colors mt-auto duration-200"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          Official website
        </a>
      )}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DevicesClient() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [toastShow, setToastShow] = useState(false);

  useEffect(() => {
    fetch("/api/players")
      .then((r) => r.json())
      .then((data) => {
        setPlayers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setToastShow(true);
      setTimeout(() => setToastShow(false), 3000);
    });
  };

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.downloaderCode.toLowerCase().includes(q) ||
        p.platforms.some((pl) => pl.toLowerCase().includes(q));
      const matchFilter =
        activeFilter === "All" || p.platforms.includes(activeFilter);
      return matchSearch && matchFilter;
    });
  }, [players, search, activeFilter]);

  return (
    <div
      className="min-h-screen text-white pt-24 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Background system matching homepage */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none select-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noisy" />
            <feColorMatrix type="linear" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,122,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,122,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating background glows */}
        <div
          className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.10] blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08] blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 relative z-10">

        {/* ─── HEADER ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs text-orange-500 font-bold tracking-[0.2em] uppercase mb-4 select-none">
            SETUP CENTER
          </p>
          <h1 className="font-anton text-white uppercase leading-tight mb-5 select-none"
            style={{ fontSize: "clamp(2rem, 7vw, 4rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}
          >
            DOWNLOADER CODES <br />
            <span
              style={{
                background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              & APP INSTALLATION
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            The fastest way to install IPTV on your Firestick or Android device.
            Just type a 6-digit code and start streaming in seconds.
          </p>
        </motion.div>

        {/* ─── STEP 1 CARD ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="rounded-[20px] p-8 mb-14"
          style={{
            background: "rgba(15, 15, 15, 0.6)",
            border: "1px solid rgba(255, 138, 0, 0.15)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center
                font-black text-black text-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                boxShadow: "0 0 15px rgba(255, 122, 0, 0.3)",
              }}
            >
              1
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-white font-black text-xl mb-3">
                  Get the &quot;Downloader&quot; App
                </h2>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center
                    opacity-20 shrink-0 border-2 border-white select-none hidden sm:flex"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    className="w-6 h-6"
                  >
                    <path
                      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                If you are using an{" "}
                <strong className="text-white">Amazon Firestick</strong> or{" "}
                <strong className="text-white">Android TV Box</strong>, you must
                install the{" "}
                <strong className="text-white">Downloader by AFTVnews</strong>{" "}
                app from your device&apos;s official app store first.
              </p>
              <ul className="space-y-3">
                {[
                  "Go to the Search icon on your Firestick/Android TV home screen.",
                  'Type "Downloader" and install the orange app.',
                  'Go to Settings › My Fire TV › Developer Options, and turn ON "Install Unknown Apps" for Downloader.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                        boxShadow: "0 0 6px rgba(255, 122, 0, 0.4)",
                      }}
                    />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ─── SUBTITLE + SEARCH + FILTERS ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8"
        >
          <p className="text-center text-gray-400 text-sm mb-6 leading-relaxed">
            Open the Downloader app and type one of the 6-digit codes below into
            the URL search bar to automatically install the player.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, code or platform…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[12px] text-sm
                text-white placeholder-gray-600 outline-none transition-all duration-300"
              style={{
                background: "rgba(15, 15, 15, 0.8)",
                border: "1px solid rgba(255, 138, 0, 0.15)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(255, 122, 0, 0.45)";
                e.target.style.boxShadow = "0 0 15px rgba(255, 122, 0, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 138, 0, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold
                    cursor-pointer transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "rgba(255, 122, 0, 0.15)",
                          border: "1px solid rgba(255, 122, 0, 0.4)",
                          color: "#ff7a00",
                          boxShadow: "0 0 10px rgba(255, 122, 0, 0.1)",
                        }
                      : {
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          color: "#888",
                        }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── CARDS GRID ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(255, 122, 0, 0.15)",
                borderTopColor: "#ff7a00",
              }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-bold text-lg mb-2">No players match your search</p>
            <p className="text-sm text-gray-600 mb-6">Try searching for another app name, shortcode, or platform.</p>
            <button
              onClick={() => { setSearch(""); setActiveFilter("All"); }}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(255, 122, 0, 0.15)",
                border: "1px solid rgba(255, 122, 0, 0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 122, 0, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 122, 0, 0.15)";
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((player) => (
                <PlayerCard key={player.id} player={player} onCopy={handleCopy} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ─── WHY SECTION ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-16 pt-12"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
        >
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wide">
            Why Do I Need a Downloader Code for IPTV?
          </h2>
          <div className="text-gray-400 text-sm leading-relaxed space-y-5">
            <p>
              In 2026, the{" "}
              <strong className="text-white">AFTVnews Downloader app</strong>{" "}
              remains the standard method for sideloading third-party applications
              onto devices running the Android TV operating system, specifically the
              Amazon Fire TV Stick, Nvidia Shield, and Google Chromecast. Because
              Amazon removes official IPTV player applications like{" "}
              <strong className="text-white">IPTV Smarters Pro</strong> from their
              built-in store, you must manually install the{" "}
              <code
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: "rgba(255, 255, 255, 0.05)", color: "#ff7a00", border: "1px solid rgba(255, 255, 255, 0.02)" }}
              >
                .apk
              </code>{" "}
              file.
            </p>
            <p>
              Using a{" "}
              <strong className="text-white">6-digit Downloader shortcode</strong>{" "}
              (such as{" "}
              <code
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: "rgba(255, 255, 255, 0.05)", color: "#ff7a00", border: "1px solid rgba(255, 255, 255, 0.02)" }}
              >
                6468112
              </code>{" "}
              for Smarters Pro) completely eliminates the hassle of typing a massive
              URL with your television remote. The codes provided above are 100%
              verified, virus-free, and directly link to the official original
              software developers.
            </p>

            <h3 className="text-white font-black text-lg pt-4 uppercase tracking-wide">
              Choosing the Best IPTV App for Smart TVs
            </h3>
            <p>
              If you own a Samsung Tizen TV or an LG WebOS television, you do not
              need the AFTVnews downloader app. Instead, simply navigate to your
              TV&apos;s built-in App Store and search for{" "}
              <strong className="text-white">IBO Player</strong>,{" "}
              <strong className="text-white">BOB Player</strong>, or{" "}
              <strong className="text-white">KING4K</strong>. These modern apps
              allow you to connect your premium IPTV subscription directly to your
              TV using a MAC address, requiring absolutely zero extra hardware.
            </p>
          </div>
        </motion.div>

        {/* ─── FAQ ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <span className="text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block select-none">
              FAQ
            </span>
            <h2 className="font-anton text-4xl text-white uppercase mb-3">
              Setup &amp; Installation FAQ
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Common questions about sideloading, shortcodes, and IPTV player configurations.
            </p>
          </div>
          <div className="rounded-[20px] p-6 md:p-8"
            style={{
              background: "rgba(15, 15, 15, 0.4)",
              border: "1px solid rgba(255, 138, 0, 0.1)",
            }}
          >
            <FAQAccordion />
          </div>
        </motion.div>

        {/* ─── FULL GUIDES ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="font-anton text-white uppercase text-center mb-8"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}
          >
            Full Installation Guides
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {GUIDES.map(({ label, Icon, href }) => (
              <Link key={label} href={href}>
                <motion.div
                  whileHover={{
                    y: -5,
                    borderColor: "rgba(255,122,0,0.55)",
                    boxShadow: "0 0 28px rgba(255,122,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07)",
                    transition: { duration: 0.2 },
                  }}
                  className="flex flex-col items-center gap-3.5 p-5 rounded-[20px]
                    cursor-pointer text-center"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,122,0,0.08) 0%, rgba(8,8,8,0.97) 100%)",
                    border: "1px solid rgba(255,122,0,0.18)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Icon box */}
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,122,0,0.15) 0%, rgba(0,0,0,0.6) 100%)",
                      border: "1px solid rgba(255,122,0,0.25)",
                      boxShadow: "0 0 16px rgba(255,122,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={2}
                      stroke="#ff7a00"
                      style={{ filter: "drop-shadow(0 0 6px rgba(255,122,0,0.55))" }}
                    />
                  </div>

                  <span className="text-xs font-bold text-gray-300 leading-tight">
                    {label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>

      <CopyToast show={toastShow} />
    </div>
  );
}
