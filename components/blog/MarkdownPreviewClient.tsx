"use client";

import dynamic from "next/dynamic";

const MarkdownPreview = dynamic(() => import("@/components/blog/MarkdownPreview"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/[0.04] rounded"
          style={{ width: `${70 + Math.sin(i) * 25}%` }}
        />
      ))}
    </div>
  ),
});

export default function MarkdownPreviewClient({ source }: { source: string }) {
  return <MarkdownPreview source={source} />;
}
