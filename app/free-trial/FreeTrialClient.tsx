"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MagneticButton from "@/components/ui/MagneticButton";
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
    title: "Request Your Trial",
    desc: "Fill in your device type and email. Our team processes requests instantly, 24 hours a day.",
  },
  {
    num: "02",
    title: "Receive Credentials",
    desc: "Get your username, password, and server URL delivered to your inbox within minutes.",
  },
  {
    num: "03",
    title: "Start Watching",
    desc: "Enter your credentials into your IPTV app and start streaming 50,000+ channels immediately.",
  },
];

const WHAT_TO_TEST = [
  {
    num: "01",
    title: "Live Sports Stream Quality",
    desc: "Find a live match in your sport of choice and watch for at least 30 minutes. Check for buffering, pixelation, and whether the stream recovers automatically if it dips. This is the hardest test for any IPTV infrastructure.",
  },
  {
    num: "02",
    title: "EPG Accuracy",
    desc: "Open the programme guide and verify that current programme titles match what's actually broadcasting. An accurate EPG means the service maintains its data actively.",
  },
  {
    num: "03",
    title: "Channel Count by Category",
    desc: "Navigate through your most-watched categories — US sports, UK entertainment, news, or international channels. Verify the channels you actually want are present.",
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
    desc: "If you have multiple devices, test the stream on both simultaneously. Verify that both streams run at full quality without impacting each other.",
  },
];

