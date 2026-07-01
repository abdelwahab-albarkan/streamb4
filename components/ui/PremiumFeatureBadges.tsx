'use client'
import React from 'react'
import { motion } from 'framer-motion'

/* ============================================
   PREMIUM SVG ICONS
============================================ */

const IconLiveTV = () => (
  <svg viewBox="0 0 24 24" fill="none" 
    className="w-6 h-6" 
    filter="url(#glowOrange)">
    <defs>
      <linearGradient id="tvG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff7a00"/>
        <stop offset="100%" stopColor="#ffb300"/>
      </linearGradient>
      <filter id="glowOrange" x="-20%" y="-20%" 
        width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Screen body */}
    <rect x="1" y="3" width="22" height="15" rx="2.5"
      stroke="url(#tvG)" strokeWidth="1.5"
      fill="url(#tvG)" fillOpacity="0.08"/>
    {/* Inner screen shine */}
    <rect x="3" y="5" width="18" height="11" rx="1.5"
      fill="url(#tvG)" fillOpacity="0.12"/>
    {/* Play triangle */}
    <path d="M10 8.5l5 3-5 3V8.5z"
      fill="url(#tvG)" opacity="0.9"/>
    {/* LIVE dot */}
    <circle cx="5" cy="7" r="1.2"
      fill="#ff4444" opacity="0.9"/>
    {/* Stand */}
    <path d="M8 18l1.5 3h5L16 18" 
      stroke="url(#tvG)" strokeWidth="1.5" 
      strokeLinecap="round"/>
    <path d="M7 21h10" 
      stroke="url(#tvG)" strokeWidth="1.5" 
      strokeLinecap="round"/>
  </svg>
)

const IconClapperboard = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <defs>
      <linearGradient id="clapG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff7a00"/>
        <stop offset="100%" stopColor="#ffb300"/>
      </linearGradient>
      <filter id="glowClap" x="-20%" y="-20%" 
        width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Main board */}
    <rect x="2" y="7" width="20" height="15" rx="2"
      stroke="url(#clapG)" strokeWidth="1.5"
      fill="url(#clapG)" fillOpacity="0.08"
      filter="url(#glowClap)"/>
    {/* Top clapper */}
    <rect x="2" y="3" width="20" height="5" rx="1.5"
      stroke="url(#clapG)" strokeWidth="1.5"
      fill="url(#clapG)" fillOpacity="0.15"/>
    {/* Clapper stripes */}
    <path d="M6 3l-2 5M10 3l-2 5M14 3l-2 5M18 3l-2 5"
      stroke="url(#clapG)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.8"/>
    {/* Play button inner */}
    <path d="M10 12l5 2.5-5 2.5V12z"
      fill="url(#clapG)" opacity="0.8"/>
  </svg>
)

const Icon4K = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <defs>
      <linearGradient id="fourKG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff7a00"/>
        <stop offset="100%" stopColor="#ffb300"/>
      </linearGradient>
      <filter id="glow4k" x="-20%" y="-20%" 
        width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Badge container */}
    <rect x="1" y="4" width="22" height="16" rx="3"
      stroke="url(#fourKG)" strokeWidth="1.5"
      fill="url(#fourKG)" fillOpacity="0.08"
      filter="url(#glow4k)"/>
    {/* 4 */}
    <path d="M5 8v4h3M8 8v8" 
      stroke="url(#fourKG)" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
    {/* K */}
    <path d="M11 8v8M11 12l4-4M11 12l4 4"
      stroke="url(#fourKG)" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
    {/* HD small */}
    <text x="17" y="17" 
      fontSize="4" 
      fill="url(#fourKG)" 
      fontWeight="bold"
      opacity="0.8">HD</text>
    {/* Corner shine */}
    <path d="M18 5l3 3" 
      stroke="url(#fourKG)" strokeWidth="1"
      strokeLinecap="round" opacity="0.4"/>
  </svg>
)

