"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PlayerData {
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

const FILTERS = ["All", "Firestick", "Android TV", "Samsung", "LG", "Windows", "Mac", "Android", "iPhone"];

// ─── Toast ────────────────────────────────────────────────────────────────────
function CopyToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      style={{
        animation: "fadeInPage 0.25s ease-out both",
        background: "#0a0a0a",
        border: "1px solid rgba(255,122,0,0.45)",
        color: "#ff7a00",
        boxShadow: "0 0 30px rgba(255,122,0,0.25)",
      }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-6 py-3.5 rounded-2xl
        text-sm font-bold shadow-2xl whitespace-nowrap"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-400">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      Downloader Code Copied Successfully
    </div>
  );
}

// ─── Player Card ──────────────────────────────────────────────────────────────
function PlayerCard({
  player,
  onCopy,
}: {
  player: PlayerData;
  onCopy: (code: string) => void;
}) {
  const isBrowser = player.downloaderCode === "Browser";

  return (
    <div
      style={{ animation: "fadeInPage 0.3s ease-out both", background: "rgba(15, 15, 15, 0.6)" }}
      className="player-card relative rounded-[20px] p-6 flex flex-col gap-4 overflow-hidden"
    >
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

      <div
        className="player-card-glow absolute inset-0 rounded-[20px] -z-10 opacity-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at bottom, rgba(255, 122, 0, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-center gap-2.5 mt-3">
        <div
          className="player-card-icon w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: "linear-gradient(145deg, rgba(255, 122, 0, 0.12) 0%, rgba(255, 179, 0, 0.05) 100%)",
            border: "1px solid rgba(255, 122, 0, 0.2)",
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
              style={{ filter: "drop-shadow(0 0 4px rgba(255, 122, 0, 0.35))" }}
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <h3 className="font-bold text-white text-[15px] leading-tight">{player.name}</h3>
      </div>

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
        <button
          onClick={() => !isBrowser && onCopy(player.downloaderCode)}
          className={`w-full text-left px-4 py-3 rounded-[12px] font-mono font-black text-xl tracking-widest transition-all duration-200 ${!isBrowser ? "hover:scale-[1.02] active:scale-[0.98]" : ""}`}
          style={{
            background: "rgba(10, 10, 10, 0.8)",
            border: isBrowser
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(255,122,0,0.22)",
            color: isBrowser ? "#666" : "#ff7a00",
            cursor: isBrowser ? "default" : "pointer",
            letterSpacing: "0.12em",
            boxShadow: "none",
          }}
          title={isBrowser ? "" : "Click to copy"}
        >
          {player.downloaderCode}
        </button>
      </div>

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
          className="w-full px-4 py-2.5 rounded-[12px] text-xs text-gray-400 font-mono truncate"
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
    </div>
  );
}

// ─── Interactive Island ───────────────────────────────────────────────────────
export default function DevicesClient({ initialPlayers }: { initialPlayers: PlayerData[] }) {
  const [players] = useState<PlayerData[]>(initialPlayers);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [toastShow, setToastShow] = useState(false);

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
    <>
      {/* ─── SUBTITLE + SEARCH + FILTERS ─────────────────────────────── */}
      <div style={{ animation: "fadeInPage 0.4s ease-out 0.1s both" }} className="mb-8">
        <p className="text-center text-gray-400 text-sm mb-6 leading-relaxed">
          Open the Downloader app and type one of the 6-digit codes below into
          the URL search bar to automatically install the player.
        </p>

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
      </div>

      {/* ─── CARDS GRID ──────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500 mb-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-bold text-lg mb-2">No players match your search</p>
          <p className="text-sm text-gray-600 mb-6">
            Try searching for another app name, shortcode, or platform.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveFilter("All");
            }}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} onCopy={handleCopy} />
          ))}
        </div>
      )}

      <CopyToast show={toastShow} />
    </>
  );
}
