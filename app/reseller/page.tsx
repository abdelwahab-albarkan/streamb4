import type { Metadata } from "next";
import ResellerClient from "./ResellerClient";

export const metadata: Metadata = {
  title: "IPTV Reseller Program — White-Label IPTV Business | STREAMB4",
  description: "Start your IPTV reseller business with STREAMB4. White-label solution, 25 to 1,000+ connections, high profit margins, dedicated account manager, and 24/7 support. Apply today.",
  alternates: {
    canonical: "https://streamb4.com/reseller",
  },
  openGraph: {
    title: "IPTV Reseller Program — Build Your Business | STREAMB4",
    description: "Launch your own IPTV business with STREAMB4. White-label, wholesale pricing, 25 to 1,000+ connections, dedicated support. Start earning today.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Reseller Program — White-Label IPTV Business" }],
    url: "https://streamb4.com/reseller",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Reseller Program | STREAMB4",
    description: "Start your IPTV business with STREAMB4's reseller program. White-label, wholesale pricing, up to 1,000+ connections.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const resellerServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://streamb4.com/reseller#service",
  "name": "STREAMB4 IPTV Reseller Program",
  "description": "White-label IPTV reseller service. Purchase connections at wholesale prices and resell under your own brand. Dedicated account manager, real-time admin panel, 25 to 1,000+ connections available.",
  "url": "https://streamb4.com/reseller",
  "provider": { "@id": "https://streamb4.com/#organization" },
  "serviceType": "IPTV Reseller Program",
  "category": "B2B Streaming Service",
  "areaServed": { "@type": "Place", "name": "Worldwide" },
  "availableLanguage": [
    { "@type": "Language", "name": "English" },
    { "@type": "Language", "name": "French" },
    { "@type": "Language", "name": "Arabic" }
  ]
};

const resellerOfferCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": "https://streamb4.com/reseller#catalog",
  "name": "STREAMB4 IPTV Reseller Packages",
  "description": "Wholesale IPTV reseller packages from 25 to 1,000+ connections at competitive pricing.",
  "url": "https://streamb4.com/reseller",
  "provider": { "@id": "https://streamb4.com/#organization" },
  "numberOfItems": 4,
  "itemListElement": [
    {
      "@type": "Offer",
      "name": "Starter Reseller Package — 25 Connections",
      "description": "25 IPTV connections at wholesale pricing. Perfect for starting your IPTV reseller business.",
      "price": "99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://streamb4.com/reseller",
      "seller": { "@id": "https://streamb4.com/#organization" }
    },
    {
      "@type": "Offer",
      "name": "Growth Reseller Package — 100 Connections",
      "description": "100 IPTV connections at wholesale pricing with priority support.",
      "price": "299",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://streamb4.com/reseller",
      "seller": { "@id": "https://streamb4.com/#organization" }
    },
    {
      "@type": "Offer",
      "name": "Business Reseller Package — 500 Connections",
      "description": "500 IPTV connections with dedicated account manager and white-label branding.",
      "price": "599",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://streamb4.com/reseller",
      "seller": { "@id": "https://streamb4.com/#organization" }
    },
    {
      "@type": "Offer",
      "name": "Enterprise Reseller Package — 1,000+ Connections",
      "description": "1,000+ IPTV connections with full white-label solution, custom branding, and enterprise SLA.",
      "price": "999",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://streamb4.com/reseller",
      "seller": { "@id": "https://streamb4.com/#organization" }
    }
  ]
};

const resellerFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the STREAMB4 reseller program work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You purchase IPTV connections at wholesale prices from STREAMB4 and resell them to your own customers at your chosen retail price. You manage everything through a dedicated admin panel with real-time control over subscriptions, renewals, and customer accounts."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum number of connections to start reselling?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The minimum entry level for the STREAMB4 reseller program is 25 connections. Packages scale up to 1,000+ connections for enterprise-level resellers."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need technical knowledge to become a reseller?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No technical knowledge is required. STREAMB4 provides a complete white-label admin panel where you can create, manage, and renew customer subscriptions with a few clicks. Full onboarding support is included."
      }
    },
    {
      "@type": "Question",
      "name": "Is white-label branding included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All reseller packages include white-label branding options so you can operate under your own brand name. Your customers will never see the STREAMB4 name."
      }
    },
    {
      "@type": "Question",
      "name": "What profit margin can I expect as a reseller?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Profit margins vary based on your retail pricing, but most resellers achieve 50–200% margins depending on the package and market. The wholesale pricing structure allows significant flexibility in setting your own prices."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Reseller Program", "item": "https://streamb4.com/reseller" }
  ]
};

export default function ResellerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(resellerServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(resellerOfferCatalogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(resellerFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <ResellerClient />
    </>
  );
}
