export interface CountryConfig {
  flag: string;
  name: string;
  currency: string;
  serverNode: string;
  desc: string;
  channels: string;
  sports: string[];
  localNetworks: string[];
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  usa: {
    flag: "🇺🇸",
    name: "United States",
    currency: "USD",
    serverNode: "Chicago & New York Edge Nodes",
    desc: "STREAMB4 carries 15,000+ US channels across two dedicated edge nodes in Chicago and New York, keeping latency low for viewers on both coasts and the Midwest. The lineup includes national networks (CBS, NBC, ABC, FOX), cable staples (ESPN, CNN, HBO, HGTV), and regional sports networks so you can follow your local team without a cable bundle. NFL, NBA, MLB, NHL, and NASCAR live games are covered across multiple sports feeds. Setup takes under five minutes on any device — Firestick, Roku, Android, iPhone, or Smart TV.",
    channels: "15,000+",
    sports: ["NFL", "NBA", "MLB", "NHL", "UFC", "NASCAR"],
    localNetworks: ["CBS", "NBC", "ABC", "FOX", "ESPN", "CNN", "HBO"],
  },
  canada: {
    flag: "🇨🇦",
    name: "Canada",
    currency: "CAD",
    serverNode: "Toronto & Montreal Edge Nodes",
    desc: "STREAMB4 serves Canadian viewers from edge nodes in Toronto and Montreal, covering both English and French Canada with a single subscription. The 8,000+ Canadian channel package includes CBC, CTV, Global, Sportsnet, TSN, and the French-language RDS for Québec viewers — no separate package needed. NHL is the flagship sport, with full coverage across regional feeds, plus CFL games, NBA on TSN, and MLS. All plans support simultaneous connections, so different family members can watch different channels at the same time.",
    channels: "8,000+",
    sports: ["NHL", "NBA", "CFL", "MLS", "TSN Sports"],
    localNetworks: ["CBC", "CTV", "Global", "Sportsnet", "TSN", "RDS"],
  },
  "united-kingdom": {
    flag: "🇬🇧",
    name: "United Kingdom",
    currency: "GBP",
    serverNode: "London Edge Nodes",
    desc: "STREAMB4's UK channel package runs through a dedicated London edge node, which matters for live sport — low latency means no perceptible delay between the match action and your screen. The 10,000+ UK channels include Sky Sports (all channels), TNT Sports, BT Sport, BBC One through Four, ITV, Channel 4, and Channel 5 with regional variants for Scotland, Wales, and Northern Ireland. Premier League, Champions League, Formula 1, cricket, and rugby are all covered. Samsung and LG Smart TV users can set up through IBO Player using a MAC address without any additional hardware.",
    channels: "10,000+",
    sports: ["Premier League", "Championship", "Champions League", "Formula 1", "Cricket", "Rugby"],
    localNetworks: ["BBC One", "ITV", "Channel 4", "Channel 5", "Sky Sports", "BT Sport"],
  },
  europe: {
    flag: "🇪🇺",
    name: "Europe",
    currency: "EUR",
    serverNode: "Frankfurt & Amsterdam Edge Nodes",
    desc: "STREAMB4's European package covers 20,000+ channels across more than 30 countries, routed through Frankfurt and Amsterdam nodes for central coverage. French (TF1, M6, France 5), German (ARD, ZDF, RTL), Italian (Rai Uno, Mediaset), Spanish (TVE, La1), Dutch (NOS), and Scandinavian public broadcasters are all included, with country-specific EPG guides in the correct local time zone. Top football leagues — La Liga, Ligue 1, Bundesliga, Serie A, and the Champions League — are covered across multiple feeds. The multi-lingual lineup means one subscription serves an entire household watching in different languages.",
    channels: "20,000+",
    sports: ["La Liga", "Ligue 1", "Bundesliga", "Serie A", "Eredivisie", "Champions League"],
    localNetworks: ["TF1", "ARD", "Rai Uno", "TVE", "NOS", "SVT"],
  },
};
