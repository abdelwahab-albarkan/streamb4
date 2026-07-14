"use client";

import React, { useState } from "react";

export default function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribed(true);
      } else {
        setError(data.error === "already_subscribed" ? "You are already subscribed!" : data.error || "Subscription failed");
      }
    } catch {
      setError("Error subscribing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-7 rounded-[24px]"
      style={{
        background: "linear-gradient(145deg,rgba(255,122,0,0.08),rgba(5,5,5,0.98))",
        border: "1px solid rgba(255,122,0,0.15)",
      }}
    >
      <div className="text-2xl mb-3">📬</div>

      <h4 className="font-anton text-xl text-white uppercase mb-2" style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}>
        STAY UPDATED
      </h4>
      <p className="text-gray-500 text-sm mb-5 leading-relaxed">
        Get the latest streaming guides and tips delivered to your inbox.
      </p>

      {subscribed ? (
        <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
          <span>✓</span>
          <span>You&apos;re subscribed!</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-3">
          {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-gray-600 border border-white/[0.08] bg-white/[0.04]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-black text-black text-sm whitespace-nowrap cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#ff7a00,#ffb300)",
              }}
            >
              {loading ? "..." : "Subscribe"}
            </button>
          </div>
        </form>
      )}

      <p className="text-gray-700 text-xs mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
