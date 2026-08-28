"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";

const SPORTS = [
  {
    emoji: "🏈",
    name: "NFL",
    fullName: "National Football League",
    slug: "nfl",
    channels: "120+",
    season: "Sep – Feb",
    channels_list: ["CBS", "NBC", "Fox", "ESPN", "NFL Network", "RedZone"],
    desc: "Every regular season game, all playoff matchups, and the Super Bowl — live across CBS, NBC, Fox, ESPN, and NFL Network.",
  },
  {
    emoji: "⚽",
    name: "Premier League",
    fullName: "English Premier League",
    slug: "premier-league",
    channels: "150+",
    season: "Aug – May",
    channels_list: ["Sky Sports", "TNT Sports", "BBC", "Amazon"],
    desc: "All 380 matches across Sky Sports, TNT Sports, and Amazon Prime Video sports nights. The full season on one subscription.",
  },
  {
    emoji: "⭐",
    name: "Champions League",
    fullName: "UEFA Champions League",
    slug: "champions-league",
    channels: "80+",
    season: "Sep – Jun",
    channels_list: ["TNT Sports", "CBS Sports", "DAZN", "Canal+"],
    desc: "Group stage through to the Final — TNT Sports for UK, CBS Sports for USA, DAZN for Germany, Canal+ for France.",
  },
  {
    emoji: "🏀",
    name: "NBA",
    fullName: "National Basketball Association",
    slug: "nba",
    channels: "90+",
    season: "Oct – Jun",
    channels_list: ["ESPN", "ABC", "TNT", "NBA TV"],
    desc: "Every regular season game, All-Star Weekend, the playoffs, and the NBA Finals across ESPN, ABC, TNT, and NBA TV.",
  },
  {
    emoji: "🥊",
    name: "UFC / MMA",
    fullName: "Ultimate Fighting Championship",
    slug: "ufc",
    channels: "60+",
    season: "Year-round",
    channels_list: ["ESPN+", "ESPN", "TNT Sports", "Bellator"],
    desc: "Every UFC PPV event, ESPN Fight Nights, and preliminary bouts — no per-event fees on top of your subscription.",
  },
  {
    emoji: "🏎️",
    name: "Formula 1",
    fullName: "F1 World Championship",
    slug: "formula-1",
    channels: "40+",
    season: "Mar – Nov",
    channels_list: ["Sky Sports F1", "ESPN", "Canal+", "ServusTV"],
    desc: "All 24 Grand Prix weekends — practice, qualifying, Sprint races, and the Grand Prix — across Sky Sports F1, ESPN, and Canal+.",
  },
  {
    emoji: "🏒",
    name: "NHL",
    fullName: "National Hockey League",
    slug: null,
    channels: "70+",
    season: "Oct – Jun",
    channels_list: ["ESPN+", "TNT", "Sportsnet", "TSN"],
    desc: "Full NHL coverage for both US and Canadian audiences. ESPN+/Hulu games plus all Sportsnet and TSN regional feeds.",
  },
  {
    emoji: "⚾",
    name: "MLB",
    fullName: "Major League Baseball",
    slug: null,
    channels: "80+",
    season: "Apr – Oct",
    channels_list: ["Fox", "ESPN", "TBS", "MLB Network"],
    desc: "Regular season, All-Star Game, and World Series coverage across Fox, ESPN, TBS, and the dedicated MLB Network channel.",
  },
  {
    emoji: "🏉",
    name: "Rugby",
    fullName: "Rugby Union & League",
    slug: null,
    channels: "50+",
    season: "Year-round",
    channels_list: ["Sky Sports", "ITV", "Channel 4", "BBC"],
    desc: "Six Nations, Rugby World Cup, Premiership, Super Rugby, and Autumn Internationals all on Sky Sports and free-to-air.",
  },
  {
    emoji: "🎾",
    name: "Tennis",
    fullName: "ATP & WTA Tour",
    slug: null,
    channels: "50+",
    season: "Year-round",
    channels_list: ["Tennis Channel", "Sky Sports", "Eurosport", "BBC"],
    desc: "All four Grand Slams and Masters 1000 events on Tennis Channel, Sky Sports Tennis, and Eurosport coverage.",
  },
  {
    emoji: "🏌️",
    name: "Golf",
    fullName: "PGA Tour & DP World Tour",
    slug: null,
    channels: "30+",
    season: "Year-round",
    channels_list: ["Golf Channel", "Sky Sports Golf", "NBC Sports", "CBS Sports"],
    desc: "PGA Tour events, The Masters, The Open Championship, Ryder Cup, and European Tour on Golf Channel and Sky Sports Golf.",
  },
  {
    emoji: "🏊",
    name: "Olympics & Multi-Sport",
    fullName: "Olympic Games & Major Events",
    slug: null,
    channels: "40+",
    season: "Bi-annual",
    channels_list: ["NBC Sports", "BBC", "Eurosport", "France TV"],
    desc: "Olympics, Commonwealth Games, World Athletics Championships, and other global multi-sport events across major broadcasters.",
  },
];

