import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/data/blogHelpers";
import { DEVICE_CONFIGS } from "@/lib/deviceConfigs";
import { SPORT_CONFIGS } from "@/lib/sportConfigs";

const BASE = "https://streamb4.com";

const DEVICE_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}/iptv`, lastModified: new Date("2026-08-20"), changeFrequency: "monthly", priority: 0.85 },
  ...Object.keys(DEVICE_CONFIGS).map((slug) => ({
    url: `${BASE}/iptv/${slug}`,
    lastModified: new Date("2026-08-20"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];

const SPORT_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}/sports`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.9 },
  ...Object.keys(SPORT_CONFIGS).map((slug) => ({
    url: `${BASE}/sports/${slug}`,
    lastModified: new Date("2026-08-28"),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  })),
];

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}`,                    lastModified: new Date("2026-08-28"), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/pricing`,            lastModified: new Date("2026-08-28"), changeFrequency: "weekly",  priority: 0.95 },
  { url: `${BASE}/free-trial`,         lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.93 },
  { url: `${BASE}/best-iptv-service`,  lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/channels`,           lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.88 },
  { url: `${BASE}/features`,           lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/install`,            lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE}/devices`,            lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/blog`,               lastModified: new Date("2026-08-28"), changeFrequency: "daily",   priority: 0.75 },
  { url: `${BASE}/faq`,                lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/reseller`,           lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/affiliate`,          lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/usa`,                lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/united-kingdom`,     lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/canada`,             lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/europe`,             lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE}/contact`,            lastModified: new Date("2026-06-01"), changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE}/about`,              lastModified: new Date("2026-06-01"), changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE}/restream`,           lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.65 },
  { url: `${BASE}/editorial-policy`,   lastModified: new Date("2026-06-01"), changeFrequency: "yearly",  priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt || p.createdAt || Date.now()),
    changeFrequency: "weekly" as const,
    priority: p.isFeatured ? 0.8 : 0.65,
  }));

  return [...STATIC_PAGES, ...SPORT_PAGES, ...DEVICE_PAGES, ...blogEntries];
}
