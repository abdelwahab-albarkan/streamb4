"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/admin/ui/Toast";

export default function SEOCenterPage() {
  const { addToast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "audit" | "sitemap">("overview");
  const [sitemapXml, setSitemapXml] = useState("");
  const [generating, setGenerating] = useState(false);

  // Load posts for audit
  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/admin/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPosts();
  }, []);

  const handleGenerateSitemap = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/sitemap", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setSitemapXml(data.xml);
        addToast("Sitemap generated and saved successfully!", "success");
      }
    } catch (err) {
      addToast("Failed to generate sitemap", "error");
    } finally {
      setGenerating(false);
    }
  };

  // Calculate SEO metrics
  const publishedPosts = posts.filter((p) => p.status === "published");
  const totalScore = publishedPosts.reduce((acc, p) => acc + (p.seoScore || 0), 0);
  const avgScore = publishedPosts.length > 0 ? Math.round(totalScore / publishedPosts.length) : 0;

  const goodPosts = publishedPosts.filter((p) => (p.seoScore || 0) >= 80).length;
  const mediumPosts = publishedPosts.filter((p) => (p.seoScore || 0) >= 50 && (p.seoScore || 0) < 80).length;
  const badPosts = publishedPosts.filter((p) => (p.seoScore || 0) < 50).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col">
        <h1
          className="font-anton text-3xl text-white uppercase tracking-wider"
          style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
        >
          SEO CENTER
        </h1>
        <p className="text-gray-500 text-xs mt-1">Audit content scores, verify schemas, and submit sitemaps.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] shrink-0">
        {(["overview", "audit", "sitemap"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === tab ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Health Score circle */}
            <div
              className="lg:col-span-1 p-6 rounded-[20px] border flex flex-col items-center justify-center text-center space-y-4"
              style={{
                background: "rgba(15,15,15,0.95)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Average SEO Health</span>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="linear-gradient(135deg,#ff7a00,#ffb300)"
                    style={{ stroke: "#ff7a00" }}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(avgScore / 100) * 276.4} 276.4`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute text-center">
                  <span
                    className="font-anton text-4xl text-white block"
                    style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
                  >
                    {avgScore}
                  </span>
                  <span className="text-[10px] text-gray-600 font-bold">/100</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
                Your content optimization is generaly good. Fix low score posts to improve rankings.
              </p>
            </div>

            {/* Posts breakdown cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Good Optimization", count: goodPosts, score: "80-100", color: "#22c55e", bg: "rgba(34,197,94,0.06)" },
                { label: "Needs Improvement", count: mediumPosts, score: "50-79", color: "#ffb300", bg: "rgba(255,179,0,0.06)" },
                { label: "Critical Actions", count: badPosts, score: "<50", color: "#ef4444", bg: "rgba(239,68,68,0.06)" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-[20px] border flex flex-col justify-between space-y-4"
                  style={{
                    background: item.bg,
                    borderColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <div>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: item.color }}>
                      Score Range: {item.score}
                    </span>
                  </div>
                  <span
                    className="font-anton text-5xl text-white block"
                    style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
                  >
                    {item.count}
                  </span>
                  <span className="text-gray-600 text-xs font-semibold">Articles</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AUDIT TAB */}
        {activeTab === "audit" && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="rounded-[20px] overflow-hidden border bg-white/[0.01]"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["Title", "Keyword", "Score", "Title length", "Meta length", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-left text-gray-500 text-xs font-bold uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b hover:bg-white/[0.02] transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.03)" }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-white text-sm font-semibold block truncate max-w-[200px]">
                          {post.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-semibold">
                        {post.focusKeyword || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${post.seoScore || 0}%`,
                                background:
                                  (post.seoScore || 0) >= 80
                                    ? "linear-gradient(90deg,#22c55e,#16a34a)"
                                    : (post.seoScore || 0) >= 50
                                    ? "linear-gradient(90deg,#ffb300,#ff7a00)"
                                    : "linear-gradient(90deg,#ef4444,#dc2626)",
                              }}
                            />
                          </div>
                          <span
                            className="text-xs font-bold"
                            style={{
                              color:
                                (post.seoScore || 0) >= 80
                                  ? "#22c55e"
                                  : (post.seoScore || 0) >= 50
                                  ? "#ffb300"
                                  : "#ef4444",
                            }}
                          >
                            {post.seoScore || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-semibold">
                        {post.seoTitle?.length || 0} chars
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-semibold">
                        {post.metaDescription?.length || 0} chars
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="text-orange-500 hover:text-orange-400 transition-colors text-xs font-bold cursor-pointer"
                        >
                          Quick Fix
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* SITEMAP TAB */}
        {activeTab === "sitemap" && (
          <motion.div
            key="sitemap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div
              className="lg:col-span-1 p-6 rounded-[20px] border flex flex-col justify-between space-y-4"
              style={{
                background: "rgba(15,15,15,0.95)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Generate Sitemap</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Update your XML index files with the latest published URLs dynamically.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateSitemap}
                disabled={generating}
                className="w-full py-3 rounded-xl font-black text-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff7a00] to-[#ffb300] cursor-pointer"
              >
                {generating ? "Generating..." : "Regenerate Sitemap ⚡"}
              </button>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block">
                Sitemap Output Preview
              </span>
              <pre
                className="text-[10px] text-green-400 overflow-x-auto p-4 rounded-xl font-mono leading-relaxed h-[180px]"
                style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {sitemapXml || "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!-- Click regenerate to preview sitemap contents -->"}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
