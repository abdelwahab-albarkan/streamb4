"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Upload, Search, ChevronLeft, ChevronRight, RefreshCw,
  Loader2, Calendar, Globe, Tag, Zap, FileText, Trash2,
  BarChart2, BookOpen, Target, Clock,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";
import type { CalendarTopic, CalendarMeta, CalendarStats } from "@/lib/types/content-calendar";
import { computeStats } from "@/lib/types/content-calendar";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const STATUSES  = ["Pending","In Progress","Generated","Published","Skipped"];
const PRIORITIES = ["High","Medium","Low"];
const PER_PAGE  = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 238));
}

function priorityColor(p: string): { bg: string; color: string } {
  const lp = (p ?? "").toLowerCase();
  if (lp === "high")   return { bg: "rgba(239,68,68,0.12)",   color: "#ef4444" };
  if (lp === "medium") return { bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" };
  if (lp === "low")    return { bg: "rgba(99,102,241,0.12)",  color: "#818cf8" };
  return { bg: "rgba(255,255,255,0.04)", color: "#666" };
}

function statusColor(s: string): { bg: string; color: string } {
  const ls = (s ?? "").toLowerCase();
  if (ls === "published")   return { bg: "rgba(34,197,94,0.10)",  color: "#22c55e" };
  if (ls === "generated")   return { bg: "rgba(99,102,241,0.10)", color: "#818cf8" };
  if (ls === "in progress") return { bg: "rgba(245,158,11,0.10)", color: "#f59e0b" };
  if (ls === "skipped")     return { bg: "rgba(255,255,255,0.04)",color: "#555"   };
  return { bg: "rgba(255,255,255,0.04)", color: "#888" }; // Pending
}

function difficultyColor(d: string): string {
  const ld = (d ?? "").toLowerCase();
  if (ld === "hard")   return "#ef4444";
  if (ld === "medium") return "#f59e0b";
  return "#22c55e";
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center px-3 py-2 rounded-xl min-w-[64px]"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="font-black text-lg" style={{ color }}>{value}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">{label}</span>
    </div>
  );
}

// ─── Filter Select ────────────────────────────────────────────────────────────

function FilterSelect({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 focus:outline-none transition-colors cursor-pointer"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", minWidth: 90 }}
      title={label}
      aria-label={label}
    >
      <option value="">{label}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Topic Card ───────────────────────────────────────────────────────────────

