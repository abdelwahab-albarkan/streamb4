"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ui/Toast";

interface PublishRecord {
  _id: string;
  platform: string;
  status: string;
  url?: string;
  platformId?: string;
  error?: string;
  attemptedAt: string;
  completedAt?: string;
  retryCount: number;
}

interface Props {
  postId: string;
  postTitle?: string;
}

const PLATFORM_ICONS: Record<string, string> = {
  website: "🌐",
  devto:   "🖥️",
  blogger: "📝",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  published: { bg: "rgba(34,197,94,0.1)",   text: "#22c55e",  dot: "#22c55e"  },
  failed:    { bg: "rgba(239,68,68,0.1)",   text: "#ef4444",  dot: "#ef4444"  },
  pending:   { bg: "rgba(255,170,0,0.1)",   text: "#ffaa00",  dot: "#ffaa00"  },
};

export default function PublishHistory({ postId }: Props) {
  const { addToast } = useToast();
  const [records, setRecords] = useState<PublishRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/publish/history?postId=${postId}`);
      const data = await res.json();
      if (data.success) setRecords(data.records ?? []);
    } catch {
      // silently fail — history is supplementary
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = async (platform: string) => {
    setRetrying(platform);
    try {
      const res  = await fetch("/api/admin/publish/retry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ postId, platform }),
      });
      const data = await res.json();
      if (data.results?.[0]?.success) {
        addToast(`Re-published to ${platform} ✓`, "success");
      } else {
        addToast(data.results?.[0]?.error ?? "Retry failed", "error");
      }
      await fetchHistory();
    } catch {
      addToast("Retry request failed", "error");
    } finally {
      setRetrying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4">
        <span className="w-4 h-4 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-gray-600 text-xs">Loading publish history…</span>
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600 text-sm">No publish records yet.</p>
        <p className="text-gray-700 text-xs mt-1">Use the Publish Center to distribute this article.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white text-sm font-bold">Publish History</h4>
        <button
          onClick={fetchHistory}
          className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {records.map(record => {
        const colors  = STATUS_COLORS[record.status] ?? STATUS_COLORS.pending;
        const isRetry = retrying === record.platform;
        const ts      = record.attemptedAt
          ? new Date(record.attemptedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
          : "—";

        return (
          <div
            key={record._id}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{PLATFORM_ICONS[record.platform] ?? "📡"}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-semibold capitalize">{record.platform}</span>
                  <span
                    className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: colors.dot }}
                    />
                    {record.status.toUpperCase()}
                  </span>
                  {record.retryCount > 0 && (
                    <span className="text-[10px] text-gray-600">{record.retryCount}× retried</span>
                  )}
                </div>
                <p className="text-gray-600 text-[11px] mt-0.5">{ts}</p>
                {record.status === "failed" && record.error && (
                  <p className="text-red-500/70 text-[11px] mt-0.5 truncate max-w-xs">{record.error}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {record.url && (
                <a
                  href={record.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors font-semibold"
                >
                  Open ↗
                </a>
              )}
              {record.status === "failed" && (
                <button
                  onClick={() => handleRetry(record.platform)}
                  disabled={isRetry}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg font-bold text-black disabled:opacity-50 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #FF7A00, #ffb300)" }}
                >
                  {isRetry ? (
                    <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                  ) : "↻"} Retry
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
