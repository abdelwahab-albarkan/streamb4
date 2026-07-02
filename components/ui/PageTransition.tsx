"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * PageTransition — fade-in only, no exit animation.
 *
 * Why no AnimatePresence / mode="wait":
 * In Next.js App Router, page children are React Server Components streamed
 * asynchronously. AnimatePresence mode="wait" unmounts the old page BEFORE
 * the new RSC payload arrives, creating a blank-page gap on every client
 * navigation. Removing the exit animation eliminates the gap entirely while
 * keeping the smooth fade-in entry effect.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