function TopicCard({
  topic,
  onGenerate,
  generating,
}: {
  topic:      CalendarTopic;
  onGenerate: (t: CalendarTopic) => void;
  generating: boolean;
}) {
  const pc = priorityColor(topic.priority);
  const sc = statusColor(topic.status);
  const rt = readingTime(topic.wordCount);

  const isPublished = (topic.status ?? "").toLowerCase() === "published";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col rounded-2xl overflow-hidden transition-colors"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 flex-1">
        {/* Top badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          {topic.priority && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
              style={{ background: pc.bg, color: pc.color }}>
              {topic.priority}
            </span>
          )}
          {topic.status && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
              style={{ background: sc.bg, color: sc.color }}>
              {topic.status}
            </span>
          )}
          {topic.country && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-500"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Globe size={8} />{topic.country}
            </span>
          )}
          {topic.month && topic.week && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-600"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <Calendar size={8} />{topic.month} W{topic.week}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white text-sm font-bold leading-snug mb-2 line-clamp-2">
          {topic.blogTitle || topic.topic || "Untitled"}
        </h3>

        {/* Primary keyword */}
        {topic.primaryKeyword && (
          <div className="flex items-center gap-1.5 mb-3">
            <Target size={10} className="text-orange-500 flex-shrink-0" />
            <span className="text-orange-400 text-[11px] font-semibold truncate">{topic.primaryKeyword}</span>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-600">
          {topic.category && (
            <span className="flex items-center gap-1">
              <BookOpen size={9} />{topic.category}
            </span>
          )}
          {topic.cluster && (
            <span className="flex items-center gap-1">
              <Tag size={9} />{topic.cluster}
            </span>
          )}
          {topic.searchIntent && (
            <span className="flex items-center gap-1">
              <Zap size={9} />{topic.searchIntent}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px]">
          {topic.difficulty && (
            <span className="font-semibold" style={{ color: difficultyColor(topic.difficulty) }}>
              ● {topic.difficulty}
            </span>
          )}
          <span className="text-gray-600 flex items-center gap-1">
            <FileText size={9} />{topic.wordCount.toLocaleString()} words
          </span>
          <span className="text-gray-600 flex items-center gap-1">
            <Clock size={9} />{rt} min read
          </span>
        </div>

        {/* Notes preview */}
        {topic.notes && (
          <p className="mt-2 text-[10px] text-gray-600 line-clamp-1 italic">{topic.notes}</p>
        )}
      </div>

      {/* Card footer */}
      <div className="px-4 pb-4 pt-3 border-t border-white/[0.04]">
        <button
          onClick={() => onGenerate(topic)}
          disabled={generating || isPublished}
          className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={isPublished
            ? { background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }
            : { background: "linear-gradient(135deg,#FF7A00,#ffb300)", color: "#000" }
          }
        >
          {generating
            ? <span className="flex items-center justify-center gap-1.5"><Loader2 size={11} className="animate-spin" />Loading…</span>
            : isPublished ? "✓ Published" : "⚡ Generate Article"
          }
        </button>
      </div>
    </motion.div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────

function UploadZone({ onUpload, loading }: { onUpload: (file: File) => void; loading: boolean }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-20 rounded-2xl transition-all cursor-pointer"
      style={{
        border: `2px dashed ${dragging ? "rgba(255,122,0,0.5)" : "rgba(255,255,255,0.1)"}`,
        background: dragging ? "rgba(255,122,0,0.04)" : "rgba(255,255,255,0.01)",
      }}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(255,122,0,0.08)", border: "1px solid rgba(255,122,0,0.15)" }}>
        {loading
          ? <Loader2 size={28} className="animate-spin text-orange-500" />
          : <Upload size={28} className="text-orange-500" />
        }
      </div>
      <div className="text-center">
        <p className="text-white font-bold">{loading ? "Parsing Excel…" : "Upload Content Calendar"}</p>
        <p className="text-gray-500 text-sm mt-1">{loading ? "Building topic index…" : "Drop your .xlsx, .xls or .csv file here"}</p>
        {!loading && <p className="text-gray-700 text-xs mt-2">or click to browse</p>}
      </div>
    </div>
  );
}

// ─── Main CalendarModal ───────────────────────────────────────────────────────

interface CalendarModalProps {
  open:       boolean;
  onClose:    () => void;
  onSelect:   (topic: CalendarTopic) => void;
}

export default function CalendarModal({ open, onClose, onSelect }: CalendarModalProps) {
  const { addToast } = useToast();

  const [topics,       setTopics]       = useState<CalendarTopic[]>([]);
  const [meta,         setMeta]         = useState<CalendarMeta | null>(null);
  const [stats,        setStats]        = useState<CalendarStats | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Filters
  const [search,   setSearch]   = useState("");
  const [fMonth,   setFMonth]   = useState("");
  const [fWeek,    setFWeek]    = useState("");
  const [fStatus,  setFStatus]  = useState("");
  const [fPrio,    setFPrio]    = useState("");
  const [fCountry, setFCountry] = useState("");
  const [fCat,     setFCat]     = useState("");
  const [page,     setPage]     = useState(1);

  // ── Load ──────────────────────────────────────────────────────────────────

  const loadTopics = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/content-calendar");
      const data = await res.json();
      if (data.success) {
        setTopics(data.topics ?? []);
        setMeta(data.metadata ?? null);
        setStats(computeStats(data.topics ?? []));
      }
    } catch { addToast("Failed to load calendar", "error"); }
    setLoading(false);
  }, [addToast]);

  useEffect(() => {
    if (open) { loadTopics(); setPage(1); }
  }, [open, loadTopics]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Upload ─────────────────────────────────────────────────────────────────

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/admin/content-calendar", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setTopics(data.topics ?? []);
        setMeta(data.metadata ?? null);
        setStats(computeStats(data.topics ?? []));
        addToast(`Loaded ${data.count} topics from ${file.name}`, "success");
      } else {
        addToast(data.error ?? "Upload failed", "error");
      }
    } catch { addToast("Upload failed", "error"); }
    setUploading(false);
  };

  // ── Clear ──────────────────────────────────────────────────────────────────

  const handleClear = async () => {
    if (!confirm("Remove all imported calendar data?")) return;
    try {
      await fetch("/api/admin/content-calendar", { method: "DELETE" });
      setTopics([]); setMeta(null); setStats(null);
      addToast("Calendar data cleared", "info");
    } catch { addToast("Clear failed", "error"); }
  };

  // ── Generate → pass to AI Writer ──────────────────────────────────────────

  const handleGenerate = (topic: CalendarTopic) => {
    setGeneratingId(topic._id);
    onSelect(topic);
    onClose();
  };

  // ── Filtered / paginated topics ────────────────────────────────────────────

  const filtered = topics.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || [t.blogTitle, t.topic, t.primaryKeyword, t.category, t.cluster]
      .some(v => v?.toLowerCase().includes(q));
    const matchMonth   = !fMonth   || (t.month ?? "").toLowerCase() === fMonth.toLowerCase();
    const matchWeek    = !fWeek    || String(t.week) === fWeek || t.week === `Week ${fWeek}` || t.week === `W${fWeek}`;
    const matchStatus  = !fStatus  || (t.status ?? "").toLowerCase() === fStatus.toLowerCase();
    const matchPrio    = !fPrio    || (t.priority ?? "").toLowerCase() === fPrio.toLowerCase();
    const matchCountry = !fCountry || (t.country ?? "").toLowerCase().includes(fCountry.toLowerCase());
    const matchCat     = !fCat     || (t.category ?? "").toLowerCase().includes(fCat.toLowerCase());
    return matchSearch && matchMonth && matchWeek && matchStatus && matchPrio && matchCountry && matchCat;
  });

  const pages    = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Unique values for filter dropdowns
  const weeks     = [...new Set(topics.map(t => String(t.week).replace(/[^\d]/g, "")).filter(Boolean))].sort((a,b) => Number(a)-Number(b));
  const countries = [...new Set(topics.map(t => t.country).filter(Boolean))].sort();
  const cats      = [...new Set(topics.map(t => t.category).filter(Boolean))].sort();

  const resetFilters = () => {
    setSearch(""); setFMonth(""); setFWeek(""); setFStatus("");
    setFPrio(""); setFCountry(""); setFCat(""); setPage(1);
  };

  const hasFilter = search || fMonth || fWeek || fStatus || fPrio || fCountry || fCat;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.97, y: 16  }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed inset-4 sm:inset-6 lg:inset-10 z-50 flex flex-col rounded-2xl overflow-hidden"
            style={{
              background:   "rgba(8,8,8,0.98)",
              border:       "1px solid rgba(255,255,255,0.08)",
              boxShadow:    "0 32px 80px rgba(0,0,0,0.9)",
            }}
          >
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,122,0,0.1)", border: "1px solid rgba(255,122,0,0.2)" }}>
                  <Calendar size={15} className="text-orange-500" />
                </div>
                <div>
                  <h2 className="text-white font-black text-sm uppercase tracking-wide">Content Calendar</h2>
                  {meta && (
                    <p className="text-gray-600 text-[10px] mt-0.5">
                      {meta.fileName} · {meta.count} topics · uploaded {new Date(meta.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {topics.length > 0 && (
                  <>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                      title="Re-upload Excel file">
                      <Upload size={11} />
                      <span className="hidden sm:inline">Re-upload</span>
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden"
                        onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                    </label>
                    <button onClick={loadTopics}
                      className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-600 hover:text-white transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }} title="Refresh">
                      <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={handleClear}
                      className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-600 hover:text-red-400 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }} title="Clear calendar data">
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
                <button onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-600 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ── Stats bar ─────────────────────────────────────────────── */}
            {stats && topics.length > 0 && (
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04] flex-shrink-0 overflow-x-auto">
                <BarChart2 size={12} className="text-gray-600 flex-shrink-0" />
                <StatPill label="Total"      value={stats.total}              color="#aaa"     />
                <StatPill label="Pending"    value={stats.pending}            color="#888"     />
                <StatPill label="In Progress"value={stats.inProgress}         color="#f59e0b"  />
                <StatPill label="Generated"  value={stats.generated}          color="#818cf8"  />
                <StatPill label="Published"  value={stats.published}          color="#22c55e"  />
                <div className="h-8 w-px bg-white/[0.06] mx-1 flex-shrink-0" />
                <StatPill label="This Week"  value={stats.remainingThisWeek}  color="#FF7A00"  />
                <StatPill label="This Month" value={stats.remainingThisMonth} color="#ff4d4d"  />

                {/* Progress bar */}
                <div className="flex-1 ml-2 min-w-[80px]">
                  <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg,#FF7A00,#22c55e)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? ((stats.generated + stats.published) / stats.total) * 100 : 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-600 mt-0.5 text-right">
                    {stats.total > 0 ? Math.round(((stats.generated + stats.published) / stats.total) * 100) : 0}% complete
                  </p>
                </div>
              </div>
            )}

            {/* ── Filter bar ────────────────────────────────────────────── */}
            {topics.length > 0 && (
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04] flex-shrink-0 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[160px]">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search topics, keywords…"
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  />
                </div>

                <FilterSelect label="Month"    value={fMonth}   onChange={v => { setFMonth(v);   setPage(1); }} options={MONTHS} />
                <FilterSelect label="Week"     value={fWeek}    onChange={v => { setFWeek(v);    setPage(1); }} options={weeks} />
                <FilterSelect label="Status"   value={fStatus}  onChange={v => { setFStatus(v);  setPage(1); }} options={STATUSES} />
                <FilterSelect label="Priority" value={fPrio}    onChange={v => { setFPrio(v);    setPage(1); }} options={PRIORITIES} />
                <FilterSelect label="Country"  value={fCountry} onChange={v => { setFCountry(v); setPage(1); }} options={countries} />
                <FilterSelect label="Category" value={fCat}     onChange={v => { setFCat(v);     setPage(1); }} options={cats} />

                {hasFilter && (
                  <button onClick={resetFilters}
                    className="px-3 py-2 rounded-xl text-[10px] font-bold text-gray-500 hover:text-orange-400 transition-colors whitespace-nowrap cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    Clear filters
                  </button>
                )}

                <span className="text-[10px] text-gray-600 whitespace-nowrap ml-auto">
                  {filtered.length} topics
                </span>
              </div>
            )}

            {/* ── Content area ──────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={24} className="animate-spin text-orange-500" />
                    <p className="text-gray-600 text-sm">Loading calendar…</p>
                  </div>
                </div>
              ) : topics.length === 0 ? (
                <UploadZone onUpload={handleUpload} loading={uploading} />
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Search size={32} className="text-gray-700" />
                  <p className="text-white font-bold">No topics match your filters</p>
                  <button onClick={resetFilters}
                    className="text-orange-400 text-sm hover:text-orange-300 transition-colors cursor-pointer">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {paginated.map(topic => (
                      <TopicCard
                        key={topic._id}
                        topic={topic}
                        onGenerate={handleGenerate}
                        generating={generatingId === topic._id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ── Pagination ────────────────────────────────────────────── */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04] flex-shrink-0">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <ChevronLeft size={12} /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, pages) }, (_, i) => {
                    let p: number;
                    if (pages <= 7) p = i + 1;
                    else if (page <= 4)        p = i + 1;
                    else if (page >= pages - 3) p = pages - 6 + i;
                    else                        p = page - 3 + i;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className="w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        style={p === page
                          ? { background: "linear-gradient(135deg,#FF7A00,#ffb300)", color: "#000" }
                          : { background: "rgba(255,255,255,0.04)", color: "#666" }}>
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  Next <ChevronRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
