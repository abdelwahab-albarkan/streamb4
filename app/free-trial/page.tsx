import type { Metadata } from "next";
import FreeTrialClient from "./FreeTrialClient";

export const metadata: Metadata = {
  title: { absolute: "IPTV Free Trial — 24 Hours, No Credit Card Required | STREAMB4" },
  description: "Try STREAMB4 free for 24 hours. Full access to 50,000+ live channels, 180,000+ VOD titles, and 4K sports. No credit card. No commitment. Instant activation.",
  alternates: {
    canonical: "https://streamb4.com/free-trial",
  },
  openGraph: {
    title: "IPTV Free Trial — 24 Hours, No Credit Card | STREAMB4",
    description: "Test the full STREAMB4 service free for 24 hours. 50,000+ channels, 4K quality, no restrictions. Instant activation — no card required.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 Free Trial — 24 Hours No Card Required" }],
    url: "https://streamb4.com/free-trial",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Free Trial — No Card Required | STREAMB4",
    description: "Try STREAMB4 free for 24 hours. 50,000+ channels, 4K quality, instant access.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Offer",
  "@id": "https://streamb4.com/free-trial#offer",
  "name": "STREAMB4 24-Hour Free IPTV Trial",
  "description": "24-hour free trial of the full STREAMB4 IPTV service. Access to 50,000+ live channels, 180,000+ VOD titles, and 4K quality. No credit card required.",
  "url": "https://streamb4.com/free-trial",
  "price": "0",
  "priceCurrency": "USD",
  "eligibleDuration": "PT24H",
  "availability": "https://schema.org/InStock",
  "seller": { "@id": "https://streamb4.com/#organization" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the STREAMB4 free trial really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The 24-hour STREAMB4 trial is completely free. No credit card required, no hidden charges. You get full access to 50,000+ channels and all features.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does the STREAMB4 free trial last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The trial lasts 24 hours from activation. You have full access to all features, channels, and VOD titles during this period.",
      },
    },
    {
      "@type": "Question",
      "name": "Do I need a credit card for the STREAMB4 free trial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No credit card is required. Simply submit your email and device type, and we'll send your credentials within minutes.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Free Trial", "item": "https://streamb4.com/free-trial" },
  ],
};

export default function FreeTrialPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(offerSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <main id="main-content">
        <FreeTrialClient />
      </main>
    </>
  );
}
