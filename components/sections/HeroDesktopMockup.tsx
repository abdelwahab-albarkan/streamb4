"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TMDBMedia } from "@/lib/tmdb";

export default function HeroDesktopMockup({ movies }: { movies: TMDBMedia[] }) {
  if (movies.length === 0) return null;

  return (
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
                sizes="110px"
                className="object-cover"
                loading="lazy"
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
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
