import type { Metadata } from "next";
import BestIPTVClient from "./BestIPTVClient";

export const metadata: Metadata = {
  title: { absolute: "Best IPTV Service 2026 — Complete Guide & Comparison | STREAMB4" },
  description: "Choosing the best IPTV service in 2026? Compare channel counts, stream quality, sports coverage, pricing, and device support. Full editorial guide to IPTV.",
  alternates: {
    canonical: "https://streamb4.com/best-iptv-service",
  },
  openGraph: {
    title: "Best IPTV Service 2026 — Complete Guide & Comparison | STREAMB4",
    description: "Compare channel counts, stream quality, sports coverage, pricing, and device support. An editorial guide to choosing the best IPTV service in 2026.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Best IPTV Service 2026 — Complete Guide" }],
    url: "https://streamb4.com/best-iptv-service",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best IPTV Service 2026 — Complete Guide & Comparison | STREAMB4",
    description: "How to choose the best IPTV service in 2026. Channel count, quality, sports, pricing, and device compatibility — all explained.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://streamb4.com/best-iptv-service#article",
  "headline": "Best IPTV Service 2026 — Complete Guide & Comparison",
  "description": "An editorial guide to choosing the best IPTV service in 2026, covering channel counts, stream quality, sports coverage, pricing, and device compatibility.",
  "author": {
    "@type": "Organization",
    "name": "STREAMB4",
    "url": "https://streamb4.com",
  },
  "publisher": {
    "@type": "Organization",
    "name": "STREAMB4",
    "url": "https://streamb4.com",
  },
  "datePublished": "2026-08-01",
  "dateModified": "2026-08-28",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://streamb4.com/best-iptv-service",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best IPTV service in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Based on our 30-day testing of 8 IPTV providers, STREAMB4 is the best IPTV service in 2026. It scored 9.8/10 across channel quantity, stream quality, sports reliability, uptime, and value for money.",
      },
    },
    {
      "@type": "Question",
      "name": "Is STREAMB4 better than cable TV?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. STREAMB4 offers 50,000+ channels versus 200-500 on cable, costs 80-90% less than a typical cable package, has no contracts, and works on all your devices. Sports coverage is comprehensive with no blackouts.",
      },
    },
    {
      "@type": "Question",
      "name": "Does STREAMB4 offer a free trial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. STREAMB4 offers a free 24-hour trial with full access to all channels, 4K quality, and every feature. No credit card required.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Best IPTV Service 2026", "item": "https://streamb4.com/best-iptv-service" },
  ],
};

export default function BestIPTVPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <main id="main-content">
        <BestIPTVClient />
      </main>
    </>
  );
}
