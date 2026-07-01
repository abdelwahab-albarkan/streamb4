"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ShieldCheck, Eye, Lock } from "lucide-react";

export default function PrivacyClient() {
  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              LEGAL INFORMATION
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
              PRIVACY <span className="text-[#FF6B00]">POLICY</span>
            </h1>
            <p className="text-gray-400 text-sm">Last updated: June 2026</p>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="py-20 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 space-y-8 text-gray-300 text-sm leading-relaxed">
            <div className="flex gap-4 items-start pb-6 border-b border-[#2a2a2a]">
              <ShieldCheck className="w-10 h-10 text-[#FF6B00] shrink-0" />
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Your Privacy Matters</h3>
                <p className="text-gray-400 text-xs">Learn how we process and store your registration details.</p>
              </div>
            </div>

            <section className="space-y-3">
              <h4 className="text-white font-bold text-base">1. Information Collection</h4>
              <p>
                We collect your name, email address, and select billing identifiers to provision your IPTV credentials. Your streaming traffic logs and patterns are never tracked or saved by our edge servers.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-white font-bold text-base">2. Cookie Policy</h4>
              <p>
                We use functional cookies solely to persist session logging credentials inside the Client Area and to remember your billing choices. We do not run tracking cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-white font-bold text-base">3. Sharing Data</h4>
              <p>
                We do not sell, rent, or distribute user details to advertising brokers. Data is shared with payment processors only to secure active transactions.
              </p>
            </section>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
