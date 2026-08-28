"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Check } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States", slug: "usa", channels: "15,000+", sports: ["NFL", "NBA", "MLB", "NHL", "UFC"] },
  { flag: "🇬🇧", name: "United Kingdom", slug: "united-kingdom", channels: "10,000+", sports: ["Premier League", "Champions League", "F1", "Rugby"] },
  { flag: "🇨🇦", name: "Canada", slug: "canada", channels: "8,000+", sports: ["NHL", "NBA", "CFL", "MLS"] },
  { flag: "🇩🇪", name: "Germany", slug: "europe", channels: "5,000+", sports: ["Bundesliga", "Champions League", "Formula 1"] },
  { flag: "🇫🇷", name: "France", slug: "europe", channels: "4,500+", sports: ["Ligue 1", "Champions League", "Rugby"] },
  { flag: "🇪🇸", name: "Spain", slug: "europe", channels: "4,000+", sports: ["La Liga", "Champions League", "MotoGP"] },
  { flag: "🇮🇹", name: "Italy", slug: "europe", channels: "4,000+", sports: ["Serie A", "Champions League", "Moto GP"] },
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

function CategoryCard({ cat }: { cat: typeof CATEGORIES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a1a1a] transition-colors"
      >
        <div>
          <span className="text-white font-bold">{cat.name}</span>
          <span className="ml-2 text-xs text-[#FF6B00] font-semibold">{cat.count} channels</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#2a2a2a]">
          <div className="flex flex-wrap gap-2 pt-4">
            {cat.channels.map((ch) => (
              <span key={ch} className="text-xs px-2.5 py-1 rounded-lg bg-[#0d0d0d] border border-[#2a2a2a] text-gray-400">
                {ch}
              </span>
            ))}
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] font-semibold">
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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF6B00]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
            Updated August 2026
          </div>
          <h1
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            50,000+{" "}
            <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              LIVE CHANNELS
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Browse the complete STREAMB4 channel lineup — sports, entertainment, news, kids, and international channels from 30+ countries.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-10">
            {["30+ Countries", "60+ Categories", "1,800+ Sports Channels", "40+ Languages"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#FF6B00]" /> {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/free-trial">
              <Button variant="primary" className="px-8 py-4 font-black text-base uppercase tracking-wide">
                Try Free 24 Hours
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="px-8 py-4 font-bold text-base uppercase tracking-wide">
                View Pricing →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* COUNTRY GRID */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">30+ Countries</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              CHANNELS BY COUNTRY
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">Every country package is included in every STREAMB4 plan. Switch between any country without changing plans.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COUNTRIES.map((c) => (
              <Link
                key={c.slug + c.name}
                href={`/${c.slug}`}
                className="group p-5 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/40 transition-all duration-300 hover:bg-[#1a1a1a]"
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
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#0d0d0d] border border-[#2a2a2a] text-gray-400">{s}</span>
                  ))}
                  {c.sports.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0d0d0d] border border-[#2a2a2a] text-gray-500">+{c.sports.length - 3}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CHANNEL CATEGORIES */}
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Browse Categories</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              CHANNEL CATEGORIES
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm mb-8">Browse channels by category. Click any category to see a sample of what's available — the full list is much larger.</p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search channels or categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white placeholder-gray-600 focus:border-[#FF6B00]/50 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((cat) => <CategoryCard key={cat.name} cat={cat} />)
            ) : (
              <p className="text-center text-gray-500 py-8">No categories match your search. <button onClick={() => setSearch("")} className="text-[#FF6B00] hover:underline">Clear search</button></p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* SPORTS CHANNELS HIGHLIGHT */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">1,800+ Sports Channels</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              EVERY SPORT COVERED
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { emoji: "🏈", name: "NFL", channels: "120+", href: "/sports/nfl" },
              { emoji: "⚽", name: "Premier League", channels: "150+", href: "/sports/premier-league" },
              { emoji: "🏀", name: "NBA", channels: "90+", href: "/sports/nba" },
              { emoji: "⭐", name: "Champions League", channels: "80+", href: "/sports/champions-league" },
              { emoji: "🥊", name: "UFC / MMA", channels: "60+", href: "/sports/ufc" },
              { emoji: "🏎️", name: "Formula 1", channels: "40+", href: "/sports/formula-1" },
            ].map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="group p-5 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/40 text-center transition-all duration-300"
              >
                <span className="text-3xl block mb-2">{s.emoji}</span>
                <p className="text-white font-bold text-sm group-hover:text-[#FF6B00] transition-colors">{s.name}</p>
                <p className="text-[#FF6B00] text-xs mt-1">{s.channels} feeds</p>
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
      <AnimatedSection className="py-24 bg-[#0d0d0d] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">What's Included</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              MORE THAN JUST LIVE TV
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Full EPG Programme Guide",
                desc: "Every channel in your lineup comes with a complete electronic programme guide. See what's on now, what's starting in 30 minutes, and schedule your viewing in advance — just like a traditional TV guide.",
              },
              {
                title: "7-Day Catch-Up TV",
                desc: "Missed a match or episode? STREAMB4 keeps a 7-day rolling archive on supported channels. Rewind to any programme that aired in the past week without setting up recordings.",
              },
              {
                title: "Multiple Quality Tiers",
                desc: "Channels are available in SD, HD, Full HD, and 4K where the source broadcast supports it. Your app automatically selects the highest quality your connection can handle, or you can lock to a lower tier on slow connections.",
              },
              {
                title: "Redundant Server Architecture",
                desc: "Each channel is hosted across multiple redundant servers. If one server degrades, anti-freeze technology switches your stream to a backup automatically — with no manual intervention on your part.",
              },
              {
                title: "No Extra Packages",
                desc: "Every country package, every sports tier, and every language is included in every STREAMB4 plan. There are no sports bolt-ons, no international add-ons, no 4K premium tiers.",
              },
              {
                title: "All Devices, One Account",
                desc: "Your channel lineup is accessible on Fire TV Stick, Smart TV, Android, iPhone, Windows, and Mac simultaneously, up to your plan's connection limit. No per-device activation required.",
              },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-[#141414] border border-[#2a2a2a]">
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Quality tier table */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-white font-bold text-center mb-6 text-sm uppercase tracking-wider">Stream Quality Available</h3>
            <div className="rounded-2xl border border-[#2a2a2a] overflow-hidden">
              <div className="grid grid-cols-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <div className="p-4 text-gray-500 text-xs uppercase tracking-wider font-bold">Quality</div>
                <div className="p-4 text-gray-500 text-xs uppercase tracking-wider font-bold border-x border-[#2a2a2a]">Resolution</div>
                <div className="p-4 text-gray-500 text-xs uppercase tracking-wider font-bold">Min. Speed Required</div>
              </div>
              {[
                { q: "Standard HD", r: "1280 × 720p", s: "5 Mbps" },
                { q: "Full HD", r: "1920 × 1080p", s: "10 Mbps" },
                { q: "4K Ultra HD", r: "3840 × 2160p", s: "25 Mbps" },
                { q: "4K HDR", r: "3840 × 2160p + HDR10", s: "30 Mbps" },
              ].map((row) => (
                <div key={row.q} className="grid grid-cols-3 border-b border-[#1a1a1a] last:border-0">
                  <div className="p-4 text-gray-300 text-sm font-semibold">{row.q}</div>
                  <div className="p-4 text-gray-400 text-sm border-x border-[#1a1a1a]">{row.r}</div>
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
          <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">How It Works</p>
          <h2
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            HOW THE CHANNEL LINEUP IS ORGANISED
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-gray-400 leading-relaxed mb-4">
                The full lineup of 50,000+ channels is organised by country, category, and quality tier inside the IPTV app. When you open the EPG, you'll see a country-based folder structure — USA channels, UK channels, International sports, and so on — making it easy to navigate even with tens of thousands of options.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Sports channels get their own dedicated section, organised by league: Premier League, NFL, NBA, UFC, and Formula 1 each have dedicated broadcast streams from every major rights holder in that sport. During peak events, multiple parallel feeds cover the same match from different camera angles or commentary languages.
              </p>
            </div>
            <div>
              <p className="text-gray-400 leading-relaxed mb-4">
                PPV (Pay-Per-View) events — UFC main cards, boxing, and major WWE events — are included in all STREAMB4 plans without additional charge. You don't pay per-event on top of your subscription.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The VOD library is separate from the live channel section and organised like a streaming catalogue — search by title, browse by genre, or filter by country of origin. New releases are added continuously. Catch-up TV appears automatically in the EPG for channels that support it.
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
      <AnimatedSection className="py-20 bg-[#050505] border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
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
              <Button variant="primary" className="px-8 py-4 font-black text-base uppercase tracking-wide">
                Try Free — No Card Required
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="px-8 py-4 font-bold text-base uppercase tracking-wide">
                View Pricing →
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
