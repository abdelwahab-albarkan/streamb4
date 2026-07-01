import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export async function GET() {
  await connectDB();
  const posts = await Post.find({ status: "published" }).sort({ publishedAt: -1 }).limit(20).lean();

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
      .map(
        (post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://streamb4.com/blog/${post.slug}</link>
      <guid>https://streamb4.com/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date((post as any).date || Date.now()).toUTCString()}</pubDate>
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
