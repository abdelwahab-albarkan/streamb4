"use client";

import React from "react";
import MDEditorPreview from "@uiw/react-markdown-preview";

export default function MarkdownPreview({ source }: { source: string }) {
  return (
    <div data-color-mode="dark">
      <MDEditorPreview source={source} style={{ background: "transparent", color: "inherit" }} />
    </div>
  );
}
