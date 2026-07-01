import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "IPTV Subscription Plans & Pricing — From $39.99 | STREAMB4",
  description: "Compare STREAMB4 IPTV plans: Solo from $39.99, Duo from $55, Family from $70. 50,000+ live channels, 4K quality, instant activation, no contracts. Choose your plan today.",
  alternates: {
    canonical: "https://streamb4.com/pricing",
  },
  openGraph: {
    title: "IPTV Plans & Pricing — Solo, Duo & Family | STREAMB4",
    description: "Premium IPTV subscriptions from $39.99. 50,000+ live channels, 4K quality, instant activation. No contracts. Compare all plans.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Subscription Plans and Pricing" }],
    url: "https://streamb4.com/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Subscription Plans From $39.99 | STREAMB4",
    description: "Compare STREAMB4 IPTV plans. Solo from $39.99, Duo $55, Family $70. 50,000+ channels, 4K quality.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

// Shared offer definitions — used by both Product and OfferCatalog
const IPTV_OFFERS = [
  {
    "@type": "Offer",
    "name": "Solo Plan — 3 Months",
    "description": "1 simultaneous connection, 50,000+ live channels, 4K Ultra HD quality — 3 month subscription",
    "price": "39.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://streamb4.com/pricing",
    "priceValidUntil": "2027-01-01",
    "seller": { "@id": "https://streamb4.com/#organization" },
    "category": "IPTV Subscription"
  },
  {
    "@type": "Offer",
    "name": "Solo Plan — 6 Months",
    "description": "1 simultaneous connection, 50,000+ live channels, 4K Ultra HD quality — 6 month subscription",
    "price": "54.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://streamb4.com/pricing",
    "priceValidUntil": "2027-01-01",
    "seller": { "@id": "https://streamb4.com/#organization" },
    "category": "IPTV Subscription"
  },
  {
    "@type": "Offer",
    "name": "Solo Plan — 12 Months",
    "description": "1 simultaneous connection, 50,000+ live channels, 4K Ultra HD quality — 12 month subscription (best value)",
    "price": "69.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://streamb4.com/pricing",
    "priceValidUntil": "2027-01-01",
    "seller": { "@id": "https://streamb4.com/#organization" },
    "category": "IPTV Subscription"
  },
  {
    "@type": "Offer",
    "name": "Duo Plan — 3 Months",
    "description": "2 simultaneous connections, 50,000+ live channels, 4K Ultra HD quality — 3 month subscription",
    "price": "55.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://streamb4.com/pricing",
    "priceValidUntil": "2027-01-01",
    "seller": { "@id": "https://streamb4.com/#organization" },
    "category": "IPTV Subscription"
  },
  {
    "@type": "Offer",
    "name": "Duo Plan — 12 Months",
    "description": "2 simultaneous connections, 50,000+ live channels, 4K Ultra HD quality — 12 month subscription",
    "price": "120.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://streamb4.com/pricing",
    "priceValidUntil": "2027-01-01",
    "seller": { "@id": "https://streamb4.com/#organization" },
    "category": "IPTV Subscription"
  },
  {
    "@type": "Offer",
    "name": "Family Plan — 3 Months",
    "description": "3 simultaneous connections, 50,000+ live channels, 4K Ultra HD quality — 3 month subscription",
    "price": "70.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://streamb4.com/pricing",
    "priceValidUntil": "2027-01-01",
    "seller": { "@id": "https://streamb4.com/#organization" },
    "category": "IPTV Subscription"
  },
  {
    "@type": "Offer",
    "name": "Family Plan — 12 Months",
    "description": "3 simultaneous connections, 50,000+ live channels, 4K Ultra HD quality — 12 month subscription",
    "price": "165.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://streamb4.com/pricing",
    "priceValidUntil": "2027-01-01",
    "seller": { "@id": "https://streamb4.com/#organization" },
    "category": "IPTV Subscription"
  }
];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://streamb4.com/pricing#product",
  "name": "STREAMB4 IPTV Subscription",
  "description": "Premium IPTV service with 50,000+ live TV channels and 180,000+ on-demand titles in 4K Ultra HD. Instant activation, no contracts.",
  "brand": {
    "@type": "Brand",
    "name": "STREAMB4"
  },
  "url": "https://streamb4.com/pricing",
  "image": {
    "@type": "ImageObject",
    "url": "https://streamb4.com/og-image.jpg",
    "width": 1200,
    "height": 630
  },
  "category": "Streaming Service Subscription",
  "offers": IPTV_OFFERS
};

const offerCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": "https://streamb4.com/pricing#catalog",
  "name": "STREAMB4 IPTV Subscription Plans",
  "description": "Complete catalog of STREAMB4 IPTV subscription plans — Solo (1 screen), Duo (2 screens), and Family (3 screens) across 3, 6, and 12-month durations.",
  "url": "https://streamb4.com/pricing",
  "provider": { "@id": "https://streamb4.com/#organization" },
  "numberOfItems": 7,
  "itemListElement": IPTV_OFFERS
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://streamb4.com/pricing" }
  ]
};

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does STREAMB4 IPTV cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "STREAMB4 plans start from $39.99 for 3 months (1 screen). The most popular plan is Solo 12 Months at $69.99/year. Duo plans (2 screens) start from $55, and Family plans (3 screens) start from $70."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a free trial before I buy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. STREAMB4 offers a free 24-hour trial with full channel access. No credit card is required to start your trial."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cancel my STREAMB4 subscription?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. There are no binding contracts. You can cancel at any time from your client portal with no cancellation fees."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods are accepted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept PayPal, Visa, Mastercard, Apple Pay, Google Pay, Bitcoin, USDT, and Ethereum."
      }
    },
    {
      "@type": "Question",
      "name": "How many screens can I use simultaneously?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Solo plan supports 1 simultaneous connection, the Duo plan supports 2, and the Family plan supports 3. Each screen can be on a different device and location."
      }
    },
    {
      "@type": "Question",
      "name": "Is activation really instant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Your STREAMB4 credentials are delivered by email within minutes of order confirmation, 24 hours a day, 7 days a week."
      }
    }
  ]
};

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(offerCatalogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(pricingFaqSchema) }} />
      <PricingClient />
    </>
  );
}
