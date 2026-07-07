"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Monitor, BookOpen, X, RotateCcw, ExternalLink,
  CheckCircle2, XCircle, Clock, Loader2, Zap, RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlatformResult {
  platform:   string;
  success:    boolean;
  action?:    "create" | "update" | "retry" | "skip";
  url?:       string;
  platformId?: string;
  durationMs?: number;
  error?:     string;
  skipped?:   boolean;
  skipReason?: string;
}

interface PlatformStatus {
  key:             string;
  label:           string;
  icon:            string;
  enabled:         boolean;
  configured:      boolean;
  status:          string; // 'published' | 'failed' | 'pending' | 'disabled'
  url:             string;
  platformId:      string;
  lastPublishedAt: string;
  lastError:       string;
  retryCount:      number;
  durationMs:      number | null;
}

interface PublishOptions {
  updateRss:               boolean;
  updateSitemap:           boolean;
  notifySearchEngines:     boolean;
  pingIndexNow:            boolean;
  generateOpenGraph:       boolean;
  generateTwitterCard:     boolean;
  regenerateInternalLinks: boolean;
}

interface Props {
  open:      boolean;
  onClose:   () => void;
  postId:    string;
  postTitle: string;
  postSlug:  string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  globe:     Globe,
  monitor:   Monitor,
  "book-open": BookOpen,
  bookmark:  BookOpen,
  hash:      Monitor,
  layout:    Monitor,
};

const OPTION_LABELS: Record<string, string> = {
  updateRss:               "Add to RSS Feed",
  updateSitemap:           "Update Sitemap",
  notifySearchEngines:     "Notify Search Engines",
  pingIndexNow:            "Ping IndexNow",
  generateOpenGraph:       "Generate OpenGraph",
  generateTwitterCard:     "Generate Twitter Card",
  regenerateInternalLinks: "Regenerate Internal Links",
};

const FUTURE_PLATFORMS = ["medium", "hashnode", "wordpress"];

