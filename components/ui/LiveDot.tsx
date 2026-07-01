import React from "react";

export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-3 w-3 ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
    </span>
  );
}
