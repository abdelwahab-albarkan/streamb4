"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Pencil, Eye, Trash2, Plus, Search, ChevronUp, ChevronDown,
  FileText, Loader2, ArrowUpDown, CheckSquare, Square, Sparkles
} from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  featuredImage?: string;
  seoScore?: number;
  views?: number;
  createdAt?: string;
  publishedAt?: string;
  category?: string;
}

type SortKey = "title" | "status" | "seoScore" | "views" | "createdAt";

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  published: { background: "rgba(34,197,94,0.10)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.22)" },
  draft:     { background: "rgba(255,179,0,0.10)",  color: "#ffb300", border: "1px solid rgba(255,179,0,0.22)" },
  scheduled: { background: "rgba(59,130,246,0.10)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.22)" },
};

function SeoBar({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#ffb300" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

export default function PostsPage() {
  const { addToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/posts")
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = posts.filter(p => {
      const matchFilter = filter === "all" || p.status === filter;
      const matchSearch = (p.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.slug ?? "").toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

    list = [...list].sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      if (sortKey === "title")     { av = a.title ?? ""; bv = b.title ?? ""; }
      if (sortKey === "status")    { av = a.status ?? ""; bv = b.status ?? ""; }
      if (sortKey === "seoScore")  { av = a.seoScore ?? 0; bv = b.seoScore ?? 0; }
      if (sortKey === "views")     { av = a.views ?? 0; bv = b.views ?? 0; }
      if (sortKey === "createdAt") { av = a.publishedAt || a.createdAt || ""; bv = b.publishedAt || b.createdAt || ""; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [posts, filter, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={11} className="text-gray-700 ml-1 inline" />;
    return sortDir === "asc"
      ? <ChevronUp size={11} className="text-orange-500 ml-1 inline" />
      : <ChevronDown size={11} className="text-orange-500 ml-1 inline" />;
  };

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
        setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
        addToast("Post deleted", "info");
      } else {
        addToast("Failed to delete", "error");
      }
    } catch { addToast("Network error", "error"); }
    setDeleting(null);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} selected posts?`)) return;
    for (const id of Array.from(selected)) {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    }
    setPosts(prev => prev.filter(p => !selected.has(p.id)));
    setSelected(new Set());
    addToast(`${selected.size} posts deleted`, "info");
  };

  const counts = {
    all: posts.length,
    published: posts.filter(p => p.status === "published").length,
    draft: posts.filter(p => p.status === "draft").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-['Anton'] text-3xl text-white uppercase tracking-wide">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/ai-writer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Sparkles size={13} className="text-purple-400" />
            AI Writer
          </Link>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-black transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", boxShadow: "0 0 20px rgba(255,122,0,0.25)" }}
          >
            <Plus size={14} strokeWidth={3} />
            New Post
          </Link>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-gray-600"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "published", "draft", "scheduled"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
              style={filter === f ? {
                background: "linear-gradient(135deg,#ff8a00,#ffb347)",
                color: "#000",
              } : {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#666",
              }}
            >
              {f} <span className="opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(255,122,0,0.08)", border: "1px solid rgba(255,122,0,0.2)" }}
          >
            <span className="text-orange-400 text-sm font-bold">{selected.size} selected</span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/[0.1] transition-all cursor-pointer"
            >
              <Trash2 size={12} /> Delete Selected
            </button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-gray-600 hover:text-white text-xs transition-colors cursor-pointer">
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FileText size={36} className="text-gray-700" />
            <p className="text-white font-bold">{search ? "No posts match your search" : "No posts yet"}</p>
            <p className="text-gray-600 text-sm">
              {search ? "Try a different term" : "Create your first post to get started"}
            </p>
            <Link href="/admin/posts/new" className="mt-2 px-5 py-2.5 rounded-xl text-sm font-black text-black"
              style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)" }}>
              Create Post
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden md:table w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <th className="pl-5 pr-2 py-3.5 w-10">
                    <button onClick={toggleAll} className="text-gray-600 hover:text-orange-400 transition-colors cursor-pointer">
                      {allSelected ? <CheckSquare size={15} className="text-orange-500" /> : <Square size={15} />}
                    </button>
                  </th>
                  {([
                    { label: "Title",   key: "title" },
                    { label: "Status",  key: "status" },
                    { label: "SEO",     key: "seoScore" },
                    { label: "Views",   key: "views" },
                    { label: "Date",    key: "createdAt" },
                  ] as { label: string; key: SortKey }[]).map(col => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-gray-600 hover:text-gray-400 transition-colors cursor-pointer select-none"
                    >
                      {col.label}<SortIcon col={col.key} />
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, i) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                    className="group border-b hover:bg-white/[0.018] transition-colors duration-100"
                    style={{ borderColor: "rgba(255,255,255,0.03)" }}
                  >
                    {/* Checkbox */}
                    <td className="pl-5 pr-2 py-4 w-10">
                      <button onClick={() => toggleOne(post.id)} className="text-gray-600 hover:text-orange-400 transition-colors cursor-pointer">
                        {selected.has(post.id)
                          ? <CheckSquare size={14} className="text-orange-500" />
                          : <Square size={14} />}
                      </button>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4 max-w-[260px]">
                      <div className="flex items-center gap-3">
                        {post.featuredImage ? (
                          <img src={post.featuredImage} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,122,0,0.08)" }}>
                            <FileText size={14} className="text-orange-700" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white text-sm font-bold truncate group-hover:text-orange-50 transition-colors">
                            {post.title || "Untitled"}
                          </p>
                          <p className="text-gray-700 text-xs truncate mt-0.5 font-mono">/{post.slug || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={STATUS_STYLES[post.status] || STATUS_STYLES.draft}>
                        {post.status || "draft"}
                      </span>
                    </td>

                    {/* SEO */}
                    <td className="px-4 py-4">
                      <SeoBar score={post.seoScore ?? 0} />
                    </td>

                    {/* Views */}
                    <td className="px-4 py-4 text-gray-400 text-sm font-semibold">
                      {(post.views ?? 0).toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-gray-600 text-xs font-semibold whitespace-nowrap">
                      {post.publishedAt || post.createdAt
                        ? new Date(post.publishedAt || post.createdAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/posts/${post.id}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-orange-400 hover:bg-orange-500/[0.08] transition-all"
                          title="Edit">
                          <Pencil size={13} />
                        </Link>
                        <Link href={`/blog/${post.slug}`} target="_blank"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-500/[0.08] transition-all"
                          title="View live">
                          <Eye size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/[0.08] transition-all cursor-pointer disabled:opacity-40"
                          title="Delete"
                        >
                          {deleting === post.id
                            ? <Loader2 size={13} className="animate-spin" />
                            : <Trash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map(post => (
                <div key={post.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,122,0,0.07)" }}>
                          <FileText size={14} className="text-orange-700" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">{post.title || "Untitled"}</p>
                        <p className="text-gray-600 text-[11px] truncate mt-0.5">/{post.slug}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex-shrink-0"
                      style={STATUS_STYLES[post.status] || STATUS_STYLES.draft}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <SeoBar score={post.seoScore ?? 0} />
                      <span className="text-gray-600 text-xs">{(post.views ?? 0).toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/posts/${post.id}`} className="text-orange-500 text-xs font-bold">Edit</Link>
                      <Link href={`/blog/${post.slug}`} target="_blank" className="text-blue-400 text-xs font-bold">View</Link>
                      <button onClick={() => handleDelete(post.id)} disabled={deleting === post.id}
                        className="text-red-500 text-xs font-bold cursor-pointer disabled:opacity-40">
                        {deleting === post.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between text-gray-700 text-xs px-1">
          <span>Showing {filtered.length} of {posts.length} posts</span>
          <div className="flex items-center gap-4">
            <span style={{ color: "#22c55e" }}>✓ {counts.published} published</span>
            <span style={{ color: "#ffb300" }}>● {counts.draft} drafts</span>
            {counts.scheduled > 0 && <span style={{ color: "#60a5fa" }}>◷ {counts.scheduled} scheduled</span>}
          </div>
        </div>
      )}
    </div>
  );
}
