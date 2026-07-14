'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Lock, FileText, Radio, Shield, MessageCircle, Earth,
  Star, ArrowRight, Check
} from 'lucide-react'
import { LucideGradDefs } from '@/components/ui/icons'

import { PaymentLogosGrid } from "@/components/ui/PaymentLogos";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PRICING_DATA = {
  1: {
    label: 'SOLO',
    tagline: 'Perfect for one screen',
    plans: [
      { duration: '3 Months',  months: 3,  price: 39.99, oldPrice: 49.99,  savePercent: 20, popular: false },
      { duration: '6 Months',  months: 6,  price: 54.99, oldPrice: 89.99,  savePercent: 40, popular: false },
      { duration: '12 Months', months: 12, price: 69.99, oldPrice: 139.99, savePercent: 50, popular: true  },
    ],
  },
  2: {
    label: 'DUO',
    tagline: 'Ideal for couples',
    plans: [
      { duration: '3 Months',  months: 3,  price: 55.00,  oldPrice: 75.00,  savePercent: 27, popular: false },
      { duration: '6 Months',  months: 6,  price: 75.00,  oldPrice: 110.00, savePercent: 32, popular: false },
      { duration: '12 Months', months: 12, price: 120.00, oldPrice: 180.00, savePercent: 33, popular: true  },
    ],
  },
  3: {
    label: 'FAMILY',
    tagline: 'For the whole household',
    plans: [
      { duration: '3 Months',  months: 3,  price: 70.00,  oldPrice: 95.00,  savePercent: 26, popular: false },
      { duration: '6 Months',  months: 6,  price: 94.00,  oldPrice: 135.00, savePercent: 30, popular: false },
      { duration: '12 Months', months: 12, price: 165.00, oldPrice: 240.00, savePercent: 31, popular: true  },
    ],
  },
}

