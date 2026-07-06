// ────────────────────────────────────────────
// Pricing
// ────────────────────────────────────────────
export interface PricingPlan {
  connections: number;
  label: string;
  tagline: string;
  monthly: number;
  quarterly: number;
  biannual: number;
  yearly: number;
  monthlyEquiv: {
    monthly: number;
    quarterly: number;
    biannual: number;
    yearly: number;
  };
  popular: boolean;
  bestValue: boolean;
}

export const PRICING: PricingPlan[] = [
  {
    connections: 1,
    label: 'SOLO',
    tagline: 'Perfect for solo streamers',
    monthly: 9.00,
    quarterly: 34.99,
    biannual: 54.99,
    yearly: 69.99,
    monthlyEquiv: {
      monthly: 9.00,
      quarterly: 11.66,
      biannual: 9.17,
      yearly: 5.83,
    },
    popular: false,
    bestValue: false,
  },
  {
    connections: 2,
    label: 'DUO',
    tagline: 'Ideal for couples',
    monthly: 17.99,
    quarterly: 55.99,
    biannual: 79.99,
    yearly: 119.99,
    monthlyEquiv: {
      monthly: 17.99,
      quarterly: 18.66,
      biannual: 13.33,
      yearly: 10.00,
    },
    popular: false,
    bestValue: false,
  },
  {
    connections: 3,
    label: 'FAMILY',
    tagline: 'Most loved by families',
    monthly: 24.99,
    quarterly: 74.99,
    biannual: 109.99,
    yearly: 159.99,
    monthlyEquiv: {
      monthly: 24.99,
      quarterly: 24.99,
      biannual: 18.33,
      yearly: 13.33,
    },
    popular: true,
    bestValue: false,
  },
  {
    connections: 4,
    label: 'HOME',
    tagline: 'For the whole household',
    monthly: 31.99,
    quarterly: 94.99,
    biannual: 139.99,
    yearly: 199.99,
    monthlyEquiv: {
      monthly: 31.99,
      quarterly: 31.66,
      biannual: 23.33,
      yearly: 16.67,
    },
    popular: false,
    bestValue: false,
  },
  {
    connections: 5,
    label: 'EXTENDED',
    tagline: 'Extended family plan',
    monthly: 38.99,
    quarterly: 114.99,
    biannual: 169.99,
    yearly: 239.99,
    monthlyEquiv: {
      monthly: 38.99,
      quarterly: 38.33,
      biannual: 28.33,
      yearly: 20.00,
    },
    popular: false,
    bestValue: false,
  },
  {
    connections: 6,
    label: 'ULTIMATE',
    tagline: 'Maximum value — 6 screens',
    monthly: 45.99,
    quarterly: 129.99,
    biannual: 194.99,
    yearly: 279.99,
    monthlyEquiv: {
      monthly: 45.99,
      quarterly: 43.33,
      biannual: 32.50,
      yearly: 23.33,
    },
    popular: false,
    bestValue: true,
  },
]

export const PRICING_TABS = [
  { id: 'monthly' as const, label: 'Monthly', save: null },
  { id: 'quarterly' as const, label: '3 Months', save: 'Save 15%' },
  { id: 'biannual' as const, label: '6 Months', save: 'Save 30%' },
  { id: 'yearly' as const, label: '12 Months', save: 'Best Value 🔥' },
]

// ────────────────────────────────────────────
// Features
// ────────────────────────────────────────────
export interface Feature {
  title: string;
  description: string;
  icon: string; // lucide icon name key
}

export const FEATURES: Feature[] = [
  {
    title: "True 4K Ultra HD",
    description: "Crystal-clear picture quality with genuine 4K UHD, FHD, and HD streams across every channel and VOD title.",
    icon: "monitor",
  },
  {
    title: "Anti-Buffering Tech",
    description: "Our proprietary anti-freeze technology ensures smooth, buffer-free streaming even during peak hours.",
    icon: "zap",
  },
  {
    title: "Global Channel Library",
    description: "Access 50,000+ live channels from USA, Canada, UK, Europe, Middle East, Asia, Africa, and Latin America.",
    icon: "globe",
  },
  {
    title: "No IP Lock",
    description: "Use your subscription from any location without restrictions. Travel freely and keep watching everywhere.",
    icon: "unlock",
  },
  {
    title: "24/7 Real Support",
    description: "Our dedicated support team is available around the clock via live chat, email, and WhatsApp.",
    icon: "headphones",
  },
  {
    title: "Every Device Works",
    description: "Compatible with Smart TV, Firestick, Android, iOS, MAG, Windows, Mac, and more — no limits.",
    icon: "smartphone",
  },
];

