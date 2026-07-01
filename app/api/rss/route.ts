import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

function readPosts() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

export async function GET() {
  const posts = readPosts().filter((p: any) => p.status === "published");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>STREAMB4 Blog</title>
    <link>https://streamb4.com/blog</link>
    <description>Streaming guides, tips and news from STREAMB4</description>
    <language>en-us</language>
    <atom:link href="https://streamb4.com/api/rss" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .slice(0, 20)
      .map(
        (post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://streamb4.com/blog/${post.slug}</link>
      <guid>https://streamb4.com/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date || Date.now()).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600",
    },
  });
}
