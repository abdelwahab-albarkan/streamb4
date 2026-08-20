import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";
import { DEVICE_CONFIGS } from "@/lib/deviceConfigs";

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

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}`,               lastModified: new Date("2026-08-20"), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/pricing`,       lastModified: new Date("2026-08-20"), changeFrequency: "weekly",  priority: 0.95 },
  { url: `${BASE}/features`,      lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/install`,       lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE}/devices`,       lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/blog`,          lastModified: new Date("2026-08-20"), changeFrequency: "daily",   priority: 0.75 },
  { url: `${BASE}/faq`,           lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/reseller`,      lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/affiliate`,     lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/usa`,           lastModified: new Date("2026-08-20"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/united-kingdom`,lastModified: new Date("2026-08-20"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/canada`,        lastModified: new Date("2026-08-20"), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/europe`,        lastModified: new Date("2026-08-20"), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE}/contact`,       lastModified: new Date("2026-06-01"), changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE}/about`,         lastModified: new Date("2026-06-01"), changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE}/restream`,      lastModified: new Date("2026-07-01"), changeFrequency: "monthly", priority: 0.65 },
  { url: `${BASE}/editorial-policy`, lastModified: new Date("2026-06-01"), changeFrequency: "yearly",  priority: 0.3 },
  // legal pages are noindex — excluded from sitemap to preserve crawl budget
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    await connectDB();
    interface SitemapPost {
      slug: string;
      updatedAt?: string | Date;
      date?: string | Date;
      isFeatured?: boolean;
    }
    const posts = await Post.find({ status: "published" })
      .select("slug updatedAt isFeatured createdAt")
      .sort({ isFeatured: -1, featured: -1, publishedAt: -1, createdAt: -1 })
      .lean() as unknown as SitemapPost[];

    blogEntries = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.date || Date.now()),
      changeFrequency: "weekly" as const,
      priority: p.isFeatured ? 0.8 : 0.65,
    }));
  } catch (err) {
    // DB not available — sitemap returns only static pages.
    // Check Vercel logs / MongoDB Atlas if blog posts are missing from sitemap.
    console.error("[sitemap] MongoDB error — blog entries omitted:", err);
  }

  return [...STATIC_PAGES, ...DEVICE_PAGES, ...blogEntries];
}