const IconLightning = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <defs>
      <linearGradient id="lightG" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#ff7a00"/>
        <stop offset="100%" stopColor="#ffb300"/>
      </linearGradient>
      <filter id="glowLight" x="-30%" y="-30%" 
        width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Lightning bolt filled */}
    <path 
      d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
      fill="url(#lightG)" 
      fillOpacity="0.25"
      stroke="url(#lightG)" 
      strokeWidth="1.5"
      strokeLinejoin="round"
      filter="url(#glowLight)"/>
    {/* Inner shine */}
    <path d="M11 6l-4 7h5l-1 5 6-8h-5l1-4z"
      fill="url(#lightG)" fillOpacity="0.3"/>
  </svg>
)

/* ============================================
   ICON CONTAINER - Glassmorphism
============================================ */

const IconContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-12 h-12 flex-shrink-0">
    {/* Outer glow */}
    <div className="absolute inset-0 rounded-xl blur-md opacity-40"
      style={{
        background: 'linear-gradient(135deg, #ff7a00, #ffb300)'
      }}
    />
    {/* Glass container */}
    <div className="relative w-full h-full rounded-xl
      flex items-center justify-center
      bg-gradient-to-br from-white/10 to-white/[0.03]
      backdrop-blur-md"
      style={{
        border: '1px solid',
        borderImageSlice: 1,
        borderImageSource: 
          'linear-gradient(135deg, rgba(255,122,0,0.6), rgba(255,179,0,0.3))',
        boxShadow: `
          0 0 20px rgba(255,122,0,0.15),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `
      }}>
      {children}
    </div>
  </div>
)

/* ============================================
   FEATURE BADGE COMPONENT
============================================ */

