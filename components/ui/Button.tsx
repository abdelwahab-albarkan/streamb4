import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    primary:
      "bg-[#FF6B00] text-white hover:bg-[#ff8533] shadow-[0_0_20px_rgba(255,107,0,0.35)] hover:shadow-[0_0_30px_rgba(255,107,0,0.55)]",
    outline:
      "border-2 border-[#FF6B00] text-[#FF6B00] bg-transparent hover:bg-[#FF6B00]/10",
    ghost:
      "bg-transparent text-white hover:bg-white/10",
    white:
      "bg-white text-[#0A0A0A] hover:bg-gray-200 font-extrabold",
  };

  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-13 px-8 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
