"use client";

import React, { use } from "react";
import { Check, Shield, Zap, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";

export interface CountryConfig {
  flag: string;
  name: string;
  currency: string;
  serverNode: string;
  desc: string;
  channels: string;
  sports: string[];
  localNetworks: string[];
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  usa: {
    flag: "🇺🇸",
    name: "United States",
    currency: "USD",
    serverNode: "Chicago & New York Edge Nodes",
    desc: "Stream 50,000+ US channels including local networks, NFL, NBA, MLB, and US TV. Dedicated USA CDN nodes ensure the lowest possible latency for American viewers.",
    channels: "15,000+",
    sports: ["NFL", "NBA", "MLB", "NHL", "UFC", "NASCAR"],
    localNetworks: ["CBS", "NBC", "ABC", "FOX", "ESPN", "CNN", "HBO"]
  },
  canada: {
    flag: "🇨🇦",
    name: "Canada",
    currency: "CAD",
    serverNode: "Toronto & Montreal Edge Nodes",
    desc: "Watch Canadian TV channels, CBC, Sportsnet, TSN, and French-language packages in 4K Ultra HD with zero buffering across Canada.",
    channels: "8,000+",
    sports: ["NHL", "NBA", "CFL", "MLS", "TSN Sports"],
    localNetworks: ["CBC", "CTV", "Global", "Sportsnet", "TSN", "RDS"]
  },
  "united-kingdom": {
    flag: "🇬🇧",
    name: "United Kingdom",
    currency: "GBP",
    serverNode: "London Edge Nodes",
    desc: "Access Sky Sports, TNT Sports, BBC iPlayer, ITV, Channel 4, and all regional UK feeds with high-bandwidth optimisation for UK viewers.",
    channels: "10,000+",
    sports: ["Premier League", "Championship", "Champions League", "Formula 1", "Cricket", "Rugby"],
    localNetworks: ["BBC One", "ITV", "Channel 4", "Channel 5", "Sky Sports", "BT Sport"]
  },
  europe: {
    flag: "🇪🇺",
    name: "Europe",
    currency: "EUR",
    serverNode: "Frankfurt & Amsterdam Edge Nodes",
    desc: "Stream Spanish, French, German, Italian, Dutch, Scandinavian and Eastern European packages with multi-lingual audio and local EPG guides.",
    channels: "20,000+",
    sports: ["La Liga", "Ligue 1", "Bundesliga", "Serie A", "Eredivisie", "Champions League"],
    localNetworks: ["TF1", "ARD", "Rai Uno", "TVE", "NOS", "SVT"]
  }
};

interface CountryClientProps {
  countryCode: string;
  config: CountryConfig;
}

export default function CountryClient({ countryCode, config }: CountryClientProps) {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[150px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
            <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-400" aria-current="page">IPTV {config.name}</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-5xl mb-4 block" role="img" aria-label={config.name}>{config.flag}</span>
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              REGIONAL OPTIMIZED
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              BEST IPTV SERVICE FOR <br />
              <span className="text-[#FF6B00] uppercase">{config.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {config.desc}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/free-trial"
                className="px-8 py-4 rounded-xl font-black text-black text-sm uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
              >
                <Play className="inline w-4 h-4 mr-2" aria-hidden="true" />
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl font-black text-white text-sm uppercase tracking-wider border border-[#FF6B00]/30 hover:border-[#FF6B00] transition-colors"
              >
                View Pricing Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <AnimatedSection className="py-12 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <p className="text-3xl font-black text-[#FF6B00] mb-2">{config.channels}</p>
              <h2 className="text-white font-bold text-sm">{config.name} Channels</h2>
              <p className="text-gray-500 text-xs mt-1">Local + International</p>
            </div>
            <div className="p-6 border-y md:border-y-0 md:border-x border-[#1A1A1A]">
              <p className="text-3xl font-black text-[#FF6B00] mb-2">{config.serverNode.split("&")[0].trim()}</p>
              <h2 className="text-white font-bold text-sm">Primary Server</h2>
              <p className="text-gray-500 text-xs mt-1">Dedicated edge node</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-black text-[#FF6B00] mb-2">4K HDR</p>
              <h2 className="text-white font-bold text-sm">Streaming Quality</h2>
              <p className="text-gray-500 text-xs mt-1">Ultra HD on all channels</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Why watch in this country */}
      <AnimatedSection className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                WHY CHOOSE STREAMB4 IN <span className="text-[#FF6B00] uppercase">{config.name}</span>?
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Our edge network caches live streams dynamically, placing streaming endpoints directly inside major internet hubs close to {config.name}. This achieves faster load speeds, instant channel-zapping, and zero frame drops — even during peak viewing hours.
              </p>
              <ul className="space-y-3 mb-8" role="list">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#FF6B00] shrink-0" aria-hidden="true" />
                  <span className="text-gray-300 text-sm">High-availability redundant server clusters</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#FF6B00] shrink-0" aria-hidden="true" />
                  <span className="text-gray-300 text-sm">Compatible with all {config.name} ISPs and routers</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#FF6B00] shrink-0" aria-hidden="true" />
                  <span className="text-gray-300 text-sm">Geo-optimized EPG with correct regional timezones</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#FF6B00] shrink-0" aria-hidden="true" />
                  <span className="text-gray-300 text-sm">No IP lock — stream from anywhere worldwide</span>
                </li>
              </ul>
              <Link
                href="/free-trial"
                className="inline-block px-8 py-4 rounded-xl font-black text-black text-sm uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
              >
                Try Free for 24 Hours
              </Link>
            </div>

            <div className="space-y-6">
              {/* Sports */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-white font-bold text-base mb-4">
                  {config.name} Sports Coverage
                </h3>
                <div className="flex flex-wrap gap-2">
                  {config.sports.map(sport => (
                    <span
                      key={sport}
                      className="px-3 py-1 rounded-full text-xs font-bold text-[#FF6B00] border border-[#FF6B00]/20"
                      style={{ background: "rgba(255,107,0,0.05)" }}
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>

              {/* Networks */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-white font-bold text-base mb-4">
                  Local TV Networks Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {config.localNetworks.map(network => (
                    <span
                      key={network}
                      className="px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {network}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-white font-semibold text-sm">Encrypted Streams</h3>
                    <p className="text-gray-400 text-xs mt-1">ISP throttling and protocol blocks cannot affect your stream.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-white font-semibold text-sm">Anti-Buffering Technology</h3>
                    <p className="text-gray-400 text-xs mt-1">Direct peering with key {config.name} network providers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-16 bg-[#0d0d0d] border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to Stream in <span className="text-[#FF6B00]">{config.name}</span>?
          </h2>
          <p className="text-gray-400 mb-8">Get instant access to all {config.channels} channels. No contracts. Cancel anytime.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/free-trial"
              className="px-8 py-4 rounded-xl font-black text-black text-sm uppercase"
              style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl font-black text-white text-sm uppercase border border-white/10 hover:border-[#FF6B00]/40 transition-colors"
            >
              View Plans & Pricing
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
