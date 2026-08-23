import type { Metadata } from "next";
import Link from "next/link";
import { DEVICE_CONFIGS } from "@/lib/deviceConfigs";

export const metadata: Metadata = {
  title: { absolute: "IPTV Compatible Devices 2026 — Firestick, Smart TV, iPhone & More | STREAMB4" },
  description: "STREAMB4 IPTV works on Amazon Firestick, Samsung TV, LG TV, Android TV, Apple TV, iPhone, Android, Windows and Mac. Choose your device for a full setup guide.",
  alternates: {
    canonical: "https://streamb4.com/iptv",
  },
  openGraph: {
    title: "IPTV Compatible Devices 2026 — Firestick, Smart TV, iPhone & More | STREAMB4",
    description: "STREAMB4 IPTV works on every major streaming device. Choose your device for a complete setup guide.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV — Compatible with Every Device" }],
    url: "https://streamb4.com/iptv",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "IPTV Device Guide", "item": "https://streamb4.com/iptv" },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "IPTV Compatible Devices",
  "description": "Streaming devices compatible with STREAMB4 IPTV service",
  "itemListElement": Object.entries(DEVICE_CONFIGS).map(([slug, config], index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": config.name,
    "url": `https://streamb4.com/iptv/${slug}`,
  })),
};

const DEVICE_CATEGORIES = [
  {
    label: "Streaming Sticks & Boxes",
    slugs: ["firestick", "android-tv", "nvidia-shield"],
  },
  {
    label: "Smart TVs",
    slugs: ["samsung-tv", "lg-tv"],
  },
  {
    label: "Apple Devices",
    slugs: ["apple-tv", "iphone"],
  },
  {
    label: "Computers",
    slugs: ["windows-pc", "mac"],
  },
  {
    label: "Mobile",
    slugs: ["android-phone"],
  },
];

export default function IPTVPage() {
  const deviceList = Object.entries(DEVICE_CONFIGS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }} />

      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[150px]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
              <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-400" aria-current="page">IPTV Devices</li>
              </ol>
            </nav>
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              COMPATIBLE WITH EVERY DEVICE
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
              IPTV ON EVERY DEVICE —<br />
              <span className="text-[#FF6B00]">PICK YOUR SETUP GUIDE</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              One STREAMB4 subscription streams on Firestick, Samsung TV, Android TV, Apple TV,
              LG TV, iPhone, Android, Windows and Mac. Choose your device below for a setup guide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl font-black text-black text-sm uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
              >
                View Pricing Plans
              </Link>
              <Link
                href="/install"
                className="px-8 py-4 rounded-xl font-black text-white text-sm uppercase tracking-wider border border-[#FF6B00]/30 hover:border-[#FF6B00] transition-colors"
              >
                Installation Guide
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-white/5 bg-white/[0.02] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "10+", label: "Compatible Devices" },
                { value: "50,000+", label: "Live Channels" },
                { value: "4K Ultra HD", label: "Maximum Quality" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-black text-[#FF6B00]">{stat.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Device Grid */}
        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
              Choose Your Device
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Select your streaming device for a dedicated setup guide, compatible app list, and troubleshooting tips.
            </p>

            {DEVICE_CATEGORIES.map((cat) => (
              <div key={cat.label} className="mb-12">
                <h3 className="text-sm font-bold text-[#FF6B00] uppercase tracking-widest mb-6">{cat.label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.slugs.map((slug) => {
                    const device = DEVICE_CONFIGS[slug];
                    if (!device) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/iptv/${slug}`}
                        className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-[#FF6B00]/40 hover:bg-white/[0.06] transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl" role="img" aria-label={device.name}>{device.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-white group-hover:text-[#FF6B00] transition-colors text-lg leading-tight">
                              {device.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{device.os}</div>
                            <p className="text-sm text-gray-400 mt-3 line-clamp-2">{device.description.split(".")[0]}.</p>
                            <div className="mt-4 text-xs font-bold text-[#FF6B00] uppercase tracking-wider group-hover:underline">
                              Setup Guide →
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why STREAMB4 section */}
        <section className="py-20 bg-[#0d0700]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
              Why STREAMB4 Works on Every Device
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Universal M3U Format",
                  body: "STREAMB4 delivers channels via M3U playlist — an open standard supported by every major IPTV player on every platform. One subscription, unlimited devices.",
                },
                {
                  title: "Xtream Codes API",
                  body: "In addition to M3U, STREAMB4 supports Xtream Codes — the login-based system used by TiviMate, IPTV Smarters, and most modern IPTV apps for faster EPG loading.",
                },
                {
                  title: "Multiple Simultaneous Streams",
                  body: "Depending on your plan, stream on 1–3 devices at the same time. Solo supports one screen, Duo supports two, and Family supports three.",
                },
                {
                  title: "No IP Restrictions",
                  body: "STREAMB4 has no geo-restrictions on the service itself. Use your subscription from any device, in any country, without a VPN.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="font-black text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All devices list for SEO */}
        <section className="py-12 bg-[#0A0A0A] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-black text-white mb-6">All Compatible Devices</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {deviceList.map(([slug, device]) => (
                <li key={slug}>
                  <Link
                    href={`/iptv/${slug}`}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
                  >
                    <span aria-hidden="true">{device.icon}</span>
                    {device.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#0d0700]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Start Streaming?
            </h2>
            <p className="text-gray-400 mb-8">
              One subscription. All your devices. 50,000+ live channels and 180,000+ movies. Plans from $39.99 for 3 months.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-10 py-5 rounded-xl font-black text-black text-sm uppercase tracking-wider"
              style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
            >
              Get STREAMB4 Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
