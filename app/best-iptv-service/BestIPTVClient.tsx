"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, Star, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

const SCORE_CRITERIA = [
  { criterion: "Channel Quantity", score: 9.9, detail: "50,000+ channels from 30+ countries" },
  { criterion: "Stream Quality", score: 9.8, detail: "True 4K HDR on supported channels" },
  { criterion: "Server Uptime", score: 9.9, detail: "99.9% guaranteed — monitored 24/7" },
  { criterion: "Sports Coverage", score: 9.8, detail: "1,800+ sports channels, no blackouts" },
  { criterion: "Value for Money", score: 9.7, detail: "From $9/mo — cable at $80-200+/mo" },
  { criterion: "Device Compatibility", score: 9.9, detail: "Works on every major device and OS" },
  { criterion: "Customer Support", score: 9.6, detail: "24/7 via chat, email, and WhatsApp" },
  { criterion: "Free Trial", score: 9.8, detail: "24h full-access trial, no card required" },
];

const COMPARE = [
  { feature: "Monthly Cost", streamb4: "From $9/mo", cable: "$80–200+/mo", isFav: true },
  { feature: "Live Channels", streamb4: "50,000+", cable: "200–500", isFav: true },
  { feature: "4K Ultra HD", streamb4: "Included", cable: "Extra $10–20/mo", isFav: true },
  { feature: "VOD Library", streamb4: "180,000+ titles", cable: "Limited", isFav: true },
  { feature: "Contracts", streamb4: "None", cable: "1–2 year lock-in", isFav: true },
  { feature: "Simultaneous Screens", streamb4: "Up to 6", cable: "1–2 per box", isFav: true },
  { feature: "Free Trial", streamb4: "24h — no card", cable: "Rarely offered", isFav: true },
  { feature: "International Channels", streamb4: "40+ languages", cable: "Expensive add-ons", isFav: true },
];

const VERDICT_BULLETS = [
  "Largest channel library — 50,000+ across 30+ countries",
  "Comprehensive sports coverage — no blackouts, multiple feeds per game",
  "Anti-freeze technology for stable streams during peak events",
  "Free 24h trial with zero feature restrictions",
  "Priced 80–90% below equivalent cable packages",
];

const WHAT_TO_LOOK_FOR = [
  {
    title: "Channel Count & Variety",
    detail: "The headline number matters less than the breakdown. A service claiming 80,000 channels can still miss ESPN, Sky Sports, or beIN Sports. Verify that the specific channels you care about are included — by country, by sport, by broadcaster.",
  },
  {
    title: "Stream Quality & Stability",
    detail: "Look for services that specify resolution tiers (SD, HD, FHD, 4K) rather than claiming everything is 4K. Equally important is anti-buffering technology — the mechanism that switches to a backup server when your primary stream fails.",
  },
  {
    title: "Server Uptime & Redundancy",
    detail: "99.9% uptime is the benchmark. Services achieve this through multiple redundant server layers. Ask specifically about uptime during peak events: NFL Sunday, Premier League Saturday, and PPV weekends are when poorly-built infrastructure fails.",
  },
  {
    title: "Device Compatibility",
    detail: "A good IPTV service works natively on Fire TV Stick, Android TV, Smart TV (Samsung/LG/Sony), iOS, Android phone, Windows, and Mac — without requiring a third-party player you pay for separately.",
  },
  {
    title: "Free Trial Policy",
    detail: "Reputable services offer a no-card-required trial of at least 24 hours with full feature access. A trial that restricts channels or quality is not a fair test. If a provider won't let you test before paying, treat that as a red flag.",
  },
  {
    title: "Support Quality",
    detail: "IPTV issues often happen at inconvenient times — during a live match or late at night. 24/7 support via WhatsApp, live chat, or email is the baseline. Response time matters more than the channel it comes through.",
  },
];

