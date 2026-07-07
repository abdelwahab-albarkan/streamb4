"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getCategoryImage } from "@/lib/blogImages";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage: string;
  publishedAt: string;
  readingTime: number;
}

interface Props {
  posts: Post[];
}

export function LatestBlogPosts({ posts }: Props) {
  if (!posts.length) return null;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #ff7a00, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#FF7A00] font-black text-xs uppercase tracking-[0.3em] mb-3">
              KNOWLEDGE CENTER
            </p>
            <h2
              className="text-white font-black text-3xl sm:text-4xl uppercase"
              style={{ fontFamily: "var(--font-anton, sans-serif)", letterSpacing: "-0.02em" }}
            >
              LATEST <span style={{ color: "#FF7A00" }}>GUIDES</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-400 transition-colors"
          >
            All articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const imgSrc = post.featuredImage || getCategoryImage(post.category);
            const pubDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div
                    className="h-full rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      background: "rgba(15,15,15,0.9)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      transition: "border-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,122,0,0.25)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)")
                    }
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={imgSrc}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={imgSrc.startsWith("http")}
                      />
                      {/* Category pill */}
                      {post.category && (
                        <span
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-black"
                          style={{ background: "linear-gradient(135deg, #FF7A00, #ffb300)" }}
                        >
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="text-white font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.05]">
                        <span className="text-gray-600 text-[11px]">
                          {pubDate ?? ""}
                        </span>
                        <span className="text-gray-600 text-[11px]">
                          {post.readingTime ? `${post.readingTime} min read` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Mobile "All articles" link */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            Browse all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
