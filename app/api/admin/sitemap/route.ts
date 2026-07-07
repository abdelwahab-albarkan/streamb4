import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export async function POST() {
  try {
    await connectDB();
    const posts = await Post.find({ status: "published" }).sort({ isFeatured: -1, featured: -1, publishedAt: -1, createdAt: -1 }).lean();

    const urls = [
      { url: "https://streamb4.com", priority: "1.0", lastmod: new Date().toISOString().split("T")[0] },
      { url: "https://streamb4.com/pricing", priority: "0.9", lastmod: new Date().toISOString().split("T")[0] },
      { url: "https://streamb4.com/features", priority: "0.8", lastmod: new Date().toISOString().split("T")[0] },
      { url: "https://streamb4.com/blog", priority: "0.8", lastmod: new Date().toISOString().split("T")[0] },
      ...posts.map((p: any) => ({
        url: `https://streamb4.com/blog/${p.slug}`,
        priority: "0.7",
        lastmod: (p as any).date || new Date().toISOString().split("T")[0],
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.url}</loc>
    <priority>${u.priority}</priority>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return NextResponse.json({ success: true, xml });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
