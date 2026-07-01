"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/ui/Toast";

type SettingTab = "general" | "seo" | "social" | "integrations" | "account";

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
        {(["general", "seo", "social", "integrations", "account"] as const).map((tab) => (
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

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-black text-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff7a00] to-[#ffb300] shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {saving ? "Saving..." : "Save Settings ⚡"}
        </button>
      </form>
    </div>
  );
}
