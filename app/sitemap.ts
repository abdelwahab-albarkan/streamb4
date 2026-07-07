import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

const BASE = "https://streamb4.com";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/pricing`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.95 },
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
    await connectDB();
    const posts = await Post.find({ status: "published" }).sort({ isFeatured: -1, featured: -1, publishedAt: -1, createdAt: -1 }).lean() as any[];

    blogEntries = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.date || Date.now()),
      changeFrequency: "weekly" as const,
      priority: p.isFeatured ? 0.8 : 0.65,
    }));
  } catch {
    // DB not available — sitemap will only include static pages
  }

  return [...STATIC_PAGES, ...blogEntries];
}
