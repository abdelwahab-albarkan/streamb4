import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import fs from "fs/promises";
import path from "path";
import MarkdownPreview from "@/components/blog/MarkdownPreview";
import ViewIncrementTrigger from "./ViewIncrementTrigger";
import CommentSection from "@/components/blog/CommentSection";
import BookmarkButton from "@/components/blog/BookmarkButton";
import { getCategoryImage } from "@/lib/blogImages";
import { MobileTOC } from "@/components/blog/MobileTOC";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { ArticleFAQ } from "@/components/blog/ArticleFAQ";
import { ContentBlock } from "@/components/blog/ContentBlocks";

async function getPost(slug: string) {
  try {
    const fsModule = await import("fs/promises");
    const pathModule = await import("path");
    const filePath = pathModule.join(process.cwd(), "data", "posts.json");
    const data = await fsModule.readFile(filePath, "utf-8");
    const posts = JSON.parse(data || "[]");

    let post = posts.find((p: any) => p.slug === slug && p.status === "published");

    if (!post) {
      post = posts.find(
        (p: any) =>
          p.status === "published" &&
          (p.slug?.includes(slug) || slug?.includes(p.slug))
      );
    }

    return post || null;
  } catch (error) {
    console.error("getPost error:", error);
    return null;
  }
}

