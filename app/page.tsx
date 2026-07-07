import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { VODSection } from "@/components/sections/VODSection";
import { SportsSection } from "@/components/sections/SportsSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { LibraryStats } from "@/components/sections/LibraryStats";
import { DevicesSection } from "@/components/sections/DevicesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CompareSection } from "@/components/sections/CompareSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { LatestBlogPosts } from "@/components/sections/LatestBlogPosts";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";
import { serializeDocs } from "@/lib/serialize";
import { OffersSection } from "@/components/sections/OffersSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "STREAMB4 — Best IPTV Service | 50,000+ Channels, 4K Streaming",
  description: "STREAMB4 is the #1 premium IPTV service. Watch 50,000+ live TV channels and 180,000+ movies in 4K Ultra HD. Instant activation. No contracts. Free 24-hour trial.",
  alternates: {
    canonical: "https://streamb4.com",
  },
  openGraph: {
    type: "website",
    url: "https://streamb4.com",
    title: "STREAMB4 — Best IPTV Service | 50,000+ Live Channels in 4K",
    description: "Stream 50,000+ live TV channels & 180,000+ movies in 4K. Plans from $39.99. Instant activation. No contracts. Try free for 24 hours.",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "STREAMB4 — Premium IPTV Streaming Service",
    }],
  },
};

// Homepage-specific JSON-LD schemas
function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://streamb4.com/#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" }
  ]
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://streamb4.com/#webpage",
  "url": "https://streamb4.com",
  "name": "STREAMB4 — Best IPTV Service | 50,000+ Channels, 4K Streaming",
  "description": "STREAMB4 is the #1 premium IPTV service. Watch 50,000+ live TV channels and 180,000+ movies in 4K Ultra HD. Instant activation. No contracts. Free 24-hour trial.",
  "isPartOf": { "@id": "https://streamb4.com/#website" },
  "about": { "@id": "https://streamb4.com/#organization" },
  "publisher": { "@id": "https://streamb4.com/#organization" },
  "inLanguage": "en-US",
  "breadcrumb": { "@id": "https://streamb4.com/#breadcrumb" }
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://streamb4.com/#service",
  "name": "STREAMB4 IPTV Streaming Service",
  "description": "Premium IPTV streaming service delivering 50,000+ live TV channels and 180,000+ on-demand movies and series in 4K Ultra HD. Instant activation, no contracts, 24/7 support.",
  "url": "https://streamb4.com",
  "provider": { "@id": "https://streamb4.com/#organization" },
  "serviceType": "IPTV Streaming Service",
  "category": "Streaming Service",
  "areaServed": { "@type": "Place", "name": "Worldwide" },
  "availableLanguage": [
    { "@type": "Language", "name": "English" },
    { "@type": "Language", "name": "French" },
    { "@type": "Language", "name": "Arabic" }
  ],
  "termsOfService": "https://streamb4.com/legal/terms",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "STREAMB4 IPTV Subscription Plans",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Solo Plan",
        "description": "1 simultaneous connection — 50,000+ live channels, 4K quality",
        "price": "39.99",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-01-01",
        "availability": "https://schema.org/InStock",
        "url": "https://streamb4.com/pricing"
      },
      {
        "@type": "Offer",
        "name": "Duo Plan",
        "description": "2 simultaneous connections — 50,000+ live channels, 4K quality",
        "price": "55.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-01-01",
        "availability": "https://schema.org/InStock",
        "url": "https://streamb4.com/pricing"
      },
      {
        "@type": "Offer",
        "name": "Family Plan",
        "description": "3 simultaneous connections — 50,000+ live channels, 4K quality",
        "price": "70.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-01-01",
        "availability": "https://schema.org/InStock",
        "url": "https://streamb4.com/pricing"
      }
    ]
  }
};

const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is STREAMB4 IPTV?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "STREAMB4 is a premium IPTV streaming service delivering 50,000+ live TV channels and 180,000+ on-demand movies and series in 4K Ultra HD. It works on Fire TV Stick, Smart TV, Android TV, Apple TV, iPhone, Android, Windows, MacOS and Linux."
      }
    },
    {
      "@type": "Question",
      "name": "How much does STREAMB4 cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "STREAMB4 plans start from $39.99 for 3 months (1 screen). A 12-month Solo plan costs $69.99, Duo $120.00, and Family (3 screens) $165.00. All plans include unlimited channels, VOD, and 4K quality."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly is my IPTV account activated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Activation is instant. Your login credentials are delivered by email within minutes of your order confirmation."
      }
    },
    {
      "@type": "Question",
      "name": "Does STREAMB4 work on Fire TV Stick?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. STREAMB4 is fully compatible with Amazon Fire TV Stick (all generations), Fire TV Cube, and Fire TV Edition smart TVs. Setup takes under 5 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use STREAMB4 abroad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. STREAMB4 has no IP restrictions. You can stream from any country in the world without a VPN."
      }
    },
    {
      "@type": "Question",
      "name": "What internet speed do I need for STREAMB4?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A minimum of 10 Mbps is recommended for HD streaming. For stable 4K Ultra HD, 25 Mbps or higher is ideal."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods does STREAMB4 accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "STREAMB4 accepts PayPal, Visa, Mastercard, Apple Pay, Google Pay, Bitcoin, USDT (Tether), and Ethereum."
      }
    }
  ]
};

// Fetch exactly 3 newest published posts for the homepage section.
// Done server-side with .limit(3) — never slice a large array on the client.
async function getLatestPosts() {
  try {
    await connectDB();
    const docs = await Post.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .lean();
    return serializeDocs(docs as any[]);
  } catch {
    return [];
  }
}

export default async function Home() {
  const latestPosts = await getLatestPosts();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(homepageFaqSchema) }} />
      <main id="main-content">
        <HeroSection />
        <StatsBar />
        <VODSection />
        <SportsSection />
        <FeaturesGrid />
        <LibraryStats />
        <DevicesSection />
        <HowItWorks />
        <PricingSection />
        <CompareSection />
        <ReviewsSection />
        <OffersSection />
        <LatestBlogPosts posts={latestPosts as any} />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}
