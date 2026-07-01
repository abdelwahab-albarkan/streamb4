import type { Metadata } from "next";
import DevicesClient from "./DevicesClient";

export const metadata: Metadata = {
  title: "IPTV Downloader Codes & App Installation — Firestick, Smart TV, Android | STREAMB4",
  description: "Get 6-digit Downloader codes for IPTV Smarters Pro, TiviMate, IBO Player and more. Install IPTV apps on Firestick, Android TV Box, Samsung, LG Smart TVs instantly.",
  alternates: {
    canonical: "https://streamb4.com/devices",
  },
  openGraph: {
    title: "IPTV Downloader Codes & App Setup | STREAMB4",
    description: "Find 6-digit Downloader shortcodes for every IPTV player app. Install on Firestick, Android TV, Samsung, LG, and more — in seconds.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Downloader Codes and App Installation" }],
    url: "https://streamb4.com/devices",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Downloader Codes for Firestick & Smart TV | STREAMB4",
    description: "Install IPTV Smarters, TiviMate, IBO Player using 6-digit shortcodes. Works on Firestick, Android TV, Samsung, LG.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

// SoftwareApplication schemas for the main IPTV player apps
const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "IPTV Player Apps for STREAMB4",
  "description": "Recommended IPTV player applications compatible with STREAMB4. Available for Amazon Fire TV Stick, Android TV, Smart TV, and mobile devices.",
  "url": "https://streamb4.com/devices",
  "numberOfItems": 4,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": "IPTV Smarters Pro",
        "description": "The most popular IPTV player for Firestick and Android TV. Supports Xtream Codes API and M3U playlists. Recommended for STREAMB4 users. Downloader code: 6468112.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Android, Amazon Fire OS, iOS",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": ["Xtream Codes support", "M3U playlist", "EPG TV guide", "Multi-screen"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "SoftwareApplication",
        "name": "TiviMate",
        "description": "Premium IPTV player with a clean TV-style interface, EPG support, and recording features. Downloader code: 778786.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Android TV, Amazon Fire OS",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": ["M3U/Xtream Codes", "EPG guide", "Recording", "Favourites"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "SoftwareApplication",
        "name": "IBO Player",
        "description": "Free IPTV player for Samsung and LG Smart TVs. Uses MAC address activation — no username or password required. Downloader code: 417847.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Android TV, Samsung Tizen, LG webOS",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": ["MAC address activation", "Samsung Smart TV", "LG Smart TV", "EPG guide"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "MobileApplication",
        "name": "GSE Smart IPTV",
        "description": "Feature-rich IPTV player for iPhone and iPad with M3U and Xtream Codes support. Downloader code: 680664.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "iOS, iPadOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": ["M3U playlist", "Xtream Codes", "EPG guide", "iPhone/iPad support"],
        "provider": { "@id": "https://streamb4.com/#organization" }
      }
    }
  ]
};

// HowTo schema for app installation via Downloader
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Install IPTV Apps on Firestick Using Downloader Codes",
  "description": "Install any IPTV player app on your Amazon Fire TV Stick using 6-digit Downloader shortcodes. No typing long URLs — just enter the code and stream.",
  "image": {
    "@type": "ImageObject",
    "url": "https://streamb4.com/og-image.jpg",
    "width": 1200,
    "height": 630
  },
  "totalTime": "PT3M",
  "tool": [
    { "@type": "HowToTool", "name": "Amazon Fire TV Stick" },
    { "@type": "HowToTool", "name": "Downloader App by AFTVnews" },
    { "@type": "HowToTool", "name": "STREAMB4 6-digit Downloader Code" }
  ],
  "supply": [
    { "@type": "HowToSupply", "name": "Active STREAMB4 subscription" },
    { "@type": "HowToSupply", "name": "Internet connection (10 Mbps minimum)" }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Enable Apps from Unknown Sources",
      "text": "On your Fire TV Stick, go to Settings → My Fire TV → Developer Options and switch 'Apps from Unknown Sources' to ON.",
      "url": "https://streamb4.com/devices"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Open the Downloader App",
      "text": "Search for 'Downloader' by AFTVnews in the Amazon App Store and install it. Open the app and navigate to the URL/code field.",
      "url": "https://streamb4.com/devices"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Enter the 6-Digit Downloader Code",
      "text": "Enter the 6-digit shortcode for your chosen IPTV player (e.g. 6468112 for IPTV Smarters Pro) and tap Go. The app APK downloads automatically.",
      "url": "https://streamb4.com/devices"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Install the IPTV Player",
      "text": "When the download finishes, tap Install. Wait for the installation to complete, then select Done.",
      "url": "https://streamb4.com/devices"
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Enter Your STREAMB4 Credentials",
      "text": "Open the IPTV player and choose 'Add via Xtream Codes' or 'Add M3U URL'. Enter the server, username, and password emailed to you by STREAMB4.",
      "url": "https://streamb4.com/devices"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an IPTV Downloader code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Downloader code is a 6-digit shortcode used inside the AFTVnews Downloader app. Instead of typing a long URL with your TV remote, you enter this short code and the app automatically fetches and installs the IPTV player APK for you."
      }
    },
    {
      "@type": "Question",
      "name": "Which IPTV player app is the best for Firestick in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IPTV Smarters Pro v5 is our top recommendation for Amazon Firestick. It supports Xtream Codes, M3U playlists, and EPG (TV guide). The Downloader code is 6468112."
      }
    },
    {
      "@type": "Question",
      "name": "How do I fix 'Downloader App Installation Blocked' on Firestick?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Go to Settings → My Fire TV → Developer Options and enable 'Apps from Unknown Sources' and 'ADB Debugging'. Then try installing again through the Downloader app."
      }
    },
    {
      "@type": "Question",
      "name": "Is IBO Player free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, IBO Player and IBO Player Pro are free to download and use. You only need your STREAMB4 subscription credentials (server URL, username, password or MAC address) to start streaming."
      }
    },
    {
      "@type": "Question",
      "name": "What is a Mac Address and Device Key for IBO Player?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When you open IBO Player on a Samsung or LG Smart TV, it shows a unique MAC address. You send this address to STREAMB4 support, and we activate your subscription to that specific TV — no username/password needed."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Devices & App Codes", "item": "https://streamb4.com/devices" }
  ]
};

export default function DevicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <DevicesClient />
    </>
  );
}
