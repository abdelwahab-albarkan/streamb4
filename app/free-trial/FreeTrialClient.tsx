"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Tv, Smartphone, Monitor, Zap, Shield, Clock, Gift, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  "50,000+ live channels",
  "180,000+ movies & series",
  "True 4K Ultra HD & HDR",
  "All sports — NFL, Premier League, NBA, UFC, F1",
  "Full EPG TV guide",
  "Catch-up TV (7 days)",
  "Anti-freeze technology",
  "No feature restrictions — same as paid",
];

const STEPS = [
  {
    num: "01",
    icon: <Gift className="w-5 h-5 text-[#FF6B00]" />,
    title: "Request Your Trial",
    desc: "Fill in your device type and email. Our team processes requests instantly, 24 hours a day.",
  },
  {
    num: "02",
    icon: <Zap className="w-5 h-5 text-[#FF6B00]" />,
    title: "Receive Credentials",
    desc: "Get your username, password, and server URL delivered to your inbox within minutes.",
  },
  {
    num: "03",
    icon: <Tv className="w-5 h-5 text-[#FF6B00]" />,
    title: "Start Watching",
    desc: "Enter your credentials into your IPTV app and start streaming 50,000+ channels immediately.",
  },
];

const DEVICES = [
  { icon: <Tv className="w-6 h-6" />, name: "Smart TV" },
  { icon: <Monitor className="w-6 h-6" />, name: "Fire TV Stick" },
  { icon: <Smartphone className="w-6 h-6" />, name: "Android / iOS" },
  { icon: <Monitor className="w-6 h-6" />, name: "Windows / Mac" },
  { icon: <Tv className="w-6 h-6" />, name: "MAG / Formuler" },
  { icon: <Tv className="w-6 h-6" />, name: "Android TV Box" },
];

