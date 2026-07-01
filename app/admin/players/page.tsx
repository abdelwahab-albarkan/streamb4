"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Player {
  id: string;
  name: string;
  recommended: boolean;
  featured: boolean;
  enabled: boolean;
  downloaderCode: string;
  website: string;
  apkUrl: string;
  logo: string;
  version: string;
  lastUpdated: string;
  platforms: string[];
  order: number;
}

const ALL_PLATFORMS = [
  "Firestick", "Android TV", "Google TV", "Samsung", "LG",
  "Apple TV", "Windows", "Mac", "Linux", "Android", "iPhone", "TV Box",
];

const EMPTY_PLAYER: Omit<Player, "id"> = {
  name: "",
  recommended: false,
  featured: false,
  enabled: true,
  downloaderCode: "",
  website: "",
  apkUrl: "",
  logo: "",
  version: "",
  lastUpdated: new Date().toISOString().slice(0, 10),
  platforms: [],
  order: 99,
};

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl"
      style={{
        background: type === "success" ? "#0d1a0d" : "#1a0d0d",
        border: `1px solid ${type === "success" ? "rgba(80,200,80,0.4)" : "rgba(255,60,60,0.4)"}`,
        color: type === "success" ? "#6ee77a" : "#ff7070",
      }}
    >
      <span>{type === "success" ? "✓" : "✗"}</span>
      {msg}
    </motion.div>
  );
}

