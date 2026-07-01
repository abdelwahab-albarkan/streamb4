import type { Metadata } from "next";
import AffiliateClient from "./AffiliateClient";

export const metadata: Metadata = {
  title: "IPTV Affiliate Program — Earn 30% Recurring Commission | STREAMB4",
  description: "Join the STREAMB4 affiliate program and earn 30% recurring commission on every sale and renewal. Real-time tracking dashboard, $50 minimum payout. Apply today.",
  alternates: {
    canonical: "https://streamb4.com/affiliate",
  },
  openGraph: {
    title: "IPTV Affiliate Program — Earn 30% Recurring Commission | STREAMB4",
    description: "Refer customers to STREAMB4 and earn 30% recurring commission. Real-time analytics, instant payouts, no cap on earnings.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 Affiliate Program — 30% Recurring Commission" }],
    url: "https://streamb4.com/affiliate",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Affiliate Program — 30% Commission | STREAMB4",
    description: "Earn 30% recurring commission referring customers to STREAMB4 IPTV. Real-time tracking dashboard.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const affiliateServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://streamb4.com/affiliate#service",
  "name": "STREAMB4 IPTV Affiliate Program",
  "description": "Earn 30% recurring commission on every STREAMB4 IPTV sale and renewal you refer. Real-time tracking dashboard, $50 minimum payout, no earnings cap.",
  "url": "https://streamb4.com/affiliate",
  "provider": { "@id": "https://streamb4.com/#organization" },
  "serviceType": "Affiliate Marketing Program",
  "category": "Affiliate Program",
  "areaServed": { "@type": "Place", "name": "Worldwide" },
  "availableLanguage": [
    { "@type": "Language", "name": "English" },
    { "@type": "Language", "name": "French" },
    { "@type": "Language", "name": "Arabic" }
  ],
  "termsOfService": "https://streamb4.com/legal/terms",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "STREAMB4 Affiliate Commission Structure",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "30% Recurring Commission",
        "description": "Earn 30% on every sale and every renewal generated through your affiliate link. Commission is paid on a recurring basis for as long as the customer remains subscribed.",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://streamb4.com/affiliate"
      }
    ]
  }
};

const affiliateFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much can I earn with the STREAMB4 affiliate program?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You earn 30% recurring commission on every sale and every renewal. There is no earnings cap. The more customers you refer, the more you earn — for as long as they remain subscribed."
      }
    },
    {
      "@type": "Question",
      "name": "When do affiliate payments get processed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Affiliate payments are processed once your balance reaches the $50 minimum payout threshold. Payments are made via PayPal or bank transfer on a monthly basis."
      }
    },
    {
      "@type": "Question",
      "name": "Is the STREAMB4 affiliate program free to join?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, joining the STREAMB4 affiliate program is completely free. Apply through the affiliate page and receive your unique tracking link upon approval."
      }
    },
    {
      "@type": "Question",
      "name": "How do I track my affiliate referrals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Affiliates get access to a real-time dashboard showing clicks, conversions, commissions earned, and pending payouts. All tracked transparently and updated in real time."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Affiliate Program", "item": "https://streamb4.com/affiliate" }
  ]
};

export default function AffiliatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(affiliateServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(affiliateFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <AffiliateClient />
    </>
  );
}
