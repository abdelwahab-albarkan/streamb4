"use client";

import React from "react";
import { motion } from "framer-motion";

interface EditorToolbarProps {
  onFormat: (format: string) => void;
  onAIAssist?: () => void;
}

const tools = [
  { group: "heading", items: ["H1", "H2", "H3"] },
  { group: "format", items: ["Bold", "Italic", "Strike", "Code"] },
  { group: "list", items: ["Bullet", "Numbered", "Quote"] },
  { group: "insert", items: ["Link", "Image", "Table", "Divider"] },
  { group: "block", items: ["FAQ", "CTA", "Callout", "Columns"] },
];

export default function EditorToolbar({ onFormat, onAIAssist }: EditorToolbarProps) {
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

      {/* AI Assist button */}
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
              border: "1px solid rgba(255,122,0,0.25)",
              color: "#ff7a00",
            }}
          >
            ✨ AI Assist
          </motion.button>
        </div>
      )}
    </div>
  );
}
