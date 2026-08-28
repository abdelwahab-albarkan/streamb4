import { getAllPosts } from "@/lib/data/blogHelpers";

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts().slice(0, 20);

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
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://streamb4.com/blog/${post.slug}</link>
      <guid>https://streamb4.com/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt || post.createdAt || Date.now()).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600",
    },
  });
}
