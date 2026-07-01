"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search trigger
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const highlightMatch = (text: string, searchStr: string) => {
    if (!searchStr) return text;
    const parts = text.split(new RegExp(`(${searchStr})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchStr.toLowerCase() ? (
        <span key={i} className="text-orange-500 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={containerRef}>
      <div className="relative z-20">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full px-5 py-3.5 pl-12 rounded-[16px] text-white text-sm outline-none placeholder-gray-600 focus:border-orange-500/30 transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderColor: isFocused ? "rgba(255,122,0,0.3)" : "rgba(255,255,255,0.08)",
          }}
          onFocus={() => setIsFocused(true)}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">
          🔍
        </span>
        {isLoading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs animate-spin font-bold select-none">
            ⟳
          </span>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {results.length > 0 && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-[20px] overflow-hidden z-50 border bg-[#0C0C0C]/95 backdrop-blur-xl"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            <div className="max-h-[320px] overflow-y-auto">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/blog/${result.slug}`}
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setIsFocused(false);
                  }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0"
                >
                  {result.featuredImage && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={result.featuredImage}
                        fill
                        sizes="48px"
                        className="object-cover"
                        alt=""
                        unoptimized={result.featuredImage.startsWith('http')}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-white font-bold text-sm truncate mb-1">
                      {highlightMatch(result.title, query)}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <span className="text-orange-500 font-bold uppercase text-[9px] tracking-wider">
                        {result.category}
                      </span>
                      <span>·</span>
                      <span>{result.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-white/[0.04] text-left shrink-0">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                {results.length} results for "{query}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
