"use client";

import React from "react";
import { DollarSign, Users, BarChart, Percent, Award, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";

const STEPS = [
  {
    icon: <LinkIcon className="w-8 h-8 text-[#FF6B00]" />,
    title: "1. Join the Program",
    description: "Sign up instantly as an affiliate partner. You'll receive your unique tracking link immediately after approval."
  },
  {
    icon: <Users className="w-8 h-8 text-[#FF6B00]" />,
    title: "2. Promote STREAMB4",
    description: "Share your referral link on your blog, YouTube channel, social media, or email newsletter."
  },
  {
    icon: <DollarSign className="w-8 h-8 text-[#FF6B00]" />,
    title: "3. Earn Commissions",
    description: "Earn 30% recurring commission on every subscription paid by users you refer. Lifetime earnings on renewals."
  }
];

export default function AffiliateClient() {
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
              <li className="text-gray-400" aria-current="page">Affiliate Program</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              PARTNER & EARN
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              EARN <span className="text-[#FF6B00]">30% RECURRING</span>
              <br />COMMISSION
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Refer customers to the web&apos;s premium IPTV service and earn industry-leading recurring commissions on every sale and renewal.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">
                  Join Affiliate Program
                </Button>
              </Link>
              <Link
                href="/reseller"
                className="px-6 py-3 rounded-xl font-black text-white text-sm uppercase tracking-wider border border-[#FF6B00]/30 hover:border-[#FF6B00] transition-colors flex items-center"
              >
                View Reseller Program →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <AnimatedSection className="py-20 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white text-center mb-12 uppercase">
            HOW IT <span className="text-[#FF6B00]">WORKS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="p-8 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#FF6B00]/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-white font-black text-xl mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Dashboard Preview */}
      <AnimatedSection className="py-20 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                REAL-TIME <span className="text-[#FF6B00]">TRACKING</span> DASHBOARD
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Monitor your referrals, conversion rates, and earnings in real-time. Our tracking system ensures all referrals are credited accurately.
              </p>
              <ul className="space-y-3 mb-8" role="list">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <BarChart className="w-4 h-4 text-[#FF6B00]" aria-hidden="true" /> Detailed Traffic Logs & Analytics
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Percent className="w-4 h-4 text-[#FF6B00]" aria-hidden="true" /> 30% Lifetime Recurring Commission Rate
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Award className="w-4 h-4 text-[#FF6B00]" aria-hidden="true" /> $50 Minimum Payout Threshold
                </li>
              </ul>
              <Link href="/contact">
                <Button size="lg">
                  Create Affiliate Account
                </Button>
              </Link>
            </div>

            {/* Stats Mock */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4 mb-6">
                <span className="text-white font-bold text-sm">Affiliate Panel</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">Active</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2a2a2a]">
                  <span className="text-gray-500 text-xs font-bold block mb-1">UNPAID EARNINGS</span>
                  <span className="text-2xl font-black text-white">$452.80</span>
                </div>
                <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2a2a2a]">
                  <span className="text-gray-500 text-xs font-bold block mb-1">TOTAL PAYOUTS</span>
                  <span className="text-2xl font-black text-[#FF6B00]">$2,840.00</span>
                </div>
              </div>
              <div className="space-y-3 text-xs text-gray-400">
                <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                  <span>Total Clicks:</span>
                  <span className="text-white font-bold">1,482</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                  <span>Conversions:</span>
                  <span className="text-white font-bold">89</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Conversion Rate:</span>
                  <span className="text-white font-bold">6.01%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
