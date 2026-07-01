"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/admin/ui/Toast";

interface SEOPanelProps {
  post: any;
  setPost: React.Dispatch<React.SetStateAction<any>>;
  seoScore: number;
  wordCount: number;
}

export function SEOPanel({ post, setPost, seoScore, wordCount }: SEOPanelProps) {
  const { addToast } = useToast();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (!post.content) {
      setSuggestions([]);
      return;
    }
    const computeSuggestions = async () => {
      try {
        const res = await fetch("/api/admin/posts");
        if (res.ok) {
          const data = await res.json();
          const posts = data.posts || [];
          const currentSlug = post.slug;
          const content = post.content;

          const list: any[] = [];
          posts
            .filter((p: any) => p.status === "published" && p.slug !== currentSlug)
            .forEach((p: any) => {
              const title = p.title || "";
              const keywords = title.toLowerCase().split(" ").filter((w: string) => w.length > 4);
              keywords.forEach((kw: string) => {
                if (content.toLowerCase().includes(kw) && !list.find((s) => s.slug === p.slug)) {
                  list.push({
                    slug: p.slug,
                    title: p.title,
                    keyword: kw,
                    url: `/blog/${p.slug}`,
                  });
                }
              });
            });
          setSuggestions(list.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      }
    };
    computeSuggestions();
  }, [post.content, post.slug]);

  const insertLink = (keyword: string, url: string) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "i");
    setPost((prev: any) => {
      const content = prev.content || "";
      const updated = content.replace(regex, `[$1](${url})`);
      return { ...prev, content: updated };
    });
    addToast(`Inserted link for: "${keyword}"`, "success");
  };

  const triggerAITitle = () => {
    if (post.title) {
      setPost((p: any) => ({
        ...p,
        seoTitle: `${p.title.slice(0, 45)} | STREAMB4`,
      }));
    }
  };

  const triggerAIMeta = () => {
    if (post.title) {
      setPost((p: any) => ({
        ...p,
        metaDescription: `Discover the ultimate stream guides. Read how to set up ${p.title} and stream 50,000+ live channels in 4K UHD. Instant activation, no contracts.`,
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-5 space-y-5"
    >
      {/* SEO SCORE */}
      <div
        className="flex items-center justify-between p-5 rounded-[20px]"
        style={{
          background:
            seoScore >= 80
              ? "rgba(34,197,94,0.06)"
              : seoScore >= 50
              ? "rgba(255,179,0,0.06)"
              : "rgba(239,68,68,0.06)",
          border: `1px solid ${
            seoScore >= 80
              ? "rgba(34,197,94,0.15)"
              : seoScore >= 50
              ? "rgba(255,179,0,0.15)"
              : "rgba(239,68,68,0.15)"
          }`,
        }}
      >
        <div>
          <p className="text-gray-500 text-xs mb-1">SEO Score</p>
          <p
            className="font-anton text-5xl"
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              color: seoScore >= 80 ? "#22c55e" : seoScore >= 50 ? "#ffb300" : "#ef4444",
            }}
          >
            {seoScore}
          </p>
          <p className="text-gray-600 text-xs">/100</p>
        </div>

        {/* Score Ring SVG */}
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={seoScore >= 80 ? "#22c55e" : seoScore >= 50 ? "#ffb300" : "#ef4444"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(seoScore / 100) * 175.9} 175.9`}
            transform="rotate(-90 32 32)"
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
      </div>

      {/* FOCUS KEYWORD */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">Focus Keyword</label>
        <input
          value={post.focusKeyword || ""}
          onChange={(e) => setPost((p: any) => ({ ...p, focusKeyword: e.target.value }))}
          placeholder="e.g. best streaming service"
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none placeholder-gray-700 focus:border-orange-500/40 transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* SEO TITLE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white font-bold text-xs uppercase tracking-wider block">SEO Title</label>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${
                post.seoTitle?.length > 60
                  ? "text-red-400"
                  : post.seoTitle?.length >= 30
                  ? "text-green-400"
                  : "text-gray-600"
              }`}
            >
              {post.seoTitle?.length || 0}/60
            </span>
            <button
              type="button"
              onClick={triggerAITitle}
              className="text-orange-500 text-xs font-bold hover:text-orange-400 transition-colors cursor-pointer"
            >
              ✨ AI
            </button>
          </div>
        </div>
        <input
          value={post.seoTitle || ""}
          onChange={(e) => setPost((p: any) => ({ ...p, seoTitle: e.target.value }))}
          placeholder="SEO optimized title..."
          maxLength={65}
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${
              post.seoTitle?.length > 60
                ? "rgba(239,68,68,0.3)"
                : post.seoTitle?.length >= 30
                ? "rgba(34,197,94,0.2)"
                : "rgba(255,255,255,0.08)"
            }`,
          }}
        />
        <div className="h-1 rounded-full bg-white/[0.04]">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(((post.seoTitle?.length || 0) / 60) * 100, 100)}%`,
              background:
                post.seoTitle?.length > 60 ? "#ef4444" : post.seoTitle?.length >= 30 ? "#22c55e" : "#ffb300",
            }}
          />
        </div>
      </div>

      {/* META DESCRIPTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white font-bold text-xs uppercase tracking-wider block">Meta Description</label>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${
                post.metaDescription?.length > 155
                  ? "text-red-400"
                  : post.metaDescription?.length >= 120
                  ? "text-green-400"
                  : "text-gray-600"
              }`}
            >
              {post.metaDescription?.length || 0}/155
            </span>
            <button
              type="button"
              onClick={triggerAIMeta}
              className="text-orange-500 text-xs font-bold hover:text-orange-400 transition-colors cursor-pointer"
            >
              ✨ AI
            </button>
          </div>
        </div>
        <textarea
          value={post.metaDescription || ""}
          onChange={(e) => setPost((p: any) => ({ ...p, metaDescription: e.target.value }))}
          placeholder="Compelling meta description..."
          maxLength={160}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none resize-none leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        <div className="h-1 rounded-full bg-white/[0.04]">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(((post.metaDescription?.length || 0) / 155) * 100, 100)}%`,
              background:
                post.metaDescription?.length > 155
                  ? "#ef4444"
                  : post.metaDescription?.length >= 120
                  ? "#22c55e"
                  : "#ffb300",
            }}
          />
        </div>
      </div>

      {/* GOOGLE PREVIEW */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">Google Preview</label>
        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[#8ab4f8] text-sm mb-0.5 truncate">
            streamb4.com › blog › {post.slug || "your-slug"}
          </p>
          <p className="text-[#c58af9] text-base font-medium leading-tight mb-1 line-clamp-1">
            {post.seoTitle || post.title || "Your SEO Title"}
          </p>
          <p className="text-[#bdc1c6] text-xs leading-relaxed line-clamp-2">
            {post.metaDescription || "Your meta description will appear here..."}
          </p>
        </div>
      </div>

      {/* SEO CHECKLIST */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">SEO Checklist</label>
        <div className="space-y-2">
          {[
            {
              check: (post.seoTitle?.length || 0) >= 30 && (post.seoTitle?.length || 0) <= 60,
              label: "SEO title length (30-60 chars)",
            },
            {
              check:
                post.focusKeyword &&
                post.seoTitle?.toLowerCase().includes(post.focusKeyword.toLowerCase()),
              label: "Keyword in SEO title",
            },
            {
              check: (post.metaDescription?.length || 0) >= 120,
              label: "Meta description length",
            },
            {
              check:
                post.focusKeyword &&
                post.metaDescription?.toLowerCase().includes(post.focusKeyword.toLowerCase()),
              label: "Keyword in meta description",
            },
            {
              check: wordCount >= 800,
              label: `Content length (${wordCount}/800 words)`,
            },
            {
              check: !!post.featuredImage,
              label: "Featured image set",
            },
            {
              check:
                post.focusKeyword &&
                post.slug?.includes(post.focusKeyword.toLowerCase().replace(/\s+/g, "-")),
              label: "Keyword in URL slug",
            },
            {
              check: !!post.category,
              label: "Category selected",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                  item.check ? "text-green-500 bg-green-500/10" : "text-gray-600 bg-white/[0.04]"
                }`}
              >
                {item.check ? "✓" : "○"}
              </div>
              <span className={`text-xs ${item.check ? "text-gray-300" : "text-gray-600"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CANONICAL + ROBOTS */}
      <div className="space-y-3">
        <div>
          <label className="text-gray-500 text-xs mb-1 block">Canonical URL</label>
          <input
            value={post.canonicalUrl || ""}
            onChange={(e) => setPost((p: any) => ({ ...p, canonicalUrl: e.target.value }))}
            placeholder="https://streamb4.com/blog/..."
            className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">No Index</span>
          <button
            type="button"
            onClick={() => setPost((p: any) => ({ ...p, noIndex: !p.noIndex }))}
            className="w-8 h-4 rounded-full relative transition-all cursor-pointer"
            style={{
              background: post.noIndex ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)",
            }}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                post.noIndex ? "left-4" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Suggest Internal Links */}
      {suggestions.length > 0 && (
        <div
          className="p-4 rounded-[16px] mt-4"
          style={{
            background: "rgba(255,122,0,0.04)",
            border: "1px solid rgba(255,122,0,0.1)",
          }}
        >
          <p className="text-orange-500 text-xs font-black uppercase tracking-wider mb-3">
            ✨ Internal Links ({suggestions.length})
          </p>
          {suggestions.map((s) => (
            <div
              key={s.slug}
              className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-white text-xs font-medium truncate max-w-[180px]">{s.title}</p>
                <p className="text-gray-600 text-[11px]">Keyword: "{s.keyword}"</p>
              </div>
              <button
                type="button"
                onClick={() => insertLink(s.keyword, s.url)}
                className="text-orange-500 text-xs hover:text-orange-400 transition-colors font-bold cursor-pointer"
              >
                Insert
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface SchemaPanelProps {
  post: any;
}

export function SchemaPanel({ post }: SchemaPanelProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seoTitle || post.title || "Untitled Article",
    "description": post.metaDescription || "Article description",
    "image": post.featuredImage || "https://streamb4.com/og-image.jpg",
    "author": {
      "@type": "Organization",
      "name": "STREAMB4",
    },
    "publisher": {
      "@type": "Organization",
      "name": "STREAMB4",
      "logo": {
        "@type": "ImageObject",
        "url": "https://streamb4.com/logo.png",
      },
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://streamb4.com/blog/${post.slug || "your-slug"}`,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-5 space-y-4"
    >
      <div className="space-y-1">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">JSON-LD Schema</label>
        <p className="text-gray-500 text-xs">This structured data will be injected automatically for search engines.</p>
      </div>

      <pre
        className="text-[10px] text-green-400 overflow-x-auto p-4 rounded-xl font-mono leading-relaxed"
        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {JSON.stringify(articleSchema, null, 2)}
      </pre>

      <div className="pt-2">
        <a
          href="https://search.google.com/test/rich-results"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange-400 font-bold hover:underline block text-center"
        >
          Test on Google Rich Results →
        </a>
      </div>
    </motion.div>
  );
}
