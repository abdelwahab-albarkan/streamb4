"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Plus, Pencil, Trash2, X, Check, Loader2, Tag, Search } from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount?: number;
}

const PRESET_COLORS = [
  "#FF7A00", "#22c55e", "#3b82f6", "#a855f7",
  "#ec4899", "#06b6d4", "#f59e0b", "#ef4444",
];

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESET_COLORS.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
          style={{ background: c, outline: value === c ? `2px solid ${c}` : "none", outlineOffset: 2 }}
        >
          {value === c && <Check size={12} className="text-white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}

function CategoryModal({
  category,
  onSave,
  onClose,
}: {
  category: Category | null;
  onSave: (data: Partial<Category>) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [color, setColor] = useState(category?.color ?? "#FF7A00");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!category);

  useEffect(() => {
    if (autoSlug) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [name, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ id: category?.id, name, slug, description, color });
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
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 64px rgba(0,0,0,0.8)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-black text-base">{category ? "Edit Category" : "New Category"}</h3>
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
              placeholder="e.g. IPTV Guides"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
            <input
              value={slug}
              onChange={e => { setSlug(e.target.value); setAutoSlug(false); }}
              placeholder="iptv-guides"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none font-mono focus:border-orange-500/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none focus:border-orange-500/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color</label>
            <ColorPicker value={color} onChange={setColor} />
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
              {category ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function CategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalCat, setModalCat] = useState<Category | null | "new">(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<Category>) => {
    const isNew = !data.id;
    try {
      const res = await fetch("/api/admin/categories", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        addToast(isNew ? "Category created!" : "Category updated!", "success");
        setModalCat(null);
        load();
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to save", "error");
      }
    } catch {
      addToast("Network error", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Posts using it won't be deleted.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast("Category deleted", "info");
        load();
      }
    } catch { addToast("Delete failed", "error"); }
    setDeleting(null);
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-['Anton'] text-3xl text-white uppercase tracking-wide">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            {categories.length} {categories.length === 1 ? "category" : "categories"} total
          </p>
        </div>
        <button
          onClick={() => setModalCat("new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-black transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", boxShadow: "0 0 20px rgba(255,122,0,0.25)" }}
        >
          <Plus size={15} strokeWidth={3} />
          New Category
        </button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        />
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-orange-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FolderOpen size={32} className="text-gray-700" />
            <p className="text-gray-600 text-sm font-semibold">
              {query ? "No categories match your search" : "No categories yet — create your first one"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_120px_120px_100px] px-5 py-3 border-b border-white/[0.04]">
              {["Name", "Slug", "Posts", "Actions"].map(h => (
                <span key={h} className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-700">{h}</span>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-[1fr_120px_120px_100px] px-5 py-4 items-center border-b border-white/[0.03] last:border-0 hover:bg-white/[0.015] transition-colors group"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color || "#FF7A00" }} />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-bold truncate">{cat.name}</p>
                      {cat.description && (
                        <p className="text-gray-600 text-xs truncate mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </div>
                  {/* Slug */}
                  <span className="text-gray-600 text-xs font-mono truncate">{cat.slug}</span>
                  {/* Posts */}
                  <span className="text-gray-400 text-sm font-bold">{cat.postCount ?? 0}</span>
                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setModalCat(cat)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deleting === cat.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/[0.08] transition-all cursor-pointer disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === cat.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalCat !== null && (
          <CategoryModal
            category={modalCat === "new" ? null : modalCat}
            onSave={handleSave}
            onClose={() => setModalCat(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
