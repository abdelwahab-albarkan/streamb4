"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function GlowCard({ children, className, style }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative overflow-hidden ${className || ""}`}
      style={style}
    >
      {/* Mouse glow effect */}
      <motion.div
        className="pointer-events-none absolute z-10 w-40 h-40 rounded-full"
        style={{
          left: glowPos.x - 80,
          top: glowPos.y - 80,
          background: "radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {children}
    </motion.div>
  );
}
