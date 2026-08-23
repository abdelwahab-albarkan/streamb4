export interface FAQGroup {
  category: string;
  items: { question: string; answer: string }[];
}

export const CATEGORIZED_FAQS: FAQGroup[] = [
  {
    category: "General Info",
    items: [
      {
        question: "What is STREAMB4?",
        answer: "STREAMB4 is a premium IPTV streaming service providing reliable access to 50,000+ live TV channels and 180,000+ movies, series, and sports packages in 4K Ultra HD over your internet connection."
      },
      {
        question: "How many devices can I use simultaneously?",
        answer: "STREAMB4 offers three plans with different simultaneous connection limits: Solo supports 1 screen, Duo supports 2, and Family supports 3 — all usable on different devices at the same time."
      },
      {
        question: "What countries does STREAMB4 work in?",
        answer: "STREAMB4 works worldwide. There are no geographic restrictions or IP locks. You can stream from any country without a VPN."
      },
      {
        question: "Can I try STREAMB4 before committing to a plan?",
        answer: "Yes. Contact our support team before purchasing and ask about a short trial. We also offer a 7-day money-back guarantee on all first-time subscriptions, so you can subscribe with confidence."
      }
    ]
  },
  {
    category: "Technical Setup",
    items: [
      {
        question: "What internet speed do I need?",
        answer: "We recommend a minimum of 10 Mbps for HD streaming and 25+ Mbps for stable 4K Ultra HD. Most modern broadband connections exceed these requirements comfortably. If you experience buffering on a fast connection, try using a wired Ethernet cable instead of Wi-Fi."
      },
      {
        question: "Which devices are compatible with STREAMB4?",
        answer: "STREAMB4 is compatible with Amazon Fire TV Stick, Android TV, Google TV, Samsung/LG/Sony Smart TVs, Apple TV, MAG Box, iPhone, Android phones and tablets, Windows, MacOS, and Linux."
      },
      {
        question: "Does STREAMB4 work while travelling?",
        answer: "Yes. There are no IP locks. You can log in and stream from any location globally — no VPN required. Your subscription works exactly the same abroad as it does at home."
      },
      {
        question: "What IPTV player apps are supported?",
        answer: "STREAMB4 works with all major IPTV players: TiviMate, IPTV Smarters Pro, IBO Player, XCIPTV, Flixera, and Net IPTV. We support Xtream Codes, M3U playlists, and MAC address activation."
      },
      {
        question: "How do I set up STREAMB4 on a Samsung or LG Smart TV?",
        answer: "Samsung and LG Smart TVs use MAC address activation. Install IBO Player from your TV's app store (search 'IBO Player'). Open the app and note the MAC address shown on screen. Send that address to STREAMB4 support via live chat or email, and we'll activate your account to that TV within minutes — no username or password needed."
      },
      {
        question: "What is Xtream Codes and do I need it?",
        answer: "Xtream Codes is a login-based connection method used by most modern IPTV apps (TiviMate, IPTV Smarters, XCIPTV). Instead of loading a long M3U URL, you enter a server address, username, and password. STREAMB4 supports both Xtream Codes and M3U. Xtream Codes is recommended because it loads the EPG guide faster and lets the app remember your login."
      },
      {
        question: "What is a 6-digit Downloader code and how do I use it?",
        answer: "A Downloader code is a shortcode you enter in the AFTVnews Downloader app on your Firestick or Android TV Box. Instead of typing a full URL with your remote, you enter a 6-digit number and the app downloads the IPTV player APK automatically. For example: IPTV Smarters Pro is 6468112, TiviMate is 778786. You can find all current codes on our Devices page."
      }
    ]
  },
  {
    category: "Billing & Plans",
    items: [
      {
        question: "Can I cancel at any time?",
        answer: "Yes. There are no binding contracts. You can manage or cancel your subscription at any time from your secure client portal. No cancellation fees apply."
      },
      {
        question: "What is your refund policy?",
        answer: "We offer a 7-day money-back guarantee for first-time subscriptions. If you are not satisfied within 7 days of purchase, contact our support team for a full refund."
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept PayPal, Visa, Mastercard, Apple Pay, Google Pay, Bitcoin, USDT (Tether), and Ethereum. All transactions are processed through secure, encrypted payment gateways."
      },
      {
        question: "How long does activation take?",
        answer: "Activation is instant. Your IPTV credentials are delivered by email within minutes of your order being confirmed. No waiting, no manual processing."
      },
      {
        question: "Can I upgrade my plan later?",
        answer: "Yes. You can upgrade to a higher plan at any time by contacting our support team. The upgrade is applied immediately and prorated to your existing subscription period."
      }
    ]
  },
  {
    category: "Streaming Quality",
    items: [
      {
        question: "What video quality does STREAMB4 support?",
        answer: "STREAMB4 supports SD, HD (1080p), Full HD, and 4K Ultra HD streams. The quality automatically adjusts to your internet connection speed to prevent buffering."
      },
      {
        question: "Why am I experiencing buffering?",
        answer: "Buffering is usually caused by one of three things: a slow or congested internet connection, Wi-Fi interference, or a busy time of day on your ISP's network. First, try switching from Wi-Fi to a wired Ethernet connection — this resolves the issue for most users. If you're already wired, try lowering the stream quality in your IPTV player settings from 4K to FHD or HD. If the problem continues, contact our 24/7 support team so we can check the specific stream and switch you to an alternative server node."
      },
      {
        question: "Does STREAMB4 include an Electronic Program Guide (EPG)?",
        answer: "Yes. Full EPG (TV Guide) is included with all plans. You can see what is on now and plan ahead for upcoming programmes and sports events. EPG data is available for 7 days ahead on most channels."
      },
      {
        question: "Is there a catch-up TV feature?",
        answer: "Yes. STREAMB4 supports catch-up TV on supported channels, allowing you to watch programmes from the past 7 days on demand. Availability varies by channel — not every channel in the library supports catch-up, but the major networks in each region typically do."
      }
    ]
  }
];
