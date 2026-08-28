import type { Metadata } from "next";
import SportsClient from "./SportsClient";

export const metadata: Metadata = {
  title: { absolute: "IPTV Sports Streaming — NFL, Premier League, NBA, F1 & More | STREAMB4" },
  description: "Stream every major sport live — NFL, Premier League, Champions League, NBA, UFC, Formula 1, NHL, MLB and more. 1,800+ sports channels. No blackouts. 4K quality.",
  alternates: {
    canonical: "https://streamb4.com/sports",
  },
  openGraph: {
    title: "IPTV Sports Streaming — All Sports in 4K | STREAMB4",
    description: "1,800+ sports channels covering NFL, Premier League, Champions League, NBA, UFC, F1 and more. No blackouts. Live and replay.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 Sports Streaming — 1,800+ Sports Channels" }],
    url: "https://streamb4.com/sports",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Sports Streaming — NFL, Premier League & More | STREAMB4",
    description: "1,800+ sports channels. NFL, Premier League, Champions League, NBA, UFC, F1. No blackouts.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Sports Available on STREAMB4 IPTV",
  "description": "Complete list of sports available to stream live on STREAMB4 — NFL, Premier League, NBA, Champions League, UFC, Formula 1 and more.",
  "url": "https://streamb4.com/sports",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "NFL", "url": "https://streamb4.com/sports/nfl" },
    { "@type": "ListItem", "position": 2, "name": "Premier League", "url": "https://streamb4.com/sports/premier-league" },
    { "@type": "ListItem", "position": 3, "name": "Champions League", "url": "https://streamb4.com/sports/champions-league" },
    { "@type": "ListItem", "position": 4, "name": "NBA", "url": "https://streamb4.com/sports/nba" },
    { "@type": "ListItem", "position": 5, "name": "UFC", "url": "https://streamb4.com/sports/ufc" },
    { "@type": "ListItem", "position": 6, "name": "Formula 1", "url": "https://streamb4.com/sports/formula-1" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Sports", "item": "https://streamb4.com/sports" },
  ],
};

export default function SportsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <main id="main-content">
        <SportsClient />
      </main>
    </>
  );
}
