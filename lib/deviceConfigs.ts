export interface AppInfo {
  name: string;
  downloaderCode?: string;
  storeSource: "amazon_appstore" | "google_play" | "app_store" | "lg_store" | "samsung_store" | "direct_download" | "downloader";
  recommended: boolean;
  note?: string;
}

export interface DeviceConfig {
  name: string;
  shortName: string;
  icon: string;
  category: "streaming_stick" | "smart_tv" | "set_top_box" | "computer" | "mobile";
  os: string;
  description: string;
  primaryKeyword: string;
  title: string;
  metaDescription: string;
  h1: string;
  whyGoodForIPTV: string;
  installSummary: string;
  compatibleApps: AppInfo[];
  requirements: {
    internetSpeed: string;
    resolution: string;
    notes?: string;
  };
  features: string[];
  troubleshootingTips: string[];
  faqs: Array<{ q: string; a: string }>;
}

export const DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  firestick: {
    name: "Amazon Fire TV Stick",
    shortName: "Firestick",
    icon: "🔥",
    category: "streaming_stick",
    os: "Fire OS (Android-based)",
    description: "The Amazon Fire TV Stick is one of the most popular devices for IPTV in 2026. It supports sideloading via the Downloader app, making all major IPTV player apps accessible, and connects directly to your TV's HDMI port.",
    primaryKeyword: "IPTV Firestick",
    title: "Best IPTV for Amazon Fire TV Stick 2026 — Setup & Compatible Apps",
    metaDescription: "Get IPTV on your Amazon Fire TV Stick. Compatible apps, Downloader codes, installation steps, and which STREAMB4 plan works best for Firestick.",
    h1: "IPTV for Amazon Fire TV Stick",
    whyGoodForIPTV: "Fire TV Stick runs Fire OS — a fork of Android — which supports app sideloading through Amazon's Downloader app. This means you're not limited to the official Amazon Appstore. All major IPTV player apps (IPTV Smarters, TiviMate, IBO Player) can be installed in minutes, and the Fire TV remote works natively with all of them.",
    installSummary: "Enable 'Apps from Unknown Sources' in Developer Options, install the Downloader app from the Amazon Appstore, enter the 6-digit code for your chosen IPTV app, install it, and enter your STREAMB4 credentials.",
    compatibleApps: [
      { name: "IPTV Smarters Pro", downloaderCode: "6468112", storeSource: "downloader", recommended: true, note: "Best for beginners — clean interface, built-in EPG" },
      { name: "TiviMate", downloaderCode: "778786", storeSource: "downloader", recommended: true, note: "Best for power users — advanced EPG, timeshift, recording" },
      { name: "IBO Player", downloaderCode: "417847", storeSource: "downloader", recommended: false, note: "Lightweight alternative" },
      { name: "GSE Smart IPTV", downloaderCode: "680664", storeSource: "downloader", recommended: false, note: "Good for managing multiple IPTV providers" },
    ],
    requirements: {
      internetSpeed: "25 Mbps for HD; 50 Mbps for 4K",
      resolution: "Up to 4K HDR (Fire TV Stick 4K / 4K Max)",
      notes: "A wired ethernet connection via a Firestick ethernet adapter significantly improves stability for live sports.",
    },
    features: [
      "Supports all major IPTV player apps via Downloader",
      "4K HDR output on Fire TV Stick 4K and 4K Max",
      "Alexa voice remote for easy navigation",
      "Wi-Fi 6 support on Fire TV Stick 4K Max",
      "Compact HDMI plug-in form factor",
    ],
    troubleshootingTips: [
      "If an app won't install, confirm 'Apps from Unknown Sources' is enabled in Settings → My Fire TV → Developer Options",
      "Buffering on live channels — switch from Wi-Fi to wired ethernet using a Firestick ethernet adapter",
      "Storage full — go to Settings → Applications → Manage Installed Applications and clear app caches",
      "EPG not loading — in your IPTV app settings, verify the XMLTV/EPG URL is entered correctly and refresh",
      "App crashing — uninstall and reinstall via Downloader using the same code",
    ],
    faqs: [
      { q: "Which Firestick model is best for IPTV?", a: "The Fire TV Stick 4K Max offers the best performance: faster processor, Wi-Fi 6, and 4K HDR output. The standard Fire TV Stick 4K is also capable. The Lite model works for HD-only use." },
      { q: "Do I need to jailbreak my Firestick for IPTV?", a: "No jailbreaking required. Enabling 'Apps from Unknown Sources' in Developer Options and using the Downloader app is the standard method — it's a built-in Amazon feature, not a hack." },
      { q: "Which IPTV app should I use on my Firestick?", a: "IPTV Smarters Pro (code: 6468112) is the easiest to set up and is recommended for most users. TiviMate (code: 778786) offers more advanced features including recording and a better EPG." },
      { q: "How do I enter my STREAMB4 credentials on Firestick?", a: "After installing your IPTV app, go to 'Add Playlist' or 'Add Provider' and select 'Xtream Codes API'. Enter the server URL, username, and password from your STREAMB4 welcome email." },
      { q: "Why is my IPTV buffering on Firestick?", a: "The most common cause is Wi-Fi signal quality. Use a Firestick ethernet adapter for a wired connection. Also check that no other devices on your network are consuming large amounts of bandwidth." },
    ],
  },

  "samsung-tv": {
    name: "Samsung Smart TV",
    shortName: "Samsung TV",
    icon: "📺",
    category: "smart_tv",
    os: "Tizen OS",
    description: "Samsung Smart TVs run Tizen OS, which has a curated app store. IPTV apps including IPTV Smarters and Smart IPTV are available from the Samsung Content Store on 2019+ models (availability varies by region). For older models or unsupported regions, screen mirroring from a phone is a reliable alternative.",
    primaryKeyword: "IPTV Samsung Smart TV",
    title: "How to Get IPTV on Samsung Smart TV 2026 — Apps & Setup Guide",
    metaDescription: "Set up IPTV on your Samsung Smart TV. Compatible apps from the Samsung Content Store, screen mirroring options, and step-by-step installation for STREAMB4.",
    h1: "IPTV on Samsung Smart TV",
    whyGoodForIPTV: "Samsung Smart TVs running Tizen OS offer a growing selection of IPTV apps directly through the Samsung Content Store. Unlike Firestick, there's no sideloading required — apps install directly. For Samsung models without a compatible IPTV app, screen mirroring from a phone or tablet is a reliable alternative.",
    installSummary: "Open the Samsung Content Store on your TV. Search for 'IPTV Smarters' or 'Smart IPTV'. Install the app, open it, and enter your STREAMB4 M3U URL or Xtream Codes credentials.",
    compatibleApps: [
      { name: "IPTV Smarters Pro", storeSource: "samsung_store", recommended: true, note: "Available in Samsung Content Store — most straightforward option" },
      { name: "Smart IPTV (SIPTV)", storeSource: "samsung_store", recommended: true, note: "One-time purchase; supports M3U playlists and EPG" },
      { name: "SS IPTV", storeSource: "samsung_store", recommended: false, note: "Free alternative; simpler interface" },
    ],
    requirements: {
      internetSpeed: "25 Mbps for HD; 50 Mbps for 4K",
      resolution: "Up to 4K HDR (Samsung 4K and 8K models)",
      notes: "A wired ethernet connection from your router to the TV port delivers the most stable stream.",
    },
    features: [
      "IPTV apps available directly from Samsung Content Store",
      "No sideloading required on supported models",
      "AirPlay 2 and screen mirroring support as an alternative method",
      "Up to 4K and 8K display support on compatible models",
      "Bixby and voice control for channel navigation",
    ],
    troubleshootingTips: [
      "If a specific IPTV app isn't available in your region's Content Store, use screen mirroring from a phone or tablet as an alternative",
      "EPG not updating — in the app settings, check that your XMLTV URL is correct and trigger a manual refresh",
      "App not finding channels — confirm your M3U URL or Xtream Codes details are entered exactly as provided in your STREAMB4 email",
      "Buffering on 4K content — ensure your internet connection is at least 50 Mbps and use a wired ethernet cable",
      "App availability varies by Samsung TV model year and region — 2019 and newer models have the widest app support",
    ],
    faqs: [
      { q: "Which Samsung TV models support IPTV apps?", a: "Samsung Smart TVs from 2019 onward running Tizen OS 5.0 or later have the widest IPTV app availability. Older models may have limited Content Store access." },
      { q: "Can I install IPTV Smarters on my Samsung Smart TV?", a: "Yes. IPTV Smarters Pro is available in the Samsung Content Store on compatible models. Search for it directly in the store." },
      { q: "What if my Samsung TV doesn't have the IPTV app I want?", a: "Use screen mirroring (AirPlay 2 on iPhone/Mac, or Smart View on Android) to mirror your phone's IPTV stream to the TV. Alternatively, connect a Fire TV Stick or Android TV box to the HDMI port." },
      { q: "Does STREAMB4 work on Samsung Smart TV?", a: "Yes. STREAMB4 provides M3U and Xtream Codes credentials that work with IPTV Smarters Pro, Smart IPTV, and other compatible Samsung TV apps." },
      { q: "Why does IPTV buffer on my Samsung TV but not on my phone?", a: "The TV may be connected via Wi-Fi while your phone is on a closer or stronger signal. Connect the Samsung TV directly to your router via ethernet cable for the most reliable connection." },
    ],
  },

  "android-tv": {
    name: "Android TV",
    shortName: "Android TV",
    icon: "🤖",
    category: "set_top_box",
    os: "Android TV / Google TV",
    description: "Android TV and Google TV devices run Android under the hood, giving full access to the Google Play Store. TiviMate — widely considered the best IPTV player — is available directly from the Play Store on Android TV, making setup straightforward.",
    primaryKeyword: "IPTV Android TV",
    title: "Best IPTV for Android TV & Google TV 2026 — Setup & Apps",
    metaDescription: "Set up IPTV on Android TV or Google TV. Install TiviMate or IPTV Smarters from the Play Store, connect your STREAMB4 subscription, and start streaming.",
    h1: "IPTV on Android TV and Google TV",
    whyGoodForIPTV: "Android TV is the most capable platform for IPTV. TiviMate — the most feature-rich IPTV player available — is in the Play Store and installs in one tap. You also get sideloading capability for additional apps, and the platform supports 4K HDR on compatible hardware. Popular Android TV devices include the Nvidia Shield, Xiaomi Mi Box, and various manufacturers' built-in Android TV implementations.",
    installSummary: "Open the Google Play Store on your Android TV or Google TV device. Search for 'TiviMate' or 'IPTV Smarters Pro'. Install, open the app, and enter your STREAMB4 Xtream Codes or M3U URL.",
    compatibleApps: [
      { name: "TiviMate", storeSource: "google_play", recommended: true, note: "Best Android TV IPTV player — Play Store download, advanced EPG, timeshift recording" },
      { name: "IPTV Smarters Pro", storeSource: "google_play", recommended: true, note: "Good alternative — clean UI, easier to set up" },
      { name: "Kodi with PVR IPTV Simple Client", storeSource: "google_play", recommended: false, note: "Flexible but more complex configuration" },
      { name: "GSE Smart IPTV", storeSource: "google_play", recommended: false, note: "Useful for managing multiple IPTV providers" },
    ],
    requirements: {
      internetSpeed: "25 Mbps for HD; 50 Mbps for 4K",
      resolution: "Up to 4K HDR on Nvidia Shield, Xiaomi Mi Box S2, and other 4K Android TV devices",
      notes: "Android TV devices vary in processing power. Higher-end devices (Nvidia Shield) handle 4K HDR and large channel lists better than budget boxes.",
    },
    features: [
      "Google Play Store access — TiviMate installs in one tap",
      "Sideloading via ADB or APK for additional apps",
      "Google Assistant voice control for channel search",
      "4K HDR support on qualifying devices",
      "Chromecast built-in for casting from phone to TV",
    ],
    troubleshootingTips: [
      "TiviMate not finding channels — confirm Xtream Codes server URL includes http:// or https:// and no trailing slash",
      "EPG showing wrong times — check timezone settings in TiviMate: Settings → General → EPG timezone",
      "Buffering on budget Android TV box — consider upgrading to a device with at least 2GB RAM and a faster processor, or use a lower stream quality setting",
      "App not in Play Store — if your Android TV is region-locked, try searching directly for 'TiviMate' or install via APK sideload",
      "Google TV vs Android TV — both are compatible; Google TV has a different homescreen UI but runs the same apps",
    ],
    faqs: [
      { q: "What is the best Android TV device for IPTV?", a: "The Nvidia Shield Pro is the best Android TV device for IPTV — it has the most powerful processor, supports 4K HDR, and handles large channel lists without slowdown. For a budget option, the Xiaomi Mi Box S2 is capable for HD and 4K." },
      { q: "Is TiviMate free on Android TV?", a: "TiviMate has a free version with basic functionality. The TiviMate Premium subscription (paid annually) unlocks EPG, recording, and multiple IPTV provider support. It's available via the Play Store." },
      { q: "Does IPTV work on Google TV (Chromecast with Google TV)?", a: "Yes. The Chromecast with Google TV runs Android TV and supports TiviMate and IPTV Smarters from the Play Store. Setup is identical to other Android TV devices." },
      { q: "Can I use STREAMB4 on my Android TV?", a: "Yes. STREAMB4 provides M3U and Xtream Codes credentials that work with TiviMate, IPTV Smarters, and any other Android TV IPTV app." },
      { q: "How do I add my STREAMB4 account to TiviMate?", a: "Open TiviMate → Add Playlist → Xtream Codes. Enter the server URL, username, and password from your STREAMB4 welcome email. TiviMate will import your channel list and EPG automatically." },
    ],
  },

  "apple-tv": {
    name: "Apple TV",
    shortName: "Apple TV",
    icon: "🍎",
    category: "set_top_box",
    os: "tvOS",
    description: "Apple TV runs tvOS, which is a closed platform — apps must come from the Apple App Store. IPTV Smarters Pro and GSE Smart IPTV are both available in the tvOS App Store, making Apple TV a fully viable IPTV device without any sideloading.",
    primaryKeyword: "IPTV Apple TV",
    title: "How to Get IPTV on Apple TV 2026 — Setup & Compatible Apps",
    metaDescription: "Set up IPTV on Apple TV. IPTV Smarters Pro and GSE Smart IPTV are in the tvOS App Store. Add your STREAMB4 credentials and start watching in minutes.",
    h1: "IPTV on Apple TV",
    whyGoodForIPTV: "Apple TV 4K is a premium streaming device with excellent build quality and performance. While tvOS is a closed platform (no sideloading), the Apple App Store includes IPTV Smarters Pro and GSE Smart IPTV — both fully compatible with STREAMB4's M3U and Xtream Codes. The Apple TV 4K (3rd generation) supports 4K HDR and Dolby Vision output.",
    installSummary: "Open the App Store on your Apple TV. Search for 'IPTV Smarters Pro' or 'GSE Smart IPTV'. Install, open the app, and enter your STREAMB4 M3U URL or Xtream Codes login.",
    compatibleApps: [
      { name: "IPTV Smarters Pro", storeSource: "app_store", recommended: true, note: "Available in tvOS App Store — clean interface, EPG support" },
      { name: "GSE Smart IPTV", storeSource: "app_store", recommended: true, note: "Available in tvOS App Store — multi-provider support" },
      { name: "XCIPTV", storeSource: "app_store", recommended: false, note: "Available for Apple TV in App Store" },
    ],
    requirements: {
      internetSpeed: "25 Mbps for HD; 50 Mbps for 4K",
      resolution: "4K HDR and Dolby Vision on Apple TV 4K (2nd and 3rd generation)",
      notes: "Apple TV 4K (1st generation, 2017) supports 4K but lacks the Dolby Vision support of the 2nd and 3rd generation models.",
    },
    features: [
      "All IPTV apps installed via App Store — no sideloading",
      "4K HDR and Dolby Vision on Apple TV 4K (2nd/3rd gen)",
      "AirPlay support — stream from iPhone or iPad to Apple TV",
      "Siri Remote with touch control for navigation",
      "tvOS integration for playback continuity",
    ],
    troubleshootingTips: [
      "IPTV app not in App Store — ensure your App Store is set to the correct country; app availability varies by region",
      "No sound on some channels — check Audio settings in the IPTV app; try changing audio output to stereo if surround is causing issues",
      "Buffering on 4K channels — ensure your Apple TV is connected via ethernet using an ethernet adapter rather than Wi-Fi",
      "EPG not loading — verify the XMLTV URL in app settings; some apps require a manual refresh after adding the EPG URL",
      "Remote pairing issues — hold the Back and Volume Up buttons for 5 seconds to re-pair the Siri Remote",
    ],
    faqs: [
      { q: "Which Apple TV model is best for IPTV?", a: "The Apple TV 4K (3rd generation) is the best choice: 4K HDR, Dolby Vision, Dolby Atmos, and a fast chip for smooth channel switching. The 2nd generation 4K model is also capable." },
      { q: "Can I sideload IPTV apps on Apple TV?", a: "No. tvOS does not support sideloading. All apps must come from the App Store. IPTV Smarters Pro and GSE Smart IPTV are both available there." },
      { q: "Is TiviMate available for Apple TV?", a: "No. TiviMate is Android-only. For Apple TV, IPTV Smarters Pro is the closest equivalent in terms of features and interface quality." },
      { q: "Does STREAMB4 work with Apple TV?", a: "Yes. STREAMB4 provides M3U and Xtream Codes credentials that work with IPTV Smarters Pro and GSE Smart IPTV on Apple TV." },
      { q: "Can I use AirPlay to watch IPTV on my Apple TV?", a: "Yes. You can run an IPTV app on your iPhone or iPad and use AirPlay to mirror or stream the content to your Apple TV. This is also useful if the specific app you want isn't available in the tvOS App Store." },
    ],
  },

  "lg-tv": {
    name: "LG Smart TV",
    shortName: "LG TV",
    icon: "🖥️",
    category: "smart_tv",
    os: "webOS",
    description: "LG Smart TVs run webOS, which has a growing selection of IPTV apps available directly from the LG Content Store. IPTV Smarters Pro and Smart IPTV (SIPTV) are compatible with LG webOS, making setup straightforward without additional hardware.",
    primaryKeyword: "IPTV LG Smart TV",
    title: "How to Get IPTV on LG Smart TV 2026 — webOS Apps & Setup",
    metaDescription: "Set up IPTV on your LG Smart TV. Compatible webOS apps, M3U setup, and how to connect your STREAMB4 subscription to LG TV.",
    h1: "IPTV on LG Smart TV",
    whyGoodForIPTV: "LG's webOS platform has improved IPTV app support significantly in recent years. IPTV Smarters is available via the LG Content Store on compatible models, and Smart IPTV (SIPTV) supports LG webOS directly. For LG TVs where app options are limited, a connected streaming stick (Firestick or Android TV box via HDMI) is a straightforward alternative.",
    installSummary: "Open the LG Content Store (the apps section of the LG Smart TV menu). Search for 'IPTV Smarters' or 'Smart IPTV'. Install, launch the app, and enter your STREAMB4 M3U URL or Xtream Codes details.",
    compatibleApps: [
      { name: "IPTV Smarters Pro", storeSource: "lg_store", recommended: true, note: "Available in LG Content Store on compatible webOS models" },
      { name: "Smart IPTV (SIPTV)", storeSource: "lg_store", recommended: true, note: "Directly supports LG webOS; one-time purchase; requires MAC address registration" },
      { name: "SS IPTV", storeSource: "lg_store", recommended: false, note: "Free option; simpler interface" },
    ],
    requirements: {
      internetSpeed: "25 Mbps for HD; 50 Mbps for 4K",
      resolution: "Up to 4K and 8K on compatible LG OLED and NanoCell models",
      notes: "webOS app availability depends on TV model year. 2019+ models have the widest Content Store selection. For older models, use a streaming stick via HDMI.",
    },
    features: [
      "IPTV apps directly from LG Content Store",
      "webOS Magic Remote with point-and-click navigation",
      "AirPlay 2 support for mirroring from iPhone or Mac",
      "4K and 8K display support on OLED and NanoCell models",
      "ThinQ AI integration for voice commands",
    ],
    troubleshootingTips: [
      "App not available in your region's Content Store — try creating an LG account in a different region, or use a Firestick/Android TV box via HDMI",
      "Smart IPTV requires one-time MAC address registration at siptv.eu — find your TV's MAC address in Settings → Network → Wired/Wireless Connection",
      "Channels not loading after entering credentials — confirm your M3U URL is complete and contains http:// or https://",
      "Picture freezing on live channels — check your Wi-Fi signal strength; use a wired ethernet connection from the LG TV's ethernet port",
      "EPG not populating — add your XMLTV URL in the app's EPG settings and force a refresh",
    ],
    faqs: [
      { q: "Which LG TV models support IPTV apps from the Content Store?", a: "LG Smart TVs from 2019 onward running webOS 4.5 or later have the best IPTV app availability. 2021+ models running webOS 6 have the widest selection." },
      { q: "What is Smart IPTV (SIPTV) and does it work on LG?", a: "Smart IPTV is an IPTV player app built specifically for Smart TVs including LG webOS. It requires a one-time purchase and MAC address registration at siptv.eu. It supports M3U playlists and EPG." },
      { q: "My LG TV doesn't have IPTV apps — what can I do?", a: "Connect an Amazon Fire TV Stick or Android TV box to an HDMI port. These devices have full IPTV app support and effectively add IPTV capability to any TV with an HDMI input." },
      { q: "Does STREAMB4 work on LG Smart TV?", a: "Yes. STREAMB4 provides M3U and Xtream Codes credentials that work with IPTV Smarters and Smart IPTV on LG webOS." },
      { q: "Can I use AirPlay to watch IPTV on my LG TV?", a: "Yes. LG TVs from 2019 onward support AirPlay 2. You can mirror an IPTV app from an iPhone, iPad, or Mac to your LG TV using AirPlay." },
    ],
  },

  "nvidia-shield": {
    name: "Nvidia Shield Pro",
    shortName: "Nvidia Shield",
    icon: "🛡️",
    category: "set_top_box",
    os: "Android TV",
    description: "The Nvidia Shield Pro is widely considered the best Android TV device for IPTV. Its Tegra X1+ processor handles large channel lists and 4K HDR streams without slowdown, and it runs full Android TV with Play Store access for TiviMate and all IPTV apps.",
    primaryKeyword: "IPTV Nvidia Shield",
    title: "IPTV on Nvidia Shield — Best Android TV Setup for 4K Streaming",
    metaDescription: "The Nvidia Shield is the best Android TV device for IPTV. Install TiviMate from the Play Store, connect your STREAMB4 subscription, and stream 4K HDR channels.",
    h1: "IPTV on Nvidia Shield",
    whyGoodForIPTV: "The Nvidia Shield outperforms every other Android TV device for IPTV. The Tegra X1+ chip handles concurrent 4K HDR streams, large EPG databases, and TiviMate's advanced features without the lag or memory pressure that affects budget Android TV boxes. It also supports Plex Media Server, making it a whole-home media hub beyond IPTV.",
    installSummary: "Open the Google Play Store on your Nvidia Shield. Search for 'TiviMate'. Install, open, select 'Add Playlist → Xtream Codes', and enter your STREAMB4 server URL, username, and password.",
    compatibleApps: [
      { name: "TiviMate", storeSource: "google_play", recommended: true, note: "The definitive IPTV app for Nvidia Shield — full EPG, timeshift, recording to external storage" },
      { name: "IPTV Smarters Pro", storeSource: "google_play", recommended: true, note: "Good alternative; simpler setup" },
      { name: "Kodi", storeSource: "google_play", recommended: false, note: "Flexible but requires PVR IPTV plugin configuration" },
    ],
    requirements: {
      internetSpeed: "50 Mbps for 4K HDR; 25 Mbps for HD",
      resolution: "4K HDR, Dolby Vision, HDR10+",
      notes: "The Nvidia Shield has a built-in gigabit ethernet port — no adapter needed. Wired connection is recommended for 4K live sport.",
    },
    features: [
      "Tegra X1+ processor — fastest Android TV chip available",
      "Built-in gigabit ethernet port",
      "4K HDR, Dolby Vision, HDR10+ output",
      "TiviMate recording to external USB/drive",
      "Plex Media Server capability alongside IPTV",
      "NVIDIA GameStream and GeForce NOW support",
    ],
    troubleshootingTips: [
      "Any buffering issues on Shield are almost always network-side — verify your internet speed is at or above 50 Mbps for 4K channels",
      "TiviMate recording not working — connect an external USB drive or HDD to the Shield's USB port and set it as the recording path in TiviMate settings",
      "Dolby Atmos audio not passing through — check Shield audio settings: Settings → Device Preferences → Sound → Dolby Atmos, set to Auto",
      "Google TV homescreen (on 2022+ Shield) vs Android TV — both are compatible; the app drawer and Play Store are the same",
      "4K content appearing in HD — ensure HDMI cable is 2.0 or above, and TV is set to accept 4K/60fps HDR input",
    ],
    faqs: [
      { q: "Is the Nvidia Shield worth it for IPTV?", a: "Yes, if you want the best performance available. The Shield handles large channel lists, 4K HDR, and TiviMate's advanced EPG without any slowdown. Budget Android TV boxes frequently struggle with these workloads." },
      { q: "Can I record IPTV channels on Nvidia Shield?", a: "Yes. TiviMate on Nvidia Shield supports timeshift and recording to an external USB drive or connected storage. This works with any channel in your STREAMB4 package." },
      { q: "Does Nvidia Shield support 4K IPTV?", a: "Yes. The Shield natively outputs 4K HDR, Dolby Vision, and HDR10+. STREAMB4 carries 4K feeds for major channels where 4K broadcasts are available." },
      { q: "Which version of Nvidia Shield should I get?", a: "The Shield Pro (2019 or 2022 edition) has internal storage and a USB port for external drives. The Shield TV tube-style version is more compact but lacks a USB port for recording." },
    ],
  },

  "windows-pc": {
    name: "Windows PC",
    shortName: "Windows",
    icon: "💻",
    category: "computer",
    os: "Windows 10 / 11",
    description: "Windows PCs support IPTV through dedicated apps and M3U-compatible media players. IPTV Smarters for Windows, VLC Media Player, and Kodi all work with STREAMB4 credentials on Windows 10 and 11.",
    primaryKeyword: "IPTV Windows PC",
    title: "How to Watch IPTV on Windows PC — Best Apps & Setup Guide 2026",
    metaDescription: "Watch IPTV on your Windows PC or laptop. Use IPTV Smarters for Windows, VLC, or Kodi with your STREAMB4 M3U URL. Step-by-step setup included.",
    h1: "IPTV on Windows PC",
    whyGoodForIPTV: "Windows offers the most flexibility for IPTV. You can use a dedicated app like IPTV Smarters for Windows, a media player like VLC with an M3U URL, or a full media centre like Kodi with the PVR IPTV Simple Client plugin. All methods work with STREAMB4's M3U and Xtream Codes credentials.",
    installSummary: "Download IPTV Smarters for Windows from the official website or Microsoft Store, install it, and enter your STREAMB4 Xtream Codes or M3U URL. Alternatively, open VLC, go to Media → Open Network Stream, and paste your M3U URL directly.",
    compatibleApps: [
      { name: "IPTV Smarters Pro for Windows", storeSource: "direct_download", recommended: true, note: "Dedicated IPTV app; best channel browsing and EPG experience on Windows" },
      { name: "VLC Media Player", storeSource: "direct_download", recommended: true, note: "Free; supports M3U playlists via Media → Open Network Stream" },
      { name: "Kodi", storeSource: "direct_download", recommended: false, note: "Full media centre; requires PVR IPTV Simple Client plugin configuration" },
      { name: "MX Player for PC", storeSource: "direct_download", recommended: false, note: "Alternative lightweight option" },
    ],
    requirements: {
      internetSpeed: "25 Mbps for HD; 50 Mbps for 4K",
      resolution: "Up to 4K on compatible monitors; hardware decoding supported on Windows 10/11",
      notes: "For the best performance on Windows, enable hardware acceleration in your IPTV app or media player settings.",
    },
    features: [
      "Multiple IPTV app options — dedicated apps, media players, or full media centres",
      "M3U playlist support in VLC without additional software",
      "Keyboard and mouse navigation for easy channel browsing",
      "Screen recording and picture-in-picture available via Windows",
      "Can run IPTV in a window alongside other applications",
    ],
    troubleshootingTips: [
      "VLC M3U stream not loading — check that the M3U URL is complete and your internet connection is active; try Media → Convert/Save to test the stream",
      "Buffering in VLC — increase the network caching value: Tools → Preferences → Show All → Input/Codecs → Network caching (ms), set to 1500-3000",
      "IPTV Smarters channels not appearing — confirm your Xtream Codes server URL is correct and doesn't have a trailing slash",
      "High CPU usage during 4K playback — enable hardware acceleration in VLC: Tools → Preferences → Video → Output → DirectX or Direct3D11",
      "Firewall blocking IPTV — add your IPTV app to Windows Defender Firewall exceptions if streams fail to load",
    ],
    faqs: [
      { q: "Can I watch IPTV on Windows using just VLC?", a: "Yes. Open VLC, go to Media → Open Network Stream, and paste your STREAMB4 M3U URL. VLC will load your channel list. For EPG and better channel organisation, use IPTV Smarters for Windows instead." },
      { q: "Is there a dedicated IPTV app for Windows?", a: "IPTV Smarters Pro for Windows provides a dedicated channel browser with EPG, favourites, and category filtering. It's the recommended app for regular IPTV use on Windows." },
      { q: "Can I watch 4K IPTV on my Windows PC?", a: "Yes, if your PC has a 4K monitor or is connected to a 4K TV via HDMI, and your internet connection is 50 Mbps or above. Enable hardware acceleration for smooth 4K playback." },
      { q: "Does STREAMB4 work on Windows?", a: "Yes. STREAMB4 provides M3U and Xtream Codes credentials that work with IPTV Smarters for Windows, VLC, Kodi, and any other M3U-compatible player." },
      { q: "Can I connect my Windows PC to my TV for IPTV?", a: "Yes. Connect your PC to your TV using an HDMI cable. Set your display to 'Extend' or 'Duplicate' in Windows display settings. Then run your IPTV app in fullscreen on the TV display." },
    ],
  },

  mac: {
    name: "Mac (macOS)",
    shortName: "Mac",
    icon: "🍏",
    category: "computer",
    os: "macOS",
    description: "Mac users can watch IPTV through IPTV Smarters for macOS, VLC Media Player, or XCIPTV. All three support M3U and Xtream Codes, and work natively on both Intel and Apple Silicon Macs (M1/M2/M3/M4).",
    primaryKeyword: "IPTV Mac",
    title: "How to Watch IPTV on Mac 2026 — Best Apps & Setup Guide",
    metaDescription: "Watch IPTV on your Mac. Compatible apps including IPTV Smarters and VLC, plus how to enter your STREAMB4 credentials on macOS.",
    h1: "IPTV on Mac",
    whyGoodForIPTV: "macOS supports IPTV through a range of apps available from the Mac App Store and direct download. VLC Media Player handles M3U playlists natively without any additional plugins. IPTV Smarters offers a more TV-like experience with EPG, channel categories, and favourites. Both work on Intel and Apple Silicon Macs.",
    installSummary: "Download IPTV Smarters from the Mac App Store, or download VLC from videolan.org. For IPTV Smarters: open the app and enter your STREAMB4 Xtream Codes. For VLC: go to File → Open Network and paste your M3U URL.",
    compatibleApps: [
      { name: "IPTV Smarters Pro for Mac", storeSource: "app_store", recommended: true, note: "Available on Mac App Store; full channel browser with EPG" },
      { name: "VLC Media Player", storeSource: "direct_download", recommended: true, note: "Free; open M3U URL via File → Open Network" },
      { name: "XCIPTV", storeSource: "app_store", recommended: false, note: "Available for macOS on App Store" },
      { name: "Infuse", storeSource: "app_store", recommended: false, note: "Supports M3U; polished Apple-native interface" },
    ],
    requirements: {
      internetSpeed: "25 Mbps for HD; 50 Mbps for 4K",
      resolution: "4K on external display via HDMI or Thunderbolt; native Retina display on MacBook Pro models",
      notes: "Apple Silicon Macs (M1/M2/M3/M4) have hardware AV1 and HEVC decoding — smoother 4K playback than Intel models.",
    },
    features: [
      "IPTV Smarters available from Mac App Store — no sideloading",
      "VLC supports M3U playlists natively — zero setup",
      "Apple Silicon compatibility (M1/M2/M3/M4 — native apps)",
      "AirPlay output to Apple TV or AirPlay-compatible TV",
      "Screen Share to cast to any AirPlay device",
    ],
    troubleshootingTips: [
      "VLC M3U stream not loading — verify the M3U URL is pasted correctly without extra spaces; test the URL in a browser first",
      "App blocked by Gatekeeper — right-click the app and select 'Open' to bypass macOS Gatekeeper on direct-download apps",
      "Buffering on Wi-Fi — connect via wired ethernet using a USB-C to ethernet adapter for a more stable stream",
      "No audio on certain channels — in VLC go to Audio → Audio Track and check if a different audio track resolves the issue",
      "4K playback choppy on older Intel Mac — enable hardware acceleration: VLC → Preferences → Video → Acceleration, or use QuickTime via an M3U-to-HLS proxy",
    ],
    faqs: [
      { q: "What is the best IPTV app for Mac?", a: "IPTV Smarters Pro for Mac offers the most complete IPTV experience with channel browsing, EPG, categories, and favourites. VLC is the best free option if you just want to load an M3U URL." },
      { q: "Does IPTV work on Apple Silicon Mac (M1/M2/M3)?", a: "Yes. IPTV Smarters for Mac is a native universal app that runs on both Intel and Apple Silicon. VLC also has a native Apple Silicon build. Performance on M-series Macs is excellent." },
      { q: "Can I AirPlay IPTV from Mac to my Apple TV?", a: "Yes. With your IPTV app running on Mac, use the AirPlay menu in the menu bar or mirror your display to your Apple TV." },
      { q: "Does STREAMB4 work on Mac?", a: "Yes. STREAMB4 provides M3U and Xtream Codes credentials that work with IPTV Smarters, VLC, and any other macOS app that supports M3U playlists." },
    ],
  },

  iphone: {
    name: "iPhone & iPad",
    shortName: "iPhone",
    icon: "📱",
    category: "mobile",
    os: "iOS / iPadOS",
    description: "iPhone and iPad support IPTV through apps available in the iOS App Store. IPTV Smarters Pro and GSE Smart IPTV are both available without any sideloading required, and both support STREAMB4's M3U and Xtream Codes credentials.",
    primaryKeyword: "IPTV iPhone",
    title: "How to Watch IPTV on iPhone & iPad 2026 — App Setup Guide",
    metaDescription: "Watch IPTV on iPhone or iPad. Install IPTV Smarters Pro from the App Store and connect your STREAMB4 subscription in minutes.",
    h1: "IPTV on iPhone and iPad",
    whyGoodForIPTV: "iPhone and iPad are straightforward IPTV devices — no sideloading, no developer accounts. IPTV Smarters Pro and GSE Smart IPTV are in the App Store and install in one tap. The iPad's larger display makes it particularly useful for watching live sport on the go.",
    installSummary: "Open the App Store on your iPhone or iPad. Search for 'IPTV Smarters Pro'. Install, open the app, tap 'Add User' → 'Xtream Codes API', and enter your STREAMB4 server URL, username, and password.",
    compatibleApps: [
      { name: "IPTV Smarters Pro", storeSource: "app_store", recommended: true, note: "Available in iOS App Store; supports Xtream Codes and M3U" },
      { name: "GSE Smart IPTV", storeSource: "app_store", recommended: true, note: "Multi-provider support; reliable EPG" },
      { name: "XCIPTV", storeSource: "app_store", recommended: false, note: "Clean interface alternative" },
    ],
    requirements: {
      internetSpeed: "15 Mbps for HD on mobile; 50 Mbps on Wi-Fi for 4K",
      resolution: "Up to 4K on iPad Pro with compatible display; 1080p on most iPhone screens",
      notes: "Mobile data works for HD streaming but a Wi-Fi connection is recommended for extended viewing to avoid data overages.",
    },
    features: [
      "All IPTV apps available directly from App Store",
      "AirPlay to Apple TV or AirPlay-compatible TV",
      "Background audio for radio/music IPTV channels",
      "Picture-in-Picture support on iPad",
      "Works on 4G/5G as well as Wi-Fi",
    ],
    troubleshootingTips: [
      "App not showing channels — confirm Xtream Codes details are entered exactly as in your STREAMB4 email; avoid extra spaces",
      "Video pauses when screen locks — in iOS Settings → Display & Brightness → Auto-Lock, set to 'Never' during viewing sessions",
      "Buffering on mobile data — switch to Wi-Fi; mobile data is sufficient for HD but 4K channels require a stable high-speed connection",
      "No audio — check the iPhone/iPad side switch is not muted; also check the volume inside the IPTV app",
      "App crashing — update the app via App Store; restart the device if issues persist",
    ],
    faqs: [
      { q: "Can I watch IPTV on iPhone?", a: "Yes. Install IPTV Smarters Pro or GSE Smart IPTV from the App Store. Enter your STREAMB4 credentials and your full channel list loads within seconds." },
      { q: "Can I stream IPTV from iPhone to my TV?", a: "Yes. Use AirPlay to stream to an Apple TV, AirPlay-compatible TV, or any AirPlay receiver. Alternatively, use an HDMI adapter (Lightning or USB-C to HDMI) for a direct wired connection." },
      { q: "Does IPTV work over mobile data?", a: "Yes. HD streams (720p/1080p) work well over 4G and 5G. 4K channels require a Wi-Fi connection for stable playback." },
      { q: "Is there an IPTV app for iPad?", a: "The same apps available for iPhone — IPTV Smarters Pro and GSE Smart IPTV — run natively on iPad. iPad also supports Picture-in-Picture for IPTV." },
    ],
  },

  "android-phone": {
    name: "Android Phone & Tablet",
    shortName: "Android",
    icon: "🤳",
    category: "mobile",
    os: "Android",
    description: "Android phones and tablets have the widest IPTV app selection of any mobile platform. TiviMate, IPTV Smarters Pro, and GSE Smart IPTV are all available from the Google Play Store, and Android supports sideloading via APK for additional options.",
    primaryKeyword: "IPTV Android phone",
    title: "How to Watch IPTV on Android Phone & Tablet 2026",
    metaDescription: "Watch IPTV on Android. Install TiviMate or IPTV Smarters from the Google Play Store and connect your STREAMB4 subscription in minutes.",
    h1: "IPTV on Android Phone and Tablet",
    whyGoodForIPTV: "Android phones and tablets offer more IPTV flexibility than any other mobile platform. TiviMate — the most feature-rich IPTV player — is in the Play Store. Android also supports APK sideloading for apps not in the Play Store. Cast to a Chromecast or Android TV to watch on your big screen while controlling from your phone.",
    installSummary: "Open the Google Play Store. Search for 'TiviMate' or 'IPTV Smarters Pro'. Install, open, select 'Add Playlist → Xtream Codes', and enter your STREAMB4 server URL, username, and password.",
    compatibleApps: [
      { name: "TiviMate", storeSource: "google_play", recommended: true, note: "Best Android IPTV app; EPG, favourites, multiple providers" },
      { name: "IPTV Smarters Pro", storeSource: "google_play", recommended: true, note: "Good alternative; simpler interface" },
      { name: "GSE Smart IPTV", storeSource: "google_play", recommended: false, note: "Multi-provider support" },
    ],
    requirements: {
      internetSpeed: "15 Mbps for HD on mobile data; 50 Mbps on Wi-Fi for 4K",
      resolution: "Up to 4K on compatible Android tablets; 1080p on most smartphones",
      notes: "Cast to a Chromecast, Chromecast with Google TV, or any Cast-compatible TV to watch on the big screen.",
    },
    features: [
      "TiviMate and IPTV Smarters available from Play Store",
      "Chromecast support — cast to TV from the IPTV app",
      "Sideloading via APK for additional apps",
      "Works on 4G/5G and Wi-Fi",
      "Picture-in-Picture mode on Android 8+",
    ],
    troubleshootingTips: [
      "TiviMate not loading channels — verify Xtream Codes URL starts with http:// or https:// and contains no trailing slash",
      "Casting not working — ensure your phone and Chromecast are on the same Wi-Fi network",
      "Buffering on mobile data — 4G/LTE can handle HD streams; switch to Wi-Fi for 4K or if you notice regular buffering",
      "Play Store not showing TiviMate — search for 'TiviMate IPTV Player'; if still unavailable in your region, download the APK directly from the TiviMate website",
      "Battery draining fast — reduce stream quality in the app settings or lower screen brightness during extended viewing",
    ],
    faqs: [
      { q: "Can I watch IPTV on my Android phone?", a: "Yes. Install TiviMate or IPTV Smarters Pro from the Google Play Store. Enter your STREAMB4 credentials and start watching immediately." },
      { q: "How do I cast IPTV from Android to my TV?", a: "In TiviMate or IPTV Smarters, tap the cast icon (if supported) or use the Chromecast button in the player. Your phone and Chromecast must be on the same Wi-Fi network." },
      { q: "Is TiviMate free on Android?", a: "TiviMate has a limited free version. TiviMate Premium (annual subscription via Play Store) unlocks EPG, multiple providers, and recording features." },
      { q: "Does STREAMB4 work on Android?", a: "Yes. STREAMB4 provides M3U and Xtream Codes credentials that work with TiviMate, IPTV Smarters, GSE Smart IPTV, and any other Android IPTV app." },
    ],
  },
};

export type DeviceSlug = keyof typeof DEVICE_CONFIGS;
