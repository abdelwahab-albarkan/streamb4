"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BookmarkProps {
  postId: string;
  postTitle: string;
  postSlug: string;
}

export default function BookmarkButton({ postId, postTitle, postSlug }: BookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks: { id: string }[] = JSON.parse(localStorage.getItem("streamb4_bookmarks") || "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsBookmarked(bookmarks.some((b) => b.id === postId));
  }, [postId]);

  const toggleBookmark = () => {
    const bookmarks: { id: string; title: string; slug: string; savedAt: string }[] = JSON.parse(localStorage.getItem("streamb4_bookmarks") || "[]");

    if (isBookmarked) {
      const updated = bookmarks.filter((b) => b.id !== postId);
      localStorage.setItem("streamb4_bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      bookmarks.push({
        id: postId,
        title: postTitle,
        slug: postSlug,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem("streamb4_bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  return (
    <motion.button
      onClick={toggleBookmark}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer"
      style={
        isBookmarked
          ? {
              background: "rgba(255,122,0,0.1)",
              border: "1px solid rgba(255,122,0,0.3)",
              color: "#ff7a00",
            }
          : {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#888",
            }
      }
    >
      {isBookmarked ? "🔖 Saved" : "📌 Save"}
    </motion.button>
  );
}
