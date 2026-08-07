"use client";

import React from "react";

interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  delay?: number;
  className?: string;
}

export default function FloatingElement({
  children,
  duration = 4,
  distance = 12,
  delay = 0,
  className,
}: FloatingElementProps) {
  return (
    <div
      className={className}
      style={{
        ["--float-dist" as string]: `${distance}px`,
        animation: `floatY ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  );
}