// ────────────────────────────────────────────
// Stats
// ────────────────────────────────────────────
export const STATS = {
  rating: 4.8,
  reviews: 12847,
  uptime: 99.9,
  customers: 230000,
};

export const LIBRARY_STATS = [
  { value: "50,000+", label: "Live Channels" },
  { value: "180,000+", label: "VOD Titles" },
  { value: "1,800+", label: "Sports Channels" },
  { value: "40+", label: "Languages" },
];

// ────────────────────────────────────────────
// FAQ
// ────────────────────────────────────────────
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is IPTV and how does it work?",
    answer: "IPTV (Internet Protocol Television) delivers television content over the internet instead of traditional cable or satellite. Simply connect your device to the internet, install a compatible player app, and enter your subscription credentials to start streaming thousands of channels instantly.",
  },
  {
    question: "Which devices are compatible?",
    answer: "STREAMB4 works on virtually every device: Amazon Firestick, Android TV, Smart TVs (Samsung, LG, Sony), iOS and Android phones/tablets, Windows and Mac computers, MAG boxes, Formuler devices, and more.",
  },
  {
    question: "Can I use my subscription on multiple devices?",
    answer: "Yes, depending on your plan. Our plans support 1 to 6 simultaneous connections. Choose the plan that fits your household needs.",
  },
  {
    question: "What channels and content do you offer?",
    answer: "We provide 50,000+ live channels including sports, news, entertainment, movies, kids content, and international programming. Plus access to 180,000+ VOD titles including the latest movies and full TV series.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No contracts whatsoever. All plans are prepaid with no hidden fees. You can cancel anytime without penalty.",
  },
  {
    question: "What internet speed do I need?",
    answer: "We recommend a minimum of 25 Mbps for HD streaming and 50 Mbps for 4K Ultra HD. A stable wired connection is recommended for the best experience.",
  },
  {
    question: "How fast is the activation?",
    answer: "Activation is instant. Once your payment is confirmed, you'll receive your credentials via email within minutes and can start watching immediately.",
  },
];

// ────────────────────────────────────────────
// Reviews
// ────────────────────────────────────────────
export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

export const REVIEWS: Review[] = [
  {
    name: "James Mitchell",
    location: "New York, USA",
    rating: 5,
    text: "Switched from cable 6 months ago and never looked back. The channel selection is incredible and the 4K quality on live sports is better than anything I had before.",
    avatar: "JM",
  },
  {
    name: "Sarah Thompson",
    location: "Toronto, Canada",
    rating: 5,
    text: "Best IPTV service I've tried — and I've tested many. Zero buffering, amazing VOD library, and the support team actually responds within minutes.",
    avatar: "ST",
  },
  {
    name: "David Clarke",
    location: "London, UK",
    rating: 5,
    text: "The Premier League streams are flawless. I can watch every match in full HD without any freezing. Worth every penny of the yearly plan.",
    avatar: "DC",
  },
  {
    name: "Maria Rodriguez",
    location: "Barcelona, Spain",
    rating: 4,
    text: "Incredible value for the price. I have the 3-connection plan for my whole family. Kids love the cartoon channels, I get my sports, wife gets her series.",
    avatar: "MR",
  },
];

// ────────────────────────────────────────────
// Sports
// ────────────────────────────────────────────
export const SPORTS_CATEGORIES = [
  { name: "NFL", icon: "🏈", channels: "120+", isLive: true },
  { name: "NBA", icon: "🏀", channels: "90+", isLive: true },
  { name: "Premier League", icon: "⚽", channels: "150+", isLive: true },
  { name: "UFC / MMA", icon: "🥊", channels: "60+", isLive: true },
  { name: "MLB", icon: "⚾", channels: "80+", isLive: false },
  { name: "F1 Racing", icon: "🏎️", channels: "40+", isLive: true },
  { name: "NHL", icon: "🏒", channels: "70+", isLive: false },
  { name: "Tennis", icon: "🎾", channels: "50+", isLive: false },
];

// ────────────────────────────────────────────
// Movie categories
// ────────────────────────────────────────────
export const MOVIE_CATEGORIES = [
  { name: "Action", count: "12,500+" },
  { name: "Comedy", count: "9,800+" },
  { name: "Drama", count: "15,200+" },
  { name: "Sci-Fi", count: "7,400+" },
  { name: "Horror", count: "5,600+" },
  { name: "Documentary", count: "8,900+" },
  { name: "Kids & Family", count: "11,300+" },
  { name: "Thriller", count: "6,700+" },
];

