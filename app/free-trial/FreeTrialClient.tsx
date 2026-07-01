"use client";

import React, { useState } from "react";
import { Check, Mail, User, ShieldCheck, Smartphone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";

const TRIAL_INCLUSIONS = [
  "50,000+ Live TV Channels Enabled",
  "180,000+ VOD Movies & Series",
  "Full Electronic Program Guide (EPG)",
  "4K / FHD / HD Quality Channels",
  "Anti-Buffering Edge Technology",
  "Instant Portal Activation Credentials"
];

const DEVICES = [
  "Fire TV Stick",
  "Smart TV (Samsung / LG / Sony)",
  "Android TV Box",
  "Mobile Phone (iOS / Android)",
  "PC / Mac",
  "MAG Box",
  "Apple TV"
];

export default function FreeTrialClient() {
  const [formData, setFormData] = useState({ name: "", email: "", device: "Fire TV Stick" });
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(true);
  }

  return (
    <main id="main-content">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-400" aria-current="page">Free Trial</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Info Column */}
            <div>
              <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
                NO CREDIT CARD REQUIRED
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
                TRY IPTV FREE FOR <br />
                <span className="text-[#FF6B00]">24 HOURS</span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Experience premium IPTV quality — 50,000+ live channels, sports, and VOD content — completely free. No credit card, no commitment.
              </p>

              <ul className="space-y-3 mb-8" role="list">
                {TRIAL_INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#FF6B00] shrink-0" aria-hidden="true" />
                    <span className="text-gray-300 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl flex gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-[#FF6B00] shrink-0" aria-hidden="true" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Each email address is limited to one trial activation. Your data is kept private and never shared with third parties.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <Link href="/pricing" className="hover:text-orange-400 transition-colors underline underline-offset-2">
                  View paid plans →
                </Link>
                <Link href="/devices" className="hover:text-orange-400 transition-colors underline underline-offset-2">
                  Compatible devices →
                </Link>
                <Link href="/install" className="hover:text-orange-400 transition-colors underline underline-offset-2">
                  Setup guides →
                </Link>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl relative">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full flex items-center justify-center mx-auto text-[#FF6B00] mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">Trial Request Submitted!</h2>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Your 24-hour activation details have been sent to <strong className="text-white">{formData.email}</strong>. Check your inbox within 5 minutes.
                  </p>
                  <Link
                    href="/install"
                    className="inline-block mt-6 px-6 py-3 rounded-xl font-black text-black text-sm uppercase tracking-wider"
                    style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
                  >
                    View Setup Guide →
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h2 className="text-xl font-bold text-white mb-4">Request Your Free 24H Trial</h2>

                  <div>
                    <label htmlFor="trial-name" className="text-xs text-gray-500 font-bold block mb-2 uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" aria-hidden="true" />
                      <input
                        id="trial-name"
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="trial-email" className="text-xs text-gray-500 font-bold block mb-2 uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" aria-hidden="true" />
                      <input
                        id="trial-email"
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="trial-device" className="text-xs text-gray-500 font-bold block mb-2 uppercase">
                      Your Primary Device
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" aria-hidden="true" />
                      <select
                        id="trial-device"
                        value={formData.device}
                        onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors appearance-none"
                      >
                        {DEVICES.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Send className="w-4 h-4" aria-hidden="true" /> Activate Free Trial
                  </Button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-600 block mb-2">— OR —</span>
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-[#FF6B00] hover:text-[#ff8c00] hover:underline"
                    >
                      ⚡ Start Free Trial via Live Chat
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