const PUBLISH_STEPS = [
  "Connecting to database…",
  "Validating article…",
  "Updating RSS feed…",
  "Updating sitemap…",
  "Publishing to platforms…",
  "Notifying search engines…",
  "Writing audit logs…",
  "Finalising…",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusIcon({ status, size = 16 }: { status: string; size?: number }) {
  if (status === "published") return <CheckCircle2 size={size} className="text-green-400" />;
  if (status === "failed")    return <XCircle size={size} className="text-red-400" />;
  if (status === "disabled")  return <Clock size={size} className="text-gray-600" />;
  return <Clock size={size} className="text-amber-400" />;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    published: { label: "Published", color: "#22c55e", bg: "rgba(34,197,94,0.1)"  },
    failed:    { label: "Failed",    color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
    pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    disabled:  { label: "Disabled",  color: "#555",    bg: "rgba(255,255,255,0.03)" },
    skipped:   { label: "Skipped",   color: "#888",    bg: "rgba(255,255,255,0.04)" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}30` }}
    >
      {s.label}
    </span>
  );
}

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <button
        type="button"
        onClick={onChange}
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
        style={{
          background: checked ? "linear-gradient(135deg,#FF7A00,#ffb300)" : "rgba(255,255,255,0.05)",
          border:     checked ? "none" : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {checked && <span className="text-black text-[10px] font-black leading-none">✓</span>}
      </button>
      <span className="text-gray-400 text-xs group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className="w-9 h-5 rounded-full transition-all relative flex-shrink-0 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
      style={{ background: checked ? "#FF7A00" : "rgba(255,255,255,0.08)" }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
        style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}

// ─── Platform status panel ────────────────────────────────────────────────────

function PlatformStatusPanel({
  postId,
  onRetry,
  retrying,
}: {
  postId:   string;
  onRetry:  (platform: string) => void;
  retrying: string | null;
}) {
  const [platforms, setPlatforms] = useState<PlatformStatus[]>([]);
  const [loading,   setLoading]   = useState(true);

  const load = useCallback(async () => {
    try {
      const res  = await fetch(`/api/admin/publish/status?postId=${postId}`);
      const data = await res.json();
      if (data.success) setPlatforms(data.platforms ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [postId]);

  useEffect(() => { load(); }, [load]);

  // Refresh after a retry completes
  useEffect(() => {
    if (retrying === null) load();
  }, [retrying, load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={18} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {platforms.map(p => {
        const Icon = PLATFORM_ICONS[p.icon] ?? Globe;
        const isActive = !FUTURE_PLATFORMS.includes(p.key);
        const canRetry  = isActive && (p.status === "failed" || p.status === "pending") && p.key !== "website";

        return (
          <div
            key={p.key}
            className="flex items-center justify-between p-3 rounded-xl transition-colors"
            style={{
              background: p.status === "published"
                ? "rgba(34,197,94,0.04)"
                : p.status === "failed"
                  ? "rgba(239,68,68,0.04)"
                  : "rgba(255,255,255,0.02)",
              border: `1px solid ${
                p.status === "published" ? "rgba(34,197,94,0.12)"
                  : p.status === "failed" ? "rgba(239,68,68,0.12)"
                  : "rgba(255,255,255,0.05)"}`,
              opacity: p.status === "disabled" ? 0.5 : 1,
            }}
          >
            {/* Left: icon + name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <Icon size={13} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold">{p.label}</p>
                {p.lastError && p.status === "failed" && (
                  <p className="text-red-400 text-[10px] truncate max-w-[180px]">{p.lastError}</p>
                )}
                {p.lastPublishedAt && p.status === "published" && (
                  <p className="text-gray-600 text-[10px]">
                    {new Date(p.lastPublishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {p.durationMs ? ` · ${(p.durationMs / 1000).toFixed(1)}s` : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Right: status + actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={p.status} />

              {p.url && p.status === "published" && (
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-400 transition-colors"
                  title="Open URL">
                  <ExternalLink size={11} />
                </a>
              )}

              {canRetry && (
                <button
                  onClick={() => onRetry(p.key)}
                  disabled={retrying === p.key}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-orange-400 transition-colors disabled:opacity-40 cursor-pointer"
                  title="Retry"
                >
                  {retrying === p.key
                    ? <Loader2 size={11} className="animate-spin" />
                    : <RotateCcw size={11} />}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Results panel ────────────────────────────────────────────────────────────

function ResultsPanel({
  results,
  postSlug,
  postId,
  onRetry,
  retrying,
}: {
  results:  PlatformResult[];
  postSlug: string;
  postId:   string;
  onRetry:  (platform: string) => void;
  retrying: string | null;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-white font-bold text-sm flex items-center gap-2">
        <Zap size={14} className="text-orange-500" />
        Publish Results
      </h3>

      {results.length === 0 && (
        <p className="text-gray-500 text-sm">No results available.</p>
      )}

      {results.map(r => (
        <div
          key={r.platform}
          className="flex items-start justify-between p-3 rounded-xl gap-3"
          style={{
            background: r.success ? "rgba(34,197,94,0.05)"
              : r.skipped         ? "rgba(255,255,255,0.02)"
              :                      "rgba(239,68,68,0.05)",
            border: `1px solid ${
              r.success ? "rgba(34,197,94,0.15)"
                : r.skipped ? "rgba(255,255,255,0.05)"
                :              "rgba(239,68,68,0.15)"}`,
          }}
        >
          <div className="flex items-start gap-2.5">
            <StatusIcon status={r.success ? "published" : r.skipped ? "disabled" : "failed"} size={15} />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white text-xs font-bold capitalize">{r.platform}</p>
                {r.action && r.action !== "skip" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase"
                    style={{
                      background: r.action === "update" ? "rgba(96,165,250,0.12)" : "rgba(255,122,0,0.12)",
                      color:      r.action === "update" ? "#60a5fa"               : "#FF7A00",
                    }}>
                    {r.action}
                  </span>
                )}
                {r.durationMs != null && (
                  <span className="text-[9px] text-gray-700">{(r.durationMs / 1000).toFixed(1)}s</span>
                )}
              </div>

              {r.skipped && <p className="text-gray-500 text-[11px] mt-0.5">{r.skipReason}</p>}
              {!r.success && !r.skipped && <p className="text-red-400 text-[11px] mt-0.5 leading-snug">{r.error}</p>}
              {r.success && r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className="text-orange-400 text-[11px] hover:text-orange-300 transition-colors mt-0.5 inline-flex items-center gap-1">
                  {r.url.length > 48 ? r.url.slice(0, 48) + "…" : r.url}
                  <ExternalLink size={9} />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {r.success && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black"
                style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                LIVE
              </span>
            )}
            {!r.success && !r.skipped && r.platform !== "website" && (
              <button
                onClick={() => onRetry(r.platform)}
                disabled={retrying === r.platform}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-bold text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-40 cursor-pointer"
                style={{ background: "rgba(255,122,0,0.08)", border: "1px solid rgba(255,122,0,0.15)" }}
              >
                {retrying === r.platform
                  ? <Loader2 size={10} className="animate-spin" />
                  : <RotateCcw size={10} />}
                Retry
              </button>
            )}
          </div>
        </div>
      ))}

      <a
        href={`/blog/${postSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 mt-2 text-xs text-orange-400 hover:text-orange-300 transition-colors py-2 rounded-lg"
        style={{ background: "rgba(255,122,0,0.04)", border: "1px solid rgba(255,122,0,0.08)" }}
      >
        <Globe size={12} />
        View on STREAMB4 → https://streamb4.com/blog/{postSlug}
        <ExternalLink size={11} />
      </a>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublishCenterModal({ open, onClose, postId, postTitle, postSlug }: Props) {
  const { addToast } = useToast();

  const [tab, setTab] = useState<"publish" | "status">("publish");

  const [options, setOptions] = useState<PublishOptions>({
    updateRss:               true,
    updateSitemap:           true,
    notifySearchEngines:     true,
    pingIndexNow:            true,
    generateOpenGraph:       true,
    generateTwitterCard:     true,
    regenerateInternalLinks: false,
  });

  const [platforms, setPlatforms] = useState({
    website: true,
    devto:   false,
    blogger: false,
  });

  const [publishing,   setPublishing]   = useState(false);
  const [done,         setDone]         = useState(false);
  const [results,      setResults]      = useState<PlatformResult[]>([]);
  const [progress,     setProgress]     = useState(0);
  const [currentStep,  setCurrentStep]  = useState("");
  const [retrying,     setRetrying]     = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setDone(false);
      setResults([]);
      setProgress(0);
      setCurrentStep("");
      setTab("publish");
    }
  }, [open]);

  // Animate progress during publish
  useEffect(() => {
    if (!publishing) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress(Math.min(92, (i / PUBLISH_STEPS.length) * 100));
      setCurrentStep(PUBLISH_STEPS[i] ?? "Finalising…");
      if (i >= PUBLISH_STEPS.length) clearInterval(interval);
    }, 550);
    return () => clearInterval(interval);
  }, [publishing]);

  const handlePublish = async () => {
    const activePlatforms = (Object.keys(platforms) as (keyof typeof platforms)[])
      .filter(k => platforms[k]);

    if (!activePlatforms.length) {
      addToast("Select at least one platform", "error");
      return;
    }

    setPublishing(true);
    setProgress(5);
    setCurrentStep("Connecting…");

    try {
      const res = await fetch("/api/admin/publish/orchestrate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, platforms: activePlatforms, ...options }),
      });
      const data = await res.json();

      setProgress(100);
      setResults(data.results ?? []);
      setDone(true);

      const successCount = (data.results ?? []).filter((r: PlatformResult) => r.success).length;
      const failCount    = (data.results ?? []).filter((r: PlatformResult) => !r.success && !r.skipped).length;

      if (failCount === 0) {
        addToast(`Published to ${successCount} platform${successCount !== 1 ? "s" : ""} 🎉`, "success");
      } else if (successCount > 0) {
        addToast(`Published to ${successCount} platforms, ${failCount} failed`, "info");
      } else {
        addToast("All platforms failed — see details", "error");
      }
    } catch (err) {
      addToast("Network error during publish", "error");
      setResults([{ platform: "website", success: false, error: String(err) }]);
      setDone(true);
    } finally {
      setPublishing(false);
    }
  };

  const handleRetry = async (platform: string) => {
    setRetrying(platform);
    try {
      const res  = await fetch("/api/admin/publish/retry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ postId, platform }),
      });
      const data = await res.json();
      const platformResult = data.results?.[0] as PlatformResult | undefined;

      if (platformResult?.success) {
        addToast(`Re-published to ${platform} ✓`, "success");
        // Update results in-place
        setResults(prev =>
          prev.map(r => r.platform === platform ? { ...r, ...platformResult } : r)
        );
      } else {
        addToast(`Retry failed: ${platformResult?.error ?? "Unknown error"}`, "error");
      }
    } catch {
      addToast(`Retry failed for ${platform}`, "error");
    }
    setRetrying(null);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !publishing && onClose()}
          />
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <div
              className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
              style={{ background: "#0a0a0a", border: "1px solid rgba(255,122,0,0.18)", boxShadow: "0 32px 80px rgba(0,0,0,0.9)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] flex-shrink-0">
                <div>
                  <h2 className="text-white font-black text-lg flex items-center gap-2">
                    <Zap size={16} className="text-orange-500" />
                    PUBLISH CENTER
                  </h2>
                  <p className="text-gray-600 text-xs mt-0.5 truncate max-w-sm">{postTitle}</p>
                </div>
                {!publishing && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Tab bar */}
              {!publishing && (
                <div className="flex border-b border-white/[0.05] flex-shrink-0">
                  {(["publish", "status"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className="px-5 py-3 text-xs font-bold uppercase transition-colors cursor-pointer"
                      style={{
                        color:       tab === t ? "#FF7A00" : "#555",
                        borderBottom: tab === t ? "2px solid #FF7A00" : "2px solid transparent",
                        background:   "transparent",
                      }}
                    >
                      {t === "publish" ? "Publish" : "Platform Status"}
                    </button>
                  ))}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Progress bar */}
                {publishing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-orange-400 font-semibold animate-pulse">{currentStep}</span>
                      <span className="text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg,#FF7A00,#ffb300)" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Publish tab */}
                {!publishing && tab === "publish" && !done && (
                  <>
                    {/* Website options */}
                    <section>
                      <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 rounded-full bg-orange-500" />
                        WEBSITE OPTIONS
                      </h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(Object.keys(options) as (keyof PublishOptions)[]).map(key => (
                          <CheckRow
                            key={key}
                            checked={options[key]}
                            onChange={() => setOptions(o => ({ ...o, [key]: !o[key] }))}
                            label={OPTION_LABELS[key] ?? key}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Platform selection */}
                    <section>
                      <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 rounded-full bg-orange-500" />
                        TARGET PLATFORMS
                      </h3>
                      <div className="space-y-2">
                        {/* Website — always on */}
                        <PlatformRow
                          icon="globe" label="STREAMB4 Website" sublabel="Full article · SEO · Schema"
                          badge="Primary" checked={true} disabled={true}
                        />
                        <PlatformRow
                          icon="monitor" label="DEV.to" sublabel="Markdown · Up to 4 tags · canonical_url"
                          badge="Live" checked={platforms.devto}
                          onChange={() => setPlatforms(p => ({ ...p, devto: !p.devto }))}
                        />
                        <PlatformRow
                          icon="book-open" label="Google Blogger" sublabel="HTML · Labels · Canonical → STREAMB4"
                          badge="Live" checked={platforms.blogger}
                          onChange={() => setPlatforms(p => ({ ...p, blogger: !p.blogger }))}
                        />
                        {[
                          { icon: "bookmark", label: "Medium",    sublabel: "Coming soon" },
                          { icon: "hash",     label: "Hashnode",  sublabel: "Coming soon" },
                          { icon: "layout",   label: "WordPress", sublabel: "Coming soon" },
                        ].map(p => (
                          <PlatformRow key={p.label} icon={p.icon} label={p.label} sublabel={p.sublabel} badge="Soon" checked={false} disabled={true} />
                        ))}
                      </div>
                    </section>

                    {/* URL preview */}
                    <div className="rounded-xl p-3 flex items-center justify-between"
                      style={{ background: "rgba(255,122,0,0.04)", border: "1px solid rgba(255,122,0,0.08)" }}>
                      <span className="text-gray-500 text-xs">
                        <span className="text-orange-400 font-bold">URL: </span>
                        https://streamb4.com/blog/{postSlug}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(`https://streamb4.com/blog/${postSlug}`)}
                        className="text-[10px] text-gray-600 hover:text-white transition-colors px-2 py-1 rounded cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        Copy
                      </button>
                    </div>
                  </>
                )}

                {/* Status tab */}
                {!publishing && tab === "status" && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-bold text-sm">Platform Status</h3>
                      <button
                        onClick={() => setTab("status")}
                        className="text-gray-600 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw size={11} />Refresh
                      </button>
                    </div>
                    <PlatformStatusPanel
                      postId={postId}
                      onRetry={handleRetry}
                      retrying={retrying}
                    />
                  </>
                )}

                {/* Results after publish */}
                {done && (
                  <ResultsPanel
                    results={results}
                    postSlug={postSlug}
                    postId={postId}
                    onRetry={handleRetry}
                    retrying={retrying}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
                {!done ? (
                  <>
                    <button
                      onClick={onClose}
                      disabled={publishing}
                      className="px-4 py-2 text-sm text-gray-500 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-black disabled:opacity-50 transition-opacity active:scale-[0.98] cursor-pointer"
                      style={{ background: "linear-gradient(135deg,#FF7A00,#ffb300)", boxShadow: "0 0 20px rgba(255,122,0,0.3)" }}
                    >
                      {publishing ? (
                        <><Loader2 size={14} className="animate-spin" />Publishing…</>
                      ) : (
                        <><Zap size={14} />PUBLISH NOW</>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 w-full justify-end">
                    <button
                      onClick={() => { setDone(false); setResults([]); setProgress(0); }}
                      className="px-4 py-2 text-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      Publish Again
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <a
                      href={`/blog/${postSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-black"
                      style={{ background: "linear-gradient(135deg,#FF7A00,#ffb300)" }}
                    >
                      View Article <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Platform row ─────────────────────────────────────────────────────────────

function PlatformRow({
  icon, label, sublabel, badge, checked, onChange, disabled,
}: {
  icon: string; label: string; sublabel?: string; badge: string;
  checked: boolean; onChange?: () => void; disabled?: boolean;
}) {
  const Icon = PLATFORM_ICONS[icon] ?? Globe;
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
      style={{
        background: checked ? "rgba(255,122,0,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${checked ? "rgba(255,122,0,0.18)" : "rgba(255,255,255,0.05)"}`,
        opacity: disabled && badge !== "Primary" ? 0.45 : 1,
      }}
      onClick={!disabled ? onChange : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          <Icon size={13} className="text-gray-400" />
        </div>
        <div>
          <p className="text-white text-xs font-bold">{label}</p>
          {sublabel && <p className="text-gray-600 text-[10px] mt-0.5">{sublabel}</p>}
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black"
          style={{
            background: badge === "Live"    ? "rgba(34,197,94,0.12)"
              : badge === "Primary" ? "rgba(255,122,0,0.12)"
              :                        "rgba(255,255,255,0.05)",
            color: badge === "Live"    ? "#22c55e"
              : badge === "Primary" ? "#FF7A00"
              :                        "#555",
          }}>
          {badge}
        </span>
      </div>
      {!disabled && <Toggle checked={checked} onChange={onChange} />}
    </div>
  );
}