const IPTV_FAQS = [
  {
    q: "What is IPTV and how does it work?",
    a: "IPTV (Internet Protocol Television) delivers TV channels and video content over your internet connection instead of a satellite dish or cable. Your provider streams content from their servers to your device in real time. Because it uses your existing broadband, there's no hardware installation — you just enter your credentials into a compatible app.",
  },
  {
    q: "Is IPTV legal?",
    a: "IPTV technology itself is legal and is used by major providers including BT TV, Sky, and Hulu. The legality depends on whether the service holds the rights to broadcast the channels it offers. Licensed IPTV providers like STREAMB4 operate within the appropriate frameworks for the territories they serve.",
  },
  {
    q: "What internet speed do I need for IPTV?",
    a: "For HD streaming, a stable connection of 10 Mbps per stream is sufficient. For 4K, aim for 25 Mbps per stream. More important than peak speed is consistency — a 50 Mbps connection with high jitter will buffer more than a stable 15 Mbps line.",
  },
  {
    q: "Can I watch IPTV on multiple devices at the same time?",
    a: "That depends on your subscription plan. STREAMB4 plans support between 1 and 6 simultaneous connections — meaning multiple family members can watch different channels on different devices from the same account.",
  },
  {
    q: "What is catch-up TV and does IPTV include it?",
    a: "Catch-up TV lets you watch programmes that already aired, typically within a 7-day window. Not all IPTV services include this feature — STREAMB4 includes a 7-day catch-up library across supported channels, so you can watch what you missed without recording.",
  },
  {
    q: "What is EPG in IPTV?",
    a: "EPG stands for Electronic Programme Guide — the TV schedule grid you see when navigating channels. A quality EPG shows programme titles, times, and descriptions. STREAMB4 includes a full EPG for all major channels, which means you can see what's on now and what's coming up without leaving the app.",
  },
  {
    q: "Why does IPTV sometimes buffer?",
    a: "Buffering in IPTV has three main causes: insufficient internet speed, server overload on the provider's side, or network congestion during peak hours. A good IPTV provider uses anti-buffering/anti-freeze technology that automatically switches to a backup server when the primary one degrades — this is the key feature that separates premium services from cheap ones.",
  },
  {
    q: "Do I need a VPN for IPTV?",
    a: "A VPN is not required to use IPTV. Some users choose to use one for privacy, but it typically adds latency and can cause its own buffering if the VPN server is slow. If you're experiencing buffering with a VPN, try disabling it — the VPN itself may be the bottleneck.",
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
        <span className="text-white font-semibold pr-4 text-sm">{q}</span>
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

function StarRating({ score }: { score: number }) {
  const full = Math.floor(score / 2);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < full ? "text-[#FF6B00] fill-[#FF6B00]" : "text-gray-700"}`}
        />
      ))}
    </div>
  );
}

export default function BestIPTVClient() {
  const overallScore = (SCORE_CRITERIA.reduce((s, c) => s + c.score, 0) / SCORE_CRITERIA.length).toFixed(1);

  return (
    <>
      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-6">
            Editorial Guide · Updated August 2026
          </div>
          <h1
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2.2rem, 7vw, 4.5rem)" }}
          >
            BEST IPTV SERVICE{" "}
            <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              2026
            </span>{" "}
            — COMPLETE GUIDE
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
            Everything you need to choose the right IPTV service in 2026 — what to look for, how to compare providers, which features actually matter, and why they matter for your specific use case.
          </p>

          {/* Quick Verdict */}
          <div
            className="p-6 rounded-2xl border border-[#FF6B00]/30 mb-8"
            style={{ background: "linear-gradient(135deg,rgba(255,107,0,0.06),rgba(255,107,0,0.02))" }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-5xl font-black text-white">{overallScore}</p>
                  <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-wider">Overall Score</p>
                </div>
                <div className="w-px h-12 bg-[#2a2a2a]" />
                <div>
                  <p className="text-[#FF6B00] font-bold text-xs uppercase tracking-widest mb-1">Our #1 Pick for 2026</p>
                  <p className="text-white font-black text-2xl">STREAMB4</p>
                  <StarRating score={Number(overallScore)} />
                </div>
              </div>
              <div className="md:ml-auto">
                <Link href="/free-trial">
                  <Button variant="primary" className="font-black uppercase tracking-wide px-6 py-3">
                    Try Free 24 Hours
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <AnimatedSection className="py-20 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Testing Methodology</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
            >
              HOW WE EVALUATED
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "30-Day Live Testing", desc: "Each service was run live for 30 days across Firestick, Smart TV, and a laptop. We tracked buffering events, stream drops, and EPG accuracy." },
              { title: "Channel Count Verification", desc: "We manually verified channel counts by category — sports, entertainment, news, international — rather than relying on provider claims." },
              { title: "Live Sports Stress Test", desc: "We streamed peak-traffic events: Premier League kickoffs, NFL Sunday, and UFC PPV main cards. These are the moments services fail under load." },
              { title: "Support Response Time", desc: "We submitted support tickets and WhatsApp messages at different times of day to measure actual response times rather than claimed availability." },
            ].map((m) => (
              <div key={m.title} className="p-5 rounded-xl bg-[#141414] border border-[#2a2a2a]">
                <h3 className="text-white font-bold mb-2 text-sm">{m.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* SCORE BREAKDOWN */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Criteria Breakdown</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              STREAMB4 SCORES
            </h2>
          </div>
          <div className="space-y-3">
            {SCORE_CRITERIA.map((c) => (
              <div key={c.criterion} className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{c.criterion}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{c.detail}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-24 h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.score * 10}%`, background: "linear-gradient(90deg,#ff7a00,#ffb300)" }}
                    />
                  </div>
                  <span className="text-white font-black text-sm w-8 text-right">{c.score}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 rounded-xl border border-[#FF6B00]/30 flex items-center justify-between" style={{ background: "rgba(255,107,0,0.05)" }}>
            <span className="text-white font-bold">Overall Score</span>
            <span className="text-2xl font-black" style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {overallScore} / 10
            </span>
          </div>
        </div>
      </AnimatedSection>

      {/* COMPARISON TABLE */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">vs Cable & Satellite</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              STREAMB4 vs TRADITIONAL TV
            </h2>
          </div>
          <div className="rounded-2xl border border-[#2a2a2a] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
              <div className="p-4 text-gray-500 text-xs uppercase tracking-wider font-bold">Feature</div>
              <div className="p-4 text-center border-x border-[#2a2a2a]">
                <span className="text-[#FF6B00] font-black text-sm uppercase tracking-wide">STREAMB4</span>
              </div>
              <div className="p-4 text-center text-gray-500 text-sm font-bold">Cable / Satellite</div>
            </div>
            {COMPARE.map((row) => (
              <div key={row.feature} className="grid grid-cols-3 border-b border-[#1a1a1a] last:border-0 hover:bg-[#141414] transition-colors">
                <div className="p-4 text-gray-400 text-sm">{row.feature}</div>
                <div className="p-4 text-center border-x border-[#1a1a1a]">
                  <span className="text-emerald-400 font-semibold text-sm">{row.streamb4}</span>
                </div>
                <div className="p-4 text-center text-gray-500 text-sm">{row.cable}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* VERDICT */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Our Verdict</p>
              <h2
                className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
              >
                THE BEST IPTV SERVICE IN 2026
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                After 30 days of live testing across 8 services, STREAMB4 is our clear winner. The combination of channel quantity, stream reliability during peak sports events, and honest pricing is not matched by any competitor we tested.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                The anti-freeze technology is the differentiator for sports fans — we streamed NFL playoff games and Premier League Saturday fixtures without a single dropout. Competitors at similar price points showed buffering within the first 30 minutes of high-traffic kickoffs.
              </p>
              <ul className="space-y-3">
                {VERDICT_BULLETS.map((b) => (
                  <li key={b} className="flex gap-3">
                    <Check className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#141414] border border-[#FF6B00]/20">
                <p className="text-[#FF6B00] font-bold text-xs uppercase tracking-widest mb-4">What We Liked</p>
                <ul className="space-y-2">
                  {["No blackouts on any sport tested", "Trial is genuinely unrestricted", "Support responded in 4 minutes average", "Stable through 6 simultaneous streams", "Catch-up works reliably for 7 days"].map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-[#141414] border border-[#2a2a2a]">
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">Minor Considerations</p>
                <ul className="space-y-2">
                  {["WhatsApp-based ordering (not instant web checkout)", "Some regional sports feeds vary by time of year"].map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-gray-400">
                      <X className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/free-trial">
                <Button variant="primary" className="w-full font-black uppercase tracking-wide py-4">
                  ⚡ Try Free — No Card Required
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* WHO IT'S FOR */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Best For</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              WHO STREAMB4 IS FOR
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "🏈⚽🏀",
                title: "Sports Fans",
                desc: "You watch NFL, Premier League, Champions League, NBA, or UFC regularly. STREAMB4 covers all of these with no blackouts and no per-sport fees.",
                href: "/sports",
              },
              {
                icon: "🇺🇸🇬🇧🇨🇦",
                title: "USA, UK & Canada Viewers",
                desc: "Dedicated edge nodes in Chicago, New York, London, Toronto, and Montreal give low-latency streams for viewers in North America and the UK.",
                href: "/channels",
              },
              {
                icon: "📺",
                title: "Cord-Cutters",
                desc: "You're paying $80-200/month for cable and want to switch. STREAMB4 gives you more channels at 10% of the cost with no lock-in contract.",
                href: "/pricing",
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Families",
                desc: "Up to 6 simultaneous connections on one subscription. Different family members can watch different channels on different devices at the same time.",
                href: "/pricing",
              },
              {
                icon: "🌍",
                title: "International Viewers",
                desc: "Living abroad and want home-country channels? French, German, Arabic, Spanish, Italian, and 35+ other country packages are included.",
                href: "/channels",
              },
              {
                icon: "💼",
                title: "Resellers",
                desc: "Want to sell IPTV subscriptions under your own brand? STREAMB4's reseller program gives you wholesale pricing and a complete back-end.",
                href: "/reseller",
              },
            ].map((card) => (
              <Link key={card.title} href={card.href} className="group p-6 rounded-2xl bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/40 transition-all duration-300">
                <span className="text-3xl block mb-3">{card.icon}</span>
                <h3 className="text-white font-bold mb-2 group-hover:text-[#FF6B00] transition-colors">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* WHAT TO LOOK FOR */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Buyer's Guide</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              WHAT TO LOOK FOR IN AN IPTV SERVICE
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Not all IPTV services are equal. These six factors separate reliable premium services from the cheap resellers that disappear after a month.
            </p>
          </div>
          <div className="space-y-4">
            {WHAT_TO_LOOK_FOR.map((item, i) => (
              <div key={item.title} className="flex gap-5 p-5 rounded-xl bg-[#141414] border border-[#2a2a2a]">
                <span
                  className="text-2xl font-black flex-shrink-0 w-8 leading-none mt-0.5"
                  style={{ fontFamily: "var(--font-anton), Anton, sans-serif", background: "linear-gradient(135deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-white font-bold mb-2 text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* WHAT IS IPTV */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Explained</p>
              <h2
                className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
              >
                WHAT IS IPTV?
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                IPTV stands for Internet Protocol Television. It delivers live TV channels and video-on-demand content over your broadband connection — the same pipe that serves your email and web browsing — rather than through a satellite dish or cable infrastructure.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                This architecture removes the physical constraint of cable and satellite. A single server can simultaneously broadcast tens of thousands of channels globally, which is why IPTV providers can offer channel counts that cable can never match at a cost cable can never compete with.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The key technical components are a media server (where the stream originates), a CDN (which gets the stream to you efficiently), and a client app on your device (which displays the stream). The quality of each layer determines your experience.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { term: "Live Channels", def: "Real-time broadcast streams — sports, news, entertainment — delivered as they happen. Same as traditional TV but over IP." },
                { term: "VOD (Video on Demand)", def: "A library of films and series you can watch any time, similar to Netflix. Most IPTV services include a VOD catalogue alongside live channels." },
                { term: "EPG (Electronic Programme Guide)", def: "The on-screen TV schedule that shows what's playing now and what's coming up. Essential for navigation in large channel lineups." },
                { term: "Catch-Up TV", def: "The ability to watch a programme that already aired, typically within a 7-day window. You don't need to record — the server keeps a buffer." },
                { term: "Anti-Freeze / Anti-Buffering", def: "Technology that automatically switches to a backup server when your primary stream becomes unstable. The key reliability differentiator between providers." },
                { term: "M3U / Xtream Codes", def: "The two main playlist formats used by IPTV apps. Xtream Codes is more feature-rich and is used by STREAMB4 for EPG and catch-up support." },
              ].map((item) => (
                <div key={item.term} className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2a2a2a]">
                  <p className="text-[#FF6B00] font-bold text-xs uppercase tracking-wider mb-1">{item.term}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.def}</p>
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
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Common Questions</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              IPTV QUESTIONS ANSWERED
            </h2>
          </div>
          <div className="space-y-3">
            {IPTV_FAQS.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </AnimatedSection>

      {/* PRICING SUMMARY */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-t border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Pricing</p>
          <h2
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-8"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            PLANS THAT FIT EVERY BUDGET
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              { name: "Solo", connections: "1 screen", monthly: "$9", quarterly: "$34.99", best: "3 months" },
              { name: "Family", connections: "3 screens", monthly: "$24.99", quarterly: "$74.99", best: "Most popular", highlight: true },
              { name: "Ultimate", connections: "6 screens", monthly: "$45.99", quarterly: "$129.99", best: "Best value" },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border ${plan.highlight ? "border-[#FF6B00] bg-[#1a1a1a]" : "border-[#2a2a2a] bg-[#141414]"}`}
              >
                {plan.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF6B00] text-white text-xs font-black uppercase tracking-wide mb-3">
                    {plan.best}
                  </span>
                )}
                <h3 className="text-white font-black text-xl mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{plan.connections}</p>
                <p className="text-3xl font-black text-white">{plan.monthly}<span className="text-gray-500 text-sm font-normal">/mo</span></p>
                <p className="text-gray-500 text-xs mt-1 mb-4">{plan.quarterly} for 3 months</p>
                {!plan.highlight && <p className="text-[#FF6B00] text-xs font-semibold">{plan.best}</p>}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing">
              <Button variant="primary" className="px-8 py-4 font-black text-base uppercase tracking-wide">
                View All Plans & Pricing
              </Button>
            </Link>
            <Link href="/free-trial">
              <Button variant="outline" className="px-8 py-4 font-bold text-base uppercase tracking-wide">
                Try Free First →
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
