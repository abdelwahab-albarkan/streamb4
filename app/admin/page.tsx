"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/components/admin/ui/Toast";
import {
  FileText,
  CheckCircle,
  FileEdit,
  Image,
  Pencil,
  Upload,
  Search,
  Sparkles,
  Mail,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [pendingComments, setPendingComments] = useState<any[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setDataError(null);

      // Load posts
      const resPosts = await fetch("/api/admin/posts");
      if (resPosts.status === 401) {
        setDataError("Session expired. Please log out and log back in.");
        return;
      }
      if (!resPosts.ok) {
        const errData = await resPosts.json().catch(() => ({}));
        setDataError(errData.error || `Server error (${resPosts.status}) — check Vercel logs and MONGODB_URI env var.`);
        return;
      }
      const postsData = await resPosts.json();
      setPosts(postsData.posts || []);

      // Load subscribers
      const resSubs = await fetch("/api/newsletter");
      if (resSubs.ok) {
        const data = await resSubs.json();
        setSubscribersCount(data.count || 0);
      }

      // Load pending comments
      const resComments = await fetch("/api/admin/comments?status=pending");
      if (resComments.ok) {
        const data = await resComments.json();
        setPendingComments(data.comments || []);
      }
    } catch (err) {
      setDataError(`Network error: ${err instanceof Error ? err.message : String(err)}`);
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveComment = async (id: string) => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      if (res.ok) {
        addToast("Comment approved! ✓", "success");
        loadDashboardData();
      }
    } catch (err) {
      addToast("Failed to approve comment", "error");
    }
  };

  const handleSpamComment = async (id: string) => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "spam" }),
      });
      if (res.ok) {
        addToast("Comment marked as spam", "info");
        loadDashboardData();
      }
    } catch (err) {
      addToast("Failed to update status", "error");
    }
  };

  // Stats calculation
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftsCount = posts.filter((p) => p.status === "draft").length;

  const stats = [
    {
      label: "Total Posts",
      value: String(totalPosts),
      change: "All posts",
      icon: <FileText className="w-5 h-5 text-orange-500" />,
    },
    {
      label: "Published",
      value: String(publishedCount),
      change: `${publishedCount} live articles`,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      label: "Drafts",
      value: String(draftsCount),
      change: "Draft items",
      icon: <FileEdit className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "Subscribers",
      value: String(subscribersCount),
      change: "Newsletter base",
      icon: <Mail className="w-5 h-5 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col">
        <h1
          className="font-anton text-4xl text-white uppercase tracking-wider"
          style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
        >
          DASHBOARD
        </h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Error Banner */}
      {dataError && (
        <div className="px-4 py-3 rounded-xl text-sm font-semibold text-red-300" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
          {dataError}
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
            className="relative p-6 rounded-[20px] overflow-hidden"
            style={{
              background: "rgba(15,15,15,0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,rgba(255,122,0,0.12),rgba(255,179,0,0.06))",
                  border: "1px solid rgba(255,122,0,0.2)",
                }}
              >
                {stat.icon}
              </div>
              <span
                className="text-xs text-gray-500 font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {stat.change}
              </span>
            </div>

            <p
              className="font-anton text-4xl text-white mb-1"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
            >
              {stat.value}
            </p>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>

            <div
              className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
              style={{
                background: "radial-gradient(circle at top right, rgba(255,122,0,0.05), transparent)",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Left (Recent Posts) & Right (Quick Actions + Moderation + Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Posts (66%) */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-[20px] overflow-hidden"
            style={{
              background: "rgba(15,15,15,0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
              <h3 className="text-white font-bold text-sm">Recent Posts</h3>
              <Link href="/admin/posts" className="text-orange-500 text-xs font-bold hover:text-orange-400">
                View all →
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["Title", "Status", "Views", "SEO", "Date"].map((h) => (
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
                  {posts.slice(0, 5).map((post, i) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-150"
                    >
                      {/* Title */}
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-semibold group-hover:text-orange-100 transition-colors max-w-[240px] truncate">
                          {post.title}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5 truncate">/{post.slug}</p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                          style={
                            post.status === "published"
                              ? {
                                  background: "rgba(34,197,94,0.1)",
                                  color: "#22c55e",
                                  border: "1px solid rgba(34,197,94,0.2)",
                                }
                              : {
                                  background: "rgba(255,179,0,0.1)",
                                  color: "#ffb300",
                                  border: "1px solid rgba(255,179,0,0.2)",
                                }
                          }
                        >
                          {post.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-6 py-4 text-gray-400 text-sm font-medium">
                        {(post.views || 0).toLocaleString()}
                      </td>

                      {/* SEO Score */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
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
                          <span className="text-xs text-gray-500 font-bold">{post.seoScore || 0}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-600 text-xs font-semibold">{post.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Actions + Comments + Activity */}
        <div className="space-y-6">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "New Post", icon: <Pencil className="w-4 h-4" />, href: "/admin/posts/new", primary: true },
              { label: "Upload Media", icon: <Upload className="w-4 h-4" />, href: "/admin/media", primary: false },
              { label: "SEO Audit", icon: <Search className="w-4 h-4" />, href: "/admin/seo", primary: false },
              { label: "AI Writer", icon: <Sparkles className="w-4 h-4" />, href: "/admin/ai-writer", primary: false },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-4 rounded-[16px] cursor-pointer transition-all duration-200"
                  style={
                    action.primary
                      ? {
                          background: "linear-gradient(135deg,#ff8a00,#ffb347)",
                          boxShadow: "0 0 20px rgba(255,122,0,0.25)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }
                  }
                >
                  <span style={{ color: action.primary ? "#000" : "#ff7a00" }}>{action.icon}</span>
                  <span className={`text-sm font-black uppercase tracking-wider ${action.primary ? "text-black" : "text-gray-300"}`}>
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Pending Comments Widget */}
          <div
            className="p-5 rounded-[20px]"
            style={{
              background: "rgba(15,15,15,0.95)",
              border: "1px solid rgba(255,122,0,0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-bold text-sm">Pending Comments</h4>
              <span className="text-orange-500 font-black text-lg">{pendingComments.length}</span>
            </div>

            {pendingComments.length === 0 ? (
              <p className="text-gray-600 text-xs font-semibold py-2">All comments moderated!</p>
            ) : (
              <div className="space-y-3">
                {pendingComments.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="flex gap-3 py-3 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs font-bold">{c.name}</p>
                      <p className="text-gray-600 text-xs truncate mt-0.5">{c.content}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveComment(c.id)}
                        className="text-green-400 hover:text-green-300 text-xs font-bold cursor-pointer"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleSpamComment(c.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer"
                      >
                        ✗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div
            className="p-6 rounded-[20px]"
            style={{
              background: "rgba(15,15,15,0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3 className="text-white font-bold text-sm mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { time: "10 mins ago", text: 'Admin published: "Install STREAMB4 on Firestick"' },
                { time: "1 hour ago", text: "New media uploaded: icon-badge-play.png" },
                { time: "3 hours ago", text: 'Draft updated: "Why Your Stream Buffers"' },
              ].map((act, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[10px] text-orange-500 font-bold uppercase">{act.time}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{act.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
