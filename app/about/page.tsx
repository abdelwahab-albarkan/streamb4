import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About STREAMB4 — Premium IPTV Since 2022 | Our Story",
  description: "Learn about STREAMB4 — the premium IPTV service trusted by thousands of customers worldwide. Our mission, values, and commitment to the best streaming experience.",
  alternates: {
    canonical: "https://streamb4.com/about",
  },
  openGraph: {
    title: "About STREAMB4 — Premium IPTV Since 2022",
    description: "STREAMB4 has delivered premium IPTV to thousands of customers worldwide since 2022. Learn our story, mission, and values.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "About STREAMB4 — Premium IPTV Service" }],
    url: "https://streamb4.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About STREAMB4 | Premium IPTV Since 2022",
    description: "Thousands of customers trust STREAMB4 for premium IPTV. Learn our story and mission.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About STREAMB4",
  "description": "Learn about STREAMB4 — the premium IPTV service trusted by thousands of customers worldwide since 2022.",
  "url": "https://streamb4.com/about",
  "mainEntity": {
    "@type": "Organization",
    "@id": "https://streamb4.com/#organization",
    "name": "STREAMB4",
    "foundingDate": "2022",
    "description": "Premium IPTV streaming service with 50,000+ live channels and 180,000+ on-demand titles in 4K Ultra HD.",
    "url": "https://streamb4.com",
    "email": "support@streamb4.com",
    "sameAs": [
      "https://x.com/streamb4t",
      "https://www.facebook.com/profile.php?id=61591545360371",
      "https://www.instagram.com/streamb4tv/",
      "https://discord.gg/BFr5HSZfk"
    ]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://streamb4.com/about" }
  ]
};

const STATS = [
  { value: "50,000+", label: "Live Channels" },
  { value: "180,000+", label: "Movies & Series" },
  { value: "2022", label: "Year Founded" },
  { value: "4K HDR", label: "Stream Quality" },
];

const VALUES = [
  {
    title: "Reliability First",
    desc: "We run redundant server infrastructure with automatic failover. When a stream goes down, you switch to the backup in milliseconds — not minutes.",
  },
  {
    title: "No Contracts. Ever.",
    desc: "We believe streaming should be flexible. No lock-ins, no cancellation fees. Subscribe monthly, every 3 months, or annually — on your terms.",
  },
  {
    title: "Real 24/7 Support",
    desc: "Our support team is staffed around the clock — not automated bots. Real humans who know IPTV inside out, ready on live chat any time.",
  },
  {
    title: "Global Coverage",
    desc: "From the USA and UK to Canada, Europe, and beyond — our CDN nodes are strategically placed to deliver low-latency streams worldwide.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />

      <main id="main-content" className="min-h-screen bg-[#050505] text-white">

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-[#FF6B00]/5 rounded-full blur-[150px]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
              <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-400" aria-current="page">About</li>
              </ol>
            </nav>

            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              OUR STORY
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 uppercase">
              PREMIUM IPTV,<br />
              <span className="text-[#FF6B00]">BUILT TO LAST</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              STREAMB4 was founded in 2022 with a single goal: build the most reliable, feature-rich IPTV service on the market — at a price that makes cord-cutting an obvious choice.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl font-black text-black text-sm uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
              >
                View Pricing
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl font-black text-white text-sm uppercase tracking-wider border border-[#FF6B00]/30 hover:border-[#FF6B00] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#0d0d0d] border-y border-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((s) => (
                <div key={s.label} className="p-6">
                  <p className="text-3xl sm:text-4xl font-black text-[#FF6B00] mb-2">{s.value}</p>
                  <p className="text-gray-400 text-sm font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase">
              OUR <span className="text-[#FF6B00]">MISSION</span>
            </h2>
            <div className="prose prose-lg prose-invert max-w-none text-gray-400 leading-relaxed space-y-4">
              <p>
                We believe premium live TV should not require expensive cable contracts, satellite dishes, or region-locked services. STREAMB4 delivers a complete entertainment solution that works on every screen you own — your Smart TV, Fire TV Stick, phone, tablet, or laptop.
              </p>
              <p>
                Since 2022, we have invested in enterprise-grade CDN infrastructure specifically optimised for live video delivery. Unlike services that re-sell third-party streams, our technical team monitors and manages our own encoder network and content delivery pipeline 24 hours a day.
              </p>
              <p>
                The result: fewer buffering events, faster channel switching, and streams that work reliably even during peak sports events when bandwidth demand spikes. That is the STREAMB4 difference.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-[#0d0d0d] border-t border-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-white text-center mb-12 uppercase">
              WHAT WE <span className="text-[#FF6B00]">STAND FOR</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="p-8 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#FF6B00]/30 transition-all duration-300"
                >
                  <h3 className="text-white font-black text-lg mb-3">{v.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="py-16 bg-[#0A0A0A] border-t border-[#1A1A1A]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-[#FF6B00] font-bold text-xs uppercase tracking-widest mb-3">
              FOLLOW US
            </p>
            <h2 className="text-2xl font-black text-white mb-2 uppercase">
              Join the STREAMB4 Community
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              Stay up to date with the latest guides, deals, and streaming news.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                {
                  name: "Discord",
                  href: "https://discord.gg/BFr5HSZfk",
                  label: "Join our Discord community",
                  bg: "#5865F2",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
                    </svg>
                  ),
                },
                {
                  name: "Facebook",
                  href: "https://www.facebook.com/profile.php?id=61591545360371",
                  label: "Follow STREAMB4 on Facebook",
                  bg: "#1877F2",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  ),
                },
                {
                  name: "X (Twitter)",
                  href: "https://x.com/streamb4t",
                  label: "Follow STREAMB4 on X",
                  bg: "#000000",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z"/>
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: "https://www.instagram.com/streamb4tv/?hl=fr",
                  label: "Follow STREAMB4 on Instagram",
                  bg: "#E1306C",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 hover:brightness-125"
                  style={{
                    background: `${s.bg}22`,
                    border: `1px solid ${s.bg}44`,
                    color: s.bg === "#000000" ? "#e5e7eb" : s.bg,
                  }}
                >
                  {s.icon}
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#0A0A0A] border-t border-[#1A1A1A]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-white mb-4 uppercase">
              READY TO EXPERIENCE <span className="text-[#FF6B00]">STREAMB4</span>?
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Join thousands of customers who have ditched cable. No contracts. Cancel anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl font-black text-black text-sm uppercase"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
              >
                View Pricing
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl font-black text-white text-sm uppercase border border-white/10 hover:border-[#FF6B00]/40 transition-colors"
              >
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
