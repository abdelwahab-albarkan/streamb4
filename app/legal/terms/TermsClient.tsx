"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ShieldAlert, Scale, FileText } from "lucide-react";

export default function TermsClient() {
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
              TERMS OF <span className="text-[#FF6B00]">SERVICE</span>
            </h1>
            <p className="text-gray-400 text-sm">Last updated: June 2026</p>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="py-20 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 space-y-8 text-gray-300 text-sm leading-relaxed">
            <div className="flex gap-4 items-start pb-6 border-b border-[#2a2a2a]">
              <Scale className="w-10 h-10 text-[#FF6B00] shrink-0" />
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Agreement of Terms</h3>
                <p className="text-gray-400 text-xs">Please read these conditions carefully before accessing the service.</p>
              </div>
            </div>

            <section className="space-y-3">
              <h4 className="text-white font-bold text-base">1. Service Provision</h4>
              <p>
                STREAMB4 provides temporary digital streaming access keys. The service details, contents list, and coverage options are subject to ongoing improvements, and feeds may change based on network sourcing constraints.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-white font-bold text-base">2. Acceptable Use Policy</h4>
              <p>
                Subscriptions are sold for personal, residential entertainment purposes. Re-streaming, public broadcasting, or attempting to scan the server infrastructure will result in instant termination without refund options.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-white font-bold text-base">3. Payment Terms</h4>
              <p>
                All plans are prepaid. Recurring subscriptions auto-bill at the start of each billing period unless cancelled by the user. Charges are processed through secure gateways in USD or equivalent local values.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-white font-bold text-base">4. Infrastructure Disclaimers</h4>
              <p>
                While we maintain a 99.9% network uptime goal, server status can vary based on local ISP restrictions, external satellite sourcing feeds, and internet congestion. The service is provided on an 'as-available' basis.
              </p>
            </section>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
