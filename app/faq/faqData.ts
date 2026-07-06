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
        answer: "Plans range from 1 to 3 simultaneous connections. Solo plan supports 1 screen, Duo supports 2 screens, and Family supports 3 screens — all usable on different devices at the same time."
      },
      {
        question: "What countries does STREAMB4 work in?",
        answer: "STREAMB4 works worldwide. There are no geographic restrictions or IP locks. You can stream from any country without a VPN."
      }
    ]
  },
  {
    category: "Technical Setup",
    items: [
      {
        question: "What internet speed do I need?",
        answer: "We recommend a minimum of 10 Mbps for HD streaming and 25+ Mbps for stable 4K Ultra HD. Most modern broadband connections exceed these requirements comfortably."
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
        answer: "Buffering is usually caused by a slow internet connection or Wi-Fi interference. We recommend using a wired Ethernet connection and ensuring at least 10 Mbps for HD or 25 Mbps for 4K."
      },
      {
        question: "Does STREAMB4 include an Electronic Program Guide (EPG)?",
        answer: "Yes. Full EPG (TV Guide) is included with all plans. You can see what is on now and plan ahead for upcoming programmes and sports events."
      }
    ]
  }
];
