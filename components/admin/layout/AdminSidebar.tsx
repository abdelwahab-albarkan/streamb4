"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
      { label: "Dashboard",  href: "/admin",           icon: <FeatureChart size="sm" /> },
      { label: "Analytics",  href: "/admin/analytics", icon: <FeatureChart size="sm" /> },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Blog Posts",    href: "/admin/posts",      icon: <FeatureFile  size="sm" />, count: 24  },
      { label: "IPTV Players",  href: "/admin/players",    icon: <FeatureStar  size="sm" /> },
      { label: "Media Library", href: "/admin/media",      icon: <FeatureImage size="sm" />, count: 142 },
      { label: "Categories",    href: "/admin/categories", icon: <FeatureFile  size="sm" /> },
      { label: "Tags",          href: "/admin/tags",       icon: <FeatureFile  size="sm" /> },
    ],
  },
  {
    title: "SEO",
    items: [
      { label: "SEO Center",        href: "/admin/seo",            icon: <FeatureSearch size="sm" /> },
      { label: "AI Writer",         href: "/admin/ai-writer",      icon: <FeatureStar   size="sm" /> },
      { label: "Publishing Center", href: "/admin/publishing",     icon: <FeatureNoLock size="sm" /> },
      { label: "Search Console",    href: "/admin/search-console", icon: <FeatureSearch size="sm" /> },
      { label: "Performance",       href: "/admin/performance",    icon: <FeatureChart  size="sm" /> },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users",      href: "/admin/users",    icon: <FeatureUsers    size="sm" /> },
      { label: "Settings",   href: "/admin/settings", icon: <FeatureSettings size="sm" /> },
      { label: "Audit Logs", href: "/admin/logs",     icon: <FeatureSettings size="sm" /> },
    ],
  },
];

// ─── Profile dropdown menu ────────────────────────────────────────────────────

function ProfileCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await fetch("/api/admin/auth/logout", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const dropdownItems = [
    {
      label: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
      href: "/admin/users",
    },
    {
      label: "Settings",
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      href: "/admin/settings",
    },
  ];

  return (
    <div className="p-4 border-t border-white/[0.04]" ref={ref}>
      {/* Dropdown panel — opens upward */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mb-2 rounded-xl overflow-hidden"
            style={{
              background: "rgba(14,14,14,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {/* Menu header */}
            <div className="px-4 py-3 border-b border-white/[0.04]">
              <p className="text-white text-xs font-black">Admin Account</p>
              <p className="text-gray-600 text-[11px] mt-0.5">admin@streamb4.com</p>
            </div>

            {/* Nav items */}
            <div className="py-1">
              {dropdownItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors text-xs font-semibold"
                >
                  <span className="text-gray-600">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Divider + Logout */}
            <div className="border-t border-white/[0.04] py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile trigger card */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group"
        style={{
          background: open ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${open ? "rgba(255,122,0,0.2)" : "rgba(255,255,255,0.04)"}`,
        }}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-black text-black text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)" }}
        >
          A
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-white text-xs font-bold truncate">Admin</p>
          <p className="text-gray-600 text-[11px] truncate">admin@streamb4.com</p>
        </div>

        {/* Chevron */}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </motion.svg>
      </button>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [pathname, setMobileOpen]);

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
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/[0.04] flex items-center justify-between">
          <span className="font-black text-lg select-none">
            <span className="text-white">STREAM</span>
            <span style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              B4
            </span>
          </span>
          <span className="text-gray-700 text-xs ml-2 font-bold uppercase tracking-wider">Admin</span>
        </div>

        {/* Nav */}
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
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group"
                      style={
                        isActive
                          ? { background: "linear-gradient(135deg,#ff8a00,#ffb347)", boxShadow: "0 0 20px rgba(255,122,0,0.25)", color: "#000" }
                          : { color: "#888" }
                      }
                    >
                      <span className={`${isActive ? "text-black" : "text-gray-600 group-hover:text-orange-500"} transition-colors`}>
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

        {/* Profile card with dropdown — shown only for authenticated users (non-login pages) */}
        <ProfileCard />
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
