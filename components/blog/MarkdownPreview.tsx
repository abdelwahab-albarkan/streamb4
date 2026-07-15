"use client";

import React from "react";
import MDEditorPreview from "@uiw/react-markdown-preview";
import type { PluggableList } from "unified";

// Rehype plugin: wraps every <table> in <div class="table-wrapper">
// so the table scrolls horizontally without the page overflowing.
function rehypeWrapTables() {
  return function (tree: any) {
    function walk(node: any) {
      if (!Array.isArray(node.children)) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === "element" && child.tagName === "table") {
          node.children[i] = {
            type: "element",
            tagName: "div",
            properties: { className: ["table-wrapper"] },
            children: [child],
          };
        } else {
          walk(child);
        }
      }
    }
    walk(tree);
  };
}

const REHYPE_PLUGINS: PluggableList = [rehypeWrapTables];

export default function MarkdownPreview({ source }: { source: string }) {
  return (
    <div data-color-mode="dark">
      <MDEditorPreview
        source={source}
        style={{ background: "transparent", color: "inherit" }}
        rehypePlugins={REHYPE_PLUGINS}
      />
    </div>
  );
}
