"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, RefreshCw, Search, CheckCircle2, XCircle, Info, AlertTriangle, Loader2 } from "lucide-react";

interface LogEntry {
  id: string;
  level: "info" | "success" | "warning" | "error";
  action: string;
  detail: string;
  user: string;
  createdAt: string;
}

const LEVEL_STYLE: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  success: { color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.18)",  Icon: CheckCircle2 },
  error:   { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.18)",  Icon: XCircle },
  warning: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)", Icon: AlertTriangle },
  info:    { color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.18)", Icon: Info },
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

async function fetchLogs(): Promise<LogEntry[]> {
  const logs: LogEntry[] = [];

  try {
    const [postsRes, historyRes] = await Promise.allSettled([
      fetch("/api/admin/posts"),
      fetch("/api/admin/publish/history?postId=all"),
    ]);

    if (postsRes.status === "fulfilled" && postsRes.value.ok) {
      const data = await postsRes.value.json();
      const posts = (data.posts || []) as Array<{
        id: string; title: string; status: string; createdAt: string; publishedAt?: string;
      }>;
      for (const p of posts.slice(0, 30)) {
        if (p.status === "published" && p.publishedAt) {
          logs.push({
            id: `pub-${p.id}`,
            level: "success",
            action: "Post Published",
            detail: `"${p.title}"`,
            user: "Admin",
            createdAt: p.publishedAt,
          });
        } else {
          logs.push({
            id: `draft-${p.id}`,
            level: "info",
            action: "Draft Saved",
            detail: `"${p.title}"`,
            user: "Admin",
            createdAt: p.createdAt,
          });
        }
      }
    }

    if (historyRes.status === "fulfilled" && historyRes.value.ok) {
      const data = await historyRes.value.json();
      const records = (data.records || []) as Array<{
        _id: string; platform: string; status: string; error?: string; postId: string; attemptedAt: string;
      }>;
      for (const r of records.slice(0, 40)) {
        logs.push({
          id: `rec-${r._id}`,
          level: r.status === "published" ? "success" : r.status === "failed" ? "error" : "warning",
          action: `${r.platform.toUpperCase()} Publish ${r.status === "published" ? "Success" : r.status === "failed" ? "Failed" : "Pending"}`,
          detail: r.error || `Post ID: ${r.postId}`,
          user: "System",
          createdAt: r.attemptedAt,
        });
      }
    }
  } catch { /* ignore */ }

  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    const data = await fetchLogs();
    setLogs(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = logs.filter(l => {
    const matchLevel = levelFilter === "all" || l.level === levelFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.action.toLowerCase().includes(q) ||
      l.detail.toLowerCase().includes(q) ||
      l.user.toLowerCase().includes(q);
    return matchLevel && matchSearch;
  });

  const counts = {
    all: logs.length,
    success: logs.filter(l => l.level === "success").length,
    error:   logs.filter(l => l.level === "error").length,
    warning: logs.filter(l => l.level === "warning").length,
    info:    logs.filter(l => l.level === "info").length,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="font-['Anton'] text-3xl text-white uppercase tracking-wide">Audit Logs</h1>
          <p className="text-gray-500 text-sm mt-1">{logs.length} events recorded</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "success", "error", "warning", "info"] as const).map(lv => {
            const s = LEVEL_STYLE[lv];
            return (
              <button
                key={lv}
                onClick={() => setLevelFilter(lv)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                style={levelFilter === lv ? {
                  background: lv === "all" ? "linear-gradient(135deg,#ff8a00,#ffb347)" : s?.bg,
                  color:      lv === "all" ? "#000" : s?.color,
                  border:     `1px solid ${lv === "all" ? "transparent" : s?.border}`,
                } : {
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#555",
                }}
              >
                {lv}{" "}
                {counts[lv] > 0 && <span className="opacity-60">({counts[lv]})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-orange-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ScrollText size={30} className="text-gray-700" />
            <p className="text-gray-600 text-sm font-semibold">
              {search || levelFilter !== "all" ? "No logs match your filters" : "No activity recorded yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {filtered.map((log, i) => {
              const style = LEVEL_STYLE[log.level] ?? LEVEL_STYLE.info;
              const Icon = style.Icon;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.15) }}
                  className="flex items-start gap-3.5 px-5 py-4 hover:bg-white/[0.015] transition-colors"
                >
                  <div
                    className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: style.bg, border: `1px solid ${style.border}` }}
                  >
                    <Icon size={13} style={{ color: style.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-bold">{log.action}</span>
                      <span
                        className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                        style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                      >
                        {log.level}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{log.detail}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-gray-600 text-xs font-semibold">{log.user}</p>
                    <p className="text-gray-700 text-[11px] mt-0.5 whitespace-nowrap">{fmt(log.createdAt)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-gray-700 text-xs px-1">
          Showing {filtered.length} of {logs.length} log entries
        </p>
      )}
    </div>
  );
}
