"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/admin/ui/Toast";

// Initial seed media files
const initialMedia = [
  {
    id: "1",
    name: "iPhone-14-PRO- (2).png",
    url: "/devices/iPhone-14-PRO- (2).png",
    type: "image/png",
    size: "184 KB",
    date: "2026-06-28",
  },
  {
    id: "2",
    name: "iPhone-14-PRO- (3).png",
    url: "/devices/iPhone-14-PRO- (3).png",
    type: "image/png",
    size: "192 KB",
    date: "2026-06-28",
  },
  {
    id: "3",
    name: "iPhone-14-PRO- (4).png",
    url: "/devices/iPhone-14-PRO- (4).png",
    type: "image/png",
    size: "176 KB",
    date: "2026-06-28",
  },
  {
    id: "4",
    name: "og-image.jpg",
    url: "/og-image.jpg",
    type: "image/jpeg",
    size: "245 KB",
    date: "2026-06-28",
  },
];

export default function MediaLibraryPage() {
  const { addToast } = useToast();
  const [files, setFiles] = useState<any[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "images" | "videos" | "svg">("all");

  useEffect(() => {
    const stored = localStorage.getItem("streamb4_media_library");
    if (stored) {
      setFiles(JSON.parse(stored));
    } else {
      setFiles(initialMedia);
      localStorage.setItem("streamb4_media_library", JSON.stringify(initialMedia));
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = Array.from(e.target.files || []);
    if (uploaded.length === 0) return;

    uploaded.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          name: file.name,
          url: ev.target?.result as string,
          type: file.type,
          size: `${Math.round(file.size / 1024)} KB`,
          date: new Date().toISOString().split("T")[0],
        };

        setFiles((prev) => {
          const updated = [newFile, ...prev];
          localStorage.setItem("streamb4_media_library", JSON.stringify(updated));
          return updated;
        });

        addToast(`Uploaded: ${file.name}`, "success");
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    localStorage.setItem("streamb4_media_library", JSON.stringify(updated));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
    addToast("File deleted successfully", "success");
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast("URL copied to clipboard!", "success");
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "images" && file.type.startsWith("image/")) ||
      (filter === "videos" && file.type.startsWith("video/")) ||
      (filter === "svg" && file.name.endsWith(".svg"));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] overflow-hidden -m-8 p-8">
      {/* Main Area */}
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
            <p className="text-gray-500 text-xs mt-1">Manage asset files and marketing attachments.</p>
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
                      ? {
                          background: "linear-gradient(135deg,#ff7a00,#ffb300)",
                        }
                      : {
                          background: "rgba(255,255,255,0.02)",
                        }
                  }
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Upload button */}
            <label
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-black text-black text-xs uppercase tracking-wider cursor-pointer bg-gradient-to-r from-[#ff7a00] to-[#ffb300] shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ↑ Upload File
              <input
                type="file"
                multiple
                accept="image/*,video/*,.svg"
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
                  filter === f ? "text-black border border-transparent" : "text-gray-500 border border-white/[0.06] hover:text-white"
                }`}
                style={
                  filter === f
                    ? {
                        background: "linear-gradient(135deg,#ff7a00,#ffb300)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                      }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          className="border border-dashed rounded-[20px] p-6 text-center transition-all duration-200 hover:border-orange-500/40 shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}
        >
          <p className="text-gray-600 text-xs font-semibold">Drag & drop files here to upload instantly</p>
        </div>

        {/* FILES GRID */}
        {view === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="group relative rounded-[16px] overflow-hidden cursor-pointer aspect-square border transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: "rgba(15,15,15,0.95)",
                  borderColor: selectedFile?.id === file.id ? "#ff7a00" : "rgba(255,255,255,0.06)",
                }}
              >
                {/* Thumbnail */}
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                  <p className="text-white text-[10px] font-semibold truncate w-full">{file.name}</p>
                </div>

                {/* Selected check */}
                {selectedFile?.id === file.id && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-black"
                    style={{ background: "#ff7a00" }}
                  >
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FILES LIST */}
        {view === "list" && (
          <div
            className="rounded-[20px] overflow-hidden border"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "rgba(15,15,15,0.95)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["File", "Type", "Size", "Date", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-left text-gray-500 text-xs font-bold uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b hover:bg-white/[0.02] transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.03)" }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={file.url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <p className="text-white text-sm font-semibold truncate max-w-[200px]">
                            {file.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-medium">{file.type}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-medium">{file.size}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-semibold">{file.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-xs font-bold">
                          <button
                            onClick={() => copyUrl(file.url)}
                            className="text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                          >
                            Copy URL
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
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
            </div>
          </div>
        )}
      </div>

      {/* Detail panel — right side */}
      {selectedFile && (
        <div
          className="w-72 flex-shrink-0 rounded-[20px] p-5 space-y-4 border flex flex-col justify-between"
          style={{
            background: "rgba(15,15,15,0.95)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden border border-white/[0.06]">
              <img src={selectedFile.url} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase block mb-1">
                  File Name
                </label>
                <input
                  defaultValue={selectedFile.name}
                  className="w-full px-3 py-2 rounded-xl text-white text-sm outline-none bg-white/[0.04] border border-white/[0.08]"
                />
              </div>
              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase block mb-1">
                  Alt Text (SEO)
                </label>
                <input
                  placeholder="Describe the image..."
                  className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none bg-white/[0.04] border border-white/[0.08] placeholder-gray-700"
                />
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase space-y-1 pt-1 border-t border-white/[0.04]">
                <p>Size: {selectedFile.size}</p>
                <p>Type: {selectedFile.type}</p>
                <p>Uploaded: {selectedFile.date}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => copyUrl(selectedFile.url)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white border border-white/[0.08] hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Copy Asset URL
            </button>
            <button
              onClick={() => handleDelete(selectedFile.id)}
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
