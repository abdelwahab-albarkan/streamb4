"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { PaymentStrip } from "@/components/ui/PaymentLogos";

// ─── SOCIAL ICONS ──────────────────────────────────────────────────────────────

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="rgba(255,255,255,0.5)">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="rgba(255,255,255,0.5)" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="rgba(255,255,255,0.5)">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z" />
  </svg>
);


const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="rgba(255,255,255,0.5)">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 00-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
  </svg>
);

const socials = [
  { name: "Facebook",  icon: <FacebookIcon />,  href: "https://www.facebook.com/profile.php?id=61591545360371" },
  { name: "Instagram", icon: <InstagramIcon />, href: "https://www.instagram.com/streamb4tv/?hl=fr" },
  { name: "X",         icon: <XIcon />,         href: "https://x.com/streamb4t" },
  { name: "Discord",   icon: <DiscordIcon />,   href: "https://discord.gg/BFr5HSZfk" },
];

const navLinks = [
  { label: "Pricing",  href: "/pricing" },
  { label: "Features", href: "/features" },
  { label: "Devices",  href: "/devices" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
  { label: "Privacy",  href: "/legal/privacy" },
  { label: "Terms",    href: "/legal/terms" },
];

const languages = ["English", "Français", "العربية"];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function Footer() {
  const [lang, setLang] = useState("English");

  return (
    <footer
      className="relative z-10 border-t"
      style={{
        background: "#050505",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

        {/* ── Top row: Logo + Nav links ── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-gray-500 text-sm hover:text-orange-400 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Knowledge Directory ── */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-8"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Header */}
          <p className="text-gray-600 text-[10px] font-black tracking-[0.25em] uppercase mb-1">
            STREAMB4 Knowledge Directory
          </p>
          <p className="text-gray-700 text-xs mb-6">
            Quick access to our expert setup guides, region-specific channels, provider comparisons, and latest tutorials.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Live Sports */}
            <div>
              <h5 className="text-white font-black text-xs tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px flex-shrink-0" style={{ background: "linear-gradient(90deg,#ff8a00,#ffb347)" }} />
                Live Sports Streaming
              </h5>
              <ul className="space-y-2">
                {[
                  { label: "Watch NBA Live Stream",         href: "/blog/nba-live-stream" },
                  { label: "Watch NFL Live Stream",         href: "/blog/nfl-live-stream" },
                  { label: "Watch NHL Live Stream",         href: "/blog/nhl-live-stream" },
                  { label: "Watch MLB Live Stream",         href: "/blog/mlb-live-stream" },
                  { label: "Watch UEFA Champions League",   href: "/blog/uefa-champions-league-live" },
                  { label: "Watch Liverpool FC",            href: "/blog/liverpool-fc-live-stream" },
                  { label: "Watch Arsenal",                 href: "/blog/arsenal-live-stream" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-600 text-xs hover:text-orange-400 transition-colors duration-200 leading-relaxed">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/blog/sports" className="text-orange-500 text-xs font-bold hover:text-orange-400 transition-colors duration-200">
                    All Sports →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Regions */}
            <div>
              <h5 className="text-white font-black text-xs tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px flex-shrink-0" style={{ background: "linear-gradient(90deg,#ff8a00,#ffb347)" }} />
                IPTV Servers by Region
              </h5>
              <ul className="space-y-2">
                {[
                  { label: "IPTV United Kingdom", href: "/blog/iptv-uk" },
                  { label: "IPTV United States",  href: "/blog/iptv-usa" },
                  { label: "IPTV Dubai",          href: "/blog/iptv-dubai" },
                  { label: "IPTV Canada",         href: "/blog/iptv-canada" },
                  { label: "IPTV Australia",      href: "/blog/iptv-australia" },
                  { label: "IPTV London",         href: "/blog/iptv-london" },
                  { label: "IPTV Manchester",     href: "/blog/iptv-manchester" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-600 text-xs hover:text-orange-400 transition-colors duration-200 leading-relaxed">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/blog/regions" className="text-orange-500 text-xs font-bold hover:text-orange-400 transition-colors duration-200">
                    Browse All Regions →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Device Guides + Compatible Apps */}
            <div>
              <h5 className="text-white font-black text-xs tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px flex-shrink-0" style={{ background: "linear-gradient(90deg,#ff8a00,#ffb347)" }} />
                Device Setup Guides
              </h5>
              <ul className="space-y-2">
                {[
                  { label: "Android TV",                              href: "/install#android-tv" },
                  { label: "iOS / Apple TV",                          href: "/install#apple-tv" },
                  { label: "Smart TV (Tizen/WebOS)",                  href: "/install#smart-tv" },
                  { label: "How to Install on Amazon Firestick",      href: "/install#firestick" },
                  { label: "How to Watch on Nvidia Shield",           href: "/blog/nvidia-shield-iptv" },
                  { label: "Install on Generic Android TV Box",       href: "/install#android-tv" },
                  { label: "Watch on Windows PC/Laptop",              href: "/blog/iptv-windows-pc" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-600 text-xs hover:text-orange-400 transition-colors duration-200 leading-relaxed">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h5 className="text-white font-black text-xs tracking-[0.15em] uppercase mt-6 mb-4 flex items-center gap-2">
                <span className="w-4 h-px flex-shrink-0" style={{ background: "linear-gradient(90deg,#ff8a00,#ffb347)" }} />
                Compatible Apps
              </h5>
              <ul className="space-y-2">
                {[
                  { label: "TiviMate IPTV Player",  href: "/devices#tivimate" },
                  { label: "IPTV Smarters Pro",      href: "/devices#smarters" },
                  { label: "XCIPTV Player",          href: "/devices#xciptv" },
                  { label: "Flix IPTV",              href: "/devices#flix" },
                  { label: "Net IPTV",               href: "/devices#netiptv" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-600 text-xs hover:text-orange-400 transition-colors duration-200 leading-relaxed">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/devices" className="text-orange-500 text-xs font-bold hover:text-orange-400 transition-colors duration-200">
                    Browse All Apps →
                  </Link>
                </li>
                <li className="pt-0.5">
                  <Link href="/blog/iptv-alternatives" className="text-orange-500 text-xs font-bold hover:text-orange-400 transition-colors duration-200">
                    View IPTV Alternatives →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Latest Blog Guides */}
            <div>
              <h5 className="text-white font-black text-xs tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px flex-shrink-0" style={{ background: "linear-gradient(90deg,#ff8a00,#ffb347)" }} />
                Latest Blog Guides
              </h5>
              <ul className="space-y-2">
                {[
                  { label: "The Best IPTV Service Providers in 2026 (Ranked & Reviewed)",                       href: "/blog/best-iptv-service-providers-2026" },
                  { label: "How to Watch FIFA World Cup 2026 Live Stream",                                       href: "/blog/fifa-world-cup-2026-live-stream" },
                  { label: "What is IPTV? The Ultimate Guide for Beginners in 2026",                            href: "/blog/what-is-iptv-guide-2026" },
                  { label: "Best Premium IPTV Service 2026: Stop Buffering, Start Streaming",                   href: "/blog/best-premium-iptv-2026" },
                  { label: "Avis IPTV France : Quel est le Meilleur Fournisseur Stable ?",                      href: "/blog/meilleur-iptv-france-2026" },
                  { label: "5 Simple Steps to Turn Your Apple TV 4K Into a Live Sports Machine (2026 Guide)",   href: "/blog/apple-tv-4k-live-sports-guide-2026" },
                  { label: "How to Jailbreak Firestick in 2026? Use These 5 Safer Steps",                       href: "/blog/firestick-jailbreak-safer-steps-2026" },
                  { label: "Affordable Streaming Options in Canada 2026: Save $1,000+/Year",                    href: "/blog/affordable-streaming-canada-2026" },
                  { label: "Best IPTV Alternatives in Canada 2026: Legal Streaming Guide",                      href: "/blog/best-iptv-alternatives-canada-2026" },
                  { label: "Best Devices for Streaming in Canada 2026: Ranked & Tested",                        href: "/blog/best-streaming-devices-canada-2026" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-600 text-xs hover:text-orange-400 transition-colors duration-200 leading-relaxed line-clamp-2">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/blog" className="text-orange-500 text-xs font-bold hover:text-orange-400 transition-colors duration-200">
                    View All Articles →
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="h-px mb-8"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />

        {/* ── Bottom row: Copyright + Social + Payment + Language ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Copyright */}
          <p className="text-gray-600 text-xs text-center lg:text-left">
            © 2026 StreamB4. All Rights Reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={`Follow STREAMB4 on ${s.name}`}
                title={`STREAMB4 on ${s.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/[0.08] hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Payment + Language */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PaymentStrip
              methods={["paypal","visa","mastercard","applepay","googlepay","bitcoin","usdt","ethereum"]}
            />

            {/* Language selector */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Select language"
                className="appearance-none text-gray-500 text-xs font-semibold pr-5 pl-2 py-1 rounded-lg cursor-pointer focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {languages.map((l) => (
                  <option
                    key={l}
                    value={l}
                    style={{ background: "#1a1a1a", color: "#fff" }}
                  >
                    {l}
                  </option>
                ))}
              </select>
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-2.5 h-2.5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
