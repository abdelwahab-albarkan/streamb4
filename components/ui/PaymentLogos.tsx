"use client";

/**
 * PaymentLogos — Official brand SVG icons via react-icons Simple Icons.
 * Always displayed in their original brand colors. Static, no interaction.
 */

import {
  SiPaypal,
  SiVisa,
  SiMastercard,
  SiApplepay,
  SiGooglepay,
  SiBitcoin,
  SiTether,
  SiEthereum,
} from "react-icons/si";

// ─── Payment Method Data ───────────────────────────────────────────────────────

export const PAYMENT_LOGOS = [
  {
    id: "paypal",
    label: "PayPal",
    Icon: SiPaypal,
    brandColor: "#009CDE",
    ariaLabel: "PayPal",
  },
  {
    id: "visa",
    label: "Visa",
    Icon: SiVisa,
    brandColor: "#FFFFFF",
    ariaLabel: "Visa",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    Icon: SiMastercard,
    brandColor: "#EB001B",
    ariaLabel: "Mastercard",
  },
  {
    id: "applepay",
    label: "Apple Pay",
    Icon: SiApplepay,
    brandColor: "#FFFFFF",
    ariaLabel: "Apple Pay",
  },
  {
    id: "googlepay",
    label: "Google Pay",
    Icon: SiGooglepay,
    brandColor: "#4285F4",
    ariaLabel: "Google Pay",
  },
  {
    id: "bitcoin",
    label: "Bitcoin",
    Icon: SiBitcoin,
    brandColor: "#F7931A",
    ariaLabel: "Bitcoin",
  },
  {
    id: "usdt",
    label: "USDT",
    Icon: SiTether,
    brandColor: "#26A17B",
    ariaLabel: "USDT (Tether)",
  },
  {
    id: "ethereum",
    label: "Ethereum",
    Icon: SiEthereum,
    brandColor: "#627EEA",
    ariaLabel: "Ethereum",
  },
] as const;

export type PaymentLogoId = typeof PAYMENT_LOGOS[number]["id"];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PaymentLogosGridProps {
  methods?: PaymentLogoId[];
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

interface PaymentStripProps {
  methods?: PaymentLogoId[];
  className?: string;
}

// ─── Full Grid ─────────────────────────────────────────────────────────────────

export function PaymentLogosGrid({
  methods,
  size = "md",
  showLabel = true,
  className = "",
}: PaymentLogosGridProps) {
  const list = methods
    ? PAYMENT_LOGOS.filter((p) => methods.includes(p.id))
    : PAYMENT_LOGOS;

  const iconSize = size === "sm" ? 22 : size === "lg" ? 34 : 28;
  const padding = size === "sm" ? "10px 14px" : size === "lg" ? "18px 24px" : "14px 18px";
  const minWidth = size === "sm" ? 64 : size === "lg" ? 100 : 80;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
      role="list"
      aria-label="Accepted payment methods"
    >
      {list.map((p) => (
        <div
          key={p.id}
          role="listitem"
          aria-label={p.ariaLabel}
          title={p.label}
          className="flex flex-col items-center justify-center gap-2 rounded-[14px] select-none"
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.08)",
            padding,
            minWidth,
          }}
        >
          <div
            className="flex items-center justify-center leading-none"
            style={{ color: p.brandColor }}
          >
            <p.Icon size={iconSize} aria-hidden />
          </div>

          {showLabel && (
            <span
              className="text-[10px] font-black uppercase tracking-[0.12em] leading-none"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {p.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Compact Strip (footer) ────────────────────────────────────────────────────

export function PaymentStrip({ methods, className = "" }: PaymentStripProps) {
  const list = methods
    ? PAYMENT_LOGOS.filter((p) => methods.includes(p.id))
    : PAYMENT_LOGOS;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="list"
      aria-label="Accepted payment methods"
    >
      {list.map((p) => (
        <div
          key={p.id}
          role="listitem"
          title={p.label}
          aria-label={p.ariaLabel}
          className="flex items-center justify-center rounded-[10px]"
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.08)",
            width: 44,
            height: 28,
            color: p.brandColor,
          }}
        >
          <p.Icon size={16} aria-hidden />
        </div>
      ))}
    </div>
  );
}
