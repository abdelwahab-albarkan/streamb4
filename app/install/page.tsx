import type { Metadata } from "next";
import InstallClient from "./InstallClient";

export const metadata: Metadata = {
  title: "How to Install IPTV — Fire TV Stick, Smart TV, Android & Mobile | STREAMB4",
  description: "Step-by-step IPTV setup guides for Amazon Fire TV Stick, Samsung Smart TV, Android TV Box, and mobile phones. Watch video tutorials and get streaming in under 5 minutes.",
  alternates: {
    canonical: "https://streamb4.com/install",
  },
  openGraph: {
    title: "How to Install IPTV on Any Device | STREAMB4",
    description: "Install STREAMB4 IPTV on Firestick, Smart TV, Android TV Box or mobile in minutes. Video tutorials included.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Installation Guide for All Devices" }],
    url: "https://streamb4.com/install",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Install Guide for Any Device | STREAMB4",
    description: "Set up STREAMB4 IPTV on Firestick, Smart TV, Android or mobile. Step-by-step video guide.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Install STREAMB4 IPTV on Amazon Fire TV Stick",
  "description": "Install STREAMB4 IPTV on your Amazon Fire TV Stick in 6 easy steps using the Downloader app.",
  "totalTime": "PT5M",
  "tool": [
    { "@type": "HowToTool", "name": "Amazon Fire TV Stick" },
    { "@type": "HowToTool", "name": "Downloader App by AFTVnews" }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Enable Developer Options",
      "text": "On your Fire TV, go to Settings → My Fire TV → Developer Options and turn ON 'Apps from Unknown Sources'.",
      "url": "https://streamb4.com/install"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Install Downloader App",
      "text": "Search 'Downloader' in the Amazon App Store and install it. This is the app you'll use to sideload IPTV players.",
      "url": "https://streamb4.com/install"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Download IPTV Player",
      "text": "Open Downloader, enter the URL or shortcode provided by STREAMB4 support and press Go to download.",
      "url": "https://streamb4.com/install"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Install the APK",
      "text": "Once downloaded, tap Install. After installation select Done — do not open yet.",
      "url": "https://streamb4.com/install"
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Enter Your Credentials",
      "text": "Open the IPTV player, choose 'Add Playlist via URL' or 'Xtream Codes', then enter the M3U URL or login details sent by STREAMB4.",
      "url": "https://streamb4.com/install"
    },
    {
      "@type": "HowToStep",
      "position": 6,
      "name": "Start Streaming",
      "text": "Your channels will load automatically. Enjoy 50,000+ live channels in crystal-clear 4K!",
      "url": "https://streamb4.com/install"
    }
  ]
};

const installFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I install STREAMB4 IPTV on Amazon Fire TV Stick?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Enable 'Apps from Unknown Sources' in Settings → My Fire TV → Developer Options. Install the Downloader app from the App Store, enter the IPTV Smarters Pro code 6468112, install the APK, then enter your STREAMB4 Xtream Codes credentials. Takes under 5 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I install STREAMB4 on a Samsung or LG Smart TV?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. For Samsung and LG Smart TVs, install IBO Player from the app store. Open it to find your MAC address, send it to STREAMB4 support, and your account is activated to that TV automatically."
      }
    },
    {
      "@type": "Question",
      "name": "What IPTV player app should I use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We recommend IPTV Smarters Pro for Firestick and Android TV (Downloader code 6468112), TiviMate for a premium interface (code 778786), and IBO Player for Samsung/LG Smart TVs (code 417847)."
      }
    },
    {
      "@type": "Question",
      "name": "How long does IPTV setup take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Setup on Amazon Fire TV Stick takes under 5 minutes following our step-by-step guide. Installation on Smart TVs, Android TV Boxes, and mobile devices typically takes 2–3 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "What internet speed do I need for IPTV streaming?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A minimum of 10 Mbps download speed is recommended for HD streaming. For stable 4K Ultra HD, we recommend 25 Mbps or higher."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Install Guide", "item": "https://streamb4.com/install" }
  ]
};

export default function InstallPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(installFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <InstallClient />
    </>
  );
}
