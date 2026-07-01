import type { Metadata } from "next";
import { Anton, Inter } from 'next/font/google'
import "./globals.css";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import MetaPixel from '@/components/analytics/MetaPixel'
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity'
import Script from 'next/script'

// ─── Fonts — preload: true for LCP improvement ───────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
  preload: true,
})

// ─── Sitewide Metadata ────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://streamb4.com"),
  title: {
    default: "STREAMB4 — Premium IPTV Service | 50,000+ Channels in 4K",
    template: "%s | STREAMB4",
  },
  description: "STREAMB4 delivers 50,000+ live TV channels and 180,000+ movies & series in 4K Ultra HD. Instant activation. No contracts. Works on Fire TV, Smart TV, Android, iOS & more.",
  keywords: [
    "iptv service", "best iptv", "live tv streaming", "iptv subscription",
    "4k iptv", "streamb4", "premium streaming", "iptv channels",
    "fire tv iptv", "smart tv iptv", "iptv free trial"
  ],
  authors: [{ name: "STREAMB4", url: "https://streamb4.com" }],
  creator: "STREAMB4",
  publisher: "STREAMB4",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://streamb4.com",
    siteName: "STREAMB4",
    title: "STREAMB4 — Premium IPTV | 50,000+ Live Channels in 4K",
    description: "Stream 50,000+ live channels and 180,000+ on-demand titles in 4K Ultra HD. Instant activation. Plans from $39.99. No contracts.",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "STREAMB4 — Premium IPTV Streaming Service with 50,000+ Channels",
    }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@streamb4t",
    creator: "@streamb4t",
    title: "STREAMB4 — Premium IPTV | 50,000+ Live Channels in 4K",
    description: "Stream 50,000+ live channels in 4K. Instant activation. Plans from $39.99.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://streamb4.com",
    types: {
      "application/rss+xml": [{ url: "https://streamb4.com/api/rss", title: "STREAMB4 Blog RSS Feed" }],
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  // verification: { google: "YOUR_GSC_TOKEN_HERE" },  // uncomment and add GSC token
};

// ─── JSON-LD Helpers ──────────────────────────────────────────────────────────
function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

// ─── Organization Schema (sitewide) ──────────────────────────────────────────
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://streamb4.com/#organization",
  "name": "STREAMB4",
  "legalName": "STREAMB4",
  "url": "https://streamb4.com",
  "logo": {
    "@type": "ImageObject",
    "@id": "https://streamb4.com/#logo",
    "url": "https://streamb4.com/logo.png",
    "contentUrl": "https://streamb4.com/logo.png",
    "width": 200,
    "height": 60,
    "caption": "STREAMB4"
  },
  "image": { "@id": "https://streamb4.com/#logo" },
  "brand": {
    "@type": "Brand",
    "name": "STREAMB4",
    "logo": "https://streamb4.com/logo.png"
  },
  "description": "Premium IPTV streaming service with 50,000+ live channels and 180,000+ on-demand titles in 4K Ultra HD.",
  "foundingDate": "2022",
  "email": "support@streamb4.com",
  "areaServed": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "availableLanguage": [
    { "@type": "Language", "name": "English" },
    { "@type": "Language", "name": "French" },
    { "@type": "Language", "name": "Arabic" },
    { "@type": "Language", "name": "Spanish" }
  ],
  "sameAs": [
    "https://discord.gg/BFr5HSZfk",
    "https://www.facebook.com/profile.php?id=61591545360371",
    "https://x.com/streamb4t",
    "https://www.instagram.com/streamb4tv/"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@streamb4.com",
      "availableLanguage": ["English", "French", "Arabic"],
      "contactOption": "TollFree",
      "areaServed": "Worldwide",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": "support@streamb4.com",
      "availableLanguage": ["English", "French", "Arabic"],
      "areaServed": "Worldwide"
    }
  ]
};

// ─── WebSite Schema with Sitelinks SearchBox ─────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://streamb4.com/#website",
  "name": "STREAMB4",
  "url": "https://streamb4.com",
  "description": "Premium IPTV streaming service with 50,000+ live channels in 4K.",
  "publisher": { "@id": "https://streamb4.com/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://streamb4.com/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
        <link rel="dns-prefetch" href="https://image.pollinations.ai" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="STREAMB4 Blog RSS Feed"
          href="https://streamb4.com/api/rss"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${anton.variable} font-sans antialiased bg-[#0A0A0A] text-white`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 px-4 py-2 bg-orange-500 text-black font-bold rounded"
        >
          Skip to main content
        </a>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <GoogleAnalytics />
        <MetaPixel />
        <MicrosoftClarity />
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              if (window.location.hostname === 'localhost') {
                navigator.serviceWorker.getRegistrations().then(regs => {
                  regs.forEach(reg => reg.unregister())
                })
              } else {
                navigator.serviceWorker
                  .register('/sw.js')
                  .then(() => {})
                  .catch(() => {})
              }
            }
          `}
        </Script>
      </body>
    </html>
  );
}
