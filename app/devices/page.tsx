import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Monitor, Radio, Cpu, Smartphone } from "lucide-react";
import DevicesClient, { type PlayerData } from "./DevicesClient";
import DevicesFAQ from "./DevicesFAQ";

export const metadata: Metadata = {
  title: { absolute: "IPTV Downloader Codes — 6-Digit Codes for IPTV Smarters, TiviMate & More | STREAMB4" },
  description: "Find 6-digit Downloader codes for every major IPTV app — IPTV Smarters Pro, TiviMate, IBO Player and more. Install IPTV apps on Firestick, Android TV Box and Smart TV instantly.",
  alternates: {
    canonical: "https://streamb4.com/devices",
  },
  openGraph: {
    title: "IPTV Downloader Codes & App Setup | STREAMB4",
    description: "Find 6-digit Downloader shortcodes for every IPTV player app. Install on Firestick, Android TV, Samsung, LG, and more — in seconds.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Downloader Codes and App Installation" }],
    url: "https://streamb4.com/devices",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Downloader Codes for Firestick & Smart TV | STREAMB4",
    description: "Install IPTV Smarters, TiviMate, IBO Player using 6-digit shortcodes. Works on Firestick, Android TV, Samsung, LG.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "IPTV Player Apps for STREAMB4",
  "description": "Recommended IPTV player applications compatible with STREAMB4. Available for Amazon Fire TV Stick, Android TV, Smart TV, and mobile devices.",
  "url": "https://streamb4.com/devices",
  "numberOfItems": 4,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": "IPTV Smarters Pro",
        "description": "The most popular IPTV player for Firestick and Android TV. Supports Xtream Codes API and M3U playlists. Recommended for STREAMB4 users. Downloader code: 6468112.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Android, Amazon Fire OS, iOS",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "featureList": ["Xtream Codes support", "M3U playlist", "EPG TV guide", "Multi-screen"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "SoftwareApplication",
        "name": "TiviMate",
        "description": "Premium IPTV player with a clean TV-style interface, EPG support, and recording features. Downloader code: 778786.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Android TV, Amazon Fire OS",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "featureList": ["M3U/Xtream Codes", "EPG guide", "Recording", "Favourites"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "SoftwareApplication",
        "name": "IBO Player",
        "description": "Free IPTV player for Samsung and LG Smart TVs. Uses MAC address activation — no username or password required. Downloader code: 417847.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Android TV, Samsung Tizen, LG webOS",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "featureList": ["MAC address activation", "Samsung Smart TV", "LG Smart TV", "EPG guide"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "MobileApplication",
        "name": "GSE Smart IPTV",
        "description": "Feature-rich IPTV player for iPhone and iPad with M3U and Xtream Codes support. Downloader code: 680664.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "iOS, iPadOS, Android",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "featureList": ["M3U playlist", "Xtream Codes", "EPG guide", "iPhone/iPad support"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Install IPTV Apps on Firestick Using Downloader Codes",
  "description": "Install any IPTV player app on your Amazon Fire TV Stick using 6-digit Downloader shortcodes. No typing long URLs — just enter the code and stream.",
  "image": { "@type": "ImageObject", "url": "https://streamb4.com/og-image.jpg", "width": 1200, "height": 630 },
  "totalTime": "PT3M",
  "tool": [
    { "@type": "HowToTool", "name": "Amazon Fire TV Stick" },
    { "@type": "HowToTool", "name": "Downloader App by AFTVnews" },
    { "@type": "HowToTool", "name": "STREAMB4 6-digit Downloader Code" }
  ],
  "supply": [
    { "@type": "HowToSupply", "name": "Active STREAMB4 subscription" },
    { "@type": "HowToSupply", "name": "Internet connection (10 Mbps minimum)" }
  ],
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Enable Apps from Unknown Sources", "text": "On your Fire TV Stick, go to Settings → My Fire TV → Developer Options and switch 'Apps from Unknown Sources' to ON.", "url": "https://streamb4.com/devices" },
    { "@type": "HowToStep", "position": 2, "name": "Open the Downloader App", "text": "Search for 'Downloader' by AFTVnews in the Amazon App Store and install it. Open the app and navigate to the URL/code field.", "url": "https://streamb4.com/devices" },
    { "@type": "HowToStep", "position": 3, "name": "Enter the 6-Digit Downloader Code", "text": "Enter the 6-digit shortcode for your chosen IPTV player (e.g. 6468112 for IPTV Smarters Pro) and tap Go. The app APK downloads automatically.", "url": "https://streamb4.com/devices" },
    { "@type": "HowToStep", "position": 4, "name": "Install the IPTV Player", "text": "When the download finishes, tap Install. Wait for the installation to complete, then select Done.", "url": "https://streamb4.com/devices" },
    { "@type": "HowToStep", "position": 5, "name": "Enter Your STREAMB4 Credentials", "text": "Open the IPTV player and choose 'Add via Xtream Codes' or 'Add M3U URL'. Enter the server, username, and password emailed to you by STREAMB4.", "url": "https://streamb4.com/devices" }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is an IPTV Downloader code?", "acceptedAnswer": { "@type": "Answer", "text": "A Downloader code is a 6-digit shortcode used inside the AFTVnews Downloader app. Instead of typing a long URL with your TV remote, you enter this short code and the app automatically fetches and installs the IPTV player APK for you." } },
    { "@type": "Question", "name": "Which IPTV player app is the best for Firestick in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "IPTV Smarters Pro v5 is our top recommendation for Amazon Firestick. It supports Xtream Codes, M3U playlists, and EPG (TV guide). The Downloader code is 6468112." } },
    { "@type": "Question", "name": "How do I fix 'Downloader App Installation Blocked' on Firestick?", "acceptedAnswer": { "@type": "Answer", "text": "Go to Settings → My Fire TV → Developer Options and enable 'Apps from Unknown Sources' and 'ADB Debugging'. Then try installing again through the Downloader app." } },
    { "@type": "Question", "name": "Is IBO Player free to use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, IBO Player and IBO Player Pro are free to download and use. You only need your STREAMB4 subscription credentials (server URL, username, password or MAC address) to start streaming." } },
    { "@type": "Question", "name": "What is a Mac Address and Device Key for IBO Player?", "acceptedAnswer": { "@type": "Answer", "text": "When you open IBO Player on a Samsung or LG Smart TV, it shows a unique MAC address. You send this address to STREAMB4 support, and we activate your subscription to that specific TV — no username/password needed." } }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Devices & App Codes", "item": "https://streamb4.com/devices" }
  ]
};

const GUIDES = [
  { label: "Amazon Firestick", Icon: Flame,      href: "/iptv/firestick" },
  { label: "Samsung Smart TV", Icon: Monitor,    href: "/iptv/samsung-tv" },
  { label: "LG Smart TV",      Icon: Radio,      href: "/iptv/lg-tv" },
  { label: "Android TV / Box", Icon: Cpu,        href: "/iptv/android-tv" },
  { label: "Mobile Phone",     Icon: Smartphone, href: "/iptv/android-phone" },
];

// Static player data — previously managed in MongoDB admin panel.
const STATIC_PLAYERS: PlayerData[] = [
  {
    id: "1",
    name: "IPTV Smarters Pro",
    recommended: true,
    featured: true,
    enabled: true,
    downloaderCode: "6468112",
    website: "https://www.iptvsmarters.com/",
    apkUrl: "",
    logo: "",
    version: "",
    lastUpdated: "",
    platforms: ["firestick", "android-tv", "android-phone", "ios"],
    order: 1,
  },
  {
    id: "2",
    name: "TiviMate",
    recommended: true,
    featured: false,
    enabled: true,
    downloaderCode: "778786",
    website: "https://tivimate.com/",
    apkUrl: "",
    logo: "",
    version: "",
    lastUpdated: "",
    platforms: ["firestick", "android-tv"],
    order: 2,
  },
  {
    id: "3",
    name: "IBO Player",
    recommended: false,
    featured: false,
    enabled: true,
    downloaderCode: "417847",
    website: "",
    apkUrl: "",
    logo: "",
    version: "",
    lastUpdated: "",
    platforms: ["samsung-tv", "lg-tv", "android-tv"],
    order: 3,
  },
  {
    id: "4",
    name: "GSE Smart IPTV",
    recommended: false,
    featured: false,
    enabled: true,
    downloaderCode: "680664",
    website: "",
    apkUrl: "",
    logo: "",
    version: "",
    lastUpdated: "",
    platforms: ["ios", "android-phone"],
    order: 4,
  },
];

function getPlayers(): PlayerData[] {
  return STATIC_PLAYERS;
}

export default function DevicesPage() {
  const players = getPlayers();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />

      <div className="min-h-screen text-white pt-24 relative overflow-hidden" style={{ background: "#050505" }}>

        {/* ─── Background decorations ──────────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none select-none" aria-hidden="true">
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noisy" />
              <feColorMatrix type="linear" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,122,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.03) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.10] blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)" }}
          />
          <div
            className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08] blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)" }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 relative z-10">

          {/* ─── HEADER — server-rendered, visible immediately (LCP) ─── */}
          <div className="text-center mb-14">
            <p className="text-xs text-orange-500 font-bold tracking-[0.2em] uppercase mb-4 select-none">
              SETUP CENTER
            </p>
            <h1
              className="font-anton text-white uppercase leading-tight mb-5 select-none"
              style={{ fontSize: "clamp(2rem, 7vw, 4rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}
            >
              DOWNLOADER CODES <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                &amp; APP INSTALLATION
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              The fastest way to install IPTV on your Firestick or Android device.
              Just type a 6-digit code and start streaming in seconds.
            </p>
          </div>

          {/* ─── STEP 1 CARD — server-rendered ───────────────────────── */}
          <div
            style={{
              background: "rgba(15, 15, 15, 0.6)",
              border: "1px solid rgba(255, 138, 0, 0.15)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
            }}
            className="rounded-[20px] p-8 mb-14"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center
                  font-black text-black text-lg shrink-0"
                style={{
                  background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                  boxShadow: "0 0 15px rgba(255, 122, 0, 0.3)",
                }}
              >
                1
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-white font-black text-xl mb-3">
                    Get the &quot;Downloader&quot; App
                  </h2>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center opacity-20 shrink-0 border-2 border-white select-none hidden sm:flex">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-6 h-6">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  If you are using an{" "}
                  <strong className="text-white">Amazon Firestick</strong> or{" "}
                  <strong className="text-white">Android TV Box</strong>, you must
                  install the{" "}
                  <strong className="text-white">Downloader by AFTVnews</strong>{" "}
                  app from your device&apos;s official app store first.
                </p>
                <ul className="space-y-3">
                  {[
                    "Go to the Search icon on your Firestick/Android TV home screen.",
                    'Type "Downloader" and install the orange app.',
                    'Go to Settings › My Fire TV › Developer Options, and turn ON "Install Unknown Apps" for Downloader.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                          boxShadow: "0 0 6px rgba(255, 122, 0, 0.4)",
                        }}
                      />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ─── INTERACTIVE ISLAND (search + filter + cards + toast) ─── */}
          <DevicesClient initialPlayers={players} />

          {/* ─── WHY SECTION — server-rendered ───────────────────────── */}
          <div
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
            className="mb-16 pt-12"
          >
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wide">
              Why Do I Need a Downloader Code for IPTV?
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-5">
              <p>
                In 2026, the{" "}
                <strong className="text-white">AFTVnews Downloader app</strong>{" "}
                remains the standard method for sideloading third-party applications
                onto devices running the Android TV operating system, specifically the
                Amazon Fire TV Stick, Nvidia Shield, and Google Chromecast. Because
                Amazon removes official IPTV player applications like{" "}
                <strong className="text-white">IPTV Smarters Pro</strong> from their
                built-in store, you must manually install the{" "}
                <code
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ background: "rgba(255, 255, 255, 0.05)", color: "#ff7a00", border: "1px solid rgba(255, 255, 255, 0.02)" }}
                >
                  .apk
                </code>{" "}
                file.
              </p>
              <p>
                Using a{" "}
                <strong className="text-white">6-digit Downloader shortcode</strong>{" "}
                (such as{" "}
                <code
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ background: "rgba(255, 255, 255, 0.05)", color: "#ff7a00", border: "1px solid rgba(255, 255, 255, 0.02)" }}
                >
                  6468112
                </code>{" "}
                for Smarters Pro) completely eliminates the hassle of typing a massive
                URL with your television remote. The codes provided above are 100%
                verified, virus-free, and directly link to the official original
                software developers.
              </p>
              <h3 className="text-white font-black text-lg pt-4 uppercase tracking-wide">
                Choosing the Best IPTV App for Smart TVs
              </h3>
              <p>
                If you own a Samsung Tizen TV or an LG WebOS television, you do not
                need the AFTVnews downloader app. Instead, simply navigate to your
                TV&apos;s built-in App Store and search for{" "}
                <strong className="text-white">IBO Player</strong>,{" "}
                <strong className="text-white">BOB Player</strong>, or{" "}
                <strong className="text-white">KING4K</strong>. These modern apps
                allow you to connect your premium IPTV subscription directly to your
                TV using a MAC address, requiring absolutely zero extra hardware.
              </p>
            </div>
          </div>

          {/* ─── FAQ — client component (accordion state) ─────────────── */}
          <DevicesFAQ />

          {/* ─── FULL GUIDES — server-rendered with Lucide icons ─────── */}
          <div>
            <h2
              className="font-anton text-white uppercase text-center mb-8"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}
            >
              Full Installation Guides
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {GUIDES.map(({ label, Icon, href }) => (
                <Link key={label} href={href}>
                  <div
                    className="flex flex-col items-center gap-3.5 p-5 rounded-[20px] cursor-pointer text-center hover:-translate-y-1 transition-transform duration-200"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,122,0,0.08) 0%, rgba(8,8,8,0.97) 100%)",
                      border: "1px solid rgba(255,122,0,0.18)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                      style={{
                        background: "linear-gradient(145deg, rgba(255,122,0,0.15) 0%, rgba(0,0,0,0.6) 100%)",
                        border: "1px solid rgba(255,122,0,0.25)",
                        boxShadow: "0 0 16px rgba(255,122,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={2}
                        stroke="#ff7a00"
                        style={{ filter: "drop-shadow(0 0 6px rgba(255,122,0,0.55))" }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-300 leading-tight">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
