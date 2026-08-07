"use client";

import React from "react";

interface AmbientGlowProps {
  position?: "left" | "right" | "center";
  opacity?: number;
}

export default function AmbientGlow({
  position = "right",
  opacity = 0.12,
}: AmbientGlowProps) {
  const positions = {
    left: { left: "-100px", top: "50%", transform: "translateY(-50%)" },
    right: { right: "-100px", top: "50%", transform: "translateY(-50%)" },
    center: { left: "50%", top: "50%", transform: "translate(-50%,-50%)" },
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...positions[position],
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,122,0,${opacity}) 0%, transparent 70%)`,
        filter: "blur(80px)",
      }}
    />
  );
}