const FAQS = [
  {
    q: "Is the free trial really free?",
    a: "Yes. The 24-hour trial is completely free. No credit card required, no hidden charges. We want you to verify the service quality before committing to a subscription.",
  },
  {
    q: "How long does the trial last?",
    a: "The trial runs for 24 hours from the moment your credentials are activated — giving you a full day to test every feature including live sports, VOD, and 4K quality.",
  },
  {
    q: "Are there any feature restrictions during the trial?",
    a: "None. Your trial account has exactly the same channel lineup, quality, and features as a paid subscription. We don't reduce quality or lock content during trials.",
  },
  {
    q: "How quickly will I receive my trial credentials?",
    a: "Trial requests are processed instantly by our team. You'll receive your credentials within minutes of submitting, 24 hours a day.",
  },
  {
    q: "What devices can I use during the trial?",
    a: "Your trial works on any device that supports IPTV — Firestick, Smart TV, Android, iPhone, Windows, Mac, MAG box, or any other compatible device.",
  },
  {
    q: "Can I convert my trial to a paid subscription?",
    a: "Yes. After your trial, simply choose a plan on the pricing page and we'll keep your account active without interruption. You can use the same credentials.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-[#141414] hover:bg-[#1a1a1a] transition-colors"
      >
        <span className="text-white font-semibold pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#FF6B00] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 bg-[#141414] text-gray-400 text-sm leading-relaxed border-t border-[#2a2a2a]">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FreeTrialClient() {
  const [device, setDevice] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !device) return;
    setSubmitted(true);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#FF6B00]/6 rounded-full blur-[160px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
            24 Hours — No Card Required
          </div>
          <h1
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
          >
            TRY STREAMB4{" "}
            <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              FREE
            </span>{" "}
            FOR 24 HOURS
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Test the full service — all 50,000+ channels, 4K sports, and 180,000+ VOD titles — before you subscribe. No credit card. No commitment. Instant activation.
          </p>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-12">
            {["100% Free", "No Credit Card", "Instant Access", "Full Features"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#FF6B00]" /> {t}
              </span>
            ))}
          </div>

          {/* Trial Form */}
          <div
            className="max-w-md mx-auto p-8 rounded-2xl border border-[#2a2a2a] bg-[#141414]"
            style={{ boxShadow: "0 0 60px rgba(255,107,0,0.08)" }}
          >
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#FF6B00]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Request Received!</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your trial credentials will arrive at <strong className="text-white">{email}</strong> within minutes. Check your inbox — and spam folder just in case.
                </p>
                <Link href="/install" className="inline-block mt-6 text-[#FF6B00] text-sm font-semibold hover:underline">
                  Setup guide while you wait →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left mb-6">
                  <h3 className="text-white font-bold text-lg mb-1">Request Your Free Trial</h3>
                  <p className="text-gray-500 text-sm">Processed 24/7 — credentials arrive in minutes</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#0d0d0d] border border-[#2a2a2a] text-white placeholder-gray-600 focus:border-[#FF6B00]/50 focus:outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Device</label>
                  <select
                    required
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0d0d0d] border border-[#2a2a2a] text-white focus:border-[#FF6B00]/50 focus:outline-none text-sm transition-colors appearance-none"
                  >
                    <option value="" disabled>Select your device</option>
                    <option value="firestick">Amazon Fire TV Stick</option>
                    <option value="smart-tv">Smart TV (Samsung / LG / Sony)</option>
                    <option value="android">Android Phone / Tablet</option>
                    <option value="iphone">iPhone / iPad</option>
                    <option value="android-tv">Android TV Box</option>
                    <option value="windows">Windows PC / Laptop</option>
                    <option value="mac">Mac</option>
                    <option value="mag">MAG / Formuler Box</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-black text-black text-base uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,122,0,0.4)]"
                  style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)" }}
                >
                  ⚡ Get My Free Trial Now
                </button>
                <p className="text-gray-600 text-xs text-center">No credit card · No commitment · Cancel anytime</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <AnimatedSection className="border-y border-[#1A1A1A] bg-[#0d0d0d] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "50,000+", label: "Live Channels" },
              { value: "180,000+", label: "VOD Titles" },
              { value: "4K", label: "Ultra HD Quality" },
              { value: "24h", label: "Full Trial Access" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* HOW IT WORKS */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              3 STEPS TO START WATCHING
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="relative p-8 rounded-2xl bg-[#141414] border border-[#2a2a2a]">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="text-4xl font-black leading-none"
                    style={{ fontFamily: "var(--font-anton), Anton, sans-serif", background: "linear-gradient(135deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* WHAT'S INCLUDED */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Full Access</p>
              <h2
                className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                EVERYTHING INCLUDED IN YOUR TRIAL
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Your free trial is not a limited demo. You get the full STREAMB4 experience — every channel, every feature, same quality as paid subscribers. No restrictions.
              </p>
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#FF6B00]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Zap className="w-6 h-6 text-[#FF6B00]" />, title: "Instant Activation", sub: "Credentials in minutes" },
                { icon: <Shield className="w-6 h-6 text-[#FF6B00]" />, title: "No Card Needed", sub: "Zero risk, zero charge" },
                { icon: <Clock className="w-6 h-6 text-[#FF6B00]" />, title: "24 Hours Full Access", sub: "Test everything freely" },
                { icon: <Tv className="w-6 h-6 text-[#FF6B00]" />, title: "Any Device", sub: "Works on all platforms" },
              ].map((card) => (
                <div key={card.title} className="p-6 rounded-2xl bg-[#141414] border border-[#2a2a2a] text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-3">
                    {card.icon}
                  </div>
                  <p className="text-white font-bold text-sm mb-1">{card.title}</p>
                  <p className="text-gray-500 text-xs">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* DEVICES */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Works Everywhere</p>
          <h2
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            YOUR TRIAL WORKS ON ALL DEVICES
          </h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto text-sm">Test STREAMB4 on the device you actually use. No hardware requirements, no additional purchases.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {DEVICES.map((d) => (
              <div key={d.name} className="p-5 rounded-xl bg-[#141414] border border-[#2a2a2a] flex flex-col items-center gap-2">
                <div className="text-[#FF6B00]">{d.icon}</div>
                <p className="text-gray-300 text-xs font-semibold text-center">{d.name}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-500 text-sm">
            Need a setup guide?{" "}
            <Link href="/install" className="text-[#FF6B00] hover:underline">View installation instructions →</Link>
          </p>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Common Questions</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              FREE TRIAL FAQ
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </AnimatedSection>

      {/* WHAT TO TEST */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Maximise Your Trial</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              WHAT TO TEST IN YOUR 24 HOURS
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              A 24-hour window is enough to evaluate all the factors that matter. Here's what to check — and why each one tells you something important about the service quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                num: "01",
                title: "Live Sports Stream Quality",
                desc: "Find a live match in your sport of choice and watch for at least 30 minutes. Check for buffering, pixelation, and whether the stream recovers automatically if it dips. This is the hardest test for any IPTV infrastructure.",
              },
              {
                num: "02",
                title: "EPG Accuracy",
                desc: "Open the programme guide and verify that current programme titles match what's actually broadcasting. An accurate EPG means the service maintains its data actively — a sign of a well-run operation.",
              },
              {
                num: "03",
                title: "Channel Count by Category",
                desc: "Navigate through your most-watched categories — US sports, UK entertainment, news, or international channels. Verify the channels you actually want are present, not just the headline number.",
              },
              {
                num: "04",
                title: "VOD Library & Search",
                desc: "Search for a recent film or series you're interested in. Test that the stream starts cleanly and that the video quality matches what the listing describes.",
              },
              {
                num: "05",
                title: "Catch-Up TV (7-Day Rewind)",
                desc: "Navigate to a channel that supports catch-up and try rewinding to a programme from yesterday. This tests that the catch-up archive is actually functional, not just a listed feature.",
              },
              {
                num: "06",
                title: "Multi-Device Access",
                desc: "If you have multiple devices — a Smart TV and a phone, for example — test the stream on both simultaneously. Verify that both streams run at full quality without impacting each other.",
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-4 p-5 rounded-xl bg-[#141414] border border-[#2a2a2a]">
                <span
                  className="text-3xl font-black flex-shrink-0 leading-none mt-0.5"
                  style={{ fontFamily: "var(--font-anton), Anton, sans-serif", background: "linear-gradient(135deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {item.num}
                </span>
                <div>
                  <h3 className="text-white font-bold mb-1.5 text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* SETUP GUIDE PREVIEW */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Installation</p>
              <h2
                className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
              >
                SETUP TAKES UNDER 5 MINUTES
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Once your credentials arrive, installation on any device takes less than five minutes. There's no hardware to buy, no satellite dish to mount, and no engineer visit required.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                The two most common apps used with STREAMB4 are <strong className="text-white">TiviMate</strong> (Android / Fire TV — recommended for its EPG) and <strong className="text-white">IPTV Smarters Pro</strong> (iOS / Android). Both are free to download. You enter your STREAMB4 server URL, username, and password, and the full channel lineup loads automatically.
              </p>
              <Link href="/install">
                <Button variant="primary" className="px-6 py-3 font-black uppercase tracking-wide">
                  View Full Setup Guides →
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { device: "Amazon Fire TV Stick", app: "TiviMate or IPTV Smarters Pro", time: "3 min" },
                { device: "Smart TV (Samsung / LG / Sony)", app: "IPTV Smarters or SS IPTV", time: "4 min" },
                { device: "Android TV Box", app: "TiviMate (recommended)", time: "3 min" },
                { device: "iPhone / iPad", app: "IPTV Smarters Pro", time: "4 min" },
                { device: "Android Phone / Tablet", app: "TiviMate or IPTV Smarters", time: "3 min" },
                { device: "Windows PC / Mac", app: "VLC or Perfect Player", time: "5 min" },
                { device: "MAG / Formuler Box", app: "Built-in IPTV player", time: "5 min" },
              ].map((d) => (
                <div key={d.device} className="flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#2a2a2a]">
                  <div>
                    <p className="text-white font-semibold text-sm">{d.device}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{d.app}</p>
                  </div>
                  <span className="text-[#FF6B00] text-xs font-bold flex-shrink-0 ml-4">{d.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* AFTER TRIAL CTA */}
      <AnimatedSection className="py-20 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">After Your Trial</p>
          <h2
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            READY TO SUBSCRIBE?
          </h2>
          <p className="text-gray-400 mb-8">Plans start from $9/month. No contracts, instant activation, cancel anytime.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing">
              <Button variant="primary" className="px-8 py-4 font-black text-base uppercase tracking-wide">
                View Pricing Plans
              </Button>
            </Link>
            <Link href="/reseller">
              <Button variant="outline" className="px-8 py-4 font-bold text-base uppercase tracking-wide">
                Reseller Program →
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
