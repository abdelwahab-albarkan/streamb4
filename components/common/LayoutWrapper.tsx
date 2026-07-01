"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import MouseGlow from "@/components/ui/MouseGlow";
import TawkChat from "@/components/common/TawkChat";
import PageTransition from "@/components/ui/PageTransition";
import { LazyMotion, domAnimation } from "framer-motion";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname === "/offline";

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <MouseGlow />
      <Navbar />
      <PageTransition>
        <main id="main-content">{children}</main>
      </PageTransition>
      <Footer />
      <TawkChat />
    </LazyMotion>
  );
}
