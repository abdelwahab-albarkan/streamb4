import type { Metadata } from "next";
import FaqClient from "./FaqClient";
import { CATEGORIZED_FAQS } from "./faqData";

export const metadata: Metadata = {
  title: "IPTV FAQ — Frequently Asked Questions | STREAMB4",
  description: "Find answers to the most common IPTV questions: setup, device compatibility, pricing, billing, streaming quality, and more. Answered by the STREAMB4 team.",
  alternates: {
    canonical: "https://streamb4.com/faq",
  },
  openGraph: {
    title: "IPTV FAQ — Frequently Asked Questions | STREAMB4",
    description: "Everything you need to know about STREAMB4 IPTV. Setup guides, device compatibility, billing, and streaming quality questions answered.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV — Frequently Asked Questions" }],
    url: "https://streamb4.com/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV FAQ | STREAMB4",
    description: "All your IPTV questions answered — setup, devices, billing, streaming quality.",
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
  "@id": "https://streamb4.com/faq#webpage",
  "url": "https://streamb4.com/faq",
  "name": "IPTV FAQ — Frequently Asked Questions | STREAMB4",
  "description": "Find answers to the most common IPTV questions: setup, device compatibility, pricing, billing, streaming quality, and more.",
  "isPartOf": { "@id": "https://streamb4.com/#website" },
  "publisher": { "@id": "https://streamb4.com/#organization" },
  "inLanguage": "en-US"
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": CATEGORIZED_FAQS.flatMap(group =>
    group.items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  )
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://streamb4.com/faq" }
  ]
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <FaqClient />
    </>
  );
}
