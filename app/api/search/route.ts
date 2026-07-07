import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json([]);
    }

    await connectDB();

    const posts = await Post.find({ status: "published" }).sort({ isFeatured: -1, featured: -1, publishedAt: -1, createdAt: -1 }).lean();
    const q = query.toLowerCase();

    const ranked = posts
      .map((post: any) => {
        let score = 0;

        // Title match = highest weight
        if (post.title.toLowerCase().includes(q)) score += 10;
        // Tag match
        if (post.tags?.some((t: string) => t.toLowerCase().includes(q))) score += 8;
        // Category match
        if (post.category?.toLowerCase().includes(q)) score += 6;
        // Excerpt match
        if (post.excerpt?.toLowerCase().includes(q)) score += 4;
        // Content match
        if (post.content?.toLowerCase().includes(q)) score += 2;

        return { ...post, searchScore: score };
      })
      .filter((p: any) => p.searchScore > 0)
      .sort((a: any, b: any) => {
        if (b.searchScore !== a.searchScore) {
          return b.searchScore - a.searchScore;
        }
        if (!!b.featured !== !!a.featured) {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        const bPub = b.publishedAt || "";
        const aPub = a.publishedAt || "";
        if (bPub !== aPub) {
          return bPub.localeCompare(aPub) * -1;
        }
        const bCreat = b.createdAt || "";
        const aCreat = a.createdAt || "";
        return bCreat.localeCompare(aCreat) * -1;
      })
      .slice(0, 10)
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        category: p.category,
        featuredImage: p.featuredImage,
        readingTime: p.readingTime || 5,
        searchScore: p.searchScore,
      }));

    return NextResponse.json(ranked);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
