import type { Metadata } from "next";
import RestreamClient from "./RestreamClient";

export const metadata: Metadata = {
  title: "IPTV Restream Service — Broadcast to Multiple Platforms | STREAMB4",
  description: "Restream your IPTV content to YouTube, Facebook, Twitch, and more simultaneously. STREAMB4 restream service with dedicated 1 Gbps servers, 99.9% uptime, and 24/7 support.",
  alternates: {
    canonical: "https://streamb4.com/restream",
  },
  openGraph: {
    title: "IPTV Restream Service — Broadcast to Any Platform | STREAMB4",
    description: "Restream to YouTube, Twitch, Facebook Live and more simultaneously. Dedicated 1 Gbps servers, 25 to 1000+ concurrent streams.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Restream Service" }],
    url: "https://streamb4.com/restream",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Restream Service | STREAMB4",
    description: "Broadcast your content to YouTube, Twitch and Facebook Live simultaneously. Dedicated 1 Gbps servers.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "STREAMB4 IPTV Restream Service",
  "description": "Professional IPTV restreaming service. Broadcast live TV content to YouTube, Facebook Live, Twitch, and any RTMP endpoint simultaneously with dedicated 1 Gbps servers.",
  "provider": {
    "@type": "Organization",
    "name": "STREAMB4",
    "url": "https://streamb4.com"
  },
  "serviceType": "IPTV Restreaming",
  "areaServed": "Worldwide",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "199",
    "highPrice": "1499",
    "offerCount": "4"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Restream Service", "item": "https://streamb4.com/restream" }
  ]
};

export default function RestreamPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <RestreamClient />
    </>
  );
}
