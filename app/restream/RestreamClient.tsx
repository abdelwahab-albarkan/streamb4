"use client";

import React from "react";
import { Check, Shield, Server, Activity, Database, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const RESTREAM_PLANS = [
  {
    streams: 25,
    price: 199,
    perStream: 7.96,
    speed: "1 Gbps Dedicated",
    channels: "All local packages",
    popular: false
  },
  {
    streams: 100,
    price: 549,
    perStream: 5.49,
    speed: "10 Gbps Dedicated",
    channels: "Global Channel List",
    popular: true
  },
  {
    streams: 500,
    price: 1999,
    perStream: 3.99,
    speed: "2x 10 Gbps Redundant",
    channels: "Full API Custom Access",
    popular: false
  }
];

export default function RestreamClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[150px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              HIGH-VOLUME STREAMING
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              IPTV <span className="text-[#FF6B00]">RESTREAM</span> SOLUTIONS
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Power your own IPTV servers with our clean streams, low latency, and highly resilient source configurations. Redundant global servers supporting up to 10,000+ connections.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Restream Packages */}
      <AnimatedSection className="py-20 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white">RESTREAM <span className="text-[#FF6B00]">PRICING</span></h2>
            <p className="text-gray-400 mt-2">Scale your streaming bandwidth infrastructure seamlessly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RESTREAM_PLANS.map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? "border-[#FF6B00] bg-[#1A1A1A] scale-[1.02] shadow-[0_0_40px_rgba(255,107,0,0.15)]"
                    : "border-[#2a2a2a] bg-[#141414] hover:border-[#FF6B00]/30"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FF6B00] text-xs font-black rounded-full uppercase tracking-wider text-white">
                    Most Demanded
                  </span>
                )}
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">{plan.streams} Active Connections</h3>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-5xl font-black text-white">${plan.price}</span>
                    <span className="text-gray-500 text-xs font-bold uppercase">/ month</span>
                  </div>
                  <div className="space-y-3 mb-8 pt-4 border-t border-[#2a2a2a]">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cost Per Stream</span>
                      <span className="text-[#FF6B00] font-bold">${plan.perStream}/mo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network Capacity</span>
                      <span className="text-white font-bold">{plan.speed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Channel Access</span>
                      <span className="text-emerald-400 font-bold">{plan.channels}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-xs text-gray-400">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> 99.99% Network Uptime
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-400">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Low Latency H264 / H265
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-400">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Dedicated Account Tech
                    </li>
                  </ul>
                  <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                    Secure Restream Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Tech Specifications */}
      <AnimatedSection className="py-20 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white">TECHNICAL <span className="text-[#FF6B00]">SPECS</span></h2>
            <p className="text-gray-400 mt-2">Enterprise level features built for maximum scalability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#141414] border border-[#2a2a2a] rounded-xl text-center">
              <Server className="w-10 h-10 text-[#FF6B00] mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">10Gbps Uplinks</h3>
              <p className="text-gray-400 text-sm">Ultra-broadband capacity to eliminate network bottlenecks.</p>
            </div>
            <div className="p-6 bg-[#141414] border border-[#2a2a2a] rounded-xl text-center">
              <Activity className="w-10 h-10 text-[#FF6B00] mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">H.264 & H.265</h3>
              <p className="text-gray-400 text-sm">Optimized encoding formats suitable for all modern players.</p>
            </div>
            <div className="p-6 bg-[#141414] border border-[#2a2a2a] rounded-xl text-center">
              <Database className="w-10 h-10 text-[#FF6B00] mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">24/7 EPG</h3>
              <p className="text-gray-400 text-sm">XML format EPG updates generated automatically.</p>
            </div>
            <div className="p-6 bg-[#141414] border border-[#2a2a2a] rounded-xl text-center">
              <Zap className="w-10 h-10 text-[#FF6B00] mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Zero Freezing</h3>
              <p className="text-gray-400 text-sm">Local card inputs for direct and reliable sources.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
