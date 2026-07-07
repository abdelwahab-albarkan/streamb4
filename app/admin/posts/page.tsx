"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Pencil, Eye, Trash2, Plus, Search, ChevronUp, ChevronDown,
  FileText, Loader2, ArrowUpDown, CheckSquare, Square, Sparkles,
  MoreHorizontal, Globe, Monitor, BookOpen, RotateCcw, Copy,
  Share2, Download, ExternalLink, RefreshCw, Zap, X,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  // Platform fields
  devtoId?: number;
  devtoUrl?: string;
  devtoStatus?: string;
  devtoError?: string;
  bloggerPostId?: string;
  bloggerUrl?: string;
  bloggerStatus?: string;
  bloggerError?: string;
}

type SortKey = "title" | "status" | "seoScore" | "views" | "createdAt";
type Platform = "website" | "devto" | "blogger";

// Tracks which platforms are currently publishing for each post
type PublishingMap = Record<string, Set<Platform>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  published: { background: "rgba(34,197,94,0.10)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.22)" },
  draft:     { background: "rgba(255,179,0,0.10)",  color: "#ffb300", border: "1px solid rgba(255,179,0,0.22)" },
  scheduled: { background: "rgba(59,130,246,0.10)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.22)" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Platform Status Dots ─────────────────────────────────────────────────────

interface PlatformDotProps {
  label:      string;
  icon:       React.ElementType;
  status:     string;    // 'published' | 'failed' | 'pending' | ''
  url?:       string;
  error?:     string;
  loading?:   boolean;
}

function PlatformDot({ label, icon: Icon, status, url, error, loading }: PlatformDotProps) {
  const [showTip, setShowTip] = useState(false);

  const color = loading ? "#ff8a00"
    : status === "published" ? "#22c55e"
    : status === "failed"    ? "#ef4444"
    : "#333";

  const bg = loading ? "rgba(255,138,0,0.12)"
    : status === "published" ? "rgba(34,197,94,0.10)"
    : status === "failed"    ? "rgba(239,68,68,0.10)"
    : "rgba(255,255,255,0.04)";

  const tip = loading ? `Publishing to ${label}…`
    : status === "published" ? `${label}: Published`
    : status === "failed"    ? `${label}: Failed — ${error || "Unknown error"}`
    : `${label}: Not published`;

  return (
    <div className="relative" onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
      {url && status === "published" && !loading ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:scale-110"
          style={{ background: bg, border: `1px solid ${color}30` }}
        >
          {loading
            ? <Loader2 size={10} className="animate-spin" style={{ color }}  />
            : <Icon size={10} style={{ color }} />
          }
        </a>
      ) : (
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: bg, border: `1px solid ${color}30` }}
        >
          {loading
            ? <Loader2 size={10} className="animate-spin" style={{ color }} />
            : <Icon size={10} style={{ color }} />
          }
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap text-white"
              style={{ background: "rgba(10,10,10,0.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
            >
              {tip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[rgba(10,10,10,0.97)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlatformsCell({ post, publishing }: { post: Post; publishing: Set<Platform> }) {
  const websitePublished = post.status === "published";
  return (
    <div className="flex items-center gap-1.5">
      <PlatformDot
        label="Website"
        icon={Globe}
        status={websitePublished ? "published" : ""}
        url={websitePublished ? `https://streamb4.com/blog/${post.slug}` : undefined}
        loading={publishing.has("website")}
      />
      <PlatformDot
        label="DEV.to"
        icon={Monitor}
        status={post.devtoStatus === "published" ? "published" : post.devtoStatus === "failed" ? "failed" : ""}
        url={post.devtoUrl}
        error={post.devtoError}
        loading={publishing.has("devto")}
      />
      <PlatformDot
        label="Blogger"
        icon={BookOpen}
        status={post.bloggerStatus === "published" ? "published" : post.bloggerStatus === "failed" ? "failed" : ""}
        url={post.bloggerUrl}
        error={post.bloggerError}
        loading={publishing.has("blogger")}
      />
    </div>
  );
}

// ─── More Menu ───────────────────────────────────────────────────────────────

interface MenuAction {
  label:    string;
  icon:     React.ElementType;
  onClick:  () => void;
  color?:   string;
  disabled?: boolean;
  loading?: boolean;
  divider?: boolean;
}

function MoreMenu({
  post,
  publishing,
  onPublish,
  onDelete,
}: {
  post:       Post;
  publishing: Set<Platform>;
  onPublish:  (postId: string, platforms: Platform[]) => void;
  onDelete:   (postId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);
  const { addToast }    = useToast();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isPublishing = publishing.size > 0;

  // Determine which platforms have failed
  const failedPlatforms: Platform[] = [
    ...(post.devtoStatus    === "failed" ? ["devto"   as Platform] : []),
    ...(post.bloggerStatus  === "failed" ? ["blogger" as Platform] : []),
  ];

  const hasFailures = failedPlatforms.length > 0;

  const close = (fn: () => void) => () => { setOpen(false); fn(); };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://streamb4.com/blog/${post.slug}`);
    addToast("URL copied to clipboard", "success");
  };

  const handleShare = () => {
    const url = `https://streamb4.com/blog/${post.slug}`;
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      addToast("URL copied (Web Share not supported on this device)", "info");
    }
  };

  const handleExportMarkdown = async () => {
    try {
      const res  = await fetch(`/api/admin/posts/${post.id}`);
      const data = await res.json();
      const content = data.post?.content ?? data.content ?? "";
      const md = `# ${post.title}\n\n${content}`;
      const blob = new Blob([md], { type: "text/markdown" });
      const a    = document.createElement("a");
      a.href     = URL.createObjectURL(blob);
      a.download = `${post.slug || post.id}.md`;
      a.click();
      URL.revokeObjectURL(a.href);
      addToast("Exported as Markdown", "success");
    } catch {
      addToast("Export failed", "error");
    }
  };

  const handleDuplicate = async () => {
    try {
      const res  = await fetch(`/api/admin/posts/${post.id}`);
      const data = await res.json();
      const src  = data.post ?? data;
      const newPost = {
        ...src,
        id:        String(Date.now()),
        title:     `${src.title} (Copy)`,
        slug:      `${src.slug}-copy-${Date.now()}`,
        status:    "draft",
        publishedAt: "",
        devtoId: undefined, devtoUrl: "", devtoStatus: "", devtoError: "",
        bloggerPostId: "", bloggerUrl: "", bloggerStatus: "", bloggerError: "",
        createdAt: new Date().toISOString(),
        views: 0,
      };
      const postRes = await fetch("/api/admin/posts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(newPost),
      });
      if (postRes.ok) addToast("Post duplicated as draft", "success");
      else            addToast("Duplicate failed", "error");
    } catch {
      addToast("Duplicate failed", "error");
    }
  };

  const actions: (MenuAction | { divider: true })[] = [
    // ── Edit / View ──────────────────────────────────────
    {
      label: "Edit",
      icon:  Pencil,
      onClick: close(() => { window.location.href = `/admin/posts/${post.id}`; }),
    },
    {
      label: "Preview",
      icon:  Eye,
      onClick: close(() => { window.open(`/admin/posts/${post.id}?preview=1`, "_blank"); }),
    },
    {
      label: "Open Live",
      icon:  ExternalLink,
      onClick: close(() => { window.open(`/blog/${post.slug}`, "_blank"); }),
      disabled: post.status !== "published",
    },
    { divider: true },
    // ── Publish ──────────────────────────────────────────
    {
      label:    "Publish Website",
      icon:     Globe,
      onClick:  close(() => onPublish(post.id, ["website"])),
      loading:  publishing.has("website"),
      disabled: isPublishing,
    },
    {
      label:    "Publish DEV.to",
      icon:     Monitor,
      onClick:  close(() => onPublish(post.id, ["devto"])),
      color:    "#818cf8",
      loading:  publishing.has("devto"),
      disabled: isPublishing,
    },
    {
      label:    "Publish Blogger",
      icon:     BookOpen,
      onClick:  close(() => onPublish(post.id, ["blogger"])),
      color:    "#f97316",
      loading:  publishing.has("blogger"),
      disabled: isPublishing,
    },
    {
      label:    "Publish Everywhere",
      icon:     Zap,
      onClick:  close(() => onPublish(post.id, ["website", "devto", "blogger"])),
      color:    "#FF7A00",
      loading:  isPublishing && publishing.size === 3,
      disabled: isPublishing,
    },
    ...(hasFailures ? [{
      label:   "Retry Failed",
      icon:    RotateCcw,
      onClick: close(() => onPublish(post.id, failedPlatforms)),
      color:   "#ef4444",
      disabled: isPublishing,
    } as MenuAction] : []),
    {
      label:   "Sync Platforms",
      icon:    RefreshCw,
      onClick: close(() => {
        // Sync = update all platforms that already have a platformId
        const toSync: Platform[] = ["website"];
        if (post.devtoId)       toSync.push("devto");
        if (post.bloggerPostId) toSync.push("blogger");
        onPublish(post.id, toSync);
      }),
      disabled: isPublishing,
    },
    { divider: true },
    // ── Utilities ────────────────────────────────────────
    {
      label:   "Copy URL",
      icon:    Copy,
      onClick: close(handleCopyUrl),
    },
    {
      label:   "Share",
      icon:    Share2,
      onClick: close(handleShare),
    },
    {
      label:   "Duplicate Post",
      icon:    FileText,
      onClick: close(handleDuplicate),
    },
    {
      label:   "Export Markdown",
      icon:    Download,
      onClick: close(handleExportMarkdown),
    },
    { divider: true },
    // ── Danger ───────────────────────────────────────────
    {
      label:   "Delete",
      icon:    Trash2,
      onClick: close(() => onDelete(post.id)),
      color:   "#ef4444",
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
        title="More actions"
        aria-label="More actions"
        aria-expanded={open}
      >
        {isPublishing
          ? <Loader2 size={13} className="animate-spin text-orange-500" />
          : <MoreHorizontal size={13} />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: -4  }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl overflow-hidden"
            style={{
              background:   "rgba(12,12,12,0.98)",
              border:       "1px solid rgba(255,255,255,0.1)",
              boxShadow:    "0 20px 48px rgba(0,0,0,0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="py-1.5">
              {actions.map((item, i) => {
                if ("divider" in item && item.divider) {
                  return <div key={`div-${i}`} className="my-1.5 border-t border-white/[0.05]" />;
                }
                const action = item as MenuAction;
                const Icon   = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={action.disabled ? undefined : action.onClick}
                    disabled={action.disabled || action.loading}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      color: action.color ?? "#999",
                    }}
                    onMouseEnter={e => {
                      if (!action.disabled) (e.currentTarget as HTMLElement).style.background = action.color
                        ? `${action.color}12`
                        : "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {action.loading
                      ? <Loader2 size={12} className="animate-spin flex-shrink-0" style={{ color: action.color ?? "#666" }} />
                      : <Icon size={12} className="flex-shrink-0" style={{ color: action.color ?? "#666" }} />
                    }
                    <span style={{ color: action.color ? undefined : "#ccc" }}>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostsPage() {
  const { addToast } = useToast();

  const [posts,      setPosts]      = useState<Post[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");
  const [sortKey,    setSortKey]    = useState<SortKey>("createdAt");
  const [sortDir,    setSortDir]    = useState<"asc" | "desc">("desc");
  const [selected,   setSelected]   = useState<Set<string>>(new Set());
  const [deleting,   setDeleting]   = useState<string | null>(null);
  // publishingMap: postId → Set of platforms currently in-flight
  const [publishingMap, setPublishingMap] = useState<PublishingMap>({});

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/posts")
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Publishing ─────────────────────────────────────────────────────────────

  const handlePublish = useCallback(async (postId: string, platforms: Platform[]) => {
    // Mark platforms as in-flight
    setPublishingMap(prev => ({
      ...prev,
      [postId]: new Set([...(prev[postId] ?? []), ...platforms]),
    }));

    const platformLabel = platforms.length === 1
      ? platforms[0]
      : platforms.length === 3 ? "everywhere" : platforms.join(" + ");

    try {
      const res  = await fetch("/api/admin/publish/orchestrate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          postId,
          platforms,
          updateRss:           platforms.includes("website"),
          updateSitemap:       platforms.includes("website"),
          notifySearchEngines: platforms.includes("website"),
          pingIndexNow:        platforms.includes("website"),
          generateOpenGraph:   platforms.includes("website"),
          generateTwitterCard: platforms.includes("website"),
        }),
      });

      const data = await res.json();
      const results: Array<{ platform: string; success: boolean; skipped?: boolean; url?: string; error?: string }> =
        data.results ?? [];

      // Refresh the single row from the server
      const rowRes  = await fetch(`/api/admin/posts/${postId}`);
      const rowData = await rowRes.json();
      const updated = rowData.post ?? rowData;

      if (updated?.id) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updated } : p));
      }

      // Toast per platform
      const successes = results.filter(r => r.success);
      const failures  = results.filter(r => !r.success && !r.skipped);
      const skipped   = results.filter(r => r.skipped);

      if (failures.length === 0 && successes.length > 0) {
        addToast(`Published to ${platformLabel} ✓`, "success");
      } else if (successes.length > 0 && failures.length > 0) {
        addToast(
          `${successes.length} succeeded, ${failures.length} failed: ${failures.map(f => f.platform).join(", ")}`,
          "info",
        );
      } else if (failures.length > 0) {
        addToast(`Failed: ${failures.map(f => `${f.platform} — ${f.error ?? "error"}`).join("; ")}`, "error");
      } else if (skipped.length > 0) {
        addToast(`Skipped (not configured): ${skipped.map(s => s.platform).join(", ")}`, "info");
      }
    } catch (err) {
      addToast(`Publish failed: ${String(err)}`, "error");
    } finally {
      // Clear in-flight flags for this post's platforms
      setPublishingMap(prev => {
        const next = { ...prev };
        if (next[postId]) {
          platforms.forEach(p => next[postId].delete(p));
          if (next[postId].size === 0) delete next[postId];
        }
        return next;
      });
    }
  }, [addToast]);

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = useCallback(async (id: string) => {
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
  }, [addToast]);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} selected posts?`)) return;
    for (const id of Array.from(selected)) {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    }
    setPosts(prev => prev.filter(p => !selected.has(p.id)));
    setSelected(new Set());
    addToast(`${selected.size} posts deleted`, "info");
  };

  // ── Sorting / filtering ────────────────────────────────────────────────────

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
      if (sortKey === "title")     { av = a.title    ?? ""; bv = b.title    ?? ""; }
      if (sortKey === "status")    { av = a.status   ?? ""; bv = b.status   ?? ""; }
      if (sortKey === "seoScore")  { av = a.seoScore ?? 0;  bv = b.seoScore ?? 0; }
      if (sortKey === "views")     { av = a.views    ?? 0;  bv = b.views    ?? 0; }
      if (sortKey === "createdAt") { av = a.publishedAt || a.createdAt || ""; bv = b.publishedAt || b.createdAt || ""; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
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
      ? <ChevronUp   size={11} className="text-orange-500 ml-1 inline" />
      : <ChevronDown size={11} className="text-orange-500 ml-1 inline" />;
  };

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));
  const toggleAll   = () => allSelected
    ? setSelected(new Set())
    : setSelected(new Set(filtered.map(p => p.id)));
  const toggleOne   = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const counts = {
    all:       posts.length,
    published: posts.filter(p => p.status === "published").length,
    draft:     posts.filter(p => p.status === "draft").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
  };

  // ── Render ─────────────────────────────────────────────────────────────────

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
            <button
              onClick={() => setSelected(new Set())}
              className="ml-auto text-gray-600 hover:text-white text-xs transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
      >
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
            {/* ── Desktop table ─────────────────────────────────────── */}
            <table className="hidden md:table w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {/* Checkbox */}
                  <th className="pl-5 pr-2 py-3.5 w-10">
                    <button onClick={toggleAll} className="text-gray-600 hover:text-orange-400 transition-colors cursor-pointer">
                      {allSelected
                        ? <CheckSquare size={15} className="text-orange-500" />
                        : <Square size={15} />}
                    </button>
                  </th>
                  {/* Sortable columns */}
                  {([
                    { label: "Title",  key: "title"     },
                    { label: "Status", key: "status"    },
                    { label: "SEO",    key: "seoScore"  },
                    { label: "Views",  key: "views"     },
                    { label: "Date",   key: "createdAt" },
                  ] as { label: string; key: SortKey }[]).map(col => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-gray-600 hover:text-gray-400 transition-colors cursor-pointer select-none"
                    >
                      {col.label}<SortIcon col={col.key} />
                    </th>
                  ))}
                  {/* New: Platforms */}
                  <th className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-gray-700">
                    Platforms
                  </th>
                  {/* Actions */}
                  <th className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-gray-700 w-14">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, i) => {
                  const publishing = publishingMap[post.id] ?? new Set<Platform>();
                  return (
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
                      <td className="px-4 py-4 max-w-[240px]">
                        <div className="flex items-center gap-3">
                          {post.featuredImage ? (
                            <img
                              src={post.featuredImage} alt=""
                              className="w-9 h-9 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                              style={{ background: "rgba(255,122,0,0.08)" }}>
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
                          ? new Date(post.publishedAt || post.createdAt!).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Platforms */}
                      <td className="px-4 py-4">
                        <PlatformsCell post={post} publishing={publishing} />
                      </td>

                      {/* Actions — More menu */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreMenu
                            post={post}
                            publishing={publishing}
                            onPublish={handlePublish}
                            onDelete={handleDelete}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {/* ── Mobile cards ──────────────────────────────────────── */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map(post => {
                const publishing = publishingMap[post.id] ?? new Set<Platform>();
                return (
                  <div key={post.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {post.featuredImage ? (
                          <img src={post.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                            style={{ background: "rgba(255,122,0,0.07)" }}>
                            <FileText size={14} className="text-orange-700" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm truncate">{post.title || "Untitled"}</p>
                          <p className="text-gray-600 text-[11px] truncate mt-0.5">/{post.slug}</p>
                        </div>
                      </div>

                      {/* Mobile More menu */}
                      <MoreMenu
                        post={post}
                        publishing={publishing}
                        onPublish={handlePublish}
                        onDelete={handleDelete}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <SeoBar score={post.seoScore ?? 0} />
                        <span className="text-gray-600 text-xs">{(post.views ?? 0).toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase"
                          style={STATUS_STYLES[post.status] || STATUS_STYLES.draft}>
                          {post.status}
                        </span>
                        <PlatformsCell post={post} publishing={publishing} />
                      </div>
                    </div>
                  </div>
                );
              })}
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
