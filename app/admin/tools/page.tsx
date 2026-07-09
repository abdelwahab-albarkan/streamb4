"use client";

import React, { useState } from "react";

// ── types ────────────────────────────────────────────────────────────────────

interface MigrationSummary {
  postsScanned:    number;
  postsUpdated:    number;
  imagesExtracted: number;
  imagesReused:    number;
  errors:          string[];
}

type MigrationState = "idle" | "running" | "done" | "error";

// ── component ─────────────────────────────────────────────────────────────────

export default function AdminToolsPage() {
  const [state,   setState]   = useState<MigrationState>("idle");
  const [summary, setSummary] = useState<MigrationSummary | null>(null);
  const [error,   setError]   = useState<string>("");

  const runMigration = async () => {
    setState("running");
    setSummary(null);
    setError("");

    try {
      const res  = await fetch("/api/admin/migrate/base64-images", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? `HTTP ${res.status}`);
        setState("error");
        return;
      }

      setSummary(data.summary);
      setState("done");
    } catch (err: any) {
      setError(err.message ?? "Network error");
      setState("error");
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Tools</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Maintenance utilities for the CMS.
          </p>
        </div>

        {/* Migration card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-white">Migrate Inline Base64 Images</h2>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                Scans every blog post for embedded{" "}
                <code className="text-amber-400 bg-amber-500/10 px-1 rounded text-xs">
                  data:image/…;base64,…
                </code>{" "}
                URLs, saves each image to the Media library, then replaces the
                huge data URL with a short{" "}
                <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded text-xs">
                  /api/admin/media/&lt;id&gt;
                </code>{" "}
                reference. This eliminates editor freezes caused by multi-megabyte
                post content.
              </p>
              <ul className="text-gray-500 text-xs mt-3 space-y-1">
                <li>✓ Safe to run multiple times (idempotent)</li>
                <li>✓ Duplicate images are detected by content hash — no duplicates in Media library</li>
                <li>✓ Posts not containing base64 images are skipped instantly</li>
              </ul>
            </div>
          </div>

          {/* Status area */}
          {state === "running" && (
            <div className="flex items-center gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
              <svg className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-blue-300 text-sm">
                Migration running… this may take up to a minute for large databases.
              </span>
            </div>
          )}

          {state === "error" && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {state === "done" && summary && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-3">
              <p className="text-emerald-400 font-semibold text-sm">Migration complete ✓</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Posts scanned",     value: summary.postsScanned },
                  { label: "Posts updated",     value: summary.postsUpdated },
                  { label: "Images extracted",  value: summary.imagesExtracted },
                  { label: "Images reused",     value: summary.imagesReused },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-white/5 p-3">
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {summary.errors.length > 0 && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-red-400 text-xs font-semibold mb-1">
                    {summary.errors.length} error(s):
                  </p>
                  <ul className="text-red-300 text-xs space-y-1">
                    {summary.errors.map((e, i) => (
                      <li key={i} className="font-mono break-all">{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.postsUpdated === 0 && summary.errors.length === 0 && (
                <p className="text-gray-400 text-xs">
                  No base64 images found — all posts are already using endpoint URLs.
                </p>
              )}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={runMigration}
            disabled={state === "running"}
            className={[
              "w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all",
              state === "running"
                ? "bg-white/5 text-gray-500 cursor-not-allowed"
                : state === "done"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-black",
            ].join(" ")}
          >
            {state === "running" ? "Running…" :
             state === "done"    ? "Run Again" :
                                   "Run Migration"}
          </button>
        </div>

        {/* Info box */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-gray-500 text-xs leading-relaxed">
            <strong className="text-gray-400">How it works:</strong> the migration
            reads the base64 payload, SHA-256 hashes it to detect duplicates, saves
            it as a new Media document, and writes{" "}
            <code className="text-gray-300">/api/admin/media/&lt;id&gt;</code> back
            into the post. The Media documents are served by the streaming endpoint
            with a 1-year immutable cache header, so browsers download each image
            exactly once. After migration, the editor content field shrinks from
            megabytes to a few hundred bytes regardless of how many images a post
            contains.
          </p>
        </div>

      </div>
    </div>
  );
}
