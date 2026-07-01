import { MetadataRoute } from "next";
import fs from "fs/promises";
import path from "path";

const BASE = "https://streamb4.com";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/pricing`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.95 },
  { url: `${BASE}/free-trial`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/features`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/install`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE}/devices`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/blog`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.75 },
  { url: `${BASE}/faq`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/reseller`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/affiliate`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/usa`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/united-kingdom`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/canada`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/europe`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE}/restream`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const filePath = path.join(process.cwd(), "data", "posts.json");
    const raw = await fs.readFile(filePath, "utf8");
    const posts: Array<{
      slug: string;
      status: string;
      updatedAt?: string;
      date?: string;
      isFeatured?: boolean;
    }> = JSON.parse(raw || "[]");

    blogEntries = posts
      .filter((p) => p.status === "published")
      .map((p) => ({
        url: `${BASE}/blog/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.date || Date.now()),
        changeFrequency: "weekly" as const,
        priority: p.isFeatured ? 0.8 : 0.65,
      }));
  } catch {
    // posts.json not found or empty — sitemap will only include static pages
  }

  return [...STATIC_PAGES, ...blogEntries];
}