// ────────────────────────────────────────────
// Devices
// ────────────────────────────────────────────
export const DEVICES = [
  { name: "Fire TV Stick", icon: "flame" },
  { name: "Smart TV", icon: "tv" },
  { name: "Android TV", icon: "tv-minimal" },
  { name: "Mobile", icon: "smartphone" },
  { name: "Desktop", icon: "monitor" },
  { name: "MAG Box", icon: "hard-drive" },
];

// ────────────────────────────────────────────
// Cable comparison
// ────────────────────────────────────────────
export const COMPARE_ROWS = [
  { feature: "Monthly Cost", iptv: "From $15/mo", cable: "$80-200+/mo" },
  { feature: "Live Channels", iptv: "50,000+", cable: "200-500" },
  { feature: "4K Ultra HD", iptv: "✓ Included", cable: "Extra $10-20/mo" },
  { feature: "VOD Library", iptv: "180,000+ titles", cable: "Limited" },
  { feature: "Contract Required", iptv: "No contracts", cable: "1-2 year lock-in" },
  { feature: "Device Limit", iptv: "Up to 6", cable: "1-2 per box" },
  { feature: "International Channels", iptv: "40+ languages", cable: "Add-on packages" },
  { feature: "DVR / Catch-up", iptv: "✓ Included", cable: "Extra equipment" },
];

// ────────────────────────────────────────────
// Navigation
// ────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Features", href: "/features" },
  { label: "Install", href: "/install" },
  { label: "Blog", href: "/blog" },
  { label: "Reseller", href: "/reseller" },
  { label: "Restream", href: "/restream" },
];

export const MORE_LINKS = [
  { label: "Devices", href: "/devices" },
  { label: "Affiliate", href: "/affiliate" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Legal", href: "/legal/terms" },
  { label: "USA", href: "/usa" },
  { label: "Canada", href: "/canada" },
  { label: "UK", href: "/uk" },
  { label: "Europe", href: "/europe" },
];

// ────────────────────────────────────────────
// Offers section
// ────────────────────────────────────────────
export const OFFERS = [
  {
    title: "IPTV Restream",
    description: "Launch your own restreaming service with our powerful infrastructure. White-label solution for entrepreneurs.",
    icon: "radio-tower",
    cta: "Learn More",
  },
  {
    title: "Reseller Program",
    description: "Earn recurring income by reselling our premium IPTV service. Full dashboard and support provided.",
    icon: "users",
    cta: "Become a Reseller",
  },
  {
    title: "Affiliate Program",
    description: "Earn up to 30% commission on every referral. Share your link and start earning today.",
    icon: "link",
    cta: "Join Affiliate",
  },
  {
    title: "Blog & Guides",
    description: "Step-by-step installation guides, tips, and the latest news about IPTV technology.",
    icon: "book-open",
    cta: "Read Blog",
  },
];

// ────────────────────────────────────────────
// Rebranding Config
// ────────────────────────────────────────────

export const SITE_CONFIG = {
  name: "STREAMB4",
  fullName: "StreamB4",
  domain: "streamb4.com",
  url: "https://streamb4.com",
  tagline: "Premium Streaming Service",
  description: "Stream 50,000+ live channels, 180,000+ movies in 4K.",
  email: "support@streamb4.com",
  whatsapp: "+1234567890",
  social: {
    twitter: "https://x.com/streamb4t",
    instagram: "https://www.instagram.com/streamb4tv/?hl=fr",
    facebook: "https://www.facebook.com/profile.php?id=61591545360371",
    discord: "https://discord.gg/BFr5HSZfk",
  }
};

export const SEO_META = {
  home: {
    title: "Best Premium Streaming Service | STREAMB4",
    description: "Experience premium streaming with STREAMB4. Watch 50,000+ live channels on every device.",
    canonical: "https://streamb4.com",
  },
  pricing: {
    title: "Streaming Plans — From $15/month | STREAMB4",
    description: "Flexible streaming plans with 1 to 6 connections. 4K quality, instant activation.",
    canonical: "https://streamb4.com/pricing",
  },
  features: {
    title: "Features — 4K Streaming, 50,000+ Channels | STREAMB4",
    description: "Anti-buffering technology, global channel library, no IP lock and 24/7 real support.",
    canonical: "https://streamb4.com/features",
  },
  reseller: {
    title: "Reseller Program — Build Your Business | STREAMB4",
    description: "Resell premium streaming with high profit margins. Scalable packages from 25 to 1,000+ connections.",
    canonical: "https://streamb4.com/reseller",
  },
};
