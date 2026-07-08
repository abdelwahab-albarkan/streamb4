"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import EditorToolbar from "@/components/admin/editor/EditorToolbar";
import PublishPanel from "@/components/admin/editor/PublishPanel";
import { SEOPanel, SchemaPanel } from "@/components/admin/editor/SEOPanel";
import {
  InlineImageModal,
  ImageConfig,
  parseFigureBlock,
  generateFigureHTML,
} from "@/components/admin/editor/InlineImageModal";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the MDEditor's underlying textarea (after it mounts) */
function getEditorTextarea(): HTMLTextAreaElement | null {
  return document.querySelector(".w-md-editor-text-input") as HTMLTextAreaElement | null;
}

/** Returns `{ config, start, end }` if cursor is inside a figure/image block, else null */
function detectImageAtCursor(
  content: string,
  cursorPos: number
): { config: ImageConfig; start: number; end: number } | null {
  // Check <figure> HTML blocks first
  const figRe = /<figure[\s\S]*?<\/figure>/g;
  let m: RegExpExecArray | null;
  while ((m = figRe.exec(content)) !== null) {
    if (m.index <= cursorPos && cursorPos <= m.index + m[0].length) {
      const cfg = parseFigureBlock(m[0]);
      if (cfg) return { config: cfg, start: m.index, end: m.index + m[0].length };
    }
  }
  // Fallback: standard markdown image  ![alt](url)
  const mdImgRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  while ((m = mdImgRe.exec(content)) !== null) {
    if (m.index <= cursorPos && cursorPos <= m.index + m[0].length) {
      return {
        config: {
          url: m[2], alt: m[1], caption: "", title: "",
          width: "100%", alignment: "center",
          borderRadius: "12px", shadow: "md",
          marginTop: "1.5rem", marginBottom: "1.5rem",
        },
        start: m.index,
        end:   m.index + m[0].length,
      };
    }
  }
  return null;
}

