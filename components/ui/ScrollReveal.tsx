"use client";

import React from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight";
}

export default function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  return (
    <div
      className={className}
      style={{
        animation: `fadeInPage 0.6s ease-out ${delay}s both`,
      }}
    >
      {children}
    </div>
  );
}
