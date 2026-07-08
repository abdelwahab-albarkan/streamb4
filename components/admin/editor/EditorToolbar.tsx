"use client";

import React from "react";
import { motion } from "framer-motion";

interface EditorToolbarProps {
  onFormat: (format: string) => void;
  onAIAssist?: () => void;
  /** Opens the full InlineImageModal — if not provided falls back to inserting a raw markdown image stub */
  onInsertImage?: () => void;
  /** When true, the Image button shows "Edit Image" (cursor is inside an image block) */
  imageAtCursor?: boolean;
  /** Opens the image modal in edit mode when cursor is inside a figure block */
  onEditImage?: () => void;
}

const tools = [
  { group: "heading", items: ["H1", "H2", "H3"] },
  { group: "format",  items: ["Bold", "Italic", "Strike", "Code"] },
  { group: "list",    items: ["Bullet", "Numbered", "Quote"] },
  { group: "insert",  items: ["Link", "Table", "Divider"] }, // Image moved out — handled separately
  { group: "block",   items: ["FAQ", "CTA", "Callout", "Columns"] },
];

export default function EditorToolbar({
  onFormat,
  onAIAssist,
  onInsertImage,
  imageAtCursor,
  onEditImage,
}: EditorToolbarProps) {
  return (
    <div
      className="flex items-center gap-1 flex-wrap p-3 rounded-[16px] mb-4"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {tools.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1">
          {group.items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onFormat(item)}
              className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150 text-xs font-bold cursor-pointer"
            >
              {item}
            </button>
          ))}
          {gi < tools.length - 1 && <div className="w-px h-4 mx-1 bg-white/[0.06]" />}
        </div>
      ))}

      {/* ── Inline Image Button ── */}
      <div className="w-px h-4 mx-1 bg-white/[0.06]" />
      {imageAtCursor ? (
        /* Edit Image — cursor is inside an existing <figure> block */
        <button
          type="button"
          onClick={onEditImage ?? onInsertImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all duration-150"
          style={{
            background: "rgba(255,122,0,0.12)",
            border:     "1px solid rgba(255,122,0,0.3)",
            color:      "#ff7a00",
          }}
          title="Edit the image at cursor position"
        >
          ✏️ Edit Image
        </button>
      ) : (
        /* Insert Image */
        <button
          type="button"
          onClick={onInsertImage ?? (() => onFormat("Image"))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150 text-xs font-bold cursor-pointer"
          title="Insert image at cursor position"
        >
          🖼 Image
        </button>
      )}

      {/* ── AI Assist ── */}
      {onAIAssist && (
        <div className="ml-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onAIAssist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer"
            style={{
              background: "linear-gradient(135deg,rgba(255,122,0,0.15),rgba(255,179,0,0.08))",
              border:     "1px solid rgba(255,122,0,0.25)",
              color:      "#ff7a00",
            }}
          >
            ✨ AI Assist
          </motion.button>
        </div>
      )}
    </div>
  );
}
