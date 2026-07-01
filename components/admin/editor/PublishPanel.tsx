"use client";

import React from "react";
import { motion } from "framer-motion";

interface PublishPanelProps {
  post: any;
  setPost: React.Dispatch<React.SetStateAction<any>>;
  wordCount: number;
  readingTime: number;
}

export default function PublishPanel({ post, setPost, wordCount, readingTime }: PublishPanelProps) {
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const tagsArray = val.split(",").map((t) => t.trim());
    setPost((p: any) => ({ ...p, tags: tagsArray }));
  };

  const triggerUploadMock = () => {
    // Mock image picker / library selector
    const mockImageUrls = [
      "/devices/iPhone-14-PRO- (2).png",
      "/devices/iPhone-14-PRO- (3).png",
      "/devices/iPhone-14-PRO- (4).png",
      "/og-image.jpg",
    ];
    const randomImg = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    setPost((p: any) => ({ ...p, featuredImage: randomImg, ogImage: randomImg }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-5 space-y-5"
    >
      {/* STATUS */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">Status</label>
        <div className="grid grid-cols-2 gap-2">
          {["draft", "published", "scheduled", "private"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPost((p: any) => ({ ...p, status: s }))}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                post.status === s
                  ? "text-black border border-transparent"
                  : "text-gray-500 border border-white/[0.06] hover:text-white"
              }`}
              style={
                post.status === s
                  ? {
                      background: "linear-gradient(135deg,#ff7a00,#ffb300)",
                    }
                  : {
                      background: "rgba(255,255,255,0.02)",
                    }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* SCHEDULE */}
      {post.status === "scheduled" && (
        <div className="space-y-2">
          <label className="text-white font-bold text-xs uppercase tracking-wider block">Publish Date</label>
          <input
            type="datetime-local"
            value={post.scheduledAt || ""}
            onChange={(e) => setPost((p: any) => ({ ...p, scheduledAt: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>
      )}

      {/* AUTHOR */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">Author</label>
        <select
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <option style={{ background: "#111" }}>Admin</option>
        </select>
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">Category</label>
        <select
          value={post.category || ""}
          onChange={(e) => setPost((p: any) => ({ ...p, category: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <option value="" style={{ background: "#111" }}>Select Category</option>
          {["Streaming Guides", "Device Setup", "Sports", "Movies & Series", "IPTV Tips", "Comparisons", "News"].map(
            (c) => (
              <option key={c} value={c} style={{ background: "#111" }}>
                {c}
              </option>
            )
          )}
        </select>
      </div>

      {/* TAGS */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">Tags</label>
        <input
          placeholder="streaming, firestick, 4k..."
          value={post.tags?.join(", ") || ""}
          onChange={handleTagChange}
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none placeholder-gray-700"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* FEATURED IMAGE */}
      <div className="space-y-2">
        <label className="text-white font-bold text-xs uppercase tracking-wider block">Featured Image</label>

        {post.featuredImage ? (
          <div className="relative rounded-xl overflow-hidden aspect-video border border-white/[0.08]">
            <img src={post.featuredImage} alt="Featured thumbnail" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setPost((p: any) => ({ ...p, featuredImage: "" }))}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            onClick={triggerUploadMock}
            className="border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-orange-500/40 transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span className="text-gray-600 text-2xl">🖼</span>
            <span className="text-gray-600 text-xs font-semibold">Click to pick from library</span>
          </div>
        )}
      </div>

      {/* TOGGLES */}
      <div className="space-y-3">
        {[
          { key: "isFeatured", label: "Featured Post" },
          { key: "isSticky", label: "Sticky Post" },
        ].map((toggle) => (
          <div
            key={toggle.key}
            className="flex items-center justify-between py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}
          >
            <span className="text-gray-400 text-sm">{toggle.label}</span>
            <button
              type="button"
              onClick={() => setPost((p: any) => ({ ...p, [toggle.key]: !p[toggle.key] }))}
              className="w-10 h-5 rounded-full relative transition-all cursor-pointer"
              style={{
                background: post[toggle.key]
                  ? "linear-gradient(135deg,#ff7a00,#ffb300)"
                  : "rgba(255,255,255,0.08)",
              }}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                  post[toggle.key] ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* READING TIME */}
      <div
        className="p-4 rounded-xl flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="text-gray-500 text-xs">Reading time</span>
        <span className="text-orange-400 font-bold text-sm">{readingTime} min</span>
      </div>
    </motion.div>
  );
}
