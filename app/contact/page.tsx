import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact STREAMB4 — 24/7 Customer Support & Sales",
  description: "Contact the STREAMB4 support team. Available 24/7 via live chat and email. Average response time under 10 minutes. Pre-sales, technical support, and reseller enquiries.",
  alternates: {
    canonical: "https://streamb4.com/contact",
  },
  openGraph: {
    title: "Contact STREAMB4 — 24/7 Live Support",
    description: "Reach the STREAMB4 team 24/7. Live chat, email, and technical support. Response time under 10 minutes.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Contact STREAMB4 Support Team" }],
    url: "https://streamb4.com/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact STREAMB4 — 24/7 Support",
    description: "24/7 live chat and email support. Response time under 10 minutes.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://streamb4.com/contact#webpage",
  "name": "Contact STREAMB4 — 24/7 Customer Support",
  "url": "https://streamb4.com/contact",
  "description": "Contact the STREAMB4 support team 24/7 via live chat or email. Average response time under 10 minutes.",
  "isPartOf": { "@id": "https://streamb4.com/#website" },
  "publisher": { "@id": "https://streamb4.com/#organization" },
  "inLanguage": "en-US"
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://streamb4.com/#organization",
  "name": "STREAMB4",
  "url": "https://streamb4.com",
  "email": "support@streamb4.com",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@streamb4.com",
      "availableLanguage": ["English", "French", "Arabic"],
      "contactOption": "TollFree",
      "areaServed": "Worldwide",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": "support@streamb4.com",
      "availableLanguage": ["English", "French", "Arabic"],
      "areaServed": "Worldwide"
    },
    {
      "@type": "ContactPoint",
      "contactType": "technical support",
      "email": "support@streamb4.com",
      "availableLanguage": ["English", "French", "Arabic"],
      "areaServed": "Worldwide",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://streamb4.com/contact" }
  ]
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(contactPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <ContactClient />
    </>
  );
}