const WHY_FEATURES = [
  { title: "Anti-Freeze Technology", desc: "Our proprietary stream management keeps live sports smooth even during peak kickoff and tipoff traffic." },
  { title: "No Blackout Restrictions", desc: "Watch your team from any location. No out-of-market restrictions, no geographic locks, no VPN required." },
  { title: "Multiple Sports Feeds", desc: "Key matches are carried on multiple feeds so you can switch if one has any technical issue — no missing the game." },
  { title: "Full EPG Guide", desc: "See every match kickoff time, channel, and competition in your TV guide. Set reminders directly in your IPTV app." },
  { title: "4K HDR Where Available", desc: "Broadcaster permitting, key matches on Sky Sports UHD, ESPN 4K, and ABC are available in 4K HDR." },
];

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

export default function SportsClient() {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,122,0,0.08), transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal delay={0.1}>
            <span
              className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              1,800+ Sports Channels
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h1
              className="font-black text-white uppercase leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
            >
              STREAM EVERY{" "}
              <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                SPORT
              </span>{" "}
              IN 4K
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              NFL, Premier League, Champions League, NBA, UFC, Formula 1, NHL, MLB and more — live, in HD and 4K, on every device. No blackouts. No per-sport add-ons.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 mb-10">
              {["No Blackouts", "Live & Replay", "4K Where Available", "No Extra Fees"].map((t) => (
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

      {/* STATS */}
      <AnimatedSection className="border-y border-white/[0.04] bg-[#0d0d0d] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "1,800+", label: "Sports Channels" },
              { value: "12+", label: "Major Sports Covered" },
              { value: "4K", label: "HDR on Key Matches" },
              { value: "0", label: "Blackout Restrictions" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* SPORTS GRID */}
      <AnimatedSection className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="All Sports" />
            <h2
              className="font-black text-white uppercase leading-[0.9] tracking-tight"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              EVERY SPORT ON ONE SUBSCRIPTION
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPORTS.map((sport) => {
              const Card = (
                <div
                  className={`group p-6 rounded-[20px] transition-all duration-300 ${sport.slug ? "cursor-pointer hover:border-[#FF6B00]/30" : ""}`}
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-2xl leading-none">{sport.emoji}</span>
                        <h3 className={`text-white font-bold text-lg leading-tight ${sport.slug ? "group-hover:text-[#FF6B00] transition-colors" : ""}`}>
                          {sport.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-xs">{sport.fullName}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-[#FF6B00] font-bold text-sm">{sport.channels}</p>
                      <p className="text-gray-600 text-xs">channels</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{sport.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sport.channels_list.map((ch) => (
                      <span
                        key={ch}
                        className="text-[10px] px-2 py-0.5 rounded-full text-gray-500"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        {ch}
                      </span>
                    ))}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full text-gray-600"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      Season: {sport.season}
                    </span>
                  </div>
                  {sport.slug && (
                    <div className="mt-4 flex items-center gap-1 text-[#FF6B00] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Play className="w-3 h-3" /> Full streaming guide →
                    </div>
                  )}
                </div>
              );
              return sport.slug ? (
                <Link key={sport.name} href={`/sports/${sport.slug}`}>{Card}</Link>
              ) : (
                <div key={sport.name}>{Card}</div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* WHY STREAMB4 FOR SPORTS */}
      <AnimatedSection className="py-24 bg-[#050505] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(255,138,0,0.07)", border: "1px solid rgba(255,138,0,0.15)" }}
              >
                Why STREAMB4
              </span>
              <h2
                className="font-black text-white uppercase leading-[0.9] tracking-tight mb-8"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
              >
                BUILT FOR SPORTS FANS
              </h2>
              <div className="space-y-6">
                {WHY_FEATURES.map((f) => (
                  <div key={f.title} className="border-l-2 border-[#FF6B00]/40 pl-5">
                    <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div
                className="p-6 rounded-[20px]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <p className="text-gray-500 text-sm mb-1">Plans from</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">$9</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <p className="text-gray-400 text-sm mb-5">Solo plan · 1 screen · All 50,000+ channels included</p>
                <Link href="/pricing">
                  <Button variant="primary" className="w-full font-black uppercase tracking-wide">
                    View All Plans
                  </Button>
                </Link>
              </div>
              <div
                className="p-6 rounded-[20px]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(5,5,5,0.97) 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-white font-bold mb-4 text-sm">All plans include:</p>
                <ul className="space-y-2">
                  {["1,800+ sports channels", "Live EPG guide", "Catch-up TV", "No blackouts", "4K where available", "24/7 support"].map((f) => (
                    <li key={f} className="text-sm text-gray-400 pl-3 border-l border-[#FF6B00]/30">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
            WATCH YOUR SPORT{" "}
            <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              TONIGHT
            </span>
          </h2>
          <p className="text-gray-400 mb-8">Try the full service free for 24 hours — no credit card required.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/free-trial">
              <MagneticButton
                className="px-10 py-5 rounded-full font-black text-black text-base uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_60px_rgba(255,122,0,0.6)] transition-all duration-300 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)", boxShadow: "0 0 40px rgba(255,122,0,0.4)" }}
              >
                ⚡ Try Free — No Card Required
              </MagneticButton>
            </Link>
            <Link href="/channels">
              <MagneticButton className="px-10 py-5 rounded-full font-bold text-white text-base uppercase tracking-wide border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:scale-105 transition-all duration-300 cursor-pointer">
                Browse All Channels →
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
