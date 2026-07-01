import React from "react";

interface BadgeProps {
  variant?: "live" | "popular" | "new";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "live", children, className = "" }: BadgeProps) {
  const variants: Record<string, string> = {
    live: "bg-red-600 text-white",
    popular: "bg-[#FF6B00] text-white",
    new: "bg-emerald-500 text-white",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {variant === "live" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
      )}
      {children}
    </span>
  );
}
