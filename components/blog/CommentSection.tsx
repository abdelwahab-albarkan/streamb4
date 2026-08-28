"use client";

import React from "react";

export default function CommentSection({ postSlug: _ }: { postSlug: string }) {
  return (
    <div className="space-y-8">
      <div
        className="p-6 rounded-[24px]"
        style={{
          background: "rgba(15,15,15,0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h4 className="text-white font-black text-lg mb-4 uppercase tracking-wider">Discussion</h4>
        <p className="text-gray-500 text-sm leading-relaxed">
          Comments are temporarily unavailable. To share your thoughts, reach us at{" "}
          <a
            href="mailto:support@streamb4.com"
            className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
          >
            support@streamb4.com
          </a>{" "}
          or join the conversation on our{" "}
          <a
            href="https://discord.gg/BFr5HSZfk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
          >
            Discord
          </a>
          .
        </p>
      </div>
    </div>
  );
}