// ─── Player Form Modal ────────────────────────────────────────────────────────
function PlayerModal({
  initial,
  onSave,
  onClose,
}: {
  initial: Partial<Player> | null;
  onSave: (data: Partial<Player>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Player, "id">>({
    ...EMPTY_PLAYER,
    ...(initial ?? {}),
  });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const togglePlatform = (p: string) => {
    set(
      "platforms",
      form.platforms.includes(p)
        ? form.platforms.filter((x) => x !== p)
        : [...form.platforms, p]
    );
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("logo", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="w-full max-w-2xl rounded-[24px] overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,122,0,0.25)",
          boxShadow: "0 0 60px rgba(255,122,0,0.1)",
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-7 py-5 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h2 className="font-black text-white text-lg">
            {initial?.id ? "Edit Player" : "Add New Player"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center
              text-gray-500 hover:text-white hover:bg-white/10
              transition-all cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        {/* Scrollable form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 px-7 py-6 space-y-5"
        >
          {/* Logo upload */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
              App Logo
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-[14px] overflow-hidden flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-700 text-xl">📷</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-[10px] text-xs font-black
                    uppercase tracking-wider cursor-pointer transition-all"
                  style={{
                    background: "rgba(255,122,0,0.1)",
                    border: "1px solid rgba(255,122,0,0.25)",
                    color: "#ff7a00",
                  }}
                >
                  Upload File
                </button>
                <input
                  type="url"
                  placeholder="Or paste image URL…"
                  value={form.logo}
                  onChange={(e) => set("logo", e.target.value)}
                  className="px-3 py-2 rounded-[8px] text-xs text-white bg-white/[0.04]
                    border border-white/[0.07] outline-none placeholder-gray-700"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoFile}
                />
              </div>
            </div>
          </div>

          {/* Name + Version */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                App Name *
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. IPTV Smarters Pro"
                className="w-full px-4 py-2.5 rounded-[10px] text-sm text-white
                  bg-white/[0.04] border border-white/[0.07] outline-none
                  placeholder-gray-700 focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                Version
              </label>
              <input
                type="text"
                value={form.version}
                onChange={(e) => set("version", e.target.value)}
                placeholder="e.g. 5.0"
                className="w-full px-4 py-2.5 rounded-[10px] text-sm text-white
                  bg-white/[0.04] border border-white/[0.07] outline-none
                  placeholder-gray-700 focus:border-orange-500/50"
              />
            </div>
          </div>

          {/* Downloader Code + Last Updated */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                Downloader Code *
              </label>
              <input
                required
                type="text"
                value={form.downloaderCode}
                onChange={(e) => set("downloaderCode", e.target.value)}
                placeholder="e.g. 6468112"
                className="w-full px-4 py-2.5 rounded-[10px] text-sm text-white
                  bg-white/[0.04] border border-white/[0.07] outline-none
                  placeholder-gray-700 focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                Last Updated
              </label>
              <input
                type="date"
                value={form.lastUpdated}
                onChange={(e) => set("lastUpdated", e.target.value)}
                className="w-full px-4 py-2.5 rounded-[10px] text-sm text-white
                  bg-white/[0.04] border border-white/[0.07] outline-none
                  focus:border-orange-500/50"
              />
            </div>
          </div>

          {/* Website + APK URL */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
              Official Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-[10px] text-sm text-white
                bg-white/[0.04] border border-white/[0.07] outline-none
                placeholder-gray-700 focus:border-orange-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
              APK / Download URL
            </label>
            <input
              type="url"
              value={form.apkUrl}
              onChange={(e) => set("apkUrl", e.target.value)}
              placeholder="https://example.com/app.apk"
              className="w-full px-4 py-2.5 rounded-[10px] text-sm text-white
                bg-white/[0.04] border border-white/[0.07] outline-none
                placeholder-gray-700 focus:border-orange-500/50"
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
              Supported Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((p) => {
                const active = form.platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-black
                      uppercase tracking-wider cursor-pointer transition-all"
                    style={
                      active
                        ? {
                            background: "linear-gradient(135deg,#ff7a00,#ffb300)",
                            color: "#000",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#555",
                          }
                    }
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => set("order", parseInt(e.target.value) || 1)}
              className="w-32 px-4 py-2.5 rounded-[10px] text-sm text-white
                bg-white/[0.04] border border-white/[0.07] outline-none
                focus:border-orange-500/50"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { key: "recommended", label: "Recommended", color: "#ff7a00" },
                { key: "featured", label: "Featured", color: "#ffb300" },
                { key: "enabled", label: "Enabled", color: "#50c878" },
              ] as const
            ).map(({ key, label, color }) => (
              <button
                key={key}
                type="button"
                onClick={() => set(key, !form[key])}
                className="flex items-center justify-between px-4 py-3 rounded-[12px]
                  cursor-pointer transition-all"
                style={{
                  background: form[key] ? `${color}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${form[key] ? `${color}40` : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <span
                  className="text-xs font-black uppercase tracking-wider"
                  style={{ color: form[key] ? color : "#555" }}
                >
                  {label}
                </span>
                <div
                  className="w-8 h-4 rounded-full transition-all relative"
                  style={{
                    background: form[key] ? color : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                    style={{ left: form[key] ? "calc(100% - 14px)" : "2px" }}
                  />
                </div>
              </button>
            ))}
          </div>
        </form>

        {/* Footer buttons */}
        <div
          className="flex items-center justify-end gap-3 px-7 py-5 border-t shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-[10px] text-sm font-black
              uppercase tracking-wider cursor-pointer transition-all text-gray-500
              hover:text-white hover:bg-white/[0.06]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={saving}
            className="px-6 py-2.5 rounded-[10px] text-sm font-black
              uppercase tracking-wider cursor-pointer transition-all text-black
              disabled:opacity-60"
            style={{
              background: saving
                ? "rgba(255,122,0,0.4)"
                : "linear-gradient(135deg,#ff7a00,#ffb300)",
            }}
          >
            {saving ? "Saving…" : initial?.id ? "Save Changes" : "Add Player"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    player: Partial<Player> | null;
  }>({ open: false, player: null });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
  };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/players")
      .then((r) => r.json())
      .then((data) => {
        setPlayers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Quick toggle (enabled / recommended / featured)
  const quickToggle = async (player: Player, key: keyof Player) => {
    const updated = { ...player, [key]: !player[key] };
    const res = await fetch(`/api/admin/players/${player.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? updated : p))
      );
      showToast(`${key} updated`);
    }
  };

  // Save (create / update)
  const handleSave = async (data: Partial<Player>) => {
    const isEdit = !!modal.player?.id;
    const url = isEdit
      ? `/api/admin/players/${modal.player!.id}`
      : "/api/admin/players";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showToast(isEdit ? "Player updated" : "Player created");
      setModal({ open: false, player: null });
      load();
    } else {
      showToast("Failed to save player", "error");
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/players/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Player deleted");
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    } else {
      showToast("Delete failed", "error");
    }
    setDeleteId(null);
  };

  const filtered = players.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.downloaderCode.includes(search)
  );

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-['Anton'] text-4xl text-white uppercase"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            IPTV PLAYERS
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {players.length} players · {players.filter((p) => p.enabled).length} enabled
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/players"
            target="_blank"
            className="px-4 py-2.5 rounded-[10px] text-xs font-black uppercase
              tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            ↗ Preview Page
          </a>
          <motion.button
            onClick={() => setModal({ open: true, player: null })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px]
              text-xs font-black uppercase tracking-wider text-black cursor-pointer"
            style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)" }}
          >
            <span className="text-base leading-none">+</span>
            Add Player
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Search players…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[10px] text-sm text-white
            placeholder-gray-600 outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-[20px] overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,10,0.8)",
        }}
      >
        {/* Table header */}
        <div
          className="grid gap-4 px-6 py-3 text-[11px] font-black uppercase
            tracking-wider text-gray-600"
          style={{
            gridTemplateColumns: "60px 1fr 130px 160px 90px 90px 90px 100px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span>Logo</span>
          <span>Name</span>
          <span>Code</span>
          <span>Platforms</span>
          <span>Enabled</span>
          <span>Rec.</span>
          <span>Order</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            No players found
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((player) => (
              <motion.div
                key={player.id}
                layout
                className="grid gap-4 px-6 py-4 items-center hover:bg-white/[0.02]
                  transition-colors"
                style={{
                  gridTemplateColumns: "60px 1fr 130px 160px 90px 90px 90px 100px",
                }}
              >
                {/* Logo */}
                <div
                  className="w-10 h-10 rounded-[10px] overflow-hidden flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {player.logo ? (
                    <img
                      src={player.logo}
                      alt={player.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-orange-500 text-xs font-black">
                      {player.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <p className="font-black text-white text-sm truncate">
                    {player.name}
                  </p>
                  {player.recommended && (
                    <span className="text-[10px] text-orange-500 font-bold">
                      ⭐ Recommended
                    </span>
                  )}
                  {player.website && (
                    <a
                      href={player.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[10px] text-gray-600 hover:text-orange-500
                        transition-colors truncate"
                    >
                      {player.website}
                    </a>
                  )}
                </div>

                {/* Code */}
                <span className="font-mono text-sm font-bold text-orange-400">
                  {player.downloaderCode}
                </span>

                {/* Platforms */}
                <div className="flex flex-wrap gap-1">
                  {player.platforms.slice(0, 3).map((p) => (
                    <span
                      key={p}
                      className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                      style={{
                        background: "rgba(255,122,0,0.1)",
                        color: "#ff7a00",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                  {player.platforms.length > 3 && (
                    <span className="text-[9px] text-gray-600">
                      +{player.platforms.length - 3}
                    </span>
                  )}
                </div>

                {/* Enabled toggle */}
                <button
                  onClick={() => quickToggle(player, "enabled")}
                  className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                  style={{
                    background: player.enabled
                      ? "rgba(80,200,120,0.3)"
                      : "rgba(255,255,255,0.08)",
                    border: `1px solid ${player.enabled ? "rgba(80,200,120,0.5)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div
                    className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
                    style={{
                      background: player.enabled ? "#50c878" : "#444",
                      left: player.enabled ? "calc(100% - 16px)" : "2px",
                    }}
                  />
                </button>

                {/* Recommended toggle */}
                <button
                  onClick={() => quickToggle(player, "recommended")}
                  className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                  style={{
                    background: player.recommended
                      ? "rgba(255,122,0,0.2)"
                      : "rgba(255,255,255,0.08)",
                    border: `1px solid ${player.recommended ? "rgba(255,122,0,0.4)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div
                    className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
                    style={{
                      background: player.recommended ? "#ff7a00" : "#444",
                      left: player.recommended ? "calc(100% - 16px)" : "2px",
                    }}
                  />
                </button>

                {/* Order */}
                <span className="text-gray-600 text-sm text-center">
                  #{player.order}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setModal({ open: true, player })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center
                      cursor-pointer transition-all text-gray-500 hover:text-white"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    title="Edit"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={() => setDeleteId(player.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center
                      cursor-pointer transition-all text-gray-600 hover:text-red-400"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    title="Delete"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal.open && (
          <PlayerModal
            initial={modal.player}
            onSave={handleSave}
            onClose={() => setModal({ open: false, player: null })}
          />
        )}

        {deleteId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm p-8 rounded-[20px] text-center"
              style={{
                background: "#0c0c0c",
                border: "1px solid rgba(255,60,60,0.3)",
              }}
            >
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="font-black text-white text-lg mb-2">Delete Player?</h3>
              <p className="text-gray-500 text-sm mb-7">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-[10px] text-sm font-black
                    uppercase tracking-wider text-gray-400 cursor-pointer
                    hover:bg-white/[0.05] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-[10px] text-sm font-black
                    uppercase tracking-wider text-white cursor-pointer"
                  style={{ background: "rgba(220,60,60,0.8)" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {toast && (
          <Toast
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
