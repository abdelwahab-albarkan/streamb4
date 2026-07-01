"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { getPopularMovies, type TMDBMedia } from "@/lib/tmdb";

export function VODSection() {
  const [movies, setMovies] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getPopularMovies();
        // Get 20 movies
        setMovies(data.slice(0, 20));
      } catch (err) {
        console.error("VOD error", err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  // Split into Row 1 and Row 2
  const row1 = movies.slice(0, 10);
  const row2 = movies.slice(10, 20);

  // Duplicate arrays to make seamless loop
  const row1Double = [...row1, ...row1];
  const row2Double = [...row2, ...row2];

  return (
    <AnimatedSection className="py-20 md:py-28 bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
            ON DEMAND
          </p>
          <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem, 6vw, 3.75rem)" }}>
            THE BIGGEST <span className="text-[#FF6B00]">VOD LIBRARY</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            180,000+ movies and TV series. Dynamic double-row infinite scrolling.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF6B00]"></div>
        </div>
      ) : (
        <div className="carousel-container space-y-6 select-none w-full relative">
          {/* Row 1: Left scrolling */}
          <div className="flex w-full overflow-hidden relative mask-gradient">
            <div className="flex gap-4 w-max animate-scroll-left">
              {row1Double.map((movie, idx) => {
                const poster = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Poster";
                return (
                  <div
                    key={`${movie.id}-r1-${idx}`}
                    className="group relative flex-none rounded-2xl overflow-hidden bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ width: "clamp(120px, 30vw, 180px)" }}
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden relative">
                      <Image
                        src={poster}
                        alt={(movie.title || movie.name) ?? ""}
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
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                          {movie.title || movie.name}
                        </h4>
                        <p className="text-gray-500 text-xxs font-medium uppercase tracking-wider">
                          {movie.release_date ? movie.release_date.split("-")[0] : "VOD"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Right scrolling */}
          <div className="flex w-full overflow-hidden relative mask-gradient">
            <div className="flex gap-4 w-max animate-scroll-right">
              {row2Double.map((movie, idx) => {
                const poster = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Poster";
                return (
                  <div
                    key={`${movie.id}-r2-${idx}`}
                    className="group relative flex-none rounded-2xl overflow-hidden bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ width: "clamp(120px, 30vw, 180px)" }}
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden relative">
                      <Image
                        src={poster}
                        alt={(movie.title || movie.name) ?? ""}
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
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                          {movie.title || movie.name}
                        </h4>
                        <p className="text-gray-500 text-xxs font-medium uppercase tracking-wider">
                          {movie.release_date ? movie.release_date.split("-")[0] : "VOD"}
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
