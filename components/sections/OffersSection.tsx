"use client";

import React from "react";
import {
  RadioTower, Users, Link as LinkIcon, BookOpen, ArrowRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { OFFERS } from "@/lib/constants";

const OFFER_ICONS: Record<string, React.ReactNode> = {
  "radio-tower": <RadioTower className="w-7 h-7" />,
  users: <Users className="w-7 h-7" />,
  link: <LinkIcon className="w-7 h-7" />,
  "book-open": <BookOpen className="w-7 h-7" />,
};

export function OffersSection() {
  return (
    <AnimatedSection className="py-20 md:py-28 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
            OPPORTUNITIES
          </p>
          <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem, 6vw, 3.75rem)" }}>
            MORE FROM <span className="text-[#FF6B00]">STREAMB4</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFERS.map((offer) => (
            <div
              key={offer.title}
              className="group bg-[#1A1A1A] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#FF6B00]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center mb-6 text-[#FF6B00] group-hover:bg-[#FF6B00]/20 transition-colors">
                {OFFER_ICONS[offer.icon]}
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{offer.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{offer.description}</p>
              <span className="inline-flex items-center gap-2 text-[#FF6B00] font-bold text-sm group-hover:gap-3 transition-all">
                {offer.cta}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
