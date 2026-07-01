import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div className="relative w-9 h-9 flex-shrink-0">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FFA726" />
            </linearGradient>
          </defs>
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="url(#logoGrad)"
            strokeWidth="1.5"
          />
          <circle cx="20" cy="20" r="14" fill="#111111" />
          <polygon points="16,13 16,27 30,20" fill="url(#logoGrad)" />
        </svg>
      </div>

      {/* Wordmark — ONE word, no space */}
      <div className="flex items-baseline">
        <span
          className="font-black text-xl tracking-tight leading-none text-white"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          STREAM
        </span>
        <span
          className="font-black text-xl tracking-tight leading-none"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #FF7A00, #FFA726)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          B4
        </span>
      </div>
    </div>
  );
}
