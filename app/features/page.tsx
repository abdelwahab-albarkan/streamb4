import type { Metadata } from "next";
import FeaturesClient from "./FeaturesClient";

export const metadata: Metadata = {
  title: "IPTV Features — 4K Streaming, Anti-Buffering, 50,000+ Channels | STREAMB4",
  description: "Discover STREAMB4 IPTV features: 50,000+ live channels, 4K Ultra HD streaming, anti-buffering technology, 24/7 support, no IP lock, EPG guide, catch-up TV, and multi-screen support.",
  alternates: {
    canonical: "https://streamb4.com/features",
  },
  openGraph: {
    title: "IPTV Features — 4K, Anti-Buffering, 50,000+ Channels | STREAMB4",
    description: "STREAMB4 delivers premium IPTV with 4K quality, anti-buffering tech, 50,000+ live channels, 180,000+ on-demand titles, and 24/7 customer support.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Features — 4K Streaming and 50,000+ Channels" }],
    url: "https://streamb4.com/features",
  },
  twitter: {
    card: "summary_large_image",
    title: "STREAMB4 IPTV Features — 4K, 50,000+ Channels",
    description: "Anti-buffering tech, 4K quality, 50,000+ live channels, EPG, catch-up TV, no IP lock. See everything STREAMB4 offers.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://streamb4.com/features#webpage",
  "url": "https://streamb4.com/features",
  "name": "IPTV Features — 4K Streaming, Anti-Buffering, 50,000+ Channels | STREAMB4",
  "description": "Discover STREAMB4 IPTV features: 50,000+ live channels, 4K Ultra HD streaming, anti-buffering technology, 24/7 support, no IP lock, EPG guide, catch-up TV, and multi-screen support.",
  "isPartOf": { "@id": "https://streamb4.com/#website" },
  "about": { "@id": "https://streamb4.com/#organization" },
  "publisher": { "@id": "https://streamb4.com/#organization" },
  "inLanguage": "en-US"
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://streamb4.com/features#service",
  "name": "STREAMB4 IPTV Service",
  "description": "Premium IPTV service with 50,000+ live channels and 180,000+ on-demand titles in 4K Ultra HD. Anti-buffering technology, 24/7 support, EPG guide, catch-up TV, and multi-screen streaming.",
  "url": "https://streamb4.com/features",
  "provider": { "@id": "https://streamb4.com/#organization" },
  "serviceType": "IPTV Streaming Service",
  "category": "Streaming Service",
  "areaServed": { "@type": "Place", "name": "Worldwide" },
  "availableLanguage": [
    { "@type": "Language", "name": "English" },
    { "@type": "Language", "name": "French" },
    { "@type": "Language", "name": "Arabic" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "STREAMB4 IPTV Feature Plans",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "50,000+ Live Channels",
          "description": "Access over 50,000 live TV channels from around the world including sports, news, entertainment, and movies in Full HD and 4K Ultra HD quality."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "180,000+ On-Demand Titles",
          "description": "Stream over 180,000 movies and TV series in a personal VOD library updated daily."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Anti-Buffering Technology",
          "description": "Proprietary anti-buffering system with automatic server failover ensures zero freezing even during peak demand."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Electronic Programme Guide (EPG)",
          "description": "Full 7-day EPG TV guide so you always know what is on now and what is coming next."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Catch-Up TV",
          "description": "Watch TV shows and events from the past 7 days on-demand with the catch-up TV feature."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Multi-Screen Streaming",
          "description": "Stream on up to 3 devices simultaneously with Duo and Family plans. No IP restrictions worldwide."
        }
      }
    ]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://streamb4.com/features" }
  ]
};

export default function FeaturesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <FeaturesClient />
    </>
  );
}
