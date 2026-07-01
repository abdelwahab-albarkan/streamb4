"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/admin/logs");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadLogs();
  }, []);

  const getLogColor = (action: string) => {
    if (action.includes("delete")) return "#ef4444";
    if (action.includes("create") || action.includes("publish")) return "#22c55e";
    if (action.includes("update") || action.includes("edit")) return "#ffb300";
    return "#3b82f6";
  };

  const getLogIcon = (action: string) => {
    if (action.includes("post")) return "📝";
    if (action.includes("user")) return "👤";
    if (action.includes("media")) return "🖼";
    if (action.includes("login")) return "🔐";
    return "ℹ";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col">
        <h1
          className="font-anton text-3xl text-white uppercase tracking-wider"
          style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
        >
          AUDIT LOGS
        </h1>
        <p className="text-gray-500 text-xs mt-1">Timeline of platform management operations and actions.</p>
      </div>

      {/* Logs timeline list */}
      <div
        className="p-6 rounded-[24px] border space-y-6 bg-[#0F0F0F]"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {logs.length === 0 ? (
          <p className="text-gray-600 text-xs font-semibold text-center py-6">No audit records found.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm border"
                style={{
                  background: `${getLogColor(log.action)}15`,
                  borderColor: `${getLogColor(log.action)}25`,
                  color: getLogColor(log.action),
                }}
              >
                {getLogIcon(log.action)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-semibold truncate pr-4">{log.details}</p>
                  <span className="text-gray-600 text-[10px] font-bold uppercase shrink-0">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-gray-600 text-[11px] font-bold uppercase">
                  By {log.user} · IP: {log.ip || "127.0.0.1"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