const DEVICE_SETUPS = [
  { device: "Amazon Fire TV Stick", app: "TiviMate or IPTV Smarters Pro", time: "3 min" },
  { device: "Smart TV (Samsung / LG / Sony)", app: "IPTV Smarters or SS IPTV", time: "4 min" },
  { device: "Android TV Box", app: "TiviMate (recommended)", time: "3 min" },
  { device: "iPhone / iPad", app: "IPTV Smarters Pro", time: "4 min" },
  { device: "Android Phone / Tablet", app: "TiviMate or IPTV Smarters", time: "3 min" },
  { device: "Windows PC / Mac", app: "VLC or Perfect Player", time: "5 min" },
  { device: "MAG / Formuler Box", app: "Built-in IPTV player", time: "5 min" },
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
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-semibold pr-4 text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-[#FF6B00] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-gray-400 text-sm leading-relaxed border-t border-white/[0.04]">
          {a}
        </div>
      )}
    </div>
  );
}

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,138,0,0.4))" }} />
      <span
        className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full"
        style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        {text}
      </span>
      <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(90deg, rgba(255,138,0,0.4), transparent)" }} />
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
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,122,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,122,0,0.08), transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: heading + trust */}
            <div>
              <ScrollReveal delay={0.1}>
                <span
                  className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6"
                  style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  24 Hours · No Card Required
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <h1
                  className="font-black text-white uppercase leading-[0.9] tracking-tight mb-6"
                  style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
                >
                  TRY STREAMB4{" "}
                  <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    FREE
                  </span>
                  <br />FOR 24 HOURS
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p className="text-gray-400 text-lg leading-relaxed mb-8" style={{ maxWidth: "42ch" }}>
                  Test the full service — all 50,000+ channels, 4K sports, and 180,000+ VOD titles — before you subscribe. No credit card. No commitment. Instant activation.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <ul className="space-y-3 mb-8">
                  {FEATURES.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>

            {/* Right: Form */}
            <ScrollReveal delay={0.2}>
              <div
                className="rounded-[24px] p-8"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(5,5,5,0.98) 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {submitted ? (
                  <div className="text-center py-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: "linear-gradient(135deg, rgba(255,122,0,0.15), rgba(255,179,0,0.08))", border: "1px solid rgba(255,122,0,0.3)" }}
                    >
                      <Check className="w-8 h-8 text-[#FF6B00]" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Request Received</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Your trial credentials will arrive at <strong className="text-white">{email}</strong> within minutes. Check your inbox — and spam folder just in case.
                    </p>
                    <Link href="/install" className="inline-block mt-6 text-[#FF6B00] text-sm font-semibold hover:underline">
                      Setup guide while you wait →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Request Your Free Trial</h3>
                      <p className="text-gray-500 text-sm">Processed 24/7 — credentials arrive in minutes</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm transition-colors focus:outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Device</label>
                      <select
                        required
                        value={device}
                        onChange={(e) => setDevice(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none appearance-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
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
                    <MagneticButton
                      className="w-full py-4 rounded-xl font-black text-black text-base uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,122,0,0.5)] cursor-pointer"
                      style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)", boxShadow: "0 0 24px rgba(255,122,0,0.3)" }}
                    >
                      ⚡ Get My Free Trial
                    </MagneticButton>
                    <p className="text-gray-600 text-xs text-center">No credit card · No commitment · Cancel anytime</p>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <AnimatedSection className="border-y border-white/[0.04] bg-[#0d0d0d] py-8">
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
      <AnimatedSection className="relative py-24 overflow-hidden bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Eyebrow text="Simple Process" />
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              3 STEPS TO START WATCHING
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative p-8 rounded-[20px]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                <span
                  className="block text-5xl font-black mb-5 leading-none"
                  style={{ fontFamily: "var(--font-anton), Anton, sans-serif", background: "linear-gradient(135deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {step.num}
                </span>
                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* WHAT'S INCLUDED */}
      <AnimatedSection className="py-24 bg-[#050505] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Eyebrow text="Full Access" />
              <h2
                className="font-black text-white uppercase leading-[0.9] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                EVERYTHING INCLUDED IN YOUR TRIAL
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8" style={{ maxWidth: "42ch" }}>
                Your free trial is not a limited demo. You get the full STREAMB4 experience — every channel, every feature, same quality as paid subscribers. No restrictions.
              </p>
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="border-l-2 border-[#FF6B00]/40 pl-4 text-gray-300 text-sm py-0.5">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Instant Activation", sub: "Credentials in minutes" },
                { title: "No Card Needed", sub: "Zero risk, zero charge" },
                { title: "24 Hours Full Access", sub: "Test everything freely" },
                { title: "Any Device", sub: "Works on all platforms" },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-6 rounded-[18px] text-center"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <p className="text-white font-bold text-sm mb-1">{card.title}</p>
                  <p className="text-gray-500 text-xs">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* WHAT TO TEST */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="Maximise Your Trial" />
            <h2
              className="font-black text-white uppercase leading-[0.9] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              WHAT TO TEST IN YOUR 24 HOURS
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              A 24-hour window is enough to evaluate all the factors that matter. Here's what to check — and why each one tells you something important about service quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WHAT_TO_TEST.map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-[18px]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                }}
              >
                <span
                  className="block text-3xl font-black mb-3 leading-none"
                  style={{ fontFamily: "var(--font-anton), Anton, sans-serif", background: "linear-gradient(135deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {item.num}
                </span>
                <h3 className="text-white font-bold mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* SETUP GUIDE */}
      <AnimatedSection className="py-24 bg-[#050505] border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <Eyebrow text="Installation" />
              <h2
                className="font-black text-white uppercase leading-[0.9] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
              >
                SETUP TAKES UNDER 5 MINUTES
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Once your credentials arrive, installation on any device takes less than five minutes. There's no hardware to buy and no engineer visit required.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                The two most common apps are <strong className="text-white">TiviMate</strong> (Android / Fire TV — recommended for its EPG) and <strong className="text-white">IPTV Smarters Pro</strong> (iOS / Android). Both are free. Enter your STREAMB4 server URL, username, and password, and the full channel lineup loads automatically.
              </p>
              <Link href="/install">
                <Button variant="primary" className="px-6 py-3 font-black uppercase tracking-wide">
                  View Full Setup Guides →
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {DEVICE_SETUPS.map((d) => (
                <div
                  key={d.device}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(5,5,5,0.97) 100%)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
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

      {/* FAQ */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="Common Questions" />
            <h2
              className="font-black text-white uppercase leading-[0.9] tracking-tight"
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

      {/* CTA */}
      <section className="relative py-28 overflow-hidden bg-[#050505]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,122,0,0.07) 0%, rgba(5,5,5,1) 50%, rgba(255,179,0,0.04) 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,122,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase mb-4">After Your Trial</p>
          <h2
            className="font-black text-white uppercase leading-[0.9] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            READY TO SUBSCRIBE?
          </h2>
          <p className="text-gray-400 mb-8">Plans start from $9/month. No contracts, instant activation, cancel anytime.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing">
              <MagneticButton
                className="px-10 py-5 rounded-full font-black text-black text-base uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_60px_rgba(255,122,0,0.6)] transition-all duration-300 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)", boxShadow: "0 0 40px rgba(255,122,0,0.4)" }}
              >
                View Pricing Plans
              </MagneticButton>
            </Link>
            <Link href="/reseller">
              <MagneticButton className="px-10 py-5 rounded-full font-bold text-white text-base uppercase tracking-wide border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:scale-105 transition-all duration-300 cursor-pointer">
                Reseller Program →
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
