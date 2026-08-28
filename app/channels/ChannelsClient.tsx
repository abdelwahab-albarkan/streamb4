"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States", slug: "usa", channels: "15,000+", sports: ["NFL", "NBA", "MLB", "NHL", "UFC"] },
  { flag: "🇬🇧", name: "United Kingdom", slug: "united-kingdom", channels: "10,000+", sports: ["Premier League", "Champions League", "F1", "Rugby"] },
  { flag: "🇨🇦", name: "Canada", slug: "canada", channels: "8,000+", sports: ["NHL", "NBA", "CFL", "MLS"] },
  { flag: "🇩🇪", name: "Germany", slug: "europe", channels: "5,000+", sports: ["Bundesliga", "Champions League", "Formula 1"] },
  { flag: "🇫🇷", name: "France", slug: "europe", channels: "4,500+", sports: ["Ligue 1", "Champions League", "Rugby"] },
  { flag: "🇪🇸", name: "Spain", slug: "europe", channels: "4,000+", sports: ["La Liga", "Champions League", "MotoGP"] },
  { flag: "🇮🇹", name: "Italy", slug: "europe", channels: "4,000+", sports: ["Serie A", "Champions League", "MotoGP"] },
  { flag: "🇳🇱", name: "Netherlands", slug: "europe", channels: "2,500+", sports: ["Eredivisie", "Champions League"] },
  { flag: "🇵🇹", name: "Portugal", slug: "europe", channels: "2,000+", sports: ["Primeira Liga", "Champions League"] },
  { flag: "🇧🇷", name: "Brazil", slug: "europe", channels: "3,500+", sports: ["Brasileirão", "Copa Libertadores"] },
  { flag: "🇸🇦", name: "Saudi Arabia", slug: "europe", channels: "2,500+", sports: ["Saudi Pro League", "World Cup"] },
  { flag: "🇦🇺", name: "Australia", slug: "europe", channels: "2,000+", sports: ["AFL", "NRL", "A-League", "Cricket"] },
];

const CATEGORIES = [
  {
    name: "USA Sports",
    channels: ["CBS Sports", "ESPN", "ESPN2", "Fox Sports 1", "Fox Sports 2", "NBC Sports", "NFL Network", "NFL RedZone", "NBA TV", "MLB Network", "NHL Network", "Tennis Channel"],
    count: "200+",
  },
  {
    name: "UK Sports",
    channels: ["Sky Sports Main Event", "Sky Sports Premier League", "Sky Sports Football", "Sky Sports F1", "TNT Sports 1", "TNT Sports 2", "TNT Sports 3", "TNT Sports 4", "BBC Sport"],
    count: "150+",
  },
  {
    name: "Entertainment (USA)",
    channels: ["HBO", "Showtime", "Starz", "AMC", "FX", "USA Network", "TNT", "TBS", "A&E", "History Channel", "Discovery", "National Geographic"],
    count: "500+",
  },
  {
    name: "Entertainment (UK)",
    channels: ["BBC One", "BBC Two", "ITV", "Channel 4", "Channel 5", "Sky One", "Sky Atlantic", "Sky Comedy", "ITV2", "E4", "More4"],
    count: "300+",
  },
  {
    name: "Movies & Cinema",
    channels: ["Sky Cinema Premier", "Sky Cinema Action", "HBO Movies", "Showtime Movies", "Starz Cinema", "Turner Classic Movies", "Fox Movies", "MGM HD"],
    count: "120+",
  },
  {
    name: "News Channels",
    channels: ["CNN", "BBC News", "Fox News", "MSNBC", "Sky News", "Al Jazeera English", "France 24", "DW News", "Euronews", "Bloomberg TV", "CNBC"],
    count: "80+",
  },
  {
    name: "Kids & Family",
    channels: ["Disney Channel", "Disney Junior", "Disney XD", "Cartoon Network", "Nickelodeon", "Nick Jr.", "Boomerang", "CBBC", "CBeebies", "Baby TV"],
    count: "100+",
  },
  {
    name: "French Channels",
    channels: ["TF1", "France 2", "France 3", "France 5", "M6", "Canal+", "W9", "TMC", "RMC Sport", "BFM TV", "CNews", "Arte"],
    count: "200+",
  },
  {
    name: "German Channels",
    channels: ["ARD", "ZDF", "RTL", "ProSieben", "Sat.1", "VOX", "Sky Sport Germany", "DAZN Germany", "Eurosport Germany", "Sky Bundesliga"],
    count: "180+",
  },
  {
    name: "Arabic Channels",
    channels: ["MBC1", "MBC2", "MBC Drama", "beIN Sports 1", "beIN Sports 2", "beIN Sports 3", "Al Jazeera", "OSN", "Dubai TV", "Abu Dhabi TV"],
    count: "400+",
  },
  {
    name: "PPV & Premium Sports",
    channels: ["UFC Fight Pass", "Bellator", "ONE Championship", "WWE Network", "DAZN", "FloSport", "Premier Boxing Champions", "Matchroom Boxing"],
    count: "60+",
  },
  {
    name: "Latino & Spanish",
    channels: ["Univision", "Telemundo", "ESPN Deportes", "Fox Deportes", "TyC Sports", "beIN Sports en Español", "Univision Deportes", "NBC Universo"],
    count: "250+",
  },
];

