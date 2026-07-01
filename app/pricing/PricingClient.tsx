'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Zap,
  Lock,
  FileText,
  Radio,
  ShieldCheck,
  MessageCircle,
  Globe,
  Check,
  Star,
  User,
  Users,
  Home,
  ArrowRight,
} from 'lucide-react'
import { openTawkChat } from "@/lib/hooks/useTawk"
import { PaymentLogosGrid } from "@/components/ui/PaymentLogos"

const PRICING_DATA = {
  1: {
    label: 'SOLO',
    tagline: 'Perfect for one screen',
    Icon: User,
    plans: [
      { duration: '3 Months',  months: 3,  price: 39.99,  oldPrice: 49.99,  savePercent: 20, popular: false },
      { duration: '6 Months',  months: 6,  price: 54.99,  oldPrice: 89.99,  savePercent: 40, popular: false },
      { duration: '12 Months', months: 12, price: 69.99,  oldPrice: 139.99, savePercent: 50, popular: true  },
    ]
  },
  2: {
    label: 'DUO',
    tagline: 'Ideal for couples',
    Icon: Users,
    plans: [
      { duration: '3 Months',  months: 3,  price: 55.00,  oldPrice: 75.00,  savePercent: 27, popular: false },
      { duration: '6 Months',  months: 6,  price: 75.00,  oldPrice: 110.00, savePercent: 32, popular: false },
      { duration: '12 Months', months: 12, price: 120.00, oldPrice: 180.00, savePercent: 33, popular: true  },
    ]
  },
  3: {
    label: 'FAMILY',
    tagline: 'For the whole household',
    Icon: Home,
    plans: [
      { duration: '3 Months',  months: 3,  price: 70.00,  oldPrice: 95.00,  savePercent: 26, popular: false },
      { duration: '6 Months',  months: 6,  price: 94.00,  oldPrice: 135.00, savePercent: 30, popular: false },
      { duration: '12 Months', months: 12, price: 165.00, oldPrice: 240.00, savePercent: 31, popular: true  },
    ]
  },
}

const FEATURES = [
  '25,000+ Live Channels',
  '100,000+ Movies & TV Shows',
  'Premium Sports Coverage',
  'Ultra HD 4K Quality',
  'Anti Freeze Technology',
  'VPN Compatible',
  'TV Guide (EPG)',
  'Catch-Up TV',
  'Fast Activation',
  '24/7 Support',
  'No Contracts',
  'Works Worldwide',
]

// Trust badges — all Lucide icons, consistent strokeWidth={1.5}
const TRUST_BADGES = [
  { Icon: Zap,           label: 'Instant Activation' },
  { Icon: Lock,          label: 'Secure Payments'    },
  { Icon: FileText,      label: 'No Contracts'       },
  { Icon: Radio,         label: '99.99% Uptime'      },
  { Icon: ShieldCheck,   label: 'Anti Freeze'        },
  { Icon: MessageCircle, label: 'Premium Support'    },
  { Icon: Globe,         label: 'Worldwide Access'   },
]

