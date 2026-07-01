import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/blog/SearchBar";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { PostCard } from "@/components/blog/PostCard";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { getCategoryImage } from "@/lib/blogImages";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export const metadata: Metadata = {
  title: "IPTV Guides, Setup Tutorials & Streaming Tips | STREAMB4 Blog",
  description: "Expert IPTV setup guides, streaming tutorials, device comparisons, and IPTV tips from the STREAMB4 team. Learn how to get the most from your IPTV subscription.",
  alternates: {
    canonical: "https://streamb4.com/blog",
  },
  openGraph: {
    title: "IPTV Guides & Streaming Tutorials | STREAMB4 Blog",
    description: "Expert IPTV setup guides, streaming tutorials, device comparisons and tips from the STREAMB4 team.",
    images: [{ url: "/og-blog.jpg", width: 1200, height: 630, alt: "STREAMB4 IPTV Blog — Guides and Tutorials" }],
    url: "https://streamb4.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Guides & Tutorials | STREAMB4 Blog",
    description: "Expert IPTV setup guides, device comparisons and streaming tips.",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://streamb4.com/blog#blog",
  "name": "STREAMB4 IPTV Blog",
  "description": "Expert IPTV setup guides, streaming tutorials, device comparisons, and IPTV tips from the STREAMB4 team.",
  "url": "https://streamb4.com/blog",
  "publisher": { "@id": "https://streamb4.com/#organization" },
  "inLanguage": "en-US",
  "isPartOf": { "@id": "https://streamb4.com/#website" },
  "about": {
    "@type": "Thing",
    "name": "IPTV Streaming"
  }
};

const blogBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://streamb4.com/blog" }
  ]
};

async function getPosts() {
  try {
    await connectDB();
    return await Post.find({ status: "published" }).sort({ publishedAt: -1 }).lean();
  } catch (err) {
    return [];
  }
}

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const posts = await getPosts();

  // Extract unique categories
  const categories = Array.from(
    new Set(posts.map((p: any) => p.category).filter(Boolean))
  ) as string[];

  // Filter posts
  let filteredPosts = posts;
  if (category && category.toLowerCase() !== "all") {
    filteredPosts = filteredPosts.filter(
      (p: any) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }
  if (q) {
    filteredPosts = filteredPosts.filter(
      (p: any) =>
        p.title?.toLowerCase().includes(q.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(q.toLowerCase())
    );
  }

  const featuredPost = posts.find((p: any) => p.isFeatured) || posts[0] || null;
  const trendingPosts = [...posts]
    .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(blogBreadcrumbSchema) }} />
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.06]"
            style={{
              background: "radial-gradient(ellipse, #ff7a00, transparent 70%)",
              filter: "blur(100px)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,122,0,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,122,0,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center mb-8">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(255,122,0,0.08)",
                border: "1px solid rgba(255,122,0,0.15)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-500 text-xs font-black tracking-[0.3em] uppercase">
                KNOWLEDGE CENTER
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="font-anton text-center uppercase leading-tight mb-6"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-anton), Anton, sans-serif",
            }}
          >
            <span className="text-white">STREAMING </span>
            <span
              style={{
                background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 40px rgba(255,122,0,0.4))",
              }}
            >
              GUIDES
            </span>
            <span className="text-white"> & TUTORIALS.</span>
          </h1>

          <p className="text-gray-500 text-center text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-semibold">
            Expert advice, setup guides, device comparisons and streaming tips from the STREAMB4 team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16 relative">
            <SearchBar />
          </div>

          {/* Category Filter */}
          <Suspense fallback={<div className="h-10" />}>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>
      </section>

      {/* ═══ FEATURED POST ═══ */}
      {!category && !q && featuredPost && (
        <section className="px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <FeaturedPost post={featuredPost} />
          </div>
        </section>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 relative z-10 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            {/* LEFT — Posts grid */}
            <div className="space-y-16">
              {filteredPosts.length === 0 ? (
                <div className="py-20 text-center rounded-[32px] border border-white/[0.04] bg-white/[0.01]">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-white font-bold text-lg mb-2">No articles found</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                    We couldn't find any articles matching your search criteria. Try filtering by another category or resetting the search.
                  </p>
                  <Link href="/blog" className="inline-block mt-6">
                    <span
                      className="px-6 py-3 rounded-full text-xs font-black text-black uppercase tracking-wider cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
                    >
                      Clear Filters
                    </span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <span className="text-orange-500 text-xs font-black tracking-[0.3em] uppercase block mb-2">
                          {category ? `${category}` : "ARCHIVE"}
                        </span>
                        <h2 className="font-anton text-2xl sm:text-3xl text-white uppercase"
                          style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}>
                          {q ? `Search results for "${q}"` : "KNOWLEDGE ARTICLES"}
                        </h2>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredPosts.map((post: any, i: number) => (
                        <PostCard key={post.id} post={post} index={i} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT — Sidebar */}
            <aside className="space-y-6">
              {/* Popular Posts */}
              <div
                className="p-6 rounded-[24px]"
                style={{
                  background: "rgba(15, 15, 15, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <h3 className="text-white font-black text-sm uppercase tracking-wider mb-5">
                  Popular Posts
                </h3>
                <div className="space-y-4">
                  {trendingPosts.map((post: any) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={post.featuredImage || getCategoryImage(post.category)}
                          alt={post.title}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          unoptimized={!!(post.featuredImage?.startsWith('http'))}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold line-clamp-2 group-hover:text-orange-300 transition-colors leading-tight mb-1">
                          {post.title}
                        </p>
                        <p className="text-gray-600 text-[10px]">
                          {(post.views || 0).toLocaleString()} views · {post.readingTime || 3} min
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div
                className="p-6 rounded-[24px]"
                style={{
                  background: "rgba(15, 15, 15, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <h3 className="text-white font-black text-sm uppercase tracking-wider mb-5">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const count = posts.filter((p: any) => p.category === cat).length;
                    return (
                      <Link
                        key={cat}
                        href={`/blog?category=${encodeURIComponent(cat)}`}
                        className="flex items-center justify-between py-2.5 border-b group transition-colors"
                        style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}
                      >
                        <span className="text-gray-400 text-sm group-hover:text-orange-400 transition-colors">
                          {cat}
                        </span>
                        <span className="text-gray-700 text-xs group-hover:text-orange-500 transition-colors">
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Try STREAMB4 CTA */}
              <div
                className="p-6 rounded-[24px] text-center"
                style={{
                  background: "rgba(15, 15, 15, 0.95)",
                  border: "1px solid rgba(255, 122, 0, 0.15)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                  }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-white font-black text-sm mb-1">Try STREAMB4 Free</p>
                <p className="text-gray-600 text-xs mb-4">24-hour trial. No credit card.</p>
                <Link
                  href="/free-trial"
                  className="w-full py-2.5 rounded-xl text-black text-xs font-black uppercase cursor-pointer block"
                  style={{
                    background: "linear-gradient(135deg, #ff7a00, #ffb300)",
                  }}
                >
                  Start Free Trial
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
    </>
  );
}