const SPORTS_HIGHLIGHTS = [
  { name: "NFL", channels: "120+", href: "/sports/nfl" },
  { name: "Premier League", channels: "150+", href: "/sports/premier-league" },
  { name: "NBA", channels: "90+", href: "/sports/nba" },
  { name: "Champions League", channels: "80+", href: "/sports/champions-league" },
  { name: "UFC / MMA", channels: "60+", href: "/sports/ufc" },
  { name: "Formula 1", channels: "40+", href: "/sports/formula-1" },
];

function Eyebrow({ text, centered = true }: { text: string; centered?: boolean }) {
  if (centered) {
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
  return (
    <span
      className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-4"
      style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
    >
      {text}
    </span>
  );
}

function CategoryCard({ cat }: { cat: typeof CATEGORIES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(5,5,5,0.97) 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm">{cat.name}</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: "rgba(255,138,0,0.1)", color: "#ff7a00", border: "1px solid rgba(255,138,0,0.2)" }}
          >
            {cat.count}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-white/[0.04]">
          <div className="flex flex-wrap gap-2 pt-4">
            {cat.channels.map((ch) => (
              <span
                key={ch}
                className="text-xs px-2.5 py-1 rounded-lg text-gray-400"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {ch}
              </span>
            ))}
            <span
              className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ background: "rgba(255,138,0,0.1)", color: "#ff7a00", border: "1px solid rgba(255,138,0,0.2)" }}
            >
              + many more
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChannelsClient() {
  const [search, setSearch] = useState("");

  const filtered = CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.channels.some((ch) => ch.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* HERO */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-[#050505]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,122,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,122,0,0.07), transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal delay={0.1}>
            <span
              className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Updated August 2026
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h1
              className="font-black text-white uppercase leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
            >
              50,000+{" "}
              <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                LIVE CHANNELS
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Browse the complete STREAMB4 channel lineup — sports, entertainment, news, kids, and international channels from 30+ countries.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 mb-10">
              {["30+ Countries", "60+ Categories", "1,800+ Sports Channels", "40+ Languages"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/free-trial">
                <MagneticButton
                  className="px-10 py-5 rounded-full font-black text-black text-base uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_60px_rgba(255,122,0,0.6)] transition-all duration-300 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)", boxShadow: "0 0 40px rgba(255,122,0,0.35)" }}
                >
                  Try Free 24 Hours
                </MagneticButton>
              </Link>
              <Link href="/pricing">
                <MagneticButton className="px-10 py-5 rounded-full font-bold text-white text-base uppercase tracking-wide border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:scale-105 transition-all duration-300 cursor-pointer">
                  View Pricing →
                </MagneticButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* COUNTRY GRID */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="30+ Countries" />
            <h2
              className="font-black text-white uppercase leading-[0.9] tracking-tight mb-3"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              CHANNELS BY COUNTRY
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">Every country package is included in every STREAMB4 plan. Switch between any country without changing plans.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COUNTRIES.map((c) => (
              <Link
                key={c.slug + c.name}
                href={`/${c.slug}`}
                className="group p-5 rounded-xl transition-all duration-300"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(5,5,5,0.97) 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <p className="text-white font-bold text-sm group-hover:text-[#FF6B00] transition-colors">{c.name}</p>
                    <p className="text-[#FF6B00] text-xs font-semibold">{c.channels} channels</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.sports.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-full text-gray-500"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      {s}
                    </span>
                  ))}
                  {c.sports.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 text-gray-600">+{c.sports.length - 3}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CHANNEL CATEGORIES */}
      <AnimatedSection className="py-24 bg-[#050505] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="Browse Categories" />
            <h2
              className="font-black text-white uppercase leading-[0.9] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              CHANNEL CATEGORIES
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm mb-8">Browse channels by category. Click any category to see a sample — the full list is much larger.</p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search channels or categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {filtered.length > 0 ? (
              filtered.map((cat) => <CategoryCard key={cat.name} cat={cat} />)
            ) : (
              <p className="text-center text-gray-500 py-8">
                No categories match your search.{" "}
                <button onClick={() => setSearch("")} className="text-[#FF6B00] hover:underline">Clear search</button>
              </p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* SPORTS HIGHLIGHT */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="1,800+ Sports Channels" />
            <h2
              className="font-black text-white uppercase leading-[0.9] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              EVERY SPORT COVERED
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPORTS_HIGHLIGHTS.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="group p-5 rounded-xl text-center transition-all duration-300 hover:border-[#FF6B00]/30"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(5,5,5,0.97) 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-white font-bold text-sm group-hover:text-[#FF6B00] transition-colors mb-1">{s.name}</p>
                <p className="text-gray-500 text-xs">{s.channels} feeds</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/sports" className="text-[#FF6B00] text-sm font-semibold hover:underline">
              View all sports →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* QUALITY & FEATURES */}
      <AnimatedSection className="py-24 bg-[#050505] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="What's Included" />
            <h2
              className="font-black text-white uppercase leading-[0.9] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              MORE THAN JUST LIVE TV
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {[
              {
                title: "Full EPG Programme Guide",
                desc: "Every channel in your lineup comes with a complete electronic programme guide. See what's on now, what's starting in 30 minutes, and schedule your viewing in advance.",
              },
              {
                title: "7-Day Catch-Up TV",
                desc: "Missed a match or episode? STREAMB4 keeps a 7-day rolling archive on supported channels — no recording setup required.",
              },
              {
                title: "Multiple Quality Tiers",
                desc: "Channels are available in SD, HD, Full HD, and 4K where the source broadcast supports it. Your app automatically selects the highest quality your connection can handle.",
              },
              {
                title: "Redundant Server Architecture",
                desc: "Each channel is hosted across multiple redundant servers. Anti-freeze technology switches your stream to a backup automatically if one server degrades.",
              },
              {
                title: "No Extra Packages",
                desc: "Every country package, every sports tier, and every language is included in every STREAMB4 plan. No sports bolt-ons, no international add-ons.",
              },
              {
                title: "All Devices, One Account",
                desc: "Your channel lineup is accessible on Fire TV Stick, Smart TV, Android, iPhone, Windows, and Mac simultaneously, up to your plan's connection limit.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-[18px]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                }}
              >
                <h3 className="text-white font-bold mb-3 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Quality tier table */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-white font-bold text-center mb-6 text-sm uppercase tracking-wider text-gray-400">Stream Quality Available</h3>
            <div
              className="rounded-[18px] overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(5,5,5,0.98) 100%)" }}
            >
              <div className="grid grid-cols-3 border-b border-white/[0.04]">
                <div className="p-4 text-gray-600 text-xs uppercase tracking-wider font-bold">Quality</div>
                <div className="p-4 text-gray-600 text-xs uppercase tracking-wider font-bold border-x border-white/[0.04]">Resolution</div>
                <div className="p-4 text-gray-600 text-xs uppercase tracking-wider font-bold">Min. Speed</div>
              </div>
              {[
                { q: "Standard HD", r: "1280 × 720p", s: "5 Mbps" },
                { q: "Full HD", r: "1920 × 1080p", s: "10 Mbps" },
                { q: "4K Ultra HD", r: "3840 × 2160p", s: "25 Mbps" },
                { q: "4K HDR", r: "3840 × 2160p + HDR10", s: "30 Mbps" },
              ].map((row) => (
                <div key={row.q} className="grid grid-cols-3 border-b border-white/[0.03] last:border-0">
                  <div className="p-4 text-gray-300 text-sm font-semibold">{row.q}</div>
                  <div className="p-4 text-gray-400 text-sm border-x border-white/[0.03]">{row.r}</div>
                  <div className="p-4 text-[#FF6B00] text-sm font-semibold">{row.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* HOW CHANNELS ARE ORGANISED */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow text="How It Works" />
          <h2
            className="font-black text-white uppercase leading-[0.9] tracking-tight mb-6 text-center"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            HOW THE CHANNEL LINEUP IS ORGANISED
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-gray-400 leading-relaxed mb-4">
                The full lineup of 50,000+ channels is organised by country, category, and quality tier inside the IPTV app. You'll see a country-based folder structure — USA channels, UK channels, International sports, and so on — making it easy to navigate even with tens of thousands of options.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Sports channels have their own dedicated section, organised by league. Premier League, NFL, NBA, UFC, and Formula 1 each have dedicated broadcast streams from every major rights holder in that sport. During peak events, multiple parallel feeds cover the same match from different camera angles or commentary languages.
              </p>
            </div>
            <div>
              <p className="text-gray-400 leading-relaxed mb-4">
                PPV events — UFC main cards, boxing, and major WWE events — are included in all STREAMB4 plans without additional charge. You don't pay per-event on top of your subscription.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The VOD library is separate from the live channel section and organised like a streaming catalogue — search by title, browse by genre, or filter by country of origin. Catch-up TV appears automatically in the EPG for channels that support it.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/free-trial">
              <Button variant="primary" className="px-8 py-4 font-black text-base uppercase tracking-wide">
                Test the Full Lineup Free →
              </Button>
            </Link>
            <Link href="/install">
              <Button variant="outline" className="px-8 py-4 font-bold text-base uppercase tracking-wide">
                Setup Guide
              </Button>
            </Link>
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
          <h2
            className="font-black text-white uppercase leading-[0.9] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            START WATCHING{" "}
            <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              TODAY
            </span>
          </h2>
          <p className="text-gray-400 mb-8">All 50,000+ channels on every plan. No extra packages. No hidden fees.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/free-trial">
              <MagneticButton
                className="px-10 py-5 rounded-full font-black text-black text-base uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_60px_rgba(255,122,0,0.6)] transition-all duration-300 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)", boxShadow: "0 0 40px rgba(255,122,0,0.4)" }}
              >
                Try Free — No Card Required
              </MagneticButton>
            </Link>
            <Link href="/pricing">
              <MagneticButton className="px-10 py-5 rounded-full font-bold text-white text-base uppercase tracking-wide border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:scale-105 transition-all duration-300 cursor-pointer">
                View Pricing →
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
