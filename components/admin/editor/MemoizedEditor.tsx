"use client";

/**
 * MemoizedEditor — React.memo wrapper around MDEditor.
 *
 * WHY: The post editor page re-renders whenever auto-save status, sidebar tabs,
 * SEO scores, or any other piece of page state changes. Without memoization
 * MDEditor re-renders too, even when `value` hasn't changed. With multi-MB
 * content (posts that haven't been migrated yet) each spurious MDEditor
 * re-render can block the main thread for several seconds.
 *
 * HOW: We compare props with a custom equality function that does a strict
 * string compare on `value`. All other props are expected to be stable
 * references (use useCallback for onChange, useMemo for textareaProps, etc.).
 * If any non-value prop changes by reference the component re-renders normally.
 */

import React, { memo } from "react";
import type { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function editorPropsEqual(prev: MDEditorProps, next: MDEditorProps): boolean {
  // Fast path: if the content string is identical, skip re-render regardless
  // of how many other page-level state updates have fired.
  if (prev.value !== next.value) return false;
  // For all other props use reference equality (same as React.memo default)
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]) as Set<keyof MDEditorProps>;
  for (const k of keys) {
    if (k === "value") continue;
    if (prev[k] !== next[k]) return false;
  }
  return true;
}

export const MemoizedEditor = memo(function MemoizedEditorInner(
  props: MDEditorProps
) {
  return <MDEditor {...props} />;
}, editorPropsEqual);