const FEATURES = [
  '50,000+ Live Channels',
  '180,000+ Movies & TV Shows',
  'Premium Sports Coverage',
  'True 4K Ultra HD + HDR10+',
  'Anti Freeze Technology',
  'VPN Compatible',
  'TV Guide (EPG)',
  'Catch-Up TV',
  'Instant Activation',
  '24/7 Support',
  'No Contracts',
  'Works Worldwide',
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function openWhatsApp(plan: (typeof PRICING_DATA)[1]['plans'][0], connections: number) {
  const connText = `${connections} Screen${connections > 1 ? 's' : ''}`;
  const priceStr = `$${plan.price.toFixed(2)}`;

  const msg =
    `Hello STREAMB4 Team 👋\n\n` +
    `I would like to purchase this subscription.\n\n` +
    `Plan: ${plan.duration}\n` +
    `Connections: ${connText}\n` +
    `Price: ${priceStr} USD\n\n` +
    `Please help me complete my purchase.`;

  window.open('https://wa.me/212625218443?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function PricingSection() {
  const [activeConnections, setActiveConnections] = useState<1 | 2 | 3>(1)
  const currentData = PRICING_DATA[activeConnections]

  return (
    <section id="pricing" className="relative py-24 overflow-hidden bg-[#050505]">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.07]"
          style={{ background: 'radial-gradient(ellipse,#ff8c00,transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,140,0,1) 1px,transparent 1px),
              linear-gradient(90deg,rgba(255,140,0,1) 1px,transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span
            className="inline-flex items-center gap-2 text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,122,0,0.07)', border: '1px solid rgba(255,122,0,0.15)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Pricing
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-anton text-center uppercase leading-[0.9] tracking-tight mb-4"
          style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', fontFamily: 'var(--font-anton), Anton, sans-serif' }}
        >
          <span className="text-white">SIMPLE </span>
          <span
            style={{
              background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(255,140,0,0.4))',
            }}
          >
            PRICING.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-500 text-center text-base sm:text-lg max-w-xl mx-auto mb-14 leading-relaxed font-semibold"
        >
          No contracts. Cancel anytime. Instant activation.
        </motion.p>

        {/* Connection switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-6 px-4"
        >
          <div
            className="relative p-1.5 rounded-[20px] w-full max-w-[380px]"
            style={{
              background: 'rgba(17,17,17,0.9)',
              border: '1px solid rgba(255,140,0,0.12)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(255,140,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div className="grid grid-cols-3 gap-1 relative">
              {/* Sliding pill */}
              <motion.div
                className="absolute inset-y-0 rounded-[14px]"
                layoutId="homePricingPill"
                style={{
                  width: 'calc(33.333% - 2px)',
                  left: `calc(${(activeConnections - 1) * 33.333}% + 2px)`,
                  background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                  boxShadow: '0 0 20px rgba(255,140,0,0.4)',
                  transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setActiveConnections(n)}
                  className="relative z-10 flex flex-col items-center py-3 sm:py-4 px-2 sm:px-5 rounded-[14px] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                    {Array.from({ length: n }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                          activeConnections === n ? 'bg-black' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`font-black text-[11px] sm:text-sm uppercase tracking-wide transition-colors duration-300 ${
                      activeConnections === n ? 'text-black' : 'text-[#A1A1AA]'
                    }`}
                  >
                    {n} {n === 1 ? 'Screen' : 'Screens'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Plan label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeConnections}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-center mb-10"
          >
            <span className="text-white font-black text-lg uppercase">{currentData.label}</span>
            <span className="text-[#A1A1AA] text-sm ml-2 font-semibold">— {currentData.tagline}</span>
          </motion.div>
        </AnimatePresence>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeConnections}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-14"
          >
            {currentData.plans.map((plan, i) => (
              <motion.div
                key={plan.duration}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: plan.popular ? -12 : -8, transition: { duration: 0.25 } }}
                className={`relative flex flex-col rounded-[24px] overflow-hidden ${
                  plan.popular ? 'lg:-mt-2 lg:-mb-2' : ''
                }`}
                style={{
                  background: plan.popular
                    ? 'linear-gradient(145deg,rgba(255,140,0,0.08),rgba(17,17,17,0.98))'
                    : 'rgba(17,17,17,0.95)',
                  border: plan.popular
                    ? '1px solid rgba(255,140,0,0.35)'
                    : '1px solid rgba(255,140,0,0.1)',
                  boxShadow: plan.popular
                    ? '0 0 60px rgba(255,140,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div
                      className="px-6 py-1.5 rounded-b-[14px] text-xs font-black text-black uppercase tracking-wider"
                      style={{
                        background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                        boxShadow: '0 4px 20px rgba(255,140,0,0.4)',
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Star size={12} strokeWidth={2} fill="currentColor" />
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                {/* Top glow line */}
                {plan.popular && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg,transparent,#FF8C00,#FFB300,transparent)' }}
                  />
                )}

                <div className={`flex flex-col h-full p-7 ${plan.popular ? 'pt-10' : ''}`}>
                  {/* Duration + Save */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider mb-1">
                        {plan.duration}
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: plan.popular
                              ? 'linear-gradient(135deg,#FF8C00,#FFB300)'
                              : 'rgba(255,140,0,0.5)',
                          }}
                        />
                        <span className="text-white text-sm font-bold">{currentData.label}</span>
                      </div>
                    </div>

                    {plan.savePercent > 0 && (
                      <div
                        className="px-3 py-1.5 rounded-xl text-xs font-black"
                        style={
                          plan.popular
                            ? { background: 'linear-gradient(135deg,#FF8C00,#FFB300)', color: '#000' }
                            : { background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.2)', color: '#FF8C00' }
                        }
                      >
                        SAVE {plan.savePercent}%
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-[#A1A1AA] text-2xl font-bold mb-1">$</span>
                      <span
                        className="font-anton leading-none"
                        style={{
                          fontSize: 'clamp(2.8rem,5vw,4rem)',
                          color: plan.popular ? '#FF8C00' : 'white',
                          fontFamily: 'var(--font-anton), Anton, sans-serif',
                          filter: plan.popular ? 'drop-shadow(0 0 20px rgba(255,140,0,0.4))' : 'none',
                        }}
                      >
                        {plan.price.toFixed(0)}
                      </span>
                      <span className="text-[#A1A1AA] text-lg font-bold mb-1">
                        .{plan.price.toFixed(2).split('.')[1]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#A1A1AA] text-sm line-through font-semibold">
                        ${plan.oldPrice.toFixed(2)}
                      </span>
                      <span className="text-[#A1A1AA] text-xs font-semibold">
                        · ${(plan.price / plan.months).toFixed(2)}/month
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px mb-6"
                    style={{
                      background: plan.popular
                        ? 'linear-gradient(90deg,transparent,rgba(255,140,0,0.3),transparent)'
                        : 'rgba(255,255,255,0.06)',
                    }}
                  />

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    {FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={
                            plan.popular
                              ? { background: 'linear-gradient(135deg,#FF8C00,#FFB300)' }
                              : { background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.2)' }
                          }
                        >
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none"
                            stroke={plan.popular ? '#000' : '#FF8C00'} strokeWidth="3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: plan.popular ? '#fff' : '#A1A1AA' }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.button
                    onClick={() => openWhatsApp(plan, activeConnections)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-[16px] font-black text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    style={
                      plan.popular
                        ? { background: 'linear-gradient(135deg,#FF8C00,#FFB300)', color: '#000', boxShadow: '0 0 30px rgba(255,140,0,0.4)' }
                        : { background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)', color: '#FF8C00' }
                    }
                  >
                    <span className="flex items-center justify-center gap-2">
                      {plan.popular
                        ? <><Zap size={14} strokeWidth={2} fill="currentColor" /> GET IPTV NOW</>
                        : <>GET STARTED <ArrowRight size={14} strokeWidth={2} /></>
                      }
                    </span>
                  </motion.button>

                  <p className="text-center text-gray-700 text-[11px] mt-4 tracking-wide flex items-center justify-center gap-2">
                    <Check size={11} strokeWidth={2.5} className="text-orange-500/60" />
                    Instant activation
                    <span className="opacity-40">·</span>
                    <Check size={11} strokeWidth={2.5} className="text-orange-500/60" />
                    Cancel anytime
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Trust badges */}
        <LucideGradDefs />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10"
        >
          {([
            { Icon: Zap,           label: 'Instant Activation' },
            { Icon: Lock,          label: 'Secure Payments' },
            { Icon: FileText,      label: 'No Contracts' },
            { Icon: Radio,         label: '99.99% Uptime' },
            { Icon: Shield,        label: 'Anti Freeze' },
            { Icon: MessageCircle, label: '24/7 Support' },
            { Icon: Earth,         label: 'Worldwide Access' },
          ] as const).map((badge) => (
            <motion.div
              key={badge.label}
              whileHover={{
                borderColor: 'rgba(255,122,0,0.4)',
                boxShadow: '0 0 18px rgba(255,122,0,0.12)',
                y: -2,
                transition: { duration: 0.2 }
              }}
              className="flex flex-col items-center gap-2.5 p-4 rounded-[16px] text-center border border-white/[0.06] transition-colors duration-300"
              style={{ background: 'rgba(17,17,17,0.8)', backdropFilter: 'blur(10px)' }}
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg,rgba(255,122,0,0.12),rgba(0,0,0,0.4))',
                  border: '1px solid rgba(255,122,0,0.2)',
                }}
              >
                <badge.Icon
                  size={16}
                  strokeWidth={2}
                  style={{ stroke: 'url(#lucideGrad)', filter: 'drop-shadow(0 0 4px rgba(255,122,0,0.4))' }}
                />
              </div>
              <span className="text-[#A1A1AA] text-[10px] font-bold uppercase tracking-wide leading-tight">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-gray-700 text-[11px] uppercase tracking-[0.25em] font-black">
            Accepted Payment Methods
          </p>

          <PaymentLogosGrid size="md" showLabel={true} />

          <p className="text-gray-700 text-[12px] text-center max-w-sm leading-relaxed">
            Secure payments via encrypted channels. Subscription activates instantly after confirmation.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