/** Get image dimensions from a File for the Media API */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload  = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
    img.onerror = () => { resolve({ width: 0, height: 0 }); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

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

  // Inline image modal state
  const [imageModalOpen,  setImageModalOpen]  = useState(false);
  const [imageEditConfig, setImageEditConfig] = useState<Partial<ImageConfig> | undefined>(undefined);
  const [imageEditRange,  setImageEditRange]  = useState<[number, number] | null>(null);
  const [imageAtCursor,   setImageAtCursor]   = useState(false);
  const [isEditMode,      setIsEditMode]      = useState(false);

  // Inline Image Bubble Menu and Drag over states
  const [bubbleMenuOpen, setBubbleMenuOpen] = useState(false);
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState({ top: 0, left: 0 });
  const [dragOverPage, setDragOverPage] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);

  // Keep a stable ref for the auto-save interval
  const postRef = useRef<any>(null);
  postRef.current = post;

  const editorContainerRef = useRef<HTMLDivElement>(null);

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

  // ── Cursor-in-image detector ──────────────────────────────────────────────
  useEffect(() => {
    const checkCursor = () => {
      const ta = getEditorTextarea();
      if (!ta) return;
      const result = detectImageAtCursor(ta.value, ta.selectionStart);
      setImageAtCursor(!!result);
    };
    const attach = () => {
      const ta = getEditorTextarea();
      if (!ta) return false;
      ta.addEventListener("click",  checkCursor);
      ta.addEventListener("keyup",  checkCursor);
      ta.addEventListener("select", checkCursor);
      return true;
    };
    // Retry until MDEditor mounts
    if (!attach()) {
      const t = setTimeout(() => attach(), 1200);
      return () => clearTimeout(t);
    }
    return () => {
      const ta = getEditorTextarea();
      if (ta) {
        ta.removeEventListener("click",  checkCursor);
        ta.removeEventListener("keyup",  checkCursor);
        ta.removeEventListener("select", checkCursor);
      }
    };
  }, [post]); // re-attach when post loads

  // ── Client-side WebP Compression and Upload helper ───────────────────────
  const uploadAndInsertImage = useCallback(async (file: File, position?: number) => {
    setUploadingInline(true);
    try {
      const processedFile = await new Promise<File>((resolve) => {
        if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
          resolve(file);
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.naturalWidth;
            let height = img.naturalHeight;
            
            const MAX_LIMIT = 1600;
            if (width > MAX_LIMIT || height > MAX_LIMIT) {
              if (width > height) {
                height = Math.round((height * MAX_LIMIT) / width);
                width = MAX_LIMIT;
              } else {
                width = Math.round((width * MAX_LIMIT) / height);
                height = MAX_LIMIT;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) { resolve(file); return; }

            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const newFilename = file.name.replace(/\.[^.]+$/, "") + ".webp";
                  resolve(new File([blob], newFilename, {
                    type: "image/webp",
                    lastModified: Date.now(),
                  }));
                } else {
                  resolve(file);
                }
              },
              "image/webp",
              0.8
            );
          };
          img.onerror = () => resolve(file);
          img.src = e.target?.result as string;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
      });

      const { width, height } = await getImageDimensions(processedFile);
      const fd = new FormData();
      fd.append("file", processedFile);
      if (width) fd.append("width", String(width));
      if (height) fd.append("height", String(height));

      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      
      if (data.success) {
        const autoAlt = processedFile.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        const defaultCfg: ImageConfig = {
          url: data.item.url,
          alt: autoAlt,
          caption: "",
          title: "",
          width: "100%",
          alignment: "center",
          borderRadius: "12px",
          shadow: "md",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
        };
        const figureHTML = generateFigureHTML(defaultCfg);

        const ta = getEditorTextarea();
        const currentContent = postRef.current?.content || "";
        const insertPos = position !== undefined ? position : (ta ? ta.selectionStart : currentContent.length);

        const newContent = currentContent.slice(0, insertPos) + figureHTML + currentContent.slice(insertPos);
        setPost((p: any) => ({ ...p, content: newContent }));

        if (ta) {
          requestAnimationFrame(() => {
            ta.focus();
            const newPos = insertPos + figureHTML.length;
            ta.setSelectionRange(newPos, newPos);
          });
        }
      }
    } catch (err) {
      console.error("Inline image upload failed:", err);
    } finally {
      setUploadingInline(false);
    }
  }, []);

  // ── Clipboard paste → auto-upload + insert immediately ──────────────────────
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const ta = getEditorTextarea();
      if (!ta || document.activeElement !== ta) return;
      const imageItem = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith("image/"));
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;
      void uploadAndInsertImage(file, ta.selectionStart);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [uploadAndInsertImage]);

  // ── Page Drag & Drop handlers ──────────────────────────────────────────────
  const handlePageDragOver = (e: React.DragEvent) => {
    const file = e.dataTransfer.items?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
      setDragOverPage(true);
    }
  };

  const handlePageDragLeave = (e: React.DragEvent) => {
    if (e.relatedTarget === null) {
      setDragOverPage(false);
    }
  };

  const handlePageDrop = async (e: React.DragEvent) => {
    setDragOverPage(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
      const ta = getEditorTextarea();
      const pos = ta ? ta.selectionStart : undefined;
      await uploadAndInsertImage(file, pos);
    }
  };

  // ── Click interceptor for MDEditor preview images ──────────────────────────
  const handleEditorContainerClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const img = target.tagName === "IMG" ? (target as HTMLImageElement) : target.closest("figure")?.querySelector("img");
    if (!img) {
      setBubbleMenuOpen(false);
      return;
    }

    const figure = img.closest("figure");
    if (!figure) return;

    e.preventDefault();
    e.stopPropagation();

    const src = img.getAttribute("src") || "";
    const currentContent = postRef.current?.content || "";

    const escapedSrc = src.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`<figure[\\s\\S]*?src="${escapedSrc}"[\\s\\S]*?<\\/figure>`, "g");
    const match = regex.exec(currentContent);
    
    if (match) {
      const start = match.index;
      const end = match.index + match[0].length;
      const parsedCfg = parseFigureBlock(match[0]);
      
      if (parsedCfg) {
        setImageEditConfig(parsedCfg);
        setImageEditRange([start, end]);
        setIsEditMode(true);

        const imgRect = img.getBoundingClientRect();
        const containerRect = editorContainerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setBubbleMenuPosition({
            top: imgRect.top - containerRect.top - 54 + (editorContainerRef.current?.scrollTop || 0),
            left: imgRect.left - containerRect.left + imgRect.width / 2,
          });
          setBubbleMenuOpen(true);
        }
      }
    }
  }, []);

  // ── Floating Bubble Menu Button Actions ─────────────────────────────────────
  const handleReplaceInline = () => {
    setBubbleMenuOpen(false);
    setImageModalOpen(true);
  };

  const handleResizeInline = () => {
    setBubbleMenuOpen(false);
    setImageModalOpen(true);
  };

  const handleDuplicateInline = useCallback(() => {
    if (!imageEditRange) return;
    const currentContent = postRef.current?.content || "";
    const block = currentContent.slice(imageEditRange[0], imageEditRange[1]);
    const newContent = currentContent.slice(0, imageEditRange[1]) + "\n" + block + currentContent.slice(imageEditRange[1]);
    setPost((p: any) => ({ ...p, content: newContent }));
    setBubbleMenuOpen(false);
  }, [imageEditRange]);

  const handleDeleteInline = useCallback(() => {
    if (!imageEditRange) return;
    const currentContent = postRef.current?.content || "";
    const newContent = currentContent.slice(0, imageEditRange[0]) + currentContent.slice(imageEditRange[1]);
    setPost((p: any) => ({ ...p, content: newContent }));
    setBubbleMenuOpen(false);
    setImageEditRange(null);
    setImageEditConfig(undefined);
    setIsEditMode(false);
  }, [imageEditRange]);

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
      case "Table":    tag = "\n| Header 1 | Header 2 |\n|---|---|\n| Cell 1 | Cell 2 |";                      break;
      case "Divider":  tag = "\n\n---\n\n";                                                                    break;
      case "FAQ":      tag = "\n\n### FAQ Section\n- **Q: Question?**\n  A: Answer.";                         break;
      case "CTA":      tag = "\n\n> **GET STREAMB4 NOW** - Experience 50,000+ live channels in 4K UHD. Click here to subscribe."; break;
      case "Callout":  tag = "\n\n> [!NOTE]\n> Essential requirements, critical steps, or must-know information"; break;
      case "Columns":  tag = "\n\n<div className=\"grid grid-cols-2 gap-4\">\n<div>Column 1</div>\n<div>Column 2</div>\n</div>\n\n"; break;
      default: break;
    }
    if (tag) insertAtCursor(tag);
  };

  // ── Custom event handlers for Editor Textarea ──────────────────────────────
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    // Shortcut: Ctrl+Shift+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") {
      e.preventDefault();
      openInsertModal();
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      if (start === end) {
        const content = ta.value;

        if (e.key === "Backspace") {
          const textBefore = content.substring(0, start);
          const figCloseIndex = textBefore.lastIndexOf("</figure>");
          if (figCloseIndex !== -1) {
            const intermediate = textBefore.substring(figCloseIndex + 9);
            if (/^\s*$/.test(intermediate)) {
              const textToSearch = textBefore.substring(0, figCloseIndex + 9);
              const figOpenIndex = textToSearch.lastIndexOf("<figure");
              if (figOpenIndex !== -1) {
                e.preventDefault();
                const newContent = content.substring(0, figOpenIndex) + content.substring(start);
                setPost((p: any) => ({ ...p, content: newContent }));
                setTimeout(() => {
                  ta.focus();
                  ta.setSelectionRange(figOpenIndex, figOpenIndex);
                }, 0);
                return;
              }
            }
          }
        } else if (e.key === "Delete") {
          const textAfter = content.substring(start);
          const figOpenIndex = textAfter.indexOf("<figure");
          if (figOpenIndex !== -1) {
            const intermediate = textAfter.substring(0, figOpenIndex);
            if (/^\s*$/.test(intermediate)) {
              const figCloseIndex = textAfter.indexOf("</figure>", figOpenIndex);
              if (figCloseIndex !== -1) {
                e.preventDefault();
                const blockEnd = start + figCloseIndex + 9;
                const newContent = content.substring(0, start) + content.substring(blockEnd);
                setPost((p: any) => ({ ...p, content: newContent }));
                setTimeout(() => {
                  ta.focus();
                  ta.setSelectionRange(start, start);
                }, 0);
                return;
              }
            }
          }
        }
      }
    }
  };

  const handleTextareaDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
      const ta = e.currentTarget;
      const pos = ta.selectionStart;
      await uploadAndInsertImage(file, pos);
    }
  };

  const handleTextareaDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const file = e.dataTransfer.items?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
    }
  };

  // ── Insert image markdown at cursor ──────────────────────────────────────
  const insertAtCursor = useCallback((markdown: string) => {
    const ta = getEditorTextarea();
    const currentContent = postRef.current?.content || "";
    if (!ta) {
      setPost((p: any) => ({ ...p, content: currentContent + markdown }));
      return;
    }
    const start = ta.selectionStart ?? currentContent.length;
    const end   = ta.selectionEnd   ?? currentContent.length;
    const newContent = currentContent.slice(0, start) + markdown + currentContent.slice(end);
    setPost((p: any) => ({ ...p, content: newContent }));
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + markdown.length;
      ta.setSelectionRange(pos, pos);
    });
  }, []);

  // ── Replace existing image block ──────────────────────────────────────────
  const replaceAtRange = useCallback((markdown: string, range: [number, number]) => {
    const currentContent = postRef.current?.content || "";
    const trimmed = markdown.trim();
    const newContent = currentContent.slice(0, range[0]) + trimmed + currentContent.slice(range[1]);
    setPost((p: any) => ({ ...p, content: newContent }));
  }, []);

  // ── Image modal handlers ──────────────────────────────────────────────────
  const openInsertModal = useCallback(() => {
    setImageEditConfig(undefined);
    setImageEditRange(null);
    setIsEditMode(false);
    setBubbleMenuOpen(false);
    setImageModalOpen(true);
  }, []);

  const openEditModal = useCallback(() => {
    const ta = getEditorTextarea();
    if (!ta) return;
    const result = detectImageAtCursor(ta.value, ta.selectionStart);
    if (!result) return;
    setImageEditConfig(result.config);
    setImageEditRange([result.start, result.end]);
    setIsEditMode(true);
    setBubbleMenuOpen(false);
    setImageModalOpen(true);
  }, []);

  const handleImageInsert = useCallback((markdown: string) => {
    if (imageEditRange) {
      replaceAtRange(markdown, imageEditRange);
    } else {
      insertAtCursor(markdown);
    }
    setImageModalOpen(false);
    setImageEditRange(null);
    setImageEditConfig(undefined);
    setIsEditMode(false);
  }, [imageEditRange, replaceAtRange, insertAtCursor]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-[#050505] text-gray-500 font-semibold font-sans">
        Loading post…
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        ref={editorContainerRef}
        onClick={handleEditorContainerClick}
        onDragOver={handlePageDragOver}
        onDragLeave={handlePageDragLeave}
        onDrop={handlePageDrop}
        className="flex h-[calc(100vh-64px)] overflow-hidden -m-8 relative select-none"
      >
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
          <div className="flex-1 overflow-y-auto px-8 py-8 relative" style={{ background: "#050505" }}>
            {/* Inline floating loading spinner */}
            {uploadingInline && (
              <div className="absolute top-4 right-8 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold animate-pulse">
                <span className="w-3 h-3 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                Processing Image WebP…
              </div>
            )}

            <div className="max-w-3xl mx-auto space-y-6">
              <textarea
                value={post.title}
                onChange={(e) => setPost((p: any) => ({ ...p, title: e.target.value }))}
                placeholder="Enter your article title..."
                rows={2}
                className="w-full bg-transparent text-white font-anton text-4xl uppercase placeholder-gray-800 outline-none resize-none border-b pb-6 leading-tight select-text"
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
                  className="flex-1 bg-transparent text-orange-400 outline-none border-b border-dashed border-orange-500/30 pb-0.5 select-text"
                />
              </div>

              {/* EDITOR TOOLBAR */}
              <EditorToolbar
                onFormat={handleFormat}
                onAIAssist={() => router.push("/admin/ai-writer")}
                onInsertImage={openInsertModal}
                imageAtCursor={imageAtCursor}
                onEditImage={openEditModal}
              />

              {/* Inline image hint */}
              <p className="text-gray-700 text-xs -mt-2">
                💡 Tip: click <strong className="text-gray-600">🖼 Image</strong> · paste image (Ctrl+V) · drag & drop anywhere · Backspace/Delete block directly
              </p>

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
                    onKeyDown: handleTextareaKeyDown,
                    onDrop: handleTextareaDrop,
                    onDragOver: handleTextareaDragOver,
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
                  className="w-full bg-transparent text-gray-400 text-sm outline-none resize-none placeholder-gray-700 leading-relaxed select-text"
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

          <div className="flex-1 overflow-y-auto font-sans">
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

        {/* FLOATING IMAGE CONTEXT BUBBLE MENU */}
        {bubbleMenuOpen && (
          <div
            className="absolute z-50 flex items-center gap-1.5 p-2 rounded-2xl border shadow-2xl bg-[#090909]/95 text-white backdrop-blur-md"
            style={{
              top: bubbleMenuPosition.top,
              left: bubbleMenuPosition.left,
              transform: "translateX(-50%)",
              borderColor: "rgba(255,255,255,0.08)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.85)",
            }}
          >
            <button
              onClick={handleReplaceInline}
              className="px-2.5 py-1 text-xs hover:bg-white/[0.06] rounded-lg font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              🔄 Replace
            </button>
            <button
              onClick={handleResizeInline}
              className="px-2.5 py-1 text-xs hover:bg-white/[0.06] rounded-lg font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              ⚙️ Spacing/Size
            </button>
            <div className="w-px h-4 bg-white/10 mx-0.5" />
            <button
              onClick={handleDuplicateInline}
              className="px-2.5 py-1 text-xs hover:bg-orange-500/10 rounded-lg font-bold text-orange-400 hover:text-orange-300 transition-all cursor-pointer"
            >
              ♊ Duplicate
            </button>
            <button
              onClick={handleDeleteInline}
              className="px-2.5 py-1 text-xs hover:bg-red-500/10 rounded-lg font-bold text-red-400 hover:text-red-300 transition-all cursor-pointer"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* FULLSCREEN DRAG DROP OVERLAY */}
      {dragOverPage && (
        <div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center pointer-events-none"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        >
          <div className="p-10 rounded-[32px] border-2 border-dashed border-orange-500 bg-black/60 flex flex-col items-center gap-4 text-center max-w-sm">
            <span className="text-5xl animate-bounce">📥</span>
            <p className="text-white font-extrabold text-lg uppercase tracking-wider">Drop Image Block</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Drop your image anywhere on the page to automatically convert to WebP, compress, and insert at cursor.
            </p>
          </div>
        </div>
      )}

      {/* INLINE IMAGE MODAL */}
      <AnimatePresence>
        {imageModalOpen && (
          <InlineImageModal
            onInsert={handleImageInsert}
            onClose={() => {
              setImageModalOpen(false);
              setImageEditConfig(undefined);
              setImageEditRange(null);
              setIsEditMode(false);
            }}
            initialConfig={imageEditConfig}
            editMode={isEditMode}
          />
        )}
      </AnimatePresence>
    </>
  );
}
