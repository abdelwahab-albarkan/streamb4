import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryClient, { COUNTRY_CONFIGS } from "./CountryClient";

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

export async function generateStaticParams() {
  return Object.keys(COUNTRY_CONFIGS).map((country) => ({ country }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ country: string }> }
): Promise<Metadata> {
  const { country } = await params;
  const config = COUNTRY_CONFIGS[country.toLowerCase()];

  if (!config) {
    return { robots: { index: false, follow: false } };
  }

  const title = `Best IPTV Service in ${config.name} — ${config.channels} Channels | STREAMB4`;
  const description = `Watch ${config.channels} live TV channels in ${config.name} in 4K Ultra HD. ${config.sports.slice(0, 3).join(", ")} and local networks. ${config.serverNode}. Instant activation.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://streamb4.com/${country}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `STREAMB4 IPTV for ${config.name} — ${config.channels} Live Channels` }],
      url: `https://streamb4.com/${country}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Best IPTV for ${config.name} | STREAMB4`,
      description: `${config.channels} live channels including ${config.sports.slice(0, 3).join(", ")}. 4K quality, instant activation.`,
    },
  };
}

export default async function CountryPage(
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  const countryCode = country.toLowerCase();
  const config = COUNTRY_CONFIGS[countryCode];

  if (!config) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
      { "@type": "ListItem", "position": 2, "name": `IPTV ${config.name}`, "item": `https://streamb4.com/${country}` }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `STREAMB4 IPTV for ${config.name}`,
    "description": config.desc,
    "provider": {
      "@type": "Organization",
      "name": "STREAMB4",
      "url": "https://streamb4.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": config.name
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": config.currency,
      "lowPrice": "39.99",
      "offerCount": "9"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceSchema) }} />
      <CountryClient countryCode={countryCode} config={config} />
    </>
  );
}
