"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Star,
  Image,
  Tag,
  FolderOpen,
  Search,
  Wand2,
  Globe,
  Monitor,
  Zap,
  Users,
  Settings,
  ScrollText,
  ChevronUp,
  ChevronLeft,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// ─── Collapse context ─────────────────────────────────────────────────────────

const CollapseContext = createContext<{ collapsed: boolean }>({ collapsed: false });
const useCollapsed = () => useContext(CollapseContext);

// ─── Nav definition ───────────────────────────────────────────────────────────

const navSections = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard },
      { label: "Analytics",  href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Blog Posts",    href: "/admin/posts",      icon: FileText,   count: null },
      { label: "IPTV Players",  href: "/admin/players",    icon: Star },
      { label: "Media Library", href: "/admin/media",      icon: Image,      count: null },
      { label: "Categories",    href: "/admin/categories", icon: FolderOpen },
      { label: "Tags",          href: "/admin/tags",       icon: Tag },
    ],
  },
  {
    title: "SEO & AI",
    items: [
      { label: "SEO Center",        href: "/admin/seo",            icon: Search },
      { label: "AI Writer",         href: "/admin/ai-writer",      icon: Wand2 },
      { label: "Publishing",        href: "/admin/publishing",     icon: Globe },
      { label: "Search Console",    href: "/admin/search-console", icon: Monitor },
      { label: "Performance",       href: "/admin/performance",    icon: Zap },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users",      href: "/admin/users",    icon: Users },
      { label: "Settings",   href: "/admin/settings", icon: Settings },
      { label: "Tools",      href: "/admin/tools",    icon: Zap },
      { label: "Audit Logs", href: "/admin/logs",     icon: ScrollText },
    ],
  },
];

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────

function NavTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const { collapsed } = useCollapsed();
  if (!collapsed) return <>{children}</>;
  return (
    <div className="relative group/tip">
      {children}
      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
        px-2.5 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0
        group-hover/tip:opacity-100 transition-opacity"
        style={{ background: "rgba(20,20,20,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[rgba(20,20,20,0.98)]" />
      </div>
    </div>
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({ item, isActive }: { item: (typeof navSections)[0]["items"][0]; isActive: boolean }) {
  const { collapsed } = useCollapsed();
  const Icon = item.icon;

  return (
    <NavTooltip label={item.label}>
      <Link
        href={item.href}
        className="relative flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-150 group"
        style={{
          padding: collapsed ? "10px" : "10px 12px",
          justifyContent: collapsed ? "center" : "flex-start",
          background: isActive ? "rgba(255,122,0,0.12)" : "transparent",
          color: isActive ? "#FF7A00" : "#666",
        }}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Active left bar */}
        {isActive && (
          <motion.div
            layoutId="activeBar"
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: "linear-gradient(180deg,#FF7A00,#ffb300)" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}

        {/* Icon */}
        <Icon
          size={16}
          strokeWidth={isActive ? 2.5 : 1.8}
          className="flex-shrink-0 transition-colors"
          style={{ color: isActive ? "#FF7A00" : undefined }}
        />

        {/* Label */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className={`truncate flex-1 ${!isActive && "group-hover:text-white transition-colors"}`}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Count badge */}
        {!collapsed && (item as { count?: number | null }).count != null && (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold"
            style={{
              background: isActive ? "rgba(255,122,0,0.2)" : "rgba(255,255,255,0.05)",
              color: isActive ? "#FF7A00" : "#555",
            }}>
            {(item as { count?: number | null }).count}
          </span>
        )}
      </Link>
    </NavTooltip>
  );
}

// ─── Profile card ─────────────────────────────────────────────────────────────

function ProfileCard() {
  const router = useRouter();
  const { collapsed } = useCollapsed();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await fetch("/api/admin/auth/logout", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch { /* ignore */ }
  };

  return (
    <div className="border-t border-white/[0.04] p-3" ref={ref}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="mb-2 rounded-xl overflow-hidden"
            style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 -12px 40px rgba(0,0,0,0.6)" }}
          >
            <div className="px-4 py-3 border-b border-white/[0.04]">
              <p className="text-white text-xs font-black">Admin Account</p>
              <p className="text-gray-600 text-[11px] mt-0.5">admin@streamb4.com</p>
            </div>
            <div className="py-1">
              <Link href="/admin/users" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors text-xs font-semibold">
                <User size={13} className="text-gray-600" />Profile
              </Link>
              <Link href="/admin/settings" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors text-xs font-semibold">
                <Settings size={13} className="text-gray-600" />Settings
              </Link>
            </div>
            <div className="border-t border-white/[0.04] py-1">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors cursor-pointer">
                <LogOut size={13} />Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavTooltip label="Account">
        <button onClick={() => setOpen(v => !v)}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150 cursor-pointer group"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
            background: open ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${open ? "rgba(255,122,0,0.2)" : "rgba(255,255,255,0.04)"}`,
          }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-black text-xs flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)" }}>
            A
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0 text-left">
                <p className="text-white text-xs font-bold truncate">Admin</p>
                <p className="text-gray-600 text-[11px] truncate">admin@streamb4.com</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.2 }}>
              <ChevronUp size={14} className="text-gray-600 group-hover:text-gray-400" />
            </motion.div>
          )}
        </button>
      </NavTooltip>
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <CollapseContext.Provider value={{ collapsed }}>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 overflow-hidden border-r"
        style={{ background: "#080808", borderColor: "rgba(255,255,255,0.04)" }}
      >
        {/* Logo + collapse toggle */}
        <div className="px-4 py-4 border-b border-white/[0.04] flex items-center justify-between flex-shrink-0">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-black text-base select-none flex items-center gap-1.5"
              >
                <span className="text-white">STREAM</span>
                <span style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>B4</span>
                <span className="text-gray-700 text-[10px] font-bold uppercase tracking-widest ml-1">CMS</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCollapsed(v => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-all hover:bg-white/[0.06] flex-shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-700 text-[9px] font-black tracking-[0.22em] uppercase px-4 mb-2"
                  >
                    {section.title}
                  </motion.h4>
                )}
              </AnimatePresence>
              {collapsed && <div className="h-px bg-white/[0.04] mx-3 mb-3 mt-1" />}
              <nav className="space-y-0.5 px-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <NavItem key={item.label} item={item} isActive={isActive} />
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <ProfileCard />
      </motion.aside>

      {/* Mobile: slide-over drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen?.(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col border-r lg:hidden"
              style={{ background: "#080808", borderColor: "rgba(255,255,255,0.04)" }}
            >
              {/* Mobile header */}
              <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
                <span className="font-black text-base select-none">
                  <span className="text-white">STREAM</span>
                  <span style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>B4</span>
                  <span className="text-gray-700 text-[10px] font-bold uppercase tracking-widest ml-1.5">CMS</span>
                </span>
                <button onClick={() => setMobileOpen?.(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* Mobile nav */}
              <div className="flex-1 overflow-y-auto py-4">
                {navSections.map((section) => (
                  <div key={section.title} className="mb-5">
                    <h4 className="text-gray-700 text-[9px] font-black tracking-[0.22em] uppercase px-5 mb-2">{section.title}</h4>
                    <nav className="space-y-0.5 px-3">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href ||
                          (item.href !== "/admin" && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: isActive ? "rgba(255,122,0,0.12)" : "transparent",
                              color: isActive ? "#FF7A00" : "#666",
                            }}
                          >
                            {isActive && (
                              <div className="absolute left-3 top-2 bottom-2 w-0.5 rounded-full bg-orange-500" />
                            )}
                            <Icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className={isActive ? "" : "text-gray-500"}>{item.label}</span>
                            {(item as { count?: number | null }).count != null && (
                              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                style={{ background: "rgba(255,122,0,0.15)", color: "#FF7A00" }}>
                                {(item as { count?: number | null }).count}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.04] p-4">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-black text-xs flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#ff8a00,#ffb347)" }}>A</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold">Admin</p>
                    <p className="text-gray-600 text-[11px]">admin@streamb4.com</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </CollapseContext.Provider>
  );
}
