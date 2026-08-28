export interface SportConfig {
  name: string;
  shortName: string;
  icon: string;
  emoji: string;
  season: string;
  country: string;
  broadcaster: string[];
  description: string;
  primaryKeyword: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whyStreamB4: string[];
  channels: string;
  keyEvents: string[];
  faqs: Array<{ q: string; a: string }>;
  relatedCountries: string[];
  relatedSports: string[];
}

export const SPORT_CONFIGS: Record<string, SportConfig> = {
  nfl: {
    name: "NFL — National Football League",
    shortName: "NFL",
    icon: "🏈",
    emoji: "🏈",
    season: "September to February",
    country: "USA",
    broadcaster: ["CBS", "NBC", "Fox", "ESPN", "NFL Network", "Amazon Prime Video"],
    description: "Stream every NFL game live in 4K — regular season, playoffs, and Super Bowl — on any device with no blackouts.",
    primaryKeyword: "watch NFL live online",
    title: "Watch NFL Live Online in 4K — Stream Every Game 2026 | STREAMB4",
    metaDescription: "Stream every NFL game live including Super Bowl, playoffs, and regular season. No blackouts, 4K quality. Works on Firestick, Smart TV, and mobile.",
    h1: "Watch NFL Live — Stream Every Game in 4K",
    intro: "STREAMB4 carries 120+ NFL channels covering every regular-season game, all playoff matchups, and the Super Bowl — live and in 4K where available. No regional blackouts, no cable box required. The same subscription gives you CBS Sports, NBC Sunday Night Football, ESPN Monday Night Football, Amazon Thursday Night Football, NFL Network, and RedZone.",
    whyStreamB4: [
      "120+ dedicated NFL feeds including RedZone",
      "No geographic blackouts — watch your team from anywhere",
      "4K HDR output on supported devices and channels",
      "Anti-freeze technology keeps streams stable during peak game traffic",
      "EPG guide shows kickoff times, channels, and scores",
      "Catch-up TV for games you missed",
    ],
    channels: "120+",
    keyEvents: ["Super Bowl LXI", "NFL Playoffs", "Pro Bowl Games", "Thursday Night Football", "Monday Night Football", "Sunday Night Football"],
    faqs: [
      { q: "Can I watch NFL live without cable?", a: "Yes. STREAMB4 gives you access to all NFL broadcast channels — CBS, NBC, Fox, ESPN, and NFL Network — without a cable subscription. You get every game live over the internet." },
      { q: "Does STREAMB4 carry NFL RedZone?", a: "Yes. NFL RedZone is included in the STREAMB4 channel lineup, so you can watch every scoring play from every game every Sunday during the season." },
      { q: "Can I watch NFL outside the USA?", a: "Yes. STREAMB4 has no IP restrictions, so you can stream NFL games from the UK, Canada, Europe, or anywhere in the world without a VPN." },
      { q: "Which device is best for watching NFL on STREAMB4?", a: "The Amazon Fire TV Stick 4K, a 4K Smart TV with IPTV Smarters or TiviMate installed, or a connected laptop all work great. For the best experience, use a wired ethernet connection on game day." },
      { q: "Is the Super Bowl included?", a: "Yes. The Super Bowl is carried live on STREAMB4 across multiple feeds including the main broadcast channel and NFL Network, in 4K where the broadcaster provides it." },
    ],
    relatedCountries: ["usa", "canada"],
    relatedSports: ["nba", "mlb", "ufc"],
  },

  "premier-league": {
    name: "English Premier League",
    shortName: "Premier League",
    icon: "⚽",
    emoji: "⚽",
    season: "August to May",
    country: "England",
    broadcaster: ["Sky Sports", "TNT Sports", "BBC Sport", "Amazon Prime Video"],
    description: "Stream every Premier League match live — all 380 games across Sky Sports, TNT Sports, and Amazon — in up to 4K quality.",
    primaryKeyword: "watch Premier League live",
    title: "Watch Premier League Live Online 2025/26 — Stream Every Match | STREAMB4",
    metaDescription: "Stream all 380 Premier League matches live in HD and 4K. Sky Sports, TNT Sports, and Amazon coverage. No blackouts. Works on all devices.",
    h1: "Watch Premier League Live — All 380 Matches in HD & 4K",
    intro: "STREAMB4 carries the complete Premier League broadcast package — every Sky Sports channel, TNT Sports (formerly BT Sport), and Amazon Prime Video sports nights. All 380 games across the full season, plus FA Cup and League Cup coverage on the same subscription. The London edge node keeps latency minimal for UK viewers, while international subscribers can watch from anywhere with no restrictions.",
    whyStreamB4: [
      "All Sky Sports channels including Sky Sports Main Event and Sky Sports Premier League",
      "TNT Sports 1–4 for Champions League and Premier League overlap fixtures",
      "Amazon Prime Video game weeks included",
      "4K HDR output on Sky Sports Ultra HD channel",
      "Low-latency London edge node for UK viewers",
      "No blackout restrictions — watch from anywhere",
    ],
    channels: "150+",
    keyEvents: ["Premier League Season Opener", "North London Derby", "Manchester Derby", "Merseyside Derby", "Boxing Day Fixtures", "Final Day Run-in"],
    faqs: [
      { q: "Can I watch all 380 Premier League games?", a: "Yes. Between Sky Sports, TNT Sports, and Amazon Prime Video coverage on STREAMB4, every Premier League match is available live." },
      { q: "Does STREAMB4 carry Sky Sports Premier League?", a: "Yes. Sky Sports Premier League, Sky Sports Main Event, and Sky Sports Football are all part of the STREAMB4 UK channel package." },
      { q: "Can I watch the Premier League outside the UK?", a: "Yes. STREAMB4 has no IP lock, so you can stream Premier League games from the USA, Canada, Europe, or anywhere in the world." },
      { q: "What picture quality is available for Premier League games?", a: "Most Premier League matches on Sky Sports stream in HD (1080p). Sky Sports Ultra HD carries selected marquee fixtures in 4K HDR — STREAMB4 carries this channel." },
      { q: "Is the FA Cup also available?", a: "Yes. BBC Sport and ITV carry FA Cup coverage, and both are included in the STREAMB4 UK package." },
    ],
    relatedCountries: ["united-kingdom", "europe"],
    relatedSports: ["champions-league", "formula-1"],
  },

  "champions-league": {
    name: "UEFA Champions League",
    shortName: "Champions League",
    icon: "⭐",
    emoji: "⭐",
    season: "September to June",
    country: "Europe",
    broadcaster: ["TNT Sports", "CBS Sports", "DAZN", "Canal+", "Sky Sport"],
    description: "Stream every UEFA Champions League match live from the group stage through to the final — across TNT Sports, CBS Sports, DAZN, and European broadcasters.",
    primaryKeyword: "watch Champions League live",
    title: "Watch UEFA Champions League Live 2025/26 — Stream Every Match | STREAMB4",
    metaDescription: "Stream every UEFA Champions League match live. TNT Sports, CBS Sports, DAZN, and European coverage. Group stage to final. No blackouts.",
    h1: "Watch UEFA Champions League Live — Group Stage to Final",
    intro: "STREAMB4 covers the entire UEFA Champions League season — from the league phase through knockout rounds to the final — across every major broadcaster. TNT Sports for UK coverage, CBS Sports for USA viewers, DAZN for Germany and Italy, Canal+ for France, and Sky Sport for Italy. Every game, every group, every knockout round on one subscription.",
    whyStreamB4: [
      "Complete coverage across UK, USA, and major European broadcasters",
      "TNT Sports 1–4 for UK Champions League nights",
      "CBS Sports Golazo stream for US audiences",
      "DAZN feed for German and Italian matchups",
      "Multi-language commentary options available",
      "Full Final coverage in HD and 4K",
    ],
    channels: "80+",
    keyEvents: ["Group Phase Matchdays", "Round of 16", "Quarter-Finals", "Semi-Finals", "UEFA Champions League Final"],
    faqs: [
      { q: "Which channels carry Champions League in the UK?", a: "TNT Sports (channels 1–4) carries most Champions League fixtures in the UK. STREAMB4 carries all TNT Sports channels in its UK package." },
      { q: "How do I watch Champions League in the USA?", a: "CBS Sports and Paramount+ carry Champions League in the USA. STREAMB4 includes CBS Sports in its US channel lineup." },
      { q: "Can I watch the Champions League Final on STREAMB4?", a: "Yes. The Champions League Final is broadcast on TNT Sports in the UK, CBS in the USA, and various European channels — all available on STREAMB4." },
      { q: "Does STREAMB4 carry DAZN for European Champions League coverage?", a: "Yes. DAZN feeds for Germany and Italy are available in the STREAMB4 European channel package, giving you local-language coverage of Champions League matches." },
      { q: "Is Europa League also available?", a: "Yes. TNT Sports carries Europa League alongside Champions League in the UK, and both are included in the STREAMB4 package." },
    ],
    relatedCountries: ["united-kingdom", "europe"],
    relatedSports: ["premier-league", "formula-1"],
  },

  nba: {
    name: "NBA — National Basketball Association",
    shortName: "NBA",
    icon: "🏀",
    emoji: "🏀",
    season: "October to June",
    country: "USA",
    broadcaster: ["ESPN", "ABC", "TNT", "NBA TV", "Amazon Prime Video"],
    description: "Watch every NBA game live — regular season, All-Star Weekend, playoffs, and the NBA Finals — across ESPN, ABC, TNT, and NBA TV.",
    primaryKeyword: "watch NBA live online",
    title: "Watch NBA Live Online in 4K — Stream Every Game 2025/26 | STREAMB4",
    metaDescription: "Stream every NBA game live including playoffs and NBA Finals. ESPN, ABC, TNT, and NBA TV coverage. No blackouts. Works on Firestick, Smart TV, mobile.",
    h1: "Watch NBA Live — Stream Every Game Including Playoffs & Finals",
    intro: "STREAMB4 carries 90+ NBA-dedicated channels covering every game of the regular season, All-Star Weekend, the playoffs, and the NBA Finals. ESPN, ABC, TNT, and NBA TV are all included. Canadian viewers get TSN coverage. International subscribers can watch games live with no regional restrictions.",
    whyStreamB4: [
      "90+ NBA channels including ESPN, ABC, TNT, and NBA TV",
      "No out-of-market game blackouts",
      "4K available for ABC and ESPN marquee games",
      "Canadian games on TSN included",
      "NBA League Pass alternative at a fraction of the cost",
      "Catch-up for games in other time zones",
    ],
    channels: "90+",
    keyEvents: ["NBA Opening Night", "Christmas Day Games", "All-Star Weekend", "NBA Playoffs", "NBA Finals"],
    faqs: [
      { q: "Can I watch all NBA games without blackouts?", a: "Yes. STREAMB4 carries NBA games on ESPN, ABC, TNT, and NBA TV with no regional blackout restrictions." },
      { q: "Is NBA TV included in STREAMB4?", a: "Yes. NBA TV is included alongside ESPN, ABC, and TNT in the STREAMB4 USA channel package." },
      { q: "Can I watch the NBA Finals on STREAMB4?", a: "Yes. The NBA Finals is broadcast on ABC, which is included in the STREAMB4 USA channel package." },
      { q: "Does STREAMB4 work for NBA fans in the UK?", a: "Yes. NBA coverage on Sky Sports and BT Sport is available in the STREAMB4 UK package. NBA TV International is also available." },
      { q: "Is there catch-up for games I missed?", a: "Yes. STREAMB4's catch-up feature lets you watch games from previous days so you never miss a game even if it aired in a different time zone." },
    ],
    relatedCountries: ["usa", "canada"],
    relatedSports: ["nfl", "mlb"],
  },

  ufc: {
    name: "UFC — Ultimate Fighting Championship",
    shortName: "UFC",
    icon: "🥊",
    emoji: "🥊",
    season: "Year-round (events every 2–3 weeks)",
    country: "Worldwide",
    broadcaster: ["ESPN+", "ESPN", "TNT Sports", "BT Sport", "UFC Fight Pass"],
    description: "Stream every UFC event live — PPV main cards, Fight Nights, and preliminary bouts — without paying per-event PPV fees.",
    primaryKeyword: "watch UFC live online",
    title: "Watch UFC Live Online — Stream PPV Events & Fight Nights 2026 | STREAMB4",
    metaDescription: "Stream UFC events live without paying per-event PPV fees. ESPN+, ESPN, and TNT Sports coverage. Works on all devices. No blackouts.",
    h1: "Watch UFC Live — Stream PPV Events Without Per-Fight Fees",
    intro: "STREAMB4 gives you 60+ UFC and MMA channels carrying every UFC event — PPV main cards, ESPN Fight Nights, and preliminary cards — without paying a per-event fee on top of your subscription. ESPN+ PPV events, ESPN Fight Nights, and TNT Sports UK coverage are all available. You also get Bellator, ONE Championship, and PFL alongside UFC on the same package.",
    whyStreamB4: [
      "60+ combat sports channels including UFC-specific feeds",
      "No per-event PPV charges on top of your subscription",
      "ESPN, ESPN+, and TNT Sports coverage in one package",
      "Worldwide access — watch from any country",
      "Preliminary cards and early prelims included",
      "Bellator, ONE Championship, and PFL also available",
    ],
    channels: "60+",
    keyEvents: ["UFC 300+", "UFC Fight Night events", "International Fight Week", "UFC on ESPN specials", "Bellator series", "ONE Championship"],
    faqs: [
      { q: "Can I watch UFC PPV events without extra charges?", a: "Yes. With STREAMB4, UFC PPV events are included in your subscription — no per-event fees on top of your monthly or quarterly plan." },
      { q: "Does STREAMB4 carry ESPN+ for UFC?", a: "Yes. ESPN and ESPN+ sports coverage is included in the STREAMB4 USA channel package, giving you access to both ESPN Fight Nights and PPV main cards." },
      { q: "Can I watch UFC outside the USA?", a: "Yes. STREAMB4 carries TNT Sports for UK viewers and ESPN for USA and international audiences. There are no geographic restrictions on your subscription." },
      { q: "Are preliminary cards available on STREAMB4?", a: "Yes. UFC preliminary cards and early prelims are carried on ESPN and UFC Fight Pass content, both available through STREAMB4." },
      { q: "Is Bellator and ONE Championship also available?", a: "Yes. STREAMB4's combat sports package includes Bellator, ONE Championship, PFL, and other major MMA promotions alongside UFC." },
    ],
    relatedCountries: ["usa", "united-kingdom"],
    relatedSports: ["nfl", "nba"],
  },

  "formula-1": {
    name: "Formula 1",
    shortName: "F1",
    icon: "🏎️",
    emoji: "🏎️",
    season: "March to November (24 races)",
    country: "Worldwide",
    broadcaster: ["Sky Sports F1", "Canal+", "ESPN", "F1 TV", "ServusTV"],
    description: "Watch every Formula 1 race live — 24 Grand Prix weekends including practice, qualifying, Sprint races, and the Grand Prix — across Sky Sports F1, ESPN, and Canal+.",
    primaryKeyword: "watch Formula 1 live online",
    title: "Watch Formula 1 Live Online 2026 — Stream Every Grand Prix | STREAMB4",
    metaDescription: "Stream all 24 Formula 1 races live including qualifying and Sprint races. Sky Sports F1, ESPN, and Canal+ coverage. No blackouts. Works on all devices.",
    h1: "Watch Formula 1 Live — All 24 Grand Prix Weekends in HD",
    intro: "STREAMB4 gives you 40+ F1 channels so you never miss a wheel turn of a Grand Prix weekend. Sky Sports F1 (UK) carries every session without ad breaks during racing. Canal+ covers the French market. ESPN covers the USA. Across three major broadcasters, every practice, qualifying session, Sprint race, and Grand Prix is available on one subscription.",
    whyStreamB4: [
      "Sky Sports F1 — every session, ad-free during racing",
      "Canal+ for French-language coverage",
      "ESPN for USA audiences",
      "All 24 Grand Prix weekends covered",
      "Practice, qualifying, Sprint, and race sessions",
      "No blackout restrictions for any race",
    ],
    channels: "40+",
    keyEvents: ["Australian Grand Prix", "Monaco Grand Prix", "British Grand Prix", "Italian Grand Prix", "United States Grand Prix (Austin)", "Abu Dhabi Grand Prix Final"],
    faqs: [
      { q: "Does STREAMB4 carry Sky Sports F1?", a: "Yes. Sky Sports F1 is included in the STREAMB4 UK channel package. It carries every F1 session including practice, qualifying, Sprint races, and the Grand Prix, all without ad breaks during on-track action." },
      { q: "Can I watch Formula 1 in the USA on STREAMB4?", a: "Yes. ESPN carries Formula 1 in the USA and is included in the STREAMB4 USA channel package. You get the same race coverage as ESPN subscribers." },
      { q: "Are Sprint weekends available on STREAMB4?", a: "Yes. Sprint race weekends are carried across all the same broadcaster channels — Sky Sports F1, ESPN, and Canal+ — and are included in your STREAMB4 subscription." },
      { q: "Can I watch F1 outside the UK?", a: "Yes. STREAMB4 has no geographic restrictions. You can watch Sky Sports F1 from any country in the world without a VPN." },
      { q: "How many F1 channels does STREAMB4 carry?", a: "STREAMB4 carries 40+ channels covering Formula 1 including Sky Sports F1, Canal+, ESPN, ServusTV (Austria, free-to-air), and additional regional coverage feeds." },
    ],
    relatedCountries: ["united-kingdom", "europe"],
    relatedSports: ["premier-league", "champions-league"],
  },
};
