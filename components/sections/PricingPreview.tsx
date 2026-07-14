"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { PRICING, PRICING_TABS } from "@/lib/constants";
import { PaymentLogosGrid } from "@/components/ui/PaymentLogos";

// ─── DATA ────────────────────────────────────────────────────────────────────

const plans = PRICING;
const tabs = PRICING_TABS;

const features = [
  "50,000+ Live TV Channels",
  "180,000+ Movies & Series",
  "True 4K Ultra HD + HDR10+",
  "All Devices Supported",
  "24/7 Live Chat Support",
  "No IP Lock — Travel Free",
  "Instant Account Activation",
  "No Long-Term Contract",
];

type Period = "monthly" | "quarterly" | "biannual" | "yearly";

const getPeriodName = (period: string) => {
  switch (period) {
    case "monthly":
      return "1 Month";
    case "quarterly":
      return "3 Months";
    case "biannual":
      return "6 Months";
    case "yearly":
      return "12 Months";
    default:
      return "1 Month";
  }
};

// ─── CARD ─────────────────────────────────────────────────────────────────────

function PricingCard({
  plan,
  period,
}: {
  plan: (typeof plans)[0];
  period: Period;
}) {
  const [hovered, setHovered] = useState(false);

  const isPopular = plan.popular;
  const isBestValue = plan.bestValue;
  const isHighlighted = isPopular || isBestValue;

  const getDisplayPrice = (): number => {
    return plan[period];
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "monthly":
        return "/mo";
      case "quarterly":
        return "/3 mo";
      case "biannual":
        return "/6 mo";
      case "yearly":
        return "/yr";
      default:
        return "/mo";
    }
  };

  const displayPrice = getDisplayPrice();

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: isPopular ? -6 : -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        zIndex: isPopular ? 10 : 1,
      }}
      className={`relative ${isPopular ? "lg:-mt-5 lg:-mb-5" : ""}`}
    >
      {/* ── Outer ambient glow — static for popular, fade on hover for others ── */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse, rgba(255,122,0,1), transparent 65%)",
          filter: "blur(28px)",
          transform: "scale(1.1)",
          opacity: isPopular ? 0.12 : hovered ? 0.06 : 0,
        }}
      />

      {/* ── Gradient border wrapper ── */}
      <div
        className="absolute inset-0 rounded-[28px] p-px"
        style={{
          background: isPopular
            ? "linear-gradient(135deg, rgba(255,140,0,0.9) 0%, rgba(255,200,50,0.6) 40%, rgba(255,122,0,0.2) 100%)"
            : hovered
            ? "linear-gradient(135deg, rgba(255,122,0,0.35) 0%, rgba(255,179,0,0.12) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
          transition: "all 0.45s ease",
        }}
      >
        <div className="w-full h-full rounded-[27px] bg-[#050505]" />
      </div>

      {/* ── Card body ── */}
      <div
        className="relative rounded-[28px] p-8 overflow-hidden"
        style={{
          background: isPopular
            ? "linear-gradient(160deg, rgba(255,122,0,0.1) 0%, rgba(15,10,5,0.97) 35%, rgba(5,5,5,1) 100%)"
            : "linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)",
          boxShadow: isPopular
            ? "0 32px 80px rgba(0,0,0,0.85), 0 0 80px rgba(255,122,0,0.08), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Inner top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: isPopular
              ? "linear-gradient(90deg, transparent 0%, rgba(255,160,0,0.7) 50%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
          }}
        />

        {/* Ambient corner glow */}
        <div
          className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{
            background: isPopular
              ? "radial-gradient(circle at top right, rgba(255,140,0,0.14), transparent 65%)"
              : hovered
              ? "radial-gradient(circle at top right, rgba(255,122,0,0.07), transparent 65%)"
              : "transparent",
            transition: "all 0.4s ease",
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* ── Badge — static, no loop ── */}
        {isHighlighted && (
          <div className="flex justify-center mb-5">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: isPopular
                  ? "linear-gradient(135deg, #ff8c00, #ffb800)"
                  : "rgba(255,122,0,0.12)",
                border: isPopular ? "none" : "1px solid rgba(255,122,0,0.3)",
                boxShadow: isPopular
                  ? "0 0 20px rgba(255,122,0,0.28)"
                  : "0 0 10px rgba(255,122,0,0.12)",
              }}
            >
              <span
                className="text-[11px] font-black uppercase tracking-[0.15em]"
                style={{ color: isPopular ? "#000" : "#ff8c00" }}
              >
                {isPopular ? "🔥 Most Popular" : "💎 Best Value"}
              </span>
            </div>
          </div>
        )}

        {/* ── Plan info ── */}
        <div
          className="mb-7"
          style={{ paddingTop: !isHighlighted ? "52px" : "0" }}
        >
          {/* Connection dots — static */}
          <div className="flex gap-1.5 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    i < plan.connections
                      ? "linear-gradient(135deg, #ff8c00, #ffb800)"
                      : "rgba(255,255,255,0.07)",
                  boxShadow:
                    i < plan.connections && isPopular
                      ? "0 0 6px rgba(255,140,0,0.5)"
                      : "none",
                }}
              />
            ))}
          </div>

          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-600 mb-1">
            {plan.connections} Connection{plan.connections > 1 ? "s" : ""}
          </p>
          <h3
            className="font-anton text-[28px] uppercase tracking-tight text-white mb-1.5"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
          >
            {plan.label}
          </h3>
          <p className="text-gray-600 text-[13px]">{plan.tagline}</p>
        </div>

        {/* ── Price block ── */}
        <div className="mb-7 relative">
          <div className="flex items-end gap-1 mb-1">
            <span className="text-gray-500 text-2xl font-bold mb-2">$</span>
            <span className="font-['Anton'] text-white leading-none" style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>
              {displayPrice.toFixed(2)
                .replace('.00', '')
                .replace(/(\.\d)$/, '$10')}
            </span>
            <span className="text-gray-600 text-sm mb-2 ml-1">
              {getPeriodLabel()}
            </span>
          </div>

          {period !== 'monthly' && (
            <p className="text-orange-400/70 text-xs mt-1">
              ≈ ${plan.monthlyEquiv[period]}/month
            </p>
          )}
        </div>

        {/* ── Divider ── */}
        <div
          className="mb-6 h-px"
          style={{
            background: isPopular
              ? "linear-gradient(90deg, transparent, rgba(255,140,0,0.35), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />

        {/* ── Features ── */}
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {features.map((feat) => (
            <li
              key={feat}
              className="flex items-center gap-3 group"
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_14px_rgba(255,140,0,0.45)]"
                style={{
                  background: isPopular
                    ? "linear-gradient(135deg, #ff8c00, #ffb800)"
                    : "rgba(255,122,0,0.1)",
                  border: isPopular ? "none" : "1px solid rgba(255,122,0,0.22)",
                }}
              >
                <svg
                  className="w-2.5 h-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isPopular ? "#000" : "#ff8c00"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span
                className="text-[13px] font-medium transition-colors duration-200 group-hover:text-white/80"
                style={{
                  color: isPopular
                    ? "rgba(255,255,255,0.82)"
                    : "rgba(255,255,255,0.45)",
                }}
              >
                {feat}
              </span>
            </li>
          ))}
        </motion.ul>

        {/* ── CTA Button ── */}
        <motion.button
          onClick={() => {
            const planName = getPeriodName(period);
            const formattedPrice = displayPrice.toFixed(2)
              .replace('.00', '')
              .replace(/(\.\d)$/, '$10');
            const connText = `${plan.connections} Screen${plan.connections > 1 ? 's' : ''}`;
            const priceText = `$${formattedPrice}`;

            const msg =
              `Hello STREAMB4 Team 👋\n\n` +
              `I would like to purchase this subscription.\n\n` +
              `Plan: ${planName}\n` +
              `Connections: ${connText}\n` +
              `Price: ${priceText} USD\n\n` +
              `Device:\n` +
              `(Firestick / Android TV / Smart TV / iPhone / Windows)\n\n` +
              `Please help me complete my purchase.`;

            window.open('https://wa.me/212625218443?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full py-4 rounded-[14px] font-black text-[13px] uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer"
          style={
            isPopular
              ? {
                  background: "linear-gradient(135deg, #ff8c00, #ffb800)",
                  color: "#000",
                  boxShadow: "0 0 28px rgba(255,140,0,0.3)",
                }
              : {
                  background: hovered
                    ? "rgba(255,122,0,0.07)"
                    : "rgba(255,255,255,0.04)",
                  color: "#ffffff",
                  border: `1px solid ${
                    hovered ? "rgba(255,122,0,0.25)" : "rgba(255,255,255,0.08)"
                  }`,
                }
          }
        >
          {isPopular ? '⚡️ GET IPTV NOW' : 'GET STARTED →'}
        </motion.button>

        <p className="text-center text-gray-700 text-[11px] mt-4 tracking-wide">
          ✓ Instant activation &nbsp;·&nbsp; ✓ Cancel anytime
        </p>
      </div>
    </motion.div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────

export function PricingPreview() {
  const [activePeriod, setActivePeriod] = useState<Period>("monthly");

  return (
    <section
      id="pricing"
      className="relative py-32 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* ── Background layers ── */}

      {/* Noise */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.022] pointer-events-none"
        aria-hidden="true"
      >
        <filter id="pricingNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="3"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pricingNoise)" />
      </svg>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,122,0,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,122,0,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Center radial glow — static */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          width: "1100px",
          height: "700px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse, rgba(255,122,0,0.07) 0%, transparent 68%)",
          filter: "blur(70px)",
        }}
      />

      {/* Top/bottom fades */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <span
            className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,122,0,0.07)",
              border: "1px solid rgba(255,122,0,0.15)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Pricing
          </span>
        </motion.div>



        {/* ── Billing period toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center mb-16 overflow-x-auto pb-2 w-full scrollbar-none"
        >
          <div
            className="relative flex items-center p-1.5 rounded-full min-w-max mx-auto"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px rgba(0,0,0,0.35)",
            }}
          >
            {/* Sliding pill — removed duplicate; pill rendered inside each active button below */}

            {tabs.map((tab) => {
              const isActive = activePeriod === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePeriod(tab.id)}
                  className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer select-none"
                  style={{ color: isActive ? "#000000" : "rgba(255,255,255,0.38)" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="pricingPill"
                      className="absolute inset-0 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8,
                      }}
                      style={{
                        background: "linear-gradient(135deg, #ff8c00, #ffb800)",
                        boxShadow: "0 0 18px rgba(255,140,0,0.32)",
                      }}
                    />
                  )}
                  {tab.label}
                  {tab.save && (
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{
                        background: isActive
                          ? "rgba(0,0,0,0.18)"
                          : "rgba(255,122,0,0.14)",
                        color: isActive ? "#000" : "#ff8c00",
                      }}
                    >
                      {tab.save}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
        >
          {plans.map((plan) => (
            <PricingCard
              key={plan.connections}
              plan={plan}
              period={activePeriod}
            />
          ))}
        </motion.div>

        {/* ── Payment methods ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-5 mt-4"
        >
          <p className="text-gray-700 text-[11px] uppercase tracking-[0.25em] font-black">
            Accepted Payment Methods
          </p>

          <PaymentLogosGrid size="sm" showLabel={true} />

          <p className="text-gray-700 text-[12px] text-center max-w-sm leading-relaxed">
            Secure payments via encrypted channels. Subscription activates
            instantly after confirmation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