export default function PricingClient() {
  const [activeConnections, setActiveConnections] = useState(1)

  const openTawk = (plan: any) => {
    const connText = `${activeConnections} Screen${activeConnections > 1 ? 's' : ''}`;
    const priceStr = `$${plan.price.toFixed(2)}`;
    const msg =
      `Hello STREAMB4 Team 👋\n\n` +
      `I would like to purchase this subscription.\n\n` +
      `Plan: ${plan.duration}\n` +
      `Connections: ${connText}\n` +
      `Price: ${priceStr} USD\n\n` +
      `Device:\n` +
      `(Firestick / Android TV / Smart TV / iPhone / Windows)\n\n` +
      `Please help me complete my purchase.`;

    openTawkChat(msg, {
      Product: 'IPTV Subscription',
      Plan: plan.duration,
      Connections: activeConnections,
      Price: priceStr
    });
  }

  const currentData = PRICING_DATA[activeConnections as keyof typeof PRICING_DATA]

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden text-white flex flex-col">
      {/* ═══ BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main orange glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-[0.08]"
          style={{
            background: 'radial-gradient(ellipse,#ff8c00,transparent 70%)',
            filter: 'blur(80px)'
          }}/>
        {/* Bottom glow */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-[0.05]"
          style={{
            background: 'radial-gradient(ellipse,#ff8c00,transparent 70%)',
            filter: 'blur(60px)'
          }}/>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,140,0,1) 1px,transparent 1px),
              linear-gradient(90deg,rgba(255,140,0,1) 1px,transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}/>
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}/>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: '#ff8c00',
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.15
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1">

        {/* ═══ HERO ═══ */}
        <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}>

              {/* Label */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
                style={{
                  background: 'rgba(255,140,0,0.06)',
                  border: '1px solid rgba(255,140,0,0.18)',
                  backdropFilter: 'blur(10px)'
                }}>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-orange-500 text-xs font-black tracking-[0.35em] uppercase">
                  PREMIUM PLANS
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>

              {/* Heading */}
              <h1 className="font-anton uppercase leading-[0.9] tracking-tight mb-8"
                style={{ fontSize: 'clamp(3rem,8vw,7rem)', fontFamily: 'var(--font-anton), Anton, sans-serif' }}>
                <span className="text-white">SIMPLE </span>
                <br className="hidden sm:block" />
                <span style={{
                  background: 'linear-gradient(135deg,#FF8C00,#FFB300,#FF8C00)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite',
                  filter: 'drop-shadow(0 0 40px rgba(255,140,0,0.5))'
                }}>
                  PRICING.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[#A1A1AA] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-6 font-semibold">
                Choose the plan that fits your needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-[#A1A1AA]">
                {['No contracts', 'Instant activation', 'Premium streaming quality', '24/7 support'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Check
                      className="flex-shrink-0 text-orange-500"
                      size={16}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ CONNECTION SWITCHER ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-1.5 rounded-[20px]"
              style={{
                background: 'rgba(17,17,17,0.9)',
                border: '1px solid rgba(255,140,0,0.12)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 40px rgba(255,140,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)'
              }}>

              <div className="grid grid-cols-3 gap-1 relative">
                {/* Sliding pill */}
                <motion.div
                  className="absolute inset-y-0 rounded-[14px]"
                  layoutId="connectionPill"
                  style={{
                    width: 'calc(33.333% - 2px)',
                    left: `calc(${(activeConnections - 1) * 33.333}% + 2px)`,
                    background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                    boxShadow: '0 0 20px rgba(255,140,0,0.4)',
                    transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)'
                  }}/>

                {([
                  { n: 1, Icon: User  },
                  { n: 2, Icon: Users },
                  { n: 3, Icon: Home  },
                ] as const).map(({ n, Icon: TabIcon }) => (
                  <button
                    key={n}
                    onClick={() => setActiveConnections(n)}
                    aria-pressed={activeConnections === n}
                    aria-label={`${n} Screen${n > 1 ? 's' : ''}`}
                    className="relative z-10 flex flex-col items-center py-4 px-3 rounded-[14px] transition-all duration-300 cursor-pointer"
                  >
                    {/* Lucide icon */}
                    <TabIcon
                      size={20}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className={`mb-2 transition-colors duration-300 ${
                        activeConnections === n ? 'text-black' : 'text-white/30'
                      }`}
                    />
                    <span className={`font-black text-sm uppercase tracking-wide transition-colors duration-300 ${
                      activeConnections === n ? 'text-black' : 'text-[#A1A1AA]'
                    }`}>
                      {n} {n === 1 ? 'Screen' : 'Screens'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Plan label */}
            <motion.div
              key={activeConnections}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4">
              <span className="text-white font-black text-lg uppercase">
                {currentData.label}
              </span>
              <span className="text-[#A1A1AA] text-sm ml-2 font-semibold">
                — {currentData.tagline}
              </span>
            </motion.div>
          </div>
        </section>

        {/* ═══ PRICING CARDS ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeConnections}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">

                {currentData.plans.map((plan, i) => (
                  <motion.div
                    key={plan.duration}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{
                      y: plan.popular ? -14 : -10,
                      transition: { duration: 0.25 }
                    }}
                    className={`relative flex flex-col rounded-[24px] overflow-hidden cursor-pointer ${
                      plan.popular ? 'lg:-mt-[8px] lg:-mb-[8px]' : ''
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
                    }}>

                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center">
                        <div className="flex items-center gap-1.5 px-6 py-1.5 rounded-b-[14px] text-xs font-black text-black uppercase tracking-wider"
                          style={{
                            background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                            boxShadow: '0 4px 20px rgba(255,140,0,0.4)'
                          }}>
                          <Star size={11} strokeWidth={2.5} fill="black" aria-hidden="true" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Top glow line */}
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 h-px"
                        style={{
                          background: 'linear-gradient(90deg,transparent,#FF8C00,#FFB300,transparent)'
                        }}/>
                    )}

                    <div className={`flex flex-col h-full p-7 ${plan.popular ? 'pt-10' : ''}`}>
                      {/* Duration + Save badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider mb-1">
                            {plan.duration}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full"
                              style={{
                                background: plan.popular
                                  ? 'linear-gradient(135deg,#FF8C00,#FFB300)'
                                  : 'rgba(255,140,0,0.5)'
                              }}/>
                            <span className="text-white text-sm font-bold">
                              {activeConnections === 1 ? 'SOLO'
                                : activeConnections === 2 ? 'DUO'
                                : 'FAMILY'}
                            </span>
                          </div>
                        </div>

                        {plan.savePercent > 0 && (
                          <div className="px-3 py-1.5 rounded-xl text-xs font-black"
                            style={plan.popular ? {
                              background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                              color: '#000'
                            } : {
                              background: 'rgba(255,140,0,0.1)',
                              border: '1px solid rgba(255,140,0,0.2)',
                              color: '#FF8C00'
                            }}>
                            SAVE {plan.savePercent}%
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-end gap-2 mb-1">
                          <span className="text-[#A1A1AA] text-2xl font-bold mb-1">$</span>
                          <span className="font-anton leading-none"
                            style={{
                              fontSize: 'clamp(3rem,6vw,4.5rem)',
                              color: plan.popular ? '#FF8C00' : 'white',
                              fontFamily: 'var(--font-anton), Anton, sans-serif',
                              filter: plan.popular
                                ? 'drop-shadow(0 0 20px rgba(255,140,0,0.4))'
                                : 'none'
                            }}>
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
                      <div className="h-px mb-6"
                        style={{
                          background: plan.popular
                            ? 'linear-gradient(90deg,transparent,rgba(255,140,0,0.3),transparent)'
                            : 'rgba(255,255,255,0.06)'
                        }}/>

                      {/* Features */}
                      <div className="space-y-3 mb-8 flex-1">
                        {FEATURES.map((feature) => (
                          <div key={feature} className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                              style={plan.popular ? {
                                background: 'linear-gradient(135deg,#FF8C00,#FFB300)'
                              } : {
                                background: 'rgba(255,140,0,0.1)',
                                border: '1px solid rgba(255,140,0,0.2)'
                              }}
                              aria-hidden="true"
                            >
                              <Check
                                size={10}
                                strokeWidth={3}
                                color={plan.popular ? '#000' : '#FF8C00'}
                              />
                            </div>
                            <span className="text-sm font-semibold"
                              style={{ color: plan.popular ? '#fff' : '#A1A1AA' }}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={() => openTawk(plan)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        aria-label={`Get ${plan.duration} plan for $${plan.price.toFixed(2)}`}
                        className="w-full py-4 rounded-[16px] font-black text-sm uppercase tracking-wider transition-all duration-300 relative overflow-hidden cursor-pointer"
                        style={plan.popular ? {
                          background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                          color: '#000',
                          boxShadow: '0 0 30px rgba(255,140,0,0.4)'
                        } : {
                          background: 'rgba(255,140,0,0.08)',
                          border: '1px solid rgba(255,140,0,0.2)',
                          color: '#FF8C00'
                        }}>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
                          Get This Plan
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ═══ TRUST BADGES ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16" aria-label="Trust indicators">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {TRUST_BADGES.map(({ Icon: BadgeIcon, label }) => (
                <motion.div
                  key={label}
                  whileHover={{
                    y: -4,
                    boxShadow: '0 0 20px rgba(255,140,0,0.15)',
                    transition: { duration: 0.2 }
                  }}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-[16px] text-center cursor-default border border-white/[0.06] hover:border-orange-500/30 transition-colors duration-300"
                  style={{
                    background: 'rgba(17,17,17,0.8)',
                    backdropFilter: 'blur(10px)'
                  }}>
                  <BadgeIcon
                    size={22}
                    strokeWidth={1.5}
                    className="text-orange-500"
                    aria-hidden="true"
                  />
                  <span className="text-[#A1A1AA] text-[10px] font-bold uppercase tracking-wide leading-tight text-center">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PAYMENT METHODS ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20" aria-label="Accepted payment methods">
          <div className="max-w-5xl mx-auto">
            <div className="p-8 rounded-[24px] text-center"
              style={{
                background: 'rgba(17,17,17,0.6)',
                border: '1px solid rgba(255,140,0,0.08)',
                backdropFilter: 'blur(20px)'
              }}>
              <p className="text-[#A1A1AA] text-sm uppercase tracking-[0.2em] font-bold mb-8">
                Accepted Payment Methods
              </p>
              <PaymentLogosGrid size="md" showLabel={true} />
            </div>
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-12 sm:p-16 rounded-[32px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg,rgba(255,140,0,0.08),rgba(17,17,17,0.98))',
                border: '1px solid rgba(255,140,0,0.18)',
                boxShadow: '0 0 80px rgba(255,140,0,0.08)'
              }}>

              {/* Background glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full opacity-20"
                  style={{
                    background: 'radial-gradient(circle,#FF8C00,transparent 70%)',
                    filter: 'blur(60px)'
                  }}/>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: 'rgba(255,140,0,0.08)',
                    border: '1px solid rgba(255,140,0,0.18)'
                  }}>
                  <span className="text-orange-500 text-xs font-black tracking-[0.2em] uppercase">
                    Still not sure?
                  </span>
                </div>

                <h2 className="font-anton uppercase leading-tight mb-4"
                  style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontFamily: 'var(--font-anton), Anton, sans-serif' }}>
                  <span className="text-white">TRY </span>
                  <span style={{
                    background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>FREE</span>
                  <span className="text-white"> FIRST.</span>
                </h2>

                <p className="text-[#A1A1AA] text-lg mb-10 max-w-xl mx-auto font-semibold">
                  Try STREAMB4 free for 24 hours. Full access. No credit card required.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/free-trial">
                    <motion.div
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      aria-label="Start your free 24-hour trial"
                      className="flex items-center justify-center gap-2.5 px-10 py-5 rounded-[16px] font-black text-black text-base uppercase tracking-wider cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                        boxShadow: '0 0 40px rgba(255,140,0,0.4)'
                      }}>
                      <Zap size={18} strokeWidth={2.5} aria-hidden="true" />
                      Start Free Trial
                    </motion.div>
                  </Link>

                  <Link href="/contact">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      aria-label="Talk to our team"
                      className="flex items-center justify-center gap-2.5 px-10 py-5 rounded-[16px] font-bold text-white text-base border transition-colors cursor-pointer"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }}>
                      <MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />
                      Talk to Us
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center }
          100% { background-position: 200% center }
        }
      `}</style>
    </div>
  )
}
