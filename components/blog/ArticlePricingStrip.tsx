import React from "react";
import Link from "next/link";

// ─── Plan data ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id:       "1m",
    duration: "1 Month",
    price:    19.99,
    oldPrice: 29.99,
    badge:    null,
    accent:   false,
  },
  {
    id:       "3m",
    duration: "3 Months",
    price:    39.99,
    oldPrice: 49.99,
    badge:    "Save 20%",
    accent:   false,
  },
  {
    id:       "6m",
    duration: "6 Months",
    price:    54.99,
    oldPrice: 89.99,
    badge:    "Save 40%",
    accent:   false,
  },
  {
    id:       "12m",
    duration: "12 Months",
    price:    69.99,
    oldPrice: 139.99,
    badge:    "Best Value",
    accent:   true,   // highlighted card
  },
];

const FEATURES = [
  "4K Ultra HD",
  "50,000+ Live Channels",
  "180,000+ Movies & Series",
  "Instant Activation",
  "24/7 Support",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckIcon({ orange = false }: { orange?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-3.5 h-3.5 flex-shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="7.5"
        fill={orange ? "rgba(255,122,0,0.18)" : "rgba(255,255,255,0.06)"}
        stroke={orange ? "rgba(255,122,0,0.4)" : "rgba(255,255,255,0.1)"}
      />
      <path
        d="M4.75 8.25L6.75 10.25L11.25 5.75"
        stroke={orange ? "#ff7a00" : "#9ca3af"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * ArticlePricingStrip
 *
 * Compact full-width pricing strip designed to sit between the hero image
 * and the article body. Shows 4 subscription plans in a single row on desktop,
 * 2×2 on tablet, and a horizontal-scroll row on mobile.
 *
 * Purely presentational — no client state. All prices link to /pricing.
 */
export function ArticlePricingStrip() {
  return (
    <section
      aria-label="STREAMB4 subscription plans"
      className="w-full rounded-[24px] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,122,0,0.05) 0%, rgba(10,10,10,0.98) 40%, rgba(10,10,10,0.98) 100%)",
        border: "1px solid rgba(255,122,0,0.14)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,122,0,0.04)",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.28em] mb-1"
            style={{ color: "#ff7a00" }}
          >
            Premium IPTV • All Plans Include
          </p>
          <h2
            className="text-white font-black text-base sm:text-lg leading-tight"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif", letterSpacing: "0.02em" }}
          >
            Choose Your STREAMB4 Plan
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5" />
              <path d="M5 8.5L7 10.5L11 6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            No contracts
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5" />
              <path d="M5 8.5L7 10.5L11 6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Cancel anytime
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 sm:p-5">
        {/* Mobile (<768px): featured 12-month plan only */}
        <div className="md:hidden">
          <PlanCard plan={PLANS[3]} />
          <Link
            href="/pricing"
            className="mt-4 flex items-center justify-center gap-1.5 text-[12px] font-bold"
            style={{ color: "#ff7a00" }}
          >
            View All Pricing Plans
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Tablet 2×2 — md to lg */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Desktop: single row */}
        <div className="hidden lg:grid grid-cols-4 gap-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div
        className="px-6 py-3 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-semibold uppercase tracking-wider"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <svg viewBox="0 0 16 16" className="w-3 h-3 flex-shrink-0" fill="none" aria-hidden="true">
          <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="#4b5563" strokeWidth="1.3" />
          <path d="M5 5V4a3 3 0 016 0v1" stroke="#4b5563" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Secure payment · Instant activation · Works on all devices
      </div>
    </section>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  compact = false,
}: {
  plan: (typeof PLANS)[number];
  compact?: boolean;
}) {
  const perMonth = (plan.price / parseInt(plan.duration)).toFixed(2);
  const durationNum = parseInt(plan.duration); // 1, 3, 6, 12

  return (
    <Link
      href="/pricing"
      className={[
        "group relative flex flex-col rounded-[18px] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2",
        compact ? "min-w-[200px] snap-start" : "",
        plan.accent ? "ring-1" : "",
      ].join(" ")}
      style={
        plan.accent
          ? {
              background:
                "linear-gradient(160deg, rgba(255,122,0,0.12) 0%, rgba(255,179,0,0.06) 50%, rgba(15,15,15,1) 100%)",
              border: "1px solid rgba(255,122,0,0.35)",
              boxShadow: "0 0 30px rgba(255,122,0,0.12), 0 8px 32px rgba(0,0,0,0.5)",
              // ring color via inline
            }
          : {
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }
      }
      aria-label={`${plan.duration} plan — $${plan.price.toFixed(2)}`}
    >
      {/* Badge */}
      <div className="px-4 pt-4 pb-0 flex items-start justify-between gap-2">
        <p
          className="text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ color: plan.accent ? "#ffb300" : "#6b7280" }}
        >
          {plan.duration}
        </p>
        {plan.badge && (
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full leading-none"
            style={
              plan.accent
                ? {
                    background: "linear-gradient(90deg,#ff7a00,#ffb300)",
                    color: "#000",
                  }
                : {
                    background: "rgba(255,255,255,0.08)",
                    color: "#9ca3af",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }
            }
          >
            {plan.badge}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="px-4 pt-2 pb-0">
        <div className="flex items-baseline gap-1">
          <span
            className="text-xs font-bold"
            style={{ color: plan.accent ? "#ff7a00" : "#6b7280" }}
          >
            $
          </span>
          <span
            className="font-black leading-none"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 1.875rem)",
              color: plan.accent ? "#ffffff" : "#e5e7eb",
              fontFamily: "var(--font-anton), Anton, sans-serif",
            }}
          >
            {plan.price.toFixed(0)}
            <span className="text-sm font-black">
              .{plan.price.toFixed(2).split(".")[1]}
            </span>
          </span>
        </div>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color: "#6b7280" }}>
          <span style={{ color: "#4b5563", textDecoration: "line-through" }}>
            ${plan.oldPrice.toFixed(2)}
          </span>
          {"  ·  "}
          {durationNum > 1 ? `$${perMonth}/mo` : "per month"}
        </p>
      </div>

      {/* Divider */}
      <div
        className="mx-4 my-3"
        style={{ height: "1px", background: plan.accent ? "rgba(255,122,0,0.2)" : "rgba(255,255,255,0.06)" }}
      />

      {/* Features */}
      <ul className="px-4 space-y-1.5 flex-1">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <CheckIcon orange={plan.accent} />
            <span
              className="text-[11px] font-semibold leading-tight"
              style={{ color: plan.accent ? "#d1d5db" : "#6b7280" }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="p-4 pt-3">
        <span
          className={[
            "w-full block text-center text-[11px] font-black uppercase tracking-widest",
            "py-2.5 rounded-xl transition-all duration-200",
            "group-hover:brightness-110",
          ].join(" ")}
          style={
            plan.accent
              ? {
                  background: "linear-gradient(90deg, #ff7a00, #ffb300)",
                  color: "#000",
                  boxShadow: "0 4px 20px rgba(255,122,0,0.35)",
                }
              : {
                  background: "rgba(255,255,255,0.07)",
                  color: "#9ca3af",
                  border: "1px solid rgba(255,255,255,0.1)",
                }
          }
        >
          {plan.accent ? "Get Started ⚡" : "View Plans"}
        </span>
      </div>
    </Link>
  );
}
