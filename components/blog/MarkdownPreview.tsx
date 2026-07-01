"use client";

import React from "react";
import dynamic from "next/dynamic";

// Import dynamic renderer safely on client side
const MDEditorPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  { ssr: false }
);

export default function MarkdownPreview({ source }: { source: string }) {
  return (
    <div data-color-mode="dark">
      <MDEditorPreview source={source} style={{ background: "transparent", color: "inherit" }} />
    </div>
  );
}
