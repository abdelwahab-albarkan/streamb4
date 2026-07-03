import type { Metadata } from "next";
import FreeTrialClient from "./FreeTrialClient";

export const metadata: Metadata = {
  title: "Free IPTV Trial — 24 Hours, No Credit Card Required | STREAMB4",
  description: "Try STREAMB4 IPTV free for 24 hours. Full access to 50,000+ live channels and 180,000+ movies. No credit card, no contract. Instant activation on any device.",
  alternates: {
    canonical: "https://streamb4.com/free-trial",
  },
  openGraph: {
    title: "Free 24-Hour IPTV Trial — No Credit Card | STREAMB4",
    description: "Try 50,000+ live TV channels and 180,000+ movies completely free for 24 hours. No credit card required. Instant activation.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 Free IPTV Trial — 24 Hours No Credit Card" }],
    url: "https://streamb4.com/free-trial",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IPTV Trial — 24 Hours No Credit Card | STREAMB4",
    description: "Try STREAMB4 free for 24 hours. 50,000+ channels, 180,000+ movies. No credit card.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": "STREAMB4 Free 24-Hour IPTV Trial",
  "description": "Try STREAMB4 IPTV free for 24 hours with full access to 50,000+ live channels and 180,000+ VOD titles. No credit card required.",
  "price": "0",
  "priceCurrency": "USD",
  "availability": "https://schema.org/InStock",
  "seller": {
    "@type": "Organization",
    "name": "STREAMB4",
    "url": "https://streamb4.com"
  },
  "url": "https://streamb4.com/free-trial",
  "validFrom": "2024-01-01",
  "shippingDetails": {
    "@type": "OfferShippingDetails",
    "shippingRate": {
      "@type": "MonetaryAmount",
      "value": "0",
      "currency": "USD"
    },
    "shippingDestination": {
      "@type": "DefinedRegion",
      "addressCountry": "US"
    },
    "deliveryTime": {
      "@type": "ShippingDeliveryTime",
      "handlingTime": {
        "@type": "QuantitativeValue",
        "minValue": "0",
        "maxValue": "0",
        "unitCode": "DAY"
      },
      "transitTime": {
        "@type": "QuantitativeValue",
        "minValue": "0",
        "maxValue": "0",
        "unitCode": "DAY"
      }
    }
  },
  "hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "US",
    "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Free Trial", "item": "https://streamb4.com/free-trial" }
  ]
};

export default function FreeTrialPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(offerSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <FreeTrialClient />
    </>
  );
}
