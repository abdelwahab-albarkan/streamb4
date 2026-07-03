"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import EditorToolbar from "@/components/admin/editor/EditorToolbar";
import PublishPanel from "@/components/admin/editor/PublishPanel";
import { SEOPanel, SchemaPanel } from "@/components/admin/editor/SEOPanel";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string; // the `id` field on the Post document

  const [post, setPost]                     = useState<any>(null);
  const [seoScore, setSeoScore]             = useState(0);
  const [wordCount, setWordCount]           = useState(0);
  const [readingTime, setReadingTime]       = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving">("saved");
  const [activePanel, setActivePanel]       = useState("publish");
  const [isSaving, setIsSaving]             = useState(false);
  const [saveError, setSaveError]           = useState("");

  // Keep a stable ref for the auto-save interval
  const postRef = useRef<any>(null);
  postRef.current = post;

  // ── Fetch post ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        }
      } catch (err) {
        console.error("[EditPost] load error:", err);
      }
    })();
  }, [postId]);

  // ── Word count + reading time ──────────────────────────────────────────────
  useEffect(() => {
    if (!post) return;
    const text  = post.content || "";
    const words = text.replace(/[#*`\[\]()]/g, "").split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(Math.max(1, Math.ceil(words / 200)));
  }, [post?.content]);

  // ── SEO score ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!post) return;
    let score = 0;
    const kw = (post.focusKeyword || "").toLowerCase();
    if ((post.seoTitle || "").length >= 30 && (post.seoTitle || "").length <= 60) score += 15;
    if (kw && (post.seoTitle || "").toLowerCase().includes(kw)) score += 15;
    if ((post.metaDescription || "").length >= 120 && (post.metaDescription || "").length <= 155) score += 15;
    if (kw && (post.metaDescription || "").toLowerCase().includes(kw)) score += 10;
    if (wordCount >= 800) score += 15;
    if (kw && (post.content || "").toLowerCase().includes(kw)) score += 10;
    if (post.featuredImage) score += 10;
    if (kw && (post.slug || "").includes(kw.replace(/\s+/g, "-"))) score += 10;
    setSeoScore(score);
  }, [post, wordCount]);

  // ── Auto-save to API every 30 s ────────────────────────────────────────────
  useEffect(() => {
    if (!postId) return;
    const timer = setInterval(async () => {
      const currentPost = postRef.current;
      if (!currentPost) return;
      setAutoSaveStatus("saving");
      try {
        await fetch(`/api/admin/posts/${postId}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(currentPost),
        });
      } catch { /* silent — user will see error on explicit save */ }
      setAutoSaveStatus("saved");
    }, 30000);
    return () => clearInterval(timer);
  }, [postId]); // mount-only; ref keeps post current

  // ── Core PUT helper ────────────────────────────────────────────────────────
  const putPost = async (payload: any): Promise<{ ok: boolean; error?: string }> => {
    const res  = await fetch(`/api/admin/posts/${postId}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? `HTTP ${res.status}` };
    return { ok: true };
  };

  // ── Save Draft ─────────────────────────────────────────────────────────────
  const saveDraft = async () => {
    if (!post || isSaving) return;
    setSaveError("");
    setIsSaving(true);
    setAutoSaveStatus("saving");
    try {
      // Always force status = "draft" regardless of panel selection
      const { ok, error } = await putPost({ ...post, status: "draft" });
      if (ok) {
        setPost((p: any) => ({ ...p, status: "draft" }));
      } else {
        setSaveError(error ?? "Save failed");
        console.error("[Save Draft] API error:", error);
      }
    } catch (err) {
      console.error("[Save Draft] fetch error:", err);
      setSaveError("Network error — please try again");
    } finally {
      setIsSaving(false);
      setAutoSaveStatus("saved");
    }
  };

  // ── Update Post (keeps whatever status the Publish Panel has) ─────────────
  const handleUpdate = async () => {
    if (!post || isSaving) return;
    setSaveError("");
    setIsSaving(true);
    try {
      const { ok, error } = await putPost(post);
      if (ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setSaveError(error ?? "Update failed");
        console.error("[Update Post] API error:", error);
      }
    } catch (err) {
      console.error("[Update Post] fetch error:", err);
      setSaveError("Network error — please try again");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Toolbar formatter ──────────────────────────────────────────────────────
  const handleFormat = (formatType: string) => {
    if (!post) return;
    let tag = "";
    switch (formatType) {
      case "H1":       tag = "\n# ";                                                                           break;
      case "H2":       tag = "\n## ";                                                                          break;
      case "H3":       tag = "\n### ";                                                                         break;
      case "Bold":     tag = "**BoldText**";                                                                    break;
      case "Italic":   tag = "*ItalicText*";                                                                    break;
      case "Strike":   tag = "~~Strikethrough~~";                                                              break;
      case "Code":     tag = "`CodeBlock`";                                                                    break;
      case "Bullet":   tag = "\n- Item";                                                                       break;
      case "Numbered": tag = "\n1. Item";                                                                      break;
      case "Quote":    tag = "\n> Quote text";                                                                  break;
      case "Link":     tag = "[Link Title](https://streamb4.com)";                                             break;
      case "Image":    tag = "![Alt Description](/og-image.jpg)";                                              break;
      case "Table":    tag = "\n| Header 1 | Header 2 |\n|---|---|\n| Cell 1 | Cell 2 |";                      break;
      case "Divider":  tag = "\n\n---\n\n";                                                                    break;
      case "FAQ":      tag = "\n\n### FAQ Section\n- **Q: Question?**\n  A: Answer.";                         break;
      case "CTA":      tag = "\n\n> **GET STREAMB4 NOW** - Experience 50,000+ live channels in 4K UHD. Click here to subscribe."; break;
      case "Callout":  tag = "\n\n> [!NOTE]\n> Essential requirements, critical steps, or must-know information"; break;
      case "Columns":  tag = "\n\n<div className=\"grid grid-cols-2 gap-4\">\n<div>Column 1</div>\n<div>Column 2</div>\n</div>\n\n"; break;
      default: break;
    }
    setPost((p: any) => ({ ...p, content: (p.content || "") + tag }));
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-[#050505] text-gray-500 font-semibold">
        Loading post…
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden -m-8">
      {/* LEFT — MAIN EDITOR */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Topbar */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(5,5,5,0.9)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer"
            >
              ← Posts
            </button>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400 text-sm font-semibold">Edit Post</span>

            {/* Save indicator / error */}
            {saveError ? (
              <span className="text-red-400 text-xs font-semibold">⚠ {saveError}</span>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    autoSaveStatus === "saved" ? "bg-green-500" : "bg-orange-500 animate-pulse"
                  }`}
                />
                {autoSaveStatus === "saved" ? "All changes saved" : "Saving…"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex gap-4 text-xs text-gray-500 px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span>{wordCount} words</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>

            <button
              onClick={saveDraft}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-gray-300 text-sm font-bold border border-white/[0.08] hover:border-orange-500/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save Draft"}
            </button>

            <motion.button
              onClick={handleUpdate}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-xl font-black text-black text-sm uppercase tracking-wide cursor-pointer disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg,#ff7a00,#ffb300)",
                boxShadow: "0 0 20px rgba(255,122,0,0.3)",
              }}
            >
              {isSaving ? "Saving…" : "Update Post ⚡"}
            </motion.button>
          </div>
        </div>

        {/* EDITOR CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-8" style={{ background: "#050505" }}>
          <div className="max-w-3xl mx-auto space-y-6">
            <textarea
              value={post.title}
              onChange={(e) => setPost((p: any) => ({ ...p, title: e.target.value }))}
              placeholder="Enter your article title..."
              rows={2}
              className="w-full bg-transparent text-white font-anton text-4xl uppercase placeholder-gray-800 outline-none resize-none border-b pb-6 leading-tight"
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            />

            {/* SLUG */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">streamb4.com/blog/</span>
              <input
                value={post.slug}
                onChange={(e) => setPost((p: any) => ({ ...p, slug: e.target.value }))}
                className="flex-1 bg-transparent text-orange-400 outline-none border-b border-dashed border-orange-500/30 pb-0.5"
              />
            </div>

            {/* EDITOR TOOLBAR */}
            <EditorToolbar
              onFormat={handleFormat}
              onAIAssist={() => router.push("/admin/ai-writer")}
            />

            {/* MARKDOWN EDITOR */}
            <div data-color-mode="dark" className="mt-4">
              <MDEditor
                value={post.content}
                onChange={(v) => setPost((p: any) => ({ ...p, content: v || "" }))}
                height={500}
                preview="edit"
                style={{ background: "transparent", border: "none", fontSize: "16px" }}
                textareaProps={{
                  placeholder: "Start writing your article...\n\nTip: Use formatting shortcuts above.",
                  style: {
                    background: "transparent",
                    color: "#e5e5e5",
                    fontSize: "16px",
                    lineHeight: "1.8",
                    fontFamily: "Inter,system-ui,sans-serif",
                  },
                }}
              />
            </div>

            {/* EXCERPT */}
            <div
              className="p-6 rounded-[20px]"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-bold text-sm">Excerpt</label>
                <span className="text-gray-600 text-xs">{post.excerpt?.length || 0}/160</span>
              </div>
              <textarea
                value={post.excerpt || ""}
                onChange={(e) => setPost((p: any) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Short description of your article..."
                maxLength={160}
                rows={3}
                className="w-full bg-transparent text-gray-400 text-sm outline-none resize-none placeholder-gray-700 leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div
        className="w-[340px] flex-shrink-0 flex flex-col border-l overflow-y-auto"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(8,8,8,0.98)" }}
      >
        {/* Sidebar tabs */}
        <div className="flex border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {["publish", "seo", "schema"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePanel(tab)}
              className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activePanel === tab
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePanel === "publish" && (
              <PublishPanel post={post} setPost={setPost} wordCount={wordCount} readingTime={readingTime} />
            )}
            {activePanel === "seo" && (
              <SEOPanel post={post} setPost={setPost} seoScore={seoScore} wordCount={wordCount} />
            )}
            {activePanel === "schema" && <SchemaPanel post={post} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
