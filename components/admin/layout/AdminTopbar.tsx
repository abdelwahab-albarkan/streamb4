"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Sun, Moon } from "lucide-react";

export default function AdminTopbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();

  // Generate simple breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, index) => {
    const url = "/" + segments.slice(0, index + 1).join("/");
    const label = seg.charAt(0).toUpperCase() + seg.slice(1);
    return { label, url };
  });

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-8 border-b z-30"
      style={{
        background: "rgba(5,5,5,0.9)",
        backdropFilter: "blur(24px)",
        borderColor: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Left: Breadcrumbs + Hamburger */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              {idx > 0 && <span className="text-gray-700">/</span>}
              <Link
                href={crumb.url}
                className={`hover:text-white transition-colors ${
                  idx === breadcrumbs.length - 1 ? "text-white font-bold" : ""
                }`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Center: Search Bar (Hidden on Mobile) */}
      <div className="relative hidden md:block">
        <input
          placeholder="Search posts, media, settings..."
          className="w-80 px-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/40 transition-colors duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Theme toggle placeholder */}
        <button className="text-gray-500 hover:text-white transition-colors p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Sun className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button className="relative text-gray-500 hover:text-white transition-colors p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{
              background: "linear-gradient(135deg,#ff8a00,#ffb347)",
              boxShadow: "0 0 10px rgba(255,122,0,0.5)",
            }}
          />
        </button>

        {/* Quick Action: New Post */}
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-black tracking-wide uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg,#ff8a00,#ffb347)",
            boxShadow: "0 0 15px rgba(255,122,0,0.3)",
          }}
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          New Post
        </Link>
      </div>
    </header>
  );
}
