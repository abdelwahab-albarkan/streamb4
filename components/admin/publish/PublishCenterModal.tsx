"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/admin/ui/Toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformStatus {
  platform: string;
  success: boolean;
  url?: string;
  error?: string;
  skipped?: boolean;
  skipReason?: string;
}

interface PublishOptions {
  updateRss: boolean;
  updateSitemap: boolean;
  notifySearchEngines: boolean;
  pingIndexNow: boolean;
  generateOpenGraph: boolean;
  generateTwitterCard: boolean;
  regenerateInternalLinks: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  postSlug: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FUTURE_PLATFORMS = [
  { key: "medium",    label: "Medium",    icon: "M" },
  { key: "hashnode",  label: "Hashnode",  icon: "H" },
  { key: "wordpress", label: "WordPress", icon: "W" },
  { key: "ghost",     label: "Ghost CMS", icon: "G" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PublishCenterModal({ open, onClose, postId, postTitle, postSlug }: Props) {
  const { addToast } = useToast();

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

  const [publishing, setPublishing] = useState(false);
  const [done,       setDone]       = useState(false);
  const [results,    setResults]    = useState<PlatformStatus[]>([]);
  const [progress,   setProgress]   = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Reset when reopened
  useEffect(() => {
    if (open) { setDone(false); setResults([]); setProgress(0); setCurrentStep(""); }
  }, [open]);

  const toggleOption  = (k: keyof PublishOptions) => setOptions(o => ({ ...o, [k]: !o[k] }));
  const togglePlatform = (k: keyof typeof platforms) => setPlatforms(p => ({ ...p, [k]: !p[k] }));

  // Animate progress while publishing
  useEffect(() => {
    if (!publishing) return;
    const steps = [
      "Saving to database…",
      "Updating RSS feed…",
      "Updating sitemap…",
      "Generating Open Graph…",
      "Publishing to platforms…",
      "Notifying search engines…",
      "Finalising…",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress(Math.min(95, (i / steps.length) * 100));
      setCurrentStep(steps[i] ?? "Finalising…");
      if (i >= steps.length) clearInterval(interval);
    }, 600);
    return () => clearInterval(interval);
  }, [publishing]);

  const handlePublish = async () => {
    const activePlatforms = (Object.keys(platforms) as (keyof typeof platforms)[]).filter(k => platforms[k]);
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
        body: JSON.stringify({
          postId,
          platforms: activePlatforms,
          ...options,
        }),
      });

      const data = await res.json();
      setProgress(100);
      setResults(data.results ?? []);
      setDone(true);

      if (data.websiteSuccess) {
        addToast("Published successfully! 🎉", "success");
      } else {
        addToast("Some platforms failed — see details below", "error");
      }
    } catch (err) {
      addToast("Publish request failed", "error");
      setResults([{ platform: "website", success: false, error: String(err) }]);
      setDone(true);
    } finally {
      setPublishing(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !publishing && onClose()}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{ background: "#0a0a0a", border: "1px solid rgba(255,122,0,0.2)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-white font-black text-xl">🚀 PUBLISH CENTER</h2>
                  <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">{postTitle}</p>
                </div>
                {!publishing && (
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-white transition-colors text-xl font-light w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="p-6 space-y-6">
                {!done ? (
                  <>
                    {/* Progress bar (publishing state) */}
                    {publishing && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-400 font-semibold animate-pulse">{currentStep}</span>
                          <span className="text-gray-500">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #FF7A00, #ffb300)" }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {!publishing && (
                      <>
                        {/* Website options */}
                        <section>
                          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 rounded-full bg-orange-500 inline-block" />
                            WEBSITE PUBLISHING
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(options) as (keyof PublishOptions)[]).map(key => (
                              <CheckRow
                                key={key}
                                checked={options[key]}
                                onChange={() => toggleOption(key)}
                                label={optionLabel(key)}
                              />
                            ))}
                          </div>
                        </section>

                        {/* Publish everywhere */}
                        <section>
                          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 rounded-full bg-orange-500 inline-block" />
                            PUBLISH EVERYWHERE
                          </h3>
                          <div className="space-y-2">
                            {/* Website — always active */}
                            <PlatformRow
                              icon="🌐"
                              label="STREAMB4 Website"
                              badge="Primary"
                              checked={true}
                              disabled={true}
                            />
                            <PlatformRow
                              icon="🖥️"
                              label="DEV.to"
                              badge="Live"
                              checked={platforms.devto}
                              onChange={() => togglePlatform("devto")}
                            />
                            <PlatformRow
                              icon="📝"
                              label="Blogger"
                              badge="Live"
                              checked={platforms.blogger}
                              onChange={() => togglePlatform("blogger")}
                            />
                            {FUTURE_PLATFORMS.map(p => (
                              <PlatformRow
                                key={p.key}
                                icon={p.icon}
                                label={p.label}
                                badge="Soon"
                                checked={false}
                                disabled={true}
                              />
                            ))}
                          </div>
                        </section>

                        {/* Preview URL */}
                        <div className="rounded-xl p-3 text-xs text-gray-500" style={{ background: "rgba(255,122,0,0.04)", border: "1px solid rgba(255,122,0,0.08)" }}>
                          <span className="text-orange-400 font-bold">URL: </span>
                          <span>https://streamb4.com/blog/{postSlug}</span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  /* Results */
                  <ResultsPanel results={results} postSlug={postSlug} />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/[0.06]">
                {!done ? (
                  <>
                    <button
                      onClick={onClose}
                      disabled={publishing}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-black disabled:opacity-50 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #FF7A00, #ffb300)" }}
                    >
                      {publishing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Publishing…
                        </>
                      ) : (
                        <>🚀 PUBLISH NOW</>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 w-full justify-end">
                    <button
                      onClick={onClose}
                      className="px-5 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                    <a
                      href={`/blog/${postSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-black"
                      style={{ background: "linear-gradient(135deg, #FF7A00, #ffb300)" }}
                    >
                      View Article ↗
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
        style={{
          background: checked ? "linear-gradient(135deg, #FF7A00, #ffb300)" : "rgba(255,255,255,0.05)",
          border:     checked ? "none" : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {checked && <span className="text-black text-[10px] font-black">✓</span>}
      </div>
      <span className="text-gray-400 text-xs group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

function PlatformRow({
  icon, label, badge, checked, onChange, disabled,
}: {
  icon: string; label: string; badge: string; checked: boolean;
  onChange?: () => void; disabled?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
      style={{
        background: checked ? "rgba(255,122,0,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${checked ? "rgba(255,122,0,0.2)" : "rgba(255,255,255,0.05)"}`,
        opacity: disabled && badge !== "Primary" ? 0.45 : 1,
      }}
      onClick={!disabled ? onChange : undefined}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-white text-xs font-semibold">{label}</p>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
            style={{
              background: badge === "Live"    ? "rgba(34,197,94,0.15)"  :
                          badge === "Primary" ? "rgba(255,122,0,0.15)"  :
                                                "rgba(255,255,255,0.05)",
              color:      badge === "Live"    ? "#22c55e"  :
                          badge === "Primary" ? "#FF7A00"  :
                                                "#666",
            }}
          >
            {badge}
          </span>
        </div>
      </div>
      {!disabled && (
        <div
          className="w-9 h-5 rounded-full transition-all relative"
          style={{ background: checked ? "#FF7A00" : "rgba(255,255,255,0.08)" }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
          />
        </div>
      )}
    </div>
  );
}

function ResultsPanel({ results, postSlug }: { results: PlatformStatus[]; postSlug: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-white font-bold text-sm">Publishing Results</h3>
      {results.length === 0 && (
        <p className="text-gray-500 text-sm">No results available.</p>
      )}
      {results.map(r => (
        <div
          key={r.platform}
          className="flex items-start justify-between p-3 rounded-xl"
          style={{
            background: r.success ? "rgba(34,197,94,0.06)" : r.skipped ? "rgba(255,255,255,0.02)" : "rgba(239,68,68,0.06)",
            border: `1px solid ${r.success ? "rgba(34,197,94,0.15)" : r.skipped ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.15)"}`,
          }}
        >
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">
              {r.success ? "✅" : r.skipped ? "⏭️" : "❌"}
            </span>
            <div>
              <p className="text-white text-xs font-bold capitalize">{r.platform}</p>
              {r.skipped  && <p className="text-gray-500 text-[11px]">{r.skipReason}</p>}
              {!r.success && !r.skipped && <p className="text-red-400 text-[11px]">{r.error}</p>}
              {r.success  && r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 text-[11px] hover:text-orange-300 transition-colors"
                >
                  {r.url.slice(0, 50)}…
                </a>
              )}
            </div>
          </div>
          {r.success && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
              LIVE
            </span>
          )}
        </div>
      ))}
      {/* Website link */}
      <a
        href={`/blog/${postSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-orange-400 hover:text-orange-300 transition-colors mt-2"
      >
        View on STREAMB4 → https://streamb4.com/blog/{postSlug}
      </a>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function optionLabel(key: string): string {
  const labels: Record<string, string> = {
    updateRss:               "Add to RSS",
    updateSitemap:           "Update Sitemap",
    notifySearchEngines:     "Notify Search Engines",
    pingIndexNow:            "Ping IndexNow",
    generateOpenGraph:       "Generate OpenGraph",
    generateTwitterCard:     "Generate Twitter Card",
    regenerateInternalLinks: "Regenerate Internal Links",
  };
  return labels[key] ?? key;
}
