"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FeatureChart,
  FeatureFile,
  FeatureImage,
  FeatureSearch,
  FeatureStar,
  FeatureUsers,
  FeatureSettings,
  FeatureNoLock
} from "@/components/ui/icons";

const navSections = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/admin", icon: <FeatureChart size="sm" /> },
      { label: "Analytics", href: "/admin/analytics", icon: <FeatureChart size="sm" /> },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Blog Posts", href: "/admin/posts", icon: <FeatureFile size="sm" />, count: 24 },
      { label: "IPTV Players", href: "/admin/players", icon: <FeatureStar size="sm" /> },
      { label: "Media Library", href: "/admin/media", icon: <FeatureImage size="sm" />, count: 142 },
      { label: "Categories", href: "/admin/categories", icon: <FeatureFile size="sm" /> },
      { label: "Tags", href: "/admin/tags", icon: <FeatureFile size="sm" /> },
    ],
  },
  {
    title: "SEO",
    items: [
      { label: "SEO Center", href: "/admin/seo", icon: <FeatureSearch size="sm" /> },
      { label: "AI Writer", href: "/admin/ai-writer", icon: <FeatureStar size="sm" /> },
      { label: "Publishing Center", href: "/admin/publishing", icon: <FeatureNoLock size="sm" /> },
      { label: "Search Console", href: "/admin/search-console", icon: <FeatureSearch size="sm" /> },
      { label: "Performance", href: "/admin/performance", icon: <FeatureChart size="sm" /> },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users", href: "/admin/users", icon: <FeatureUsers size="sm" /> },
      { label: "Settings", href: "/admin/settings", icon: <FeatureSettings size="sm" /> },
      { label: "Audit Logs", href: "/admin/logs", icon: <FeatureSettings size="sm" /> },
    ],
  },
];

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, setMobileOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] h-full flex flex-col border-r shrink-0 transform transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "#080808",
          borderColor: "rgba(255,255,255,0.04)",
        }}
      >
      {/* Logo Section */}
      <div className="px-6 py-5 border-b border-white/[0.04] flex items-center justify-between">
        <span className="font-black text-lg select-none">
          <span className="text-white">STREAM</span>
          <span style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>B4</span>
        </span>
        <span className="text-gray-700 text-xs ml-2 font-bold uppercase tracking-wider">Admin</span>
      </div>

      {/* Nav Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h4 className="text-gray-600 text-[10px] font-black tracking-[0.2em] uppercase px-3">
              {section.title}
            </h4>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group`}
                    style={
                      isActive
                        ? {
                            background: "linear-gradient(135deg,#ff8a00,#ffb347)",
                            boxShadow: "0 0 20px rgba(255,122,0,0.25)",
                            color: "#000",
                          }
                        : {
                            color: "#888",
                          }
                    }
                  >
                    <span
                      className={`${
                        isActive ? "text-black" : "text-gray-600 group-hover:text-orange-500"
                      } transition-colors`}
                    >
                      {item.icon}
                    </span>
                    <span className={isActive ? "text-black" : "group-hover:text-white transition-colors"}>
                      {item.label}
                    </span>

                    {item.count && (
                      <span
                        className="ml-auto text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: isActive ? "rgba(0,0,0,0.15)" : "rgba(255,122,0,0.15)",
                          color: isActive ? "#000" : "#ff7a00",
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom User Card */}
      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-black text-black text-sm"
            style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)" }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Admin</p>
            <p className="text-gray-600 text-[11px] truncate">admin@streamb4.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-400 transition-colors text-xs flex items-center gap-1 cursor-pointer font-bold"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}
    </>
  );
}
