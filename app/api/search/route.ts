import { NextResponse } from "next/server";
import { searchPosts } from "@/lib/data/blogHelpers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json([]);
  }

  const results = searchPosts(query).map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    featuredImage: p.featuredImage,
    readingTime: p.readingTime || 5,
  }));

  return NextResponse.json(results);
}
