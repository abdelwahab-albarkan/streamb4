"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Pencil, Trash2, X, Check, Loader2, Search } from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color?: string;
  postCount?: number;
}

const PRESET_COLORS = [
  "#6366f1", "#FF7A00", "#22c55e", "#3b82f6",
  "#a855f7", "#ec4899", "#06b6d4", "#f59e0b",
];

function TagModal({
  tag,
  onSave,
  onClose,
}: {
  tag: TagItem | null;
  onSave: (data: Partial<TagItem>) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(tag?.name ?? "");
  const [slug, setSlug] = useState(tag?.slug ?? "");
  const [color, setColor] = useState(tag?.color ?? "#6366f1");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!tag);

  useEffect(() => {
    if (autoSlug) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [name, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ id: tag?.id, name, slug, color });
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 64px rgba(0,0,0,0.8)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-black text-base">{tag ? "Edit Tag" : "New Tag"}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Streaming"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
            <input
              value={slug}
              onChange={e => { setSlug(e.target.value); setAutoSlug(false); }}
              placeholder="streaming"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none font-mono"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ background: c, outline: color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }}
                >
                  {color === c && <Check size={11} className="text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-black text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
              {tag ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function TagsPage() {
  const { addToast } = useToast();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalTag, setModalTag] = useState<TagItem | null | "new">(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags");
      if (res.ok) {
        const data = await res.json();
        setTags(data.tags || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<TagItem>) => {
    const isNew = !data.id;
    try {
      const res = await fetch("/api/admin/tags", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        addToast(isNew ? "Tag created!" : "Tag updated!", "success");
        setModalTag(null);
        load();
      } else {
        const err = await res.json();
        addToast(err.error || "Failed", "error");
      }
    } catch { addToast("Network error", "error"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete tag "${name}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/tags?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast("Tag deleted", "info");
        load();
      }
    } catch { addToast("Delete failed", "error"); }
    setDeleting(null);
  };

  const filtered = tags.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-['Anton'] text-3xl text-white uppercase tracking-wide">Tags</h1>
          <p className="text-gray-500 text-sm mt-1">
            {tags.length} {tags.length === 1 ? "tag" : "tags"} total
          </p>
        </div>
        <button
          onClick={() => setModalTag("new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-black transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", boxShadow: "0 0 20px rgba(255,122,0,0.25)" }}
        >
          <Plus size={15} strokeWidth={3} />
          New Tag
        </button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tags..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        />
      </div>

      {/* Tag cloud preview */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <span
              key={t.id}
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: `${t.color || "#6366f1"}18`,
                color: t.color || "#6366f1",
                border: `1px solid ${t.color || "#6366f1"}40`,
              }}
            >
              #{t.name}
              {(t.postCount ?? 0) > 0 && (
                <span className="ml-1.5 opacity-60">{t.postCount}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin text-orange-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Tag size={28} className="text-gray-700" />
            <p className="text-gray-600 text-sm font-semibold">
              {query ? "No tags match your search" : "No tags yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_120px_80px_80px] px-5 py-3 border-b border-white/[0.04]">
              {["Name", "Slug", "Posts", "Actions"].map(h => (
                <span key={h} className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-700">{h}</span>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {filtered.map(tag => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-[1fr_120px_80px_80px] px-5 py-3.5 items-center border-b border-white/[0.03] last:border-0 hover:bg-white/[0.015] transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: `${tag.color || "#6366f1"}15`,
                        color: tag.color || "#6366f1",
                        border: `1px solid ${tag.color || "#6366f1"}30`,
                      }}
                    >
                      #{tag.name}
                    </span>
                  </div>
                  <span className="text-gray-600 text-xs font-mono truncate">{tag.slug}</span>
                  <span className="text-gray-400 text-sm font-bold">{tag.postCount ?? 0}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setModalTag(tag)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id, tag.name)}
                      disabled={deleting === tag.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/[0.08] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {deleting === tag.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence>
        {modalTag !== null && (
          <TagModal
            tag={modalTag === "new" ? null : modalTag}
            onSave={handleSave}
            onClose={() => setModalTag(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
