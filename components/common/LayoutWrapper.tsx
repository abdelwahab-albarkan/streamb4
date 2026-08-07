"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import PageTransition from "@/components/ui/PageTransition";
import { LazyMotion, domAnimation } from "framer-motion";

// MouseGlow is desktop-only (pointer:fine) — lazy load so it never ships to mobile
const MouseGlow = dynamic(() => import("@/components/ui/MouseGlow"), { ssr: false });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname === "/offline";
  // Only mount MouseGlow on fine-pointer devices (desktop/laptop with a mouse)
  const [hasFinePointer, setHasFinePointer] = useState(false);
  useEffect(() => {
    setHasFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <LazyMotion features={domAnimation}>
      {hasFinePointer && <MouseGlow />}
      <Navbar />
      <PageTransition>
        <main id="main-content">{children}</main>
      </PageTransition>
      <Footer />
      <WhatsAppButton />
    </LazyMotion>
  );
}
