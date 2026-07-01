"use client";

import { useEffect } from "react";

export default function ViewIncrementTrigger({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blog/${slug}`, { method: "POST" }).catch((err) =>
      console.error("Failed to increment views:", err)
    );
  }, [slug]);

  return null;
}