async function getRelatedPosts(category: string, currentId: string) {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "posts.json");
    const data = await fs.readFile(dataFilePath, "utf8");
    const posts = JSON.parse(data || "[]");
    return posts
      .filter((p: any) => p.category === category && p.id !== currentId && p.status === "published")
      .slice(0, 3);
  } catch (err) {
    return [];
  }
}

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { robots: { index: false, follow: false } };
  const ogImg = post.ogImage || post.featuredImage || "/og-image.jpg";
  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.ogTitle || post.seoTitle || post.title,
      description: post.ogDescription || post.metaDescription || post.excerpt,
      images: [{ url: ogImg, width: 1200, height: 630, alt: post.title }],
      url: `https://streamb4.com/blog/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitterTitle || post.seoTitle || post.title,
      description: post.twitterDescription || post.metaDescription || post.excerpt,
      images: [ogImg],
    },
    alternates: {
      canonical: `https://streamb4.com/blog/${slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="max-w-2xl mx-auto px-8 text-center">
            <div className="text-6xl mb-6">📄</div>
            <h1
              className="font-anton text-4xl text-white uppercase mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
            >
              ARTICLE NOT FOUND
            </h1>
            <p className="text-gray-500 mb-8">This article doesn&apos;t exist or has been removed.</p>
            <Link href="/blog">
              <span
                className="px-8 py-4 rounded-full font-black text-black text-sm uppercase cursor-pointer"
                style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)" }}
              >
                ← Back to Blog
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id);

  // Generate Table of Contents
  const headings = post.content.match(/^#{2,3} .+/gm) || [];
  const toc = headings.map((h: string) => {
    const level = h.match(/^#+/)?.[0].length || 2;
    const text = h.replace(/^#+\s/, "");
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return { level, text, id };
  });

  const articleFaqs: { question: string; answer: string }[] = Array.isArray(post.faqs) && post.faqs.length > 0
    ? post.faqs
    : [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://streamb4.com/blog/${slug}#article`,
    "headline": post.title,
    "description": post.metaDescription || post.excerpt || "",
    "url": `https://streamb4.com/blog/${slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://streamb4.com/blog/${slug}`
    },
    "isPartOf": { "@id": "https://streamb4.com/blog#blog" },
    "datePublished": post.date || post.createdAt || "",
    "dateModified": post.updatedAt || post.date || "",
    "author": {
      "@type": "Person",
      "name": post.author || "STREAMB4 Editorial Team"
    },
    "publisher": { "@id": "https://streamb4.com/#organization" },
    "image": {
      "@type": "ImageObject",
      "url": post.featuredImage || post.ogImage || "https://streamb4.com/og-image.jpg",
      "width": 1200,
      "height": 630
    },
    "thumbnailUrl": post.featuredImage || post.ogImage || "https://streamb4.com/og-image.jpg",
    "keywords": post.focusKeyword || post.tags?.join(", ") || "IPTV",
    "articleSection": post.category || "IPTV",
    "inLanguage": "en-US",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".article-summary"]
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://streamb4.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://streamb4.com/blog/${slug}` }
    ]
  };

  const faqJsonLd = articleFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": articleFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      )}
      <ViewIncrementTrigger slug={slug} />
      <MobileTOC toc={toc} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24 flex-1 w-full space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 font-semibold uppercase tracking-wider space-x-2">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-gray-400">{post.category}</span>
        </nav>

        {/* Article Header */}
        <div className="max-w-3xl space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-black text-black uppercase tracking-wider bg-gradient-to-r from-[#ff7a00] to-[#ffb300]">
            {post.category}
          </span>
          <h1
            className="font-anton text-white uppercase tracking-tight leading-none"
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: "clamp(1.75rem, 6vw, 4rem)",
            }}
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-6 text-gray-500 text-xs font-semibold">
              <span>By {post.author || "Admin"}</span>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{(post.views || 0).toLocaleString()} views</span>
            </div>
            <BookmarkButton postId={post.id} postTitle={post.title} postSlug={slug} />
          </div>
        </div>

        {/* Share buttons */}
        <div className="py-2">
          <ShareButtons title={post.title} slug={slug} />
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-video rounded-[28px] overflow-hidden border border-white/[0.06] max-h-[500px] relative">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {/* Grid Area: Content + TOC Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Content */}
          <div className="lg:col-span-2 space-y-12">
            <article className="prose prose-base md:prose-lg prose-invert prose-orange max-w-none text-gray-300 leading-relaxed space-y-6">
              <MarkdownPreview source={post.content} />
            </article>

            {/* Custom CTA callout blocks */}
            <ContentBlock type="tip" title="Pro Streaming Tip">
              Always use a wired Ethernet connection when possible to ensure zero buffering and maximum 4K HDR stream stability.
            </ContentBlock>

            {/* FAQs Accordion — only render if post has actual FAQ data */}
            {articleFaqs.length > 0 && <ArticleFAQ faqs={articleFaqs} />}

            {/* Author Bio Card */}
            <AuthorCard author={post.author} />

            {/* Comments Section */}
            <CommentSection postSlug={slug} />
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* TOC */}
            {toc.length > 0 && (
              <div className="p-6 rounded-[24px] border border-white/[0.06] bg-white/[0.01] hidden lg:block">
                <h4 className="font-anton text-sm text-white uppercase tracking-wider mb-4">Contents</h4>
                <TableOfContents content={post.content} />
              </div>
            )}

            {/* CTA card */}
            <div className="p-6 rounded-[24px] border border-orange-500/20 bg-gradient-to-b from-orange-500/[0.02] to-transparent text-center space-y-4">
              <h4 className="font-anton text-lg text-white uppercase tracking-wider">Try STREAMB4 Free</h4>
              <p className="text-gray-500 text-xs">Test our channels free for 24 hours. No credit card required.</p>
              <Link href="/free-trial" className="block">
                <span className="w-full py-3 rounded-xl font-black text-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff7a00] to-[#ffb300] cursor-pointer inline-block">
                  Start Free Trial ⚡
                </span>
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />

        {/* Follow STREAMB4 */}
        <div
          className="rounded-[28px] p-8 sm:p-10 text-center"
          style={{
            background: "rgba(255,122,0,0.03)",
            border: "1px solid rgba(255,122,0,0.1)",
          }}
        >
          <p className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.25em] mb-2">
            Stay Connected
          </p>
          <h3
            className="font-anton text-2xl text-white uppercase mb-2"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
          >
            Follow STREAMB4
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Get the latest streaming guides, channel updates, and exclusive deals delivered straight to your feed.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              {
                name: "Discord",
                label: "Join STREAMB4 on Discord",
                href: "https://discord.gg/BFr5HSZfk",
                color: "#5865F2",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
                  </svg>
                ),
              },
              {
                name: "Facebook",
                label: "Follow STREAMB4 on Facebook",
                href: "https://www.facebook.com/profile.php?id=61591545360371",
                color: "#1877F2",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                ),
              },
              {
                name: "X (Twitter)",
                label: "Follow STREAMB4 on X",
                href: "https://x.com/streamb4t",
                color: "#e5e7eb",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z"/>
                  </svg>
                ),
              },
              {
                name: "Instagram",
                label: "Follow STREAMB4 on Instagram",
                href: "https://www.instagram.com/streamb4tv/?hl=fr",
                color: "#E1306C",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                ),
              },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.label}
                title={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}35`,
                  color: s.color,
                }}
              >
                {s.icon}
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
