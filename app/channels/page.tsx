import type { Metadata } from "next";
import ChannelsClient from "./ChannelsClient";

export const metadata: Metadata = {
  title: { absolute: "IPTV Channel List — 50,000+ Live Channels from 30+ Countries | STREAMB4" },
  description: "Browse STREAMB4's complete channel list. 50,000+ live channels including USA, UK, Canada, French, German, Arabic, sports, entertainment, news, and kids channels.",
  alternates: {
    canonical: "https://streamb4.com/channels",
  },
  openGraph: {
    title: "IPTV Channel List — 50,000+ Live Channels | STREAMB4",
    description: "Browse 50,000+ live channels by country and category. Sports, entertainment, news, kids, and international channels from 30+ countries.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 Channel List — 50,000+ Live Channels" }],
    url: "https://streamb4.com/channels",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Channel List — 50,000+ Channels | STREAMB4",
    description: "Browse 50,000+ live channels from 30+ countries. Sports, entertainment, news, and kids.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "STREAMB4 IPTV Channel Categories",
  "description": "Complete list of IPTV channel categories available on STREAMB4 — 50,000+ channels from 30+ countries.",
  "url": "https://streamb4.com/channels",
  "numberOfItems": 12,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "USA Sports Channels", "description": "200+ US sports channels including ESPN, Fox Sports, NFL Network, NBA TV" },
    { "@type": "ListItem", "position": 2, "name": "UK Sports Channels", "description": "150+ UK sports channels including Sky Sports, TNT Sports, BT Sport" },
    { "@type": "ListItem", "position": 3, "name": "US Entertainment", "description": "500+ US entertainment channels including HBO, Showtime, AMC, History" },
    { "@type": "ListItem", "position": 4, "name": "UK Entertainment", "description": "300+ UK channels including BBC One, ITV, Channel 4, Sky Atlantic" },
    { "@type": "ListItem", "position": 5, "name": "Movies & Cinema", "description": "120+ movie channels including Sky Cinema, HBO Movies, Turner Classic Movies" },
    { "@type": "ListItem", "position": 6, "name": "News", "description": "80+ news channels including CNN, BBC News, Fox News, Al Jazeera" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Channel List", "item": "https://streamb4.com/channels" },
  ],
};

export default function ChannelsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <main id="main-content">
        <ChannelsClient />
      </main>
    </>
  );
}
