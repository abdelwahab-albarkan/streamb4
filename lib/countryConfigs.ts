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
    desc: "Stream 50,000+ US channels including local networks, NFL, NBA, MLB, and US TV. Dedicated USA CDN nodes ensure the lowest possible latency for American viewers.",
    channels: "15,000+",
    sports: ["NFL", "NBA", "MLB", "NHL", "UFC", "NASCAR"],
    localNetworks: ["CBS", "NBC", "ABC", "FOX", "ESPN", "CNN", "HBO"],
  },
  canada: {
    flag: "🇨🇦",
    name: "Canada",
    currency: "CAD",
    serverNode: "Toronto & Montreal Edge Nodes",
    desc: "Watch Canadian TV channels, CBC, Sportsnet, TSN, and French-language packages in 4K Ultra HD with zero buffering across Canada.",
    channels: "8,000+",
    sports: ["NHL", "NBA", "CFL", "MLS", "TSN Sports"],
    localNetworks: ["CBC", "CTV", "Global", "Sportsnet", "TSN", "RDS"],
  },
  "united-kingdom": {
    flag: "🇬🇧",
    name: "United Kingdom",
    currency: "GBP",
    serverNode: "London Edge Nodes",
    desc: "Access Sky Sports, TNT Sports, BBC iPlayer, ITV, Channel 4, and all regional UK feeds with high-bandwidth optimisation for UK viewers.",
    channels: "10,000+",
    sports: ["Premier League", "Championship", "Champions League", "Formula 1", "Cricket", "Rugby"],
    localNetworks: ["BBC One", "ITV", "Channel 4", "Channel 5", "Sky Sports", "BT Sport"],
  },
  europe: {
    flag: "🇪🇺",
    name: "Europe",
    currency: "EUR",
    serverNode: "Frankfurt & Amsterdam Edge Nodes",
    desc: "Stream Spanish, French, German, Italian, Dutch, Scandinavian and Eastern European packages with multi-lingual audio and local EPG guides.",
    channels: "20,000+",
    sports: ["La Liga", "Ligue 1", "Bundesliga", "Serie A", "Eredivisie", "Champions League"],
    localNetworks: ["TF1", "ARD", "Rai Uno", "TVE", "NOS", "SVT"],
  },
};
