"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { getPopularSports, type TMDBMedia } from "@/lib/tmdb";

const SPORTS_CATEGORIES = ["Football", "Basketball", "Tennis", "F1", "Boxing", "Golf"];

export function SportsSection() {
  const [sports, setSports] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSports() {
      try {
        const data = await getPopularSports();
        const filtered = data.filter(item => item.poster_path !== null);
        // Get 20 items
        setSports(filtered.slice(0, 20));
      } catch (err) {
        console.error("Sports section error", err);
      } finally {
        setLoading(false);
      }
    }
    loadSports();
  }, []);

  // Split into Row 1 and Row 2
  const row1 = sports.slice(0, 10);
  const row2 = sports.slice(10, 20);

  // Duplicate arrays to make seamless loop
  const row1Double = [...row1, ...row1];
  const row2Double = [...row2, ...row2];

  return (
    <AnimatedSection className="py-20 md:py-28 bg-[#0d0d0d] border-y border-[#1A1A1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
            LIVE SPORTS
          </p>
          <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem, 6vw, 3.75rem)" }}>
            LIVE SPORTS <span className="text-[#FF6B00]">WITHOUT</span>
            <br />THE CABLE BILL
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium mb-8">
            Every major league, fight, and race — streaming live in crystal-clear quality.
          </p>

          {/* Categories Pill list */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {SPORTS_CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#2a2a2a] text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF6B00]"></div>
        </div>
      ) : (
        <div className="carousel-container space-y-6 select-none w-full relative">
          {/* Row 1: Left scrolling (fast) */}
          <div className="flex w-full overflow-hidden relative mask-gradient">
            <div className="flex gap-4 w-max animate-scroll-left-fast">
              {row1Double.map((item, idx) => {
                const poster = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
                return (
                  <div
                    key={`${item.id}-s1-${idx}`}
                    className="group relative flex-none rounded-2xl overflow-hidden bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ width: "clamp(120px, 30vw, 180px)" }}
                  >
                    {/* Pulsing red LIVE dot overlay */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-black tracking-wider uppercase">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      LIVE
                    </div>

                    <div className="aspect-[2/3] w-full overflow-hidden relative">
                      <Image
                        src={poster}
                        alt={(item.title || item.name) ?? ""}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                      {/* Gradient Overlay at Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

                      {/* Hover details overlay */}
                      <div className="absolute inset-0 bg-[#0A0A0A]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center gap-1 text-[#FF6B00] text-xs font-bold mb-2">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                        <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                          {item.title || item.name}
                        </h4>
                        <p className="text-gray-500 text-xxs font-medium uppercase tracking-wider">
                          {item.release_date ? item.release_date.split("-")[0] : "SPORTS"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Right scrolling (fast) */}
          <div className="flex w-full overflow-hidden relative mask-gradient">
            <div className="flex gap-4 w-max animate-scroll-right-fast">
              {row2Double.map((item, idx) => {
                const poster = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
                return (
                  <div
                    key={`${item.id}-s2-${idx}`}
                    className="group relative flex-none rounded-2xl overflow-hidden bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ width: "clamp(120px, 30vw, 180px)" }}
                  >
                    {/* Pulsing red LIVE dot overlay */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-black tracking-wider uppercase">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      LIVE
                    </div>

                    <div className="aspect-[2/3] w-full overflow-hidden relative">
                      <Image
                        src={poster}
                        alt={(item.title || item.name) ?? ""}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                      {/* Gradient Overlay at Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

                      {/* Hover details overlay */}
                      <div className="absolute inset-0 bg-[#0A0A0A]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center gap-1 text-[#FF6B00] text-xs font-bold mb-2">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                        <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                          {item.title || item.name}
                        </h4>
                        <p className="text-gray-500 text-xxs font-medium uppercase tracking-wider">
                          {item.release_date ? item.release_date.split("-")[0] : "SPORTS"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AnimatedSection>
  );
}
