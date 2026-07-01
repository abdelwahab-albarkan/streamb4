"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlowCard from "@/components/ui/GlowCard";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Image from "next/image";

const reviews = [
  {
    name: 'Marcus T.',
    location: 'Manchester, UK',
    stars: 5,
    text: 'Switched from cable and saved £600 a year. Premier League streams are flawless.',
    avatar: '/avatars/marcus.png',
    initials: 'MT'
  },
  {
    name: 'Diana R.',
    location: 'Toronto, CA',
    stars: 5,
    text: 'No IP lock is game-changing. Same login in hotels across 12 countries, zero issues.',
    avatar: '/avatars/diana.png',
    initials: 'DR'
  },
  {
    name: 'Ahmed S.',
    location: 'Berlin, DE',
    stars: 5,
    text: 'Setup on my LG TV took 4 minutes. Support answered me at 2 AM. Premium.',
    avatar: '/avatars/ahmed.png',
    initials: 'AS'
  },
  {
    name: 'Jessica L.',
    location: 'Austin, TX',
    stars: 5,
    text: 'One subscription. Live games on Firestick, kids channels on iPad, wife on phone.',
    avatar: '/avatars/jessica.png',
    initials: 'JL'
  },
];

export function ReviewsSection() {
  return (
    <section className="relative py-28 overflow-hidden bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal variant="fadeUp">
          <div className="text-center mb-20">
            <span className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-4 block select-none">
              REVIEWS
            </span>
            <h2 className="font-anton text-white uppercase leading-tight" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}>
              PEOPLE ARE SWITCHING <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                FOR A REASON.
              </span>
            </h2>
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {reviews.map((review) => (
            <motion.div key={review.name} variants={staggerItem} className="h-full">
              <GlowCard
                className="p-7 rounded-[24px] relative overflow-hidden group flex flex-col justify-between h-full"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {/* Quote mark background */}
                <div className="text-8xl text-orange-500/10 font-serif absolute top-2 right-4 leading-none select-none pointer-events-none">
                  &ldquo;
                </div>

                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-5 select-none">
                    {[...Array(review.stars)].map((_, idx) => (
                      <svg
                        key={idx}
                        className="w-4 h-4 text-amber-500 fill-amber-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-300 text-[15px] leading-relaxed mb-8 relative z-10 font-medium">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                {/* Avatar with real photo */}
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full 
                    overflow-hidden flex-shrink-0"
                    style={{
                      border: '2px solid rgba(255,122,0,0.3)',
                      boxShadow: '0 0 10px rgba(255,122,0,0.2)'
                    }}>
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {review.name}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {review.location}
                    </p>
                  </div>
                </div>

                {/* Hover bottom orange underline decoration */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.5), transparent)",
                  }}
                />
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
