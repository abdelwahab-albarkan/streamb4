import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const postsFilePath = path.join(process.cwd(), "data", "posts.json");
const sitemapFilePath = path.join(process.cwd(), "public", "sitemap.xml");

function readPosts() {
  try {
    if (!fs.existsSync(postsFilePath)) return [];
    const data = fs.readFileSync(postsFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

export async function POST() {
  try {
    const posts = readPosts().filter((p: any) => p.status === "published");

    const urls = [
      { url: "https://streamb4.com", priority: "1.0", lastmod: new Date().toISOString().split("T")[0] },
      { url: "https://streamb4.com/pricing", priority: "0.9", lastmod: new Date().toISOString().split("T")[0] },
      { url: "https://streamb4.com/features", priority: "0.8", lastmod: new Date().toISOString().split("T")[0] },
      { url: "https://streamb4.com/blog", priority: "0.8", lastmod: new Date().toISOString().split("T")[0] },
      ...posts.map((p: any) => ({
        url: `https://streamb4.com/blog/${p.slug}`,
        priority: "0.7",
        lastmod: p.date || new Date().toISOString().split("T")[0],
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

    fs.mkdirSync(path.dirname(sitemapFilePath), { recursive: true });
    fs.writeFileSync(sitemapFilePath, xml, "utf8");

    return NextResponse.json({ success: true, xml });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
