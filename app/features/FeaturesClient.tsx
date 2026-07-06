"use client";

import React from "react";
import Link from "next/link";
import {
  Monitor, Zap, Globe, Unlock, Headphones, Smartphone,
  Server, Shield, Clock, Users, Wifi, Play,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const ICON_MAP: Record<string, React.ReactNode> = {
  monitor: <Monitor className="w-8 h-8" />,
  zap: <Zap className="w-8 h-8" />,
  globe: <Globe className="w-8 h-8" />,
  unlock: <Unlock className="w-8 h-8" />,
  headphones: <Headphones className="w-8 h-8" />,
  smartphone: <Smartphone className="w-8 h-8" />,
};

const FEATURES = [
  {
    title: "True 4K Ultra HD",
    icon: "monitor",
    description: "genuine 4K UHD streaming quality on every supported live TV channel",
  },
  {
    title: "Anti-Buffering Tech",
    icon: "zap",
    description: "geo-routing routing across 26 worldwide edge network cache servers",
  },
  {
    title: "Global Channel Library",
    icon: "globe",
    description: "50,000+ live channels and 180,000+ VOD movies in multiple languages",
  },
  {
    title: "No IP Lock",
    icon: "unlock",
    description: "stream from any internet connection without hardware constraints",
  },
  {
    title: "24/7 Real Support",
    icon: "headphones",
    description: "real human technicians ready to solve issues via live support channels",
  },
  {
    title: "Every Device Works",
    icon: "smartphone",
    description: "fully compatible with Fire TV, Smart TVs, Android, iOS, and PC players",
  },
];

const FEATURE_DETAILS: Record<string, { stats: string; detail: string }> = {
  "True 4K Ultra HD": {
    stats: "2160p Resolution",
    detail:
      "Every channel is tested for quality. We deliver genuine 4K UHD at 60fps for sports, FHD 1080p for entertainment, and HD 720p minimum across all streams. No upscaled fakes — real source quality verified daily.",
  },
  "Anti-Buffering Tech": {
    stats: "26 Edge Servers",
    detail:
      "Our proprietary CDN spans 26 edge servers across 4 continents, dynamically routing your stream through the fastest path. Adaptive bitrate technology adjusts in real-time, ensuring zero buffering even during peak events like the Super Bowl or Champions League finals.",
  },
  "Global Channel Library": {
    stats: "50,000+ Channels • 60+ Countries",
    detail:
      "From NFL Sunday Ticket to Premier League, Bollywood to Nollywood, Korean dramas to Latin telenovelas — we cover it all. 50,000+ live channels across 60+ countries in 40+ languages, updated weekly with new additions.",
  },
  "No IP Lock": {
    stats: "Use Anywhere, Anytime",
    detail:
      "Unlike other providers that lock your subscription to a single IP address, we let you stream from any location. Travel for work, go on vacation, visit family — your Streaming subscription follows you everywhere without restrictions.",
  },
  "24/7 Real Support": {
    stats: "< 5 Min Response Time",
    detail:
      "Our support isn't a bot. Real, trained technicians available 24/7 via live chat, email, and WhatsApp. Average response time under 5 minutes. We help with setup, troubleshooting, device configuration, and any questions you have.",
  },
  "Every Device Works": {
    stats: "15+ Device Types",
    detail:
      "Fire TV Stick, Smart TV (Samsung, LG, Sony, TCL), Android TV, Android phones & tablets, iPhone & iPad, Windows PC, Mac, MAG boxes, Formuler, Roku (via IPTV Smarters), Apple TV, Nvidia Shield, Chromecast, and more.",
  },
};

const TECH_STATS = [
  { icon: <Server className="w-6 h-6" />, value: "26", label: "Edge Servers Worldwide" },
  { icon: <Shield className="w-6 h-6" />, value: "99.9%", label: "Guaranteed Uptime" },
  { icon: <Clock className="w-6 h-6" />, value: "<5min", label: "Support Response" },
  { icon: <Users className="w-6 h-6" />, value: "230K+", label: "Active Subscribers" },
  { icon: <Wifi className="w-6 h-6" />, value: "10Gbps", label: "Server Capacity" },
  { icon: <Play className="w-6 h-6" />, value: "60fps", label: "4K Stream Quality" },
];

export default function FeaturesClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#FF6B00]/5 rounded-full blur-[180px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-4 block select-none">
              FEATURES
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              BUILT FOR PEOPLE WHO
              <br />
              <span className="text-[#FF6B00]">CARE ABOUT QUALITY</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Every feature is engineered for reliability, speed, and the best
              possible viewing experience. No compromises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 md:py-28 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat, i) => {
              const details = FEATURE_DETAILS[feat.title];
              return (
                <ScrollReveal key={feat.title} delay={i * 0.1}>
                  <div
                    className="group bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#FF6B00]/40 transition-all duration-300 hover:-translate-y-1 h-full"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center mb-6 text-[#FF6B00] group-hover:bg-[#FF6B00]/20 transition-colors">
                      {ICON_MAP[feat.icon]}
                    </div>
                    <h3 className="text-white font-black text-2xl mb-2">
                      {feat.title}
                    </h3>
                    {details && (
                      <p className="text-[#FF6B00] text-sm font-bold mb-4">
                        {details.stats}
                      </p>
                    )}
                    <p className="text-gray-400 leading-relaxed text-sm mb-4">
                      {feat.description}
                    </p>
                    {details && (
                      <p className="text-gray-500 leading-relaxed text-xs border-t border-[#2a2a2a] pt-4">
                        {details.detail}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stats */}
      <section className="py-20 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              INFRASTRUCTURE
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              BUILT FOR <span className="text-[#FF6B00]">SCALE</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Enterprise-grade infrastructure powers every stream.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {TECH_STATS.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div
                  className="flex flex-col items-center gap-3 p-6 bg-[#1A1A1A] border border-[#2a2a2a] rounded-2xl hover:border-[#FF6B00]/30 transition-all h-full"
                >
                  <div className="text-[#FF6B00]">{stat.icon}</div>
                  <span className="text-3xl font-black text-white">
                    {stat.value}
                  </span>
                  <span className="text-gray-500 text-xs font-bold uppercase text-center">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/20 via-transparent to-[#FF6B00]/20" />
        <div className="absolute inset-0 bg-[#0A0A0A]/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            READY TO <span className="text-[#FF6B00]">EXPERIENCE</span> IT?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Choose a plan and start streaming today with full access to every feature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="gap-2 text-base">
                <Play className="w-5 h-5 fill-current" />
                View Pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="gap-2 text-base">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
