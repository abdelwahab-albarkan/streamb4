"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search, Menu, Command, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Label overrides for path segments ────────────────────────────────────────

const LABEL: Record<string, string> = {
  admin: "Admin",
  posts: "Blog Posts",
  "ai-writer": "AI Writer",
  media: "Media Library",
  categories: "Categories",
  tags: "Tags",
  settings: "Settings",
  analytics: "Analytics",
  seo: "SEO Center",
  publishing: "Publishing",
  performance: "Performance",
  users: "Users",
  logs: "Audit Logs",
  players: "IPTV Players",
  "search-console": "Search Console",
  new: "New",
};

function segLabel(seg: string): string {
  // Hide route groups like (admin), dynamic segments like [id]
  if (seg.startsWith("(") || seg.startsWith("[")) return "";
  return LABEL[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
}

// ─── Search overlay ────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "New Post",     href: "/admin/posts/new",   group: "Quick Actions" },
  { label: "AI Writer",    href: "/admin/ai-writer",   group: "Quick Actions" },
  { label: "Media Library",href: "/admin/media",       group: "Quick Actions" },
  { label: "Dashboard",    href: "/admin",             group: "Pages" },
  { label: "All Posts",    href: "/admin/posts",       group: "Pages" },
  { label: "Categories",   href: "/admin/categories",  group: "Pages" },
  { label: "Tags",         href: "/admin/tags",        group: "Pages" },
  { label: "Settings",     href: "/admin/settings",    group: "Pages" },
  { label: "Analytics",    href: "/admin/analytics",   group: "Pages" },
  { label: "SEO Center",   href: "/admin/seo",         group: "Pages" },
];

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = QUICK_LINKS.filter(l =>
    q.length === 0 || l.label.toLowerCase().includes(q.toLowerCase())
  );

  const groups = Array.from(new Set(filtered.map(l => l.group)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 64px rgba(0,0,0,0.8)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <Search size={16} className="text-gray-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
          />
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="py-2 max-h-72 overflow-y-auto">
          {groups.map(group => (
            <div key={group}>
              <div className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">{group}</div>
              {filtered.filter(l => l.group === group).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-600">No results for &quot;{q}&quot;</p>
          )}
        </div>

        {/* Hint */}
        <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center gap-4 text-[11px] text-gray-700">
          <span>↵ to navigate</span>
          <span>Esc to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main topbar ───────────────────────────────────────────────────────────────

export default function AdminTopbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments
    .map((seg, i) => ({ label: segLabel(seg), url: "/" + segments.slice(0, i + 1).join("/") }))
    .filter(b => b.label);

  return (
    <>
      <header
        className="h-14 flex items-center justify-between px-4 sm:px-6 border-b z-30 sticky top-0"
        style={{
          background: "rgba(8,8,8,0.92)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.04)",
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Hamburger (mobile) */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            aria-label="Toggle Menu"
          >
            <Menu size={15} />
          </button>

          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="hidden sm:flex items-center gap-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.url}>
                {idx > 0 && <span className="text-gray-800 text-xs">›</span>}
                <Link
                  href={crumb.url}
                  className={`text-xs font-semibold transition-colors ${
                    idx === breadcrumbs.length - 1
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center: ⌘K search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-400 transition-all group"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            width: 220,
          }}
          aria-label="Open search"
        >
          <Search size={13} className="flex-shrink-0" />
          <span className="flex-1 text-left">Search...</span>
          <span className="flex items-center gap-0.5 text-gray-700 group-hover:text-gray-500 transition-colors">
            <Command size={11} /><span className="text-[11px]">K</span>
          </span>
        </button>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Mobile search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Search size={14} />
          </button>

          {/* Notification bell */}
          <button
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            aria-label="Notifications"
          >
            <Bell size={14} />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF7A00", boxShadow: "0 0 6px rgba(255,122,0,0.8)" }}
            />
          </button>

          {/* Admin avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-black text-black text-[11px] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)" }}
            title="Admin"
          >
            A
          </div>

          {/* New Post CTA */}
          <Link
            href="/admin/posts/new"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black text-black tracking-wide uppercase transition-all hover:opacity-90 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg,#ff8a00,#ffb347)",
              boxShadow: "0 0 14px rgba(255,122,0,0.3)",
            }}
          >
            <Plus size={12} strokeWidth={3} />
            New Post
          </Link>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
