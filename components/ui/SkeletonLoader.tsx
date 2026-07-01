"use client";

import React from "react";
import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div
      className="rounded-[20px] overflow-hidden p-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Icon skeleton */}
      <motion.div
        className="w-14 h-14 rounded-2xl mb-6"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ background: "rgba(255,122,0,0.1)" }}
      />
      {/* Title skeleton */}
      <motion.div
        className="h-5 rounded-lg mb-3 w-3/4"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
      {/* Text skeleton */}
      <motion.div
        className="h-3 rounded-lg mb-2 w-full"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
      <motion.div
        className="h-3 rounded-lg w-5/6"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
    </div>
  );
}

export function SkeletonPoster() {
  return (
    <motion.div
      className="rounded-xl aspect-[2/3]"
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}