const FeatureBadge = ({ 
  icon, title, subtitle 
}: { 
  icon: React.ReactNode
  title: string
  subtitle?: string 
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2 }}
    className="group flex items-center gap-3 
      px-4 py-3 rounded-2xl cursor-default
      bg-white/[0.03] border border-white/[0.06]
      hover:bg-white/[0.06] 
      hover:border-orange-500/20
      hover:shadow-[0_0_30px_rgba(255,122,0,0.1)]
      transition-all duration-300"
  >
    <IconContainer>{icon}</IconContainer>
    <div>
      <p className="text-white font-bold text-sm 
        group-hover:text-orange-100
        transition-colors duration-300">
        {title}
      </p>
      {subtitle && (
        <p className="text-gray-500 text-xs mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  </motion.div>
)

/* ============================================
   SVG FLAG COMPONENTS
============================================ */

const FlagUSA = () => (
  <svg viewBox="0 0 20 14" className="w-5 h-3.5 rounded-sm">
    <rect width="20" height="14" fill="#B22234"/>
    <rect y="1.08" width="20" height="1.08" fill="white"/>
    <rect y="3.23" width="20" height="1.08" fill="white"/>
    <rect y="5.38" width="20" height="1.08" fill="white"/>
    <rect y="7.54" width="20" height="1.08" fill="white"/>
    <rect y="9.69" width="20" height="1.08" fill="white"/>
    <rect y="11.85" width="20" height="1.08" fill="white"/>
    <rect width="8" height="7.54" fill="#3C3B6E"/>
    {[0,1,2,3,4].map(row => (
      [0,1,2,3,4,5].map(col => (
        (row % 2 === 0 ? col < 6 : col < 5) && (
          <circle key={`${row}-${col}`}
            cx={col * 1.33 + (row % 2 === 0 ? 0.67 : 1.33)}
            cy={row * 1.5 + 0.75}
            r="0.4" fill="white"/>
        )
      ))
    ))}
  </svg>
)

const FlagCanada = () => (
  <svg viewBox="0 0 20 14" className="w-5 h-3.5 rounded-sm">
    <rect width="20" height="14" fill="white"/>
    <rect width="5" height="14" fill="#FF0000"/>
    <rect x="15" width="5" height="14" fill="#FF0000"/>
    {/* Maple leaf simplified */}
    <path d="M10 2l1 2.5h2.5l-2 1.5 1 3L10 7.5 7.5 9l1-3-2-1.5H9L10 2z"
      fill="#FF0000"/>
    <rect x="9.3" y="9" width="1.4" height="2.5" fill="#FF0000"/>
  </svg>
)

const FlagUK = () => (
  <svg viewBox="0 0 20 14" className="w-5 h-3.5 rounded-sm">
    <rect width="20" height="14" fill="#012169"/>
    {/* Diagonals white */}
    <path d="M0 0l20 14M20 0L0 14" 
      stroke="white" strokeWidth="3"/>
    {/* Diagonals red */}
    <path d="M0 0l20 14M20 0L0 14" 
      stroke="#C8102E" strokeWidth="1.5"/>
    {/* Cross white */}
    <path d="M10 0v14M0 7h20" 
      stroke="white" strokeWidth="4.5"/>
    {/* Cross red */}
    <path d="M10 0v14M0 7h20" 
      stroke="#C8102E" strokeWidth="2.5"/>
  </svg>
)

const FlagEU = () => (
  <svg viewBox="0 0 20 14" className="w-5 h-3.5 rounded-sm">
    <rect width="20" height="14" fill="#003399"/>
    {/* 12 gold stars in circle */}
    {Array.from({length: 12}).map((_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const cx = 10 + 4 * Math.cos(angle)
      const cy = 7 + 4 * Math.sin(angle)
      return (
        <path key={i}
          d={`M${cx},${cy-1.2} l0.4,1.2 1.2,0 -1,0.8 0.4,1.2 
              -1-0.8 -1,0.8 0.4-1.2 -1-0.8 1.2,0z`}
          fill="#FFCC00"
          transform={`scale(0.6) 
            translate(${cx/0.6 - cx}, ${cy/0.6 - cy})`}
        />
      )
    })}
  </svg>
)

/* ============================================
   COUNTRY PILL COMPONENT  
============================================ */

const CountryPill = ({ 
  flag, name 
}: { 
  flag: React.ReactNode
  name: string 
}) => (
  <motion.div
    whileHover={{ scale: 1.08, y: -1 }}
    transition={{ duration: 0.2 }}
    className="group inline-flex items-center gap-2
      px-4 py-2 rounded-full cursor-default
      backdrop-blur-md
      transition-all duration-300
      hover:shadow-[0_0_25px_rgba(255,122,0,0.2)]"
    style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,122,0,0.25)',
      boxShadow: '0 0 12px rgba(255,122,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
    }}
  >
    {/* Flag with glow */}
    <div className="rounded-sm overflow-hidden
      shadow-[0_0_8px_rgba(255,122,0,0.3)]
      group-hover:shadow-[0_0_12px_rgba(255,122,0,0.5)]
      transition-all duration-300">
      {flag}
    </div>
    <span className="text-gray-200 text-xs font-semibold 
      tracking-wide uppercase
      group-hover:text-orange-100
      transition-colors duration-300">
      {name}
    </span>
  </motion.div>
)

/* ============================================
   MAIN EXPORT COMPONENTS
============================================ */

export const PremiumFeatureBadges = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="flex flex-wrap gap-3 my-6"
  >
    <FeatureBadge
      icon={<IconLiveTV />}
      title="50,000+ Live Channels"
      subtitle="Every league, every match"
    />
    <FeatureBadge
      icon={<IconClapperboard />}
      title="180,000+ Movies & Series"
      subtitle="New titles weekly"
    />
    <FeatureBadge
      icon={<Icon4K />}
      title="4K Ultra HD"
      subtitle="HDR10+ quality"
    />
    <FeatureBadge
      icon={<IconLightning />}
      title="Instant Activation"
      subtitle="Ready in 60 seconds"
    />
  </motion.div>
)

export const PremiumCountryBadges = () => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, duration: 0.5 }}
    className="flex flex-row flex-nowrap items-center gap-2 mb-6 w-max max-w-full overflow-visible"
  >
    <CountryPill flag={<FlagUSA />} name="United States" />
    <CountryPill flag={<FlagCanada />} name="Canada" />
    <CountryPill flag={<FlagUK />} name="United Kingdom" />
    <CountryPill flag={<FlagEU />} name="Europe" />
  </motion.div>
)
