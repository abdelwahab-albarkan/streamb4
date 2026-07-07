"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/ui/Toast";

type SettingTab = "general" | "seo" | "social" | "integrations" | "publishing" | "account";

export default function SettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingTab>("general");
  const [settings, setSettings] = useState<any>({
    siteName: "",
    siteUrl: "",
    tagline: "",
    metaTitleTemplate: "",
    defaultMetaDescription: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    discord: "",
    email: "",
    anthropicKey: "",
    tmdbKey: "",
    cloudinaryUrl: "",
  });

  const [saving, setSaving] = useState(false);

  // ── Publishing platforms state ──────────────────────────────────────────
  const [devtoKey,           setDevtoKey]           = useState("");
  const [devtoEnabled,       setDevtoEnabled]       = useState(false);
  const [devtoCanonical,     setDevtoCanonical]     = useState(true);
  const [devtoUsername,      setDevtoUsername]      = useState("");
  const [devtoSaving,        setDevtoSaving]        = useState(false);
  const [bloggerEnabled,     setBloggerEnabled]     = useState(false);
  const [bloggerConnected,   setBloggerConnected]   = useState(false);
  const [bloggerBlogId,      setBloggerBlogId]      = useState("");
  const [bloggerBlogUrl,     setBloggerBlogUrl]     = useState("");
  const [bloggerSaving,      setBloggerSaving]      = useState(false);
  const [bloggerConnecting,  setBloggerConnecting]  = useState(false);
  const [_urlParams,         setUrlParams]          = useState<Record<string,string>>({});

  // Load platform credentials
  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    setUrlParams(params);
    if (params.tab === "publishing") setActiveTab("publishing");
    if (params.blogger_success) addToast("Blogger connected successfully! ✓", "success");
    if (params.blogger_error)   addToast(`Blogger error: ${params.blogger_error}`, "error");

    async function loadPlatforms() {
      try {
        const res  = await fetch("/api/admin/platforms");
        const data = await res.json();
        if (data.success) {
          const devto   = (data.platforms ?? []).find((p: Record<string, unknown>) => p.platform === "devto");
          const blogger = (data.platforms ?? []).find((p: Record<string, unknown>) => p.platform === "blogger");
          if (devto) {
            setDevtoEnabled(devto.enabled ?? false);
            setDevtoCanonical(devto.devtoCanonicalUrlEnabled ?? true);
            setDevtoUsername(devto.devtoUsername ?? "");
            if (devto.devtoApiKey) setDevtoKey("••••••••");
          }
          if (blogger) {
            setBloggerEnabled(blogger.enabled ?? false);
            setBloggerConnected(blogger.bloggerConnected ?? false);
            setBloggerBlogId(blogger.bloggerBlogId ?? "");
            setBloggerBlogUrl(blogger.bloggerBlogUrl ?? "");
          }
        }
      } catch { /* silently fail */ }
    }
    loadPlatforms();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveDevTo = async () => {
    setDevtoSaving(true);
    try {
      const body: Record<string, unknown> = { platform: "devto", enabled: devtoEnabled, devtoCanonicalUrlEnabled: devtoCanonical };
      if (devtoKey && devtoKey !== "••••••••") body.devtoApiKey = devtoKey;
      const res  = await fetch("/api/admin/platforms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { addToast("DEV.to settings saved ✓", "success"); if (devtoKey && devtoKey !== "••••••••") setDevtoKey("••••••••"); }
      else               addToast(data.error ?? "Save failed", "error");
    } catch { addToast("Save failed", "error"); }
    finally  { setDevtoSaving(false); }
  };

  const handleConnectBlogger = async () => {
    setBloggerConnecting(true);
    try {
      const res  = await fetch("/api/admin/publish/blogger?action=auth");
      const data = await res.json();
      if (data.success && data.url) { window.location.href = data.url; }
      else addToast(data.error ?? "Could not get OAuth URL", "error");
    } catch { addToast("Failed to initiate Blogger OAuth", "error"); }
    finally  { setBloggerConnecting(false); }
  };

  const handleDisconnectBlogger = async () => {
    if (!confirm("Disconnect Blogger? This will remove the stored tokens.")) return;
    try {
      await fetch("/api/admin/publish/blogger", { method: "DELETE" });
      setBloggerConnected(false); setBloggerBlogId(""); setBloggerBlogUrl("");
      addToast("Blogger disconnected", "info");
    } catch { addToast("Disconnect failed", "error"); }
  };

  const handleSaveBlogger = async () => {
    setBloggerSaving(true);
    try {
      const res  = await fetch("/api/admin/platforms", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "blogger", enabled: bloggerEnabled, bloggerBlogId, bloggerBlogUrl }),
      });
      const data = await res.json();
      if (data.success) addToast("Blogger settings saved ✓", "success");
      else              addToast(data.error ?? "Save failed", "error");
    } catch { addToast("Save failed", "error"); }
    finally  { setBloggerSaving(false); }
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings || {});
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        addToast("Settings updated successfully! ✓", "success");
      } else {
        addToast("Failed to update settings", "error");
      }
    } catch (err) {
      addToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar vertical tabs */}
      <div className="w-full lg:w-60 flex-shrink-0 flex flex-row lg:flex-col gap-1 border-b lg:border-b-0 lg:border-r border-white/[0.06] pb-4 lg:pb-0 lg:pr-4 shrink-0">
        {(["general", "seo", "social", "integrations", "publishing", "account"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === tab ? "text-orange-500 bg-white/[0.03]" : "text-gray-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="flex-1 max-w-2xl space-y-6">
        <h1
          className="font-anton text-3xl text-white uppercase tracking-wider"
          style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
        >
          SETTINGS — {activeTab}
        </h1>

        {/* GENERAL TAB */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Site Name
              </label>
              <input
                value={settings.siteName || ""}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Site URL
              </label>
              <input
                value={settings.siteUrl || ""}
                onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Tagline
              </label>
              <input
                value={settings.tagline || ""}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Default Meta Title Template
              </label>
              <input
                value={settings.metaTitleTemplate || ""}
                onChange={(e) => handleInputChange("metaTitleTemplate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Default Meta Description
              </label>
              <textarea
                value={settings.defaultMetaDescription || ""}
                onChange={(e) => handleInputChange("defaultMetaDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* SOCIAL TAB */}
        {activeTab === "social" && (
          <div className="space-y-4">
            {[
              { key: "whatsapp", label: "WhatsApp Contact" },
              { key: "facebook", label: "Facebook Link" },
              { key: "instagram", label: "Instagram Link" },
              { key: "twitter", label: "Twitter / X Link" },
              { key: "youtube", label: "YouTube Channel Link" },
              { key: "discord", label: "Discord Server Invite" },
              { key: "email", label: "Support Email" },
            ].map((item) => (
              <div key={item.key} className="space-y-1">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                  {item.label}
                </label>
                <input
                  value={settings[item.key] || ""}
                  onChange={(e) => handleInputChange(item.key, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* INTEGRATIONS TAB */}
        {activeTab === "integrations" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Anthropic API Key
              </label>
              <input
                type="password"
                placeholder="sk-ant-••••••••••••••••"
                value={settings.anthropicKey || ""}
                onChange={(e) => handleInputChange("anthropicKey", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                TMDB API Key
              </label>
              <input
                type="password"
                value={settings.tmdbKey || ""}
                onChange={(e) => handleInputChange("tmdbKey", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Cloudinary URL
              </label>
              <input
                value={settings.cloudinaryUrl || ""}
                onChange={(e) => handleInputChange("cloudinaryUrl", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
          </div>
        )}

        {/* PUBLISHING TAB */}
        {activeTab === "publishing" && (
          <div className="space-y-6">
            {/* DEV.to */}
            <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🖥️</span>
                  <div>
                    <h3 className="text-white font-black text-sm">DEV.to</h3>
                    {devtoUsername && <p className="text-gray-500 text-[11px]">@{devtoUsername}</p>}
                  </div>
                </div>
                <Toggle checked={devtoEnabled} onChange={setDevtoEnabled} />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">API Key</label>
                  <input type="password" placeholder="Enter DEV.to API key…" value={devtoKey}
                    onChange={e => setDevtoKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none focus:border-orange-500/40 transition-colors" />
                  <p className="text-gray-600 text-[11px]">Get your API key from dev.to/settings/extensions</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setDevtoCanonical(p => !p)}
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                    style={{ background: devtoCanonical ? "linear-gradient(135deg,#FF7A00,#ffb300)" : "rgba(255,255,255,0.05)", border: devtoCanonical ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                    {devtoCanonical && <span className="text-black text-[10px] font-black">✓</span>}
                  </div>
                  <span className="text-gray-400 text-xs">Set canonical URL to STREAMB4 article (recommended for SEO)</span>
                </label>
              </div>
              <button onClick={handleSaveDevTo} disabled={devtoSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-black disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#FF7A00,#ffb300)" }}>
                {devtoSaving ? <><span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin"/>Saving…</> : "Save DEV.to Settings"}
              </button>
            </div>

            {/* Blogger */}
            <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  <div>
                    <h3 className="text-white font-black text-sm">Blogger</h3>
                    <p className="text-gray-500 text-[11px]">
                      {bloggerConnected ? <span className="text-green-400">● Connected</span> : <span className="text-gray-600">Not connected</span>}
                    </p>
                  </div>
                </div>
                <Toggle checked={bloggerEnabled} onChange={setBloggerEnabled} />
              </div>

              {bloggerConnected ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">Blog ID</label>
                    <input value={bloggerBlogId} onChange={e => setBloggerBlogId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">Blog URL</label>
                    <input value={bloggerBlogUrl} onChange={e => setBloggerBlogUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveBlogger} disabled={bloggerSaving}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-black disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#FF7A00,#ffb300)" }}>
                      {bloggerSaving ? "Saving…" : "Save Blogger Settings"}
                    </button>
                    <button onClick={handleDisconnectBlogger}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 transition-colors border border-red-500/20 hover:border-red-500/40">
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-500 text-xs">Connect your Google account to publish directly to Blogger.</p>
                  <p className="text-gray-600 text-[11px]">Required env vars: <code className="text-orange-400">GOOGLE_CLIENT_ID</code>, <code className="text-orange-400">GOOGLE_CLIENT_SECRET</code></p>
                  <button onClick={handleConnectBlogger} disabled={bloggerConnecting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-white/[0.1] text-white hover:border-orange-500/30 transition-colors disabled:opacity-50">
                    {bloggerConnecting ? <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/>Redirecting…</> : "🔗 Connect with Google"}
                  </button>
                </div>
              )}
            </div>

            {/* Future platforms */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-gray-600 font-black text-xs uppercase tracking-wider mb-3">Coming Soon</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Medium", "Hashnode", "WordPress", "Ghost CMS"].map(p => (
                  <div key={p} className="flex items-center gap-2 p-2 rounded-lg opacity-40" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-gray-600 text-xs font-semibold">{p}</span>
                    <span className="text-[10px] text-gray-700 ml-auto">Soon</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
                Update Admin Password
              </label>
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none"
              />
            </div>
          </div>
        )}

        {/* Backup & Export section */}
        <div className="p-6 rounded-[20px] space-y-4"
          style={{
            background:'rgba(15,15,15,0.95)',
            border:'1px solid rgba(255,255,255,0.06)'
          }}>
          <h3 className="text-white font-black text-sm uppercase tracking-wider">
            Backup & Export
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href="/api/admin/backup"
              download
              className="flex items-center justify-center gap-2 p-4 rounded-xl
                text-sm font-bold text-white text-center
                border border-white/[0.08] hover:border-orange-500/30
                hover:bg-white/[0.04] transition-all duration-200">
              💾 Full Backup
            </a>
            <a href="/api/admin/export?format=json"
              download
              className="flex items-center justify-center gap-2 p-4 rounded-xl
                text-sm font-bold text-white text-center
                border border-white/[0.08] hover:border-orange-500/30
                hover:bg-white/[0.04] transition-all duration-200">
              📄 Export JSON
            </a>
            <a href="/api/admin/export?format=csv"
              download
              className="flex items-center justify-center gap-2 p-4 rounded-xl
                text-sm font-bold text-white text-center
                border border-white/[0.08] hover:border-orange-500/30
                hover:bg-white/[0.04] transition-all duration-200">
              📊 Export CSV
            </a>
          </div>
          
          <p className="text-gray-600 text-xs">
            Last backup: Never · 
            <button type="button" className="text-orange-500 hover:text-orange-400
              transition-colors cursor-pointer ml-1">
              Schedule auto-backup
            </button>
          </p>
        </div>

        {/* Save button — only show on non-publishing tabs */}
        {activeTab !== "publishing" && (
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl font-black text-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff7a00] to-[#ffb300] shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {saving ? "Saving..." : "Save Settings ⚡"}
          </button>
        )}
      </form>
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)}
      className="w-10 h-5 rounded-full transition-all relative cursor-pointer flex-shrink-0"
      style={{ background: checked ? "#FF7A00" : "rgba(255,255,255,0.08)" }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: checked ? "calc(100% - 18px)" : "2px" }} />
    </div>
  );
}
