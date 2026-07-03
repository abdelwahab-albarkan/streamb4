"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/admin/ui/Toast";

interface MediaFile {
  _id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string;
  createdAt: string;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(blobUrl);
    };
    img.onerror = () => { resolve({ width: 0, height: 0 }); URL.revokeObjectURL(blobUrl); };
    img.src = blobUrl;
  });
}

export default function MediaLibraryPage() {
  const { addToast } = useToast();
  const [files, setFiles]               = useState<MediaFile[]>([]);
  const [loading, setLoading]           = useState(true);
  const [uploading, setUploading]       = useState(false);
  const [view, setView]                 = useState<"grid" | "list">("grid");
  const [search, setSearch]             = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [filter, setFilter]             = useState<"all" | "images" | "videos" | "svg">("all");
  const [isDragging, setIsDragging]     = useState(false);
  const [altDraft, setAltDraft]         = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/admin/media");
        const data = await res.json();
        if (data.success) setFiles(data.items);
        else addToast(data.error ?? "Failed to load media", "error");
      } catch {
        addToast("Network error loading media", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => { setAltDraft(selectedFile?.altText ?? ""); }, [selectedFile?._id]);

  // ── Upload ───────────────────────────────────────────────────────────────
  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    const list = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(true);

    for (const file of list) {
      try {
        const { width, height } = await getImageDimensions(file);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("width", String(width));
        fd.append("height", String(height));

        const res  = await fetch("/api/admin/media", { method: "POST", body: fd });
        const data = await res.json();

        if (data.success) {
          setFiles(prev => [data.item, ...prev]);
          setSelectedFile(data.item);
          addToast(`Uploaded: ${file.name}`, "success");
        } else {
          addToast(data.error ?? "Upload failed", "error");
        }
      } catch {
        addToast(`Failed to upload ${file.name}`, "error");
      }
    }

    setUploading(false);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.filename}"?`)) return;
    try {
      await fetch(`/api/admin/media?id=${file._id}`, { method: "DELETE" });
      setFiles(prev => prev.filter(f => f._id !== file._id));
      if (selectedFile?._id === file._id) setSelectedFile(null);
      addToast("File deleted", "success");
    } catch {
      addToast("Delete failed", "error");
    }
  };

  // ── Copy URL ─────────────────────────────────────────────────────────────
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast("URL copied to clipboard!", "success");
  };

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  // ── Filtered ─────────────────────────────────────────────────────────────
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.filename.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "images" && file.mimeType.startsWith("image/")) ||
      (filter === "videos" && file.mimeType.startsWith("video/")) ||
      (filter === "svg"    && file.filename.endsWith(".svg"));
    return matchesSearch && matchesFilter;
  });

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex gap-6 h-[calc(100vh-140px)] overflow-hidden -m-8 p-8"
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(255,122,0,0.06)", border: "3px dashed rgba(255,122,0,0.4)" }}
        >
          <p className="text-orange-400 text-2xl font-black uppercase tracking-widest">Drop to Upload</p>
        </div>
      )}

      {/* ── Main Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        {/* Topbar */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1
              className="font-anton text-3xl text-white uppercase tracking-wider"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
            >
              MEDIA LIBRARY
            </h1>
            <p className="text-gray-500 text-xs mt-1">
              {loading ? "Loading…" : `${files.length} ${files.length === 1 ? "image" : "images"} stored in MongoDB`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/[0.06]">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    view === v ? "text-black" : "text-gray-500 hover:text-white"
                  }`}
                  style={
                    view === v
                      ? { background: "linear-gradient(135deg,#ff7a00,#ffb300)" }
                      : { background: "rgba(255,255,255,0.02)" }
                  }
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Upload button */}
            <label
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-transform ${
                uploading ? "opacity-60 pointer-events-none" : "hover:scale-[1.02] active:scale-[0.98]"
              }`}
              style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)", color: "#000" }}
            >
              {uploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Uploading…
                </>
              ) : "↑ Upload File"}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-gray-600 focus:border-orange-500/40 transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />

          <div className="flex flex-wrap gap-2 shrink-0">
            {(["all", "images", "videos", "svg"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  filter === f
                    ? "text-black border border-transparent"
                    : "text-gray-500 border border-white/[0.06] hover:text-white"
                }`}
                style={
                  filter === f
                    ? { background: "linear-gradient(135deg,#ff7a00,#ffb300)" }
                    : { background: "rgba(255,255,255,0.03)" }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone hint */}
        <div
          className="border border-dashed rounded-[20px] p-6 text-center transition-all duration-200 hover:border-orange-500/40 shrink-0 cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-gray-600 text-xs font-semibold">Drag & drop files here or click to upload</p>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <span className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-gray-500 text-sm">Loading media…</span>
          </div>
        )}

        {/* FILES GRID */}
        {!loading && view === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                onClick={() => setSelectedFile(file)}
                className="group relative rounded-[16px] overflow-hidden cursor-pointer aspect-square border transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: "rgba(15,15,15,0.95)",
                  borderColor: selectedFile?._id === file._id ? "#ff7a00" : "rgba(255,255,255,0.06)",
                }}
              >
                <img src={file.url} alt={file.altText || file.filename} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                  <p className="text-white text-[10px] font-semibold truncate w-full">{file.filename}</p>
                </div>

                {selectedFile?._id === file._id && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-black"
                    style={{ background: "#ff7a00" }}
                  >
                    ✓
                  </div>
                )}
              </div>
            ))}

            {filteredFiles.length === 0 && !loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
                <span className="text-4xl opacity-20">🖼️</span>
                <p className="text-gray-600 text-sm font-semibold">
                  {search ? "No images match your search" : "No images yet — upload one to get started"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* FILES LIST */}
        {!loading && view === "list" && (
          <div
            className="rounded-[20px] overflow-hidden border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(15,15,15,0.95)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["File", "Type", "Size", "Dimensions", "Date", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-3.5 text-left text-gray-500 text-xs font-bold uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file._id}
                      className="border-b hover:bg-white/[0.02] transition-colors cursor-pointer"
                      style={{ borderColor: "rgba(255,255,255,0.03)" }}
                      onClick={() => setSelectedFile(file)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={file.url} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                          <p className="text-white text-sm font-semibold truncate max-w-[180px]">{file.filename}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-medium">{file.mimeType}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-medium">{formatBytes(file.size)}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                        {file.width && file.height ? `${file.width}×${file.height}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-semibold">{formatDate(file.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-xs font-bold">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}
                            className="text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                          >
                            Copy URL
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                            className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredFiles.length === 0 && !loading && (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-600 text-sm font-semibold">
                    {search ? "No images match your search" : "No images yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Detail panel ─────────────────────────────────────────────────── */}
      {selectedFile && (
        <div
          className="w-72 flex-shrink-0 rounded-[20px] p-5 space-y-4 border flex flex-col justify-between"
          style={{ background: "rgba(15,15,15,0.95)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden border border-white/[0.06] bg-black/50">
              <img src={selectedFile.url} className="w-full h-full object-contain" alt={selectedFile.altText || selectedFile.filename} />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase block mb-1">File Name</label>
                <p className="text-white text-sm font-mono break-all leading-snug">{selectedFile.filename}</p>
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase block mb-1">Alt Text (SEO)</label>
                <input
                  value={altDraft}
                  onChange={(e) => setAltDraft(e.target.value)}
                  placeholder="Describe the image…"
                  className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none bg-white/[0.04] border border-white/[0.08] placeholder-gray-700"
                />
              </div>

              <div
                className="text-[10px] text-gray-500 font-bold uppercase space-y-1 pt-2 border-t border-white/[0.04]"
              >
                <p>Size: {formatBytes(selectedFile.size)}</p>
                <p>Type: {selectedFile.mimeType}</p>
                {selectedFile.width && selectedFile.height && (
                  <p>Dimensions: {selectedFile.width} × {selectedFile.height} px</p>
                )}
                <p>Uploaded: {formatDate(selectedFile.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => copyUrl(selectedFile.url)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white border border-white/[0.08] hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Copy Asset URL
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selectedFile)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500/[0.06] transition-colors cursor-pointer"
            >
              Delete File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
