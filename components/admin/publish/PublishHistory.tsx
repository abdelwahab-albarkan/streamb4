"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2, XCircle, Clock, RotateCcw, ExternalLink,
  RefreshCw, Loader2, Globe, Monitor, BookOpen, ScrollText,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PublishRecord {
  _id:         string;
  platform:    string;
  status:      string;
  url?:        string;
  platformId?: string;
  error?:      string;
  durationMs?: number;
  attemptedAt: string;
  completedAt?: string;
  retryCount:  number;
}

interface PublishLogEntry {
  _id:        string;
  postId:     string;
  platform:   string;
  action:     string;
  status:     string;
  httpStatus?: number;
  durationMs?: number;
  url?:       string;
  platformId?: string;
  error?:     string;
  message?:   string;
  timestamp:  string;
}

interface Props {
  postId:     string;
  postTitle?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  website: Globe,
  devto:   Monitor,
  blogger: BookOpen,
};

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
    published: { color: "#22c55e", bg: "rgba(34,197,94,0.1)",  icon: CheckCircle2 },
    success:   { color: "#22c55e", bg: "rgba(34,197,94,0.1)",  icon: CheckCircle2 },
    failed:    { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: XCircle },
    skipped:   { color: "#888",    bg: "rgba(255,255,255,0.04)", icon: Clock },
    pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  };
  const s = map[status] ?? map.pending;
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-black uppercase"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}30` }}>
      <Icon size={9} />
      {status}
    </span>
  );
}

// ─── Publish Records Tab ──────────────────────────────────────────────────────

function RecordsTab({ postId, onRetry, retrying }: {
  postId: string;
  onRetry: (platform: string) => void;
  retrying: string | null;
}) {
  const [records, setRecords] = useState<PublishRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/publish/history?postId=${postId}`);
      const data = await res.json();
      if (data.success) setRecords(data.records ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [postId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <Loader2 size={18} className="animate-spin text-orange-500" />
    </div>
  );

  if (records.length === 0) return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <Clock size={24} className="text-gray-700" />
      <p className="text-gray-600 text-xs font-semibold">No publish history yet</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {records.map(rec => {
        const Icon = PLATFORM_ICONS[rec.platform] ?? Globe;
        const canRetry = rec.status === "failed" && rec.platform !== "website";
        return (
          <div key={rec._id}
            className="flex items-start justify-between gap-3 p-3 rounded-xl group transition-colors"
            style={{
              background: rec.status === "published" ? "rgba(34,197,94,0.03)"
                : rec.status === "failed"             ? "rgba(239,68,68,0.03)"
                :                                        "rgba(255,255,255,0.02)",
              border: `1px solid rgba(255,255,255,0.04)`,
            }}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <Icon size={13} className="text-gray-500" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-xs font-bold capitalize">{rec.platform}</span>
                  <StatusChip status={rec.status} />
                  {rec.retryCount > 0 && (
                    <span className="text-[9px] text-gray-700">{rec.retryCount} retr{rec.retryCount === 1 ? "y" : "ies"}</span>
                  )}
                  {rec.durationMs != null && (
                    <span className="text-[9px] text-gray-700">{(rec.durationMs / 1000).toFixed(1)}s</span>
                  )}
                </div>
                {rec.url && (
                  <a href={rec.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-400 text-[10px] hover:text-orange-300 mt-0.5 transition-colors">
                    {rec.url.length > 45 ? rec.url.slice(0, 45) + "…" : rec.url}
                    <ExternalLink size={9} />
                  </a>
                )}
                {rec.error && rec.status === "failed" && (
                  <p className="text-red-400 text-[10px] mt-0.5 leading-snug">{rec.error}</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <p className="text-gray-700 text-[10px] whitespace-nowrap">{fmt(rec.attemptedAt)}</p>
              {canRetry && (
                <button
                  onClick={() => onRetry(rec.platform)}
                  disabled={retrying === rec.platform}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-orange-400 transition-colors disabled:opacity-40 cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Retry"
                >
                  {retrying === rec.platform
                    ? <Loader2 size={11} className="animate-spin" />
                    : <RotateCcw size={11} />}
                </button>
              )}
              {rec.url && (
                <a href={rec.url} target="_blank" rel="noopener noreferrer"
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Logs Tab ─────────────────────────────────────────────────────────────────

function LogsTab({ postId }: { postId: string }) {
  const [logs,    setLogs]    = useState<PublishLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/publish/logs?postId=${postId}&limit=50`);
      const data = await res.json();
      if (data.success) setLogs(data.logs ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [postId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <Loader2 size={18} className="animate-spin text-orange-500" />
    </div>
  );

  if (logs.length === 0) return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <ScrollText size={24} className="text-gray-700" />
      <p className="text-gray-600 text-xs font-semibold">No publish logs yet</p>
    </div>
  );

  return (
    <div className="space-y-1.5">
      {logs.map(log => {
        const Icon = PLATFORM_ICONS[log.platform] ?? Globe;
        return (
          <div key={log._id}
            className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
            <Icon size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white text-[11px] font-bold capitalize">{log.platform}</span>
                <span className="text-gray-600 text-[10px]">{log.action}</span>
                <StatusChip status={log.status} />
                {log.httpStatus && (
                  <span className="text-[9px] text-gray-700">HTTP {log.httpStatus}</span>
                )}
                {log.durationMs != null && (
                  <span className="text-[9px] text-gray-700">{(log.durationMs / 1000).toFixed(1)}s</span>
                )}
              </div>
              {log.error && (
                <p className="text-red-400 text-[10px] mt-0.5 truncate">{log.error}</p>
              )}
            </div>
            <p className="text-gray-700 text-[10px] flex-shrink-0 whitespace-nowrap">{fmt(log.timestamp)}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublishHistory({ postId, postTitle }: Props) {
  const { addToast } = useToast();
  const [tab,      setTab]      = useState<"history" | "logs">("history");
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = async (platform: string) => {
    setRetrying(platform);
    try {
      const res  = await fetch("/api/admin/publish/retry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ postId, platform }),
      });
      const data = await res.json();
      const r = data.results?.[0];
      if (r?.success) {
        addToast(`Re-published to ${platform} ✓`, "success");
      } else {
        addToast(`Retry failed: ${r?.error ?? "Unknown error"}`, "error");
      }
    } catch {
      addToast(`Retry failed for ${platform}`, "error");
    }
    setRetrying(null);
  };

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <h3 className="text-white text-sm font-bold">
          Publish History
          {postTitle && <span className="text-gray-600 font-normal text-xs ml-2 truncate">— {postTitle}</span>}
        </h3>
        <button
          onClick={() => setTab(tab)} // trigger re-render for child reload
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-white transition-colors cursor-pointer"
          style={{ background: "rgba(255,255,255,0.04)" }}
          title="Refresh"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.04]">
        {(["history", "logs"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-xs font-bold uppercase transition-colors cursor-pointer"
            style={{
              color:        tab === t ? "#FF7A00" : "#555",
              borderBottom: tab === t ? "2px solid #FF7A00" : "2px solid transparent",
              background:   "transparent",
            }}
          >
            {t === "history" ? "Platform Records" : "Audit Logs"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {tab === "history" && (
          <RecordsTab postId={postId} onRetry={handleRetry} retrying={retrying} />
        )}
        {tab === "logs" && (
          <LogsTab postId={postId} />
        )}
      </div>
    </div>
  );
}
