"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/layout/Logo";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-6"
      style={{ background: "#050505" }}
    >
      {/* Background SVG Noise */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none" aria-hidden="true">
        <filter id="login-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#login-noise)" />
      </svg>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,122,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,122,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Center Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(255,122,0,0.08), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-[420px] z-10 p-8 rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(5,5,5,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h2
            className="font-anton text-2xl uppercase tracking-wider text-white mt-4 text-center"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
          >
            ADMIN GATEWAY
          </h2>
          <p className="text-gray-500 text-xs text-center mt-1">
            Access credentials to manage STREAMB4 platform.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@streamb4.com"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-700 outline-none focus:border-orange-500/40 transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
              SECURE PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-700 outline-none focus:border-orange-500/40 transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl text-xs font-black text-black tracking-wider uppercase whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #ff8a00, #ffb347)",
              boxShadow: "0 0 25px rgba(255,122,0,0.35)",
            }}
          >
            {loading ? "Authenticating..." : "AUTHORIZE ACCESS ⚡"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
