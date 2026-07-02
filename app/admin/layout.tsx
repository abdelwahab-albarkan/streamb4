"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopbar from "@/components/admin/layout/AdminTopbar";
import { ToastProvider } from "@/components/admin/ui/Toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // The login page renders only the centered card — no sidebar, no topbar.
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <ToastProvider>
        <div style={{ background: "#050505", minHeight: "100vh" }}>
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "#050505" }}
      >
        <AdminSidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#050505]">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
