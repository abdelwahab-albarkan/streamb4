"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, scaleIn, slideLeft, slideRight } from "@/lib/animations";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight";
}

const variants = { fadeUp, fadeIn, scaleIn, slideLeft, slideRight };

export default function ScrollReveal({
  children,
  delay = 0,
  className,
  variant = "fadeUp",
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[variant] as any}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
