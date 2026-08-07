"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div
      className="rounded-[20px] overflow-hidden p-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl mb-6"
        style={{ background: "rgba(255,122,0,0.1)", animation: "skeletonPulse 1.5s ease-in-out infinite" }}
      />
      <div
        className="h-5 rounded-lg mb-3 w-3/4"
        style={{ background: "rgba(255,255,255,0.08)", animation: "skeletonPulse 1.5s ease-in-out 0.1s infinite" }}
      />
      <div
        className="h-3 rounded-lg mb-2 w-full"
        style={{ background: "rgba(255,255,255,0.05)", animation: "skeletonPulse 1.5s ease-in-out 0.2s infinite" }}
      />
      <div
        className="h-3 rounded-lg w-5/6"
        style={{ background: "rgba(255,255,255,0.05)", animation: "skeletonPulse 1.5s ease-in-out 0.3s infinite" }}
      />
    </div>
  );
}

export function SkeletonPoster() {
  return (
    <div
      className="rounded-xl aspect-[2/3]"
      style={{ background: "rgba(255,255,255,0.06)", animation: "skeletonPulse 1.5s ease-in-out infinite" }}
    />
  );
}
