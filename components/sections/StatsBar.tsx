"use client";

import React from "react";
import { Star, TrendingUp, Users } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <AnimatedSection className="relative border-y border-[#1A1A1A] bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4">
          {/* Rating */}
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-[#FF6B00] fill-[#FF6B00]" />
            </div>
            <div>
              <div className="flex items-center gap-0.5 md:gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FF6B00] fill-[#FF6B00]" />
                ))}
                <span className="text-white font-black ml-1">{STATS.rating}/5</span>
              </div>
              <p className="text-gray-500 text-xs md:text-sm">{STATS.reviews.toLocaleString("en-US")} verified reviews</p>
            </div>
          </div>

          {/* Uptime */}
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-white font-black text-lg md:text-xl">{STATS.uptime}%</p>
              <p className="text-gray-500 text-xs md:text-sm">Server Uptime Guaranteed</p>
            </div>
          </div>

          {/* Customers */}
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-black text-lg md:text-xl">{(STATS.customers / 1000).toFixed(0)}K+</p>
              <p className="text-gray-500 text-xs md:text-sm">Active Customers Worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
