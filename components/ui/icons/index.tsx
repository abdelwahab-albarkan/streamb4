'use client'
import { motion } from 'framer-motion'
import {
  Download, PlaySquare, KeyRound, RefreshCw, Tv, Globe,
  Smartphone, Zap, ShieldCheck, Settings, Store, Wifi,
  Flame, Monitor, Cpu, CheckCircle, Copy, ExternalLink,
  Star, Lock, FileText, Radio, Shield, MessageCircle, Earth,
  Bitcoin, CreditCard, Package, LogIn, Clock, Search,
  ChevronRight, Wrench, ListOrdered, LayoutGrid, ArrowRight,
  ScanLine, RotateCw, CirclePlay, Rocket, Award, Play,
  LucideIcon as LucideIconType
} from 'lucide-react'

/* ════════════════════════════════════════════════
   PREMIUM ICON CONTAINER (Lucide-based)
   60×60 glassmorphism, 2px stroke, orange glow
════════════════════════════════════════════════ */
interface PremiumIconBoxProps {
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  float?: boolean
}

export function PremiumIconBox({
  children,
  size = 'md',
  className = '',
  float = false,
}: PremiumIconBoxProps) {
  const dim = {
    xs: 'w-9 h-9 rounded-[10px]',
    sm: 'w-11 h-11 rounded-[13px]',
    md: 'w-[60px] h-[60px] rounded-[16px]',
    lg: 'w-[72px] h-[72px] rounded-[20px]',
  }

  return (
    <motion.div
      animate={float ? { y: [0, -4, 0] } : undefined}
      transition={float ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      whileHover={{
        scale: 1.08,
        boxShadow: '0 0 28px rgba(255,122,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,122,0,0.55)',
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
      className={`relative flex-shrink-0 flex items-center justify-center
        ${dim[size]} ${className}`}
      style={{
        background:
          'linear-gradient(145deg, rgba(255,122,0,0.10) 0%, rgba(20,10,0,0.85) 100%)',
        border: '1px solid rgba(255,122,0,0.22)',
        boxShadow:
          '0 0 18px rgba(255,122,0,0.10), inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 14px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Top shine line */}
      <div
        className="absolute top-0 left-2 right-2 h-px rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,200,100,0.35), transparent)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════
   LUCIDE ICON — single source, consistent style
   Usage: <LIcon icon={Download} />
════════════════════════════════════════════════ */
interface LIconProps {
  icon: LucideIconType
  size?: number
  className?: string
  gradient?: boolean
}

export function LIcon({ icon: Icon, size = 22, className = '' }: LIconProps) {
  return (
    <Icon
      size={size}
      strokeWidth={2}
      className={className}
      style={{
        stroke: 'url(#lucideGrad)',
        filter: 'drop-shadow(0 0 6px rgba(255,122,0,0.45))',
      }}
    />
  )
}


/* Inline SVG gradient needed for Lucide stroke gradient */
export function LucideGradDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
      <defs>
        <linearGradient id="lucideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7a00" />
          <stop offset="100%" stopColor="#ffb300" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ════════════════════════════════════════════════
   READY-TO-USE BOXED LUCIDE ICONS
   <BoxIcon.Download /> etc.
════════════════════════════════════════════════ */
function makeBoxIcon(
  Icon: LucideIconType,
  defaultSize: PremiumIconBoxProps['size'] = 'md',
  iconSize = 24
) {
  return function BoxedIcon({
    size,
    float,
    className,
  }: {
    size?: PremiumIconBoxProps['size']
    float?: boolean
    className?: string
  }) {
    return (
      <PremiumIconBox size={size ?? defaultSize} float={float} className={className}>
        <LucideGradDefs />
        <LIcon icon={Icon} size={iconSize} />
      </PremiumIconBox>
    )
  }
}

// Install step icons
export const BoxIconSettings      = makeBoxIcon(Settings,      'md', 24)
export const BoxIconDownload      = makeBoxIcon(Download,      'md', 24)
export const BoxIconLink          = makeBoxIcon(ScanLine,      'md', 24)
export const BoxIconPackage       = makeBoxIcon(Package,       'md', 24)
export const BoxIconPlay          = makeBoxIcon(CirclePlay,    'md', 24)
export const BoxIconCheckCircle   = makeBoxIcon(CheckCircle,   'md', 24)
export const BoxIconStore         = makeBoxIcon(Store,         'md', 24)
export const BoxIconSearch        = makeBoxIcon(Search,        'md', 24)
export const BoxIconRadio         = makeBoxIcon(Radio,         'md', 24)
export const BoxIconMessage       = makeBoxIcon(MessageCircle, 'md', 24)
export const BoxIconRotate        = makeBoxIcon(RotateCw,      'md', 24)
export const BoxIconSmartphone    = makeBoxIcon(Smartphone,    'md', 24)
export const BoxIconLogIn         = makeBoxIcon(LogIn,         'md', 24)
export const BoxIconClock         = makeBoxIcon(Clock,         'md', 24)
export const BoxIconTv            = makeBoxIcon(Tv,            'md', 24)
export const BoxIconGlobe         = makeBoxIcon(Globe,         'md', 24)
export const BoxIconCpu           = makeBoxIcon(Cpu,           'md', 24)
export const BoxIconFlame         = makeBoxIcon(Flame,         'md', 24)
export const BoxIconMonitor       = makeBoxIcon(Monitor,       'md', 24)
export const BoxIconWifi          = makeBoxIcon(Wifi,          'md', 24)
export const BoxIconRocket        = makeBoxIcon(Rocket,        'md', 24)
export const BoxIconShield        = makeBoxIcon(ShieldCheck,   'md', 24)
export const BoxIconKey           = makeBoxIcon(KeyRound,      'md', 24)
export const BoxIconZap           = makeBoxIcon(Zap,           'md', 24)
export const BoxIconLock          = makeBoxIcon(Lock,          'md', 24)
export const BoxIconFileText      = makeBoxIcon(FileText,      'md', 24)
export const BoxIconStar          = makeBoxIcon(Star,          'md', 24)
export const BoxIconAward         = makeBoxIcon(Award,         'md', 24)
export const BoxIconEarth         = makeBoxIcon(Earth,         'md', 24)
export const BoxIconRefresh       = makeBoxIcon(RefreshCw,     'md', 24)
export const BoxIconExternalLink  = makeBoxIcon(ExternalLink,  'md', 24)
export const BoxIconListOrdered   = makeBoxIcon(ListOrdered,   'md', 24)
export const BoxIconGrid          = makeBoxIcon(LayoutGrid,    'md', 24)
export const BoxIconCopy          = makeBoxIcon(Copy,          'md', 24)
export const BoxIconCreditCard    = makeBoxIcon(CreditCard,    'md', 24)
export const BoxIconPlaySquare    = makeBoxIcon(PlaySquare,    'md', 24)

/* ════════════════════════════════════════════════
   STEP ICON — used in install page steps
   Maps a string key → premium Lucide icon box
════════════════════════════════════════════════ */
const STEP_ICON_MAP: Record<string, LucideIconType> = {
  settings:   Settings,
  download:   Download,
  link:       ScanLine,
  package:    Package,
  play:       CirclePlay,
  check:      CheckCircle,
  store:      Store,
  search:     Search,
  radio:      Radio,
  message:    MessageCircle,
  rotate:     RotateCw,
  smartphone: Smartphone,
  login:      LogIn,
  clock:      Clock,
  tv:         Tv,
  globe:      Globe,
  key:        KeyRound,
  zap:        Zap,
  wifi:       Wifi,
  rocket:     Rocket,
  shield:     ShieldCheck,
  earth:      Earth,
  refresh:    RotateCw,
}

export function StepIcon({ name }: { name: string }) {
  const Icon = STEP_ICON_MAP[name] ?? CheckCircle
  return (
    <PremiumIconBox size="md">
      <LucideGradDefs />
      <LIcon icon={Icon} size={22} />
    </PremiumIconBox>
  )
}

/* ═══════════════════════════════════════
   ICON CONTAINER — Used by ALL icons
═══════════════════════════════════════ */

interface IconContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  className?: string
}

export function IconContainer({ 
  children, 
  size = 'md',
  glow = true,
  className = ''
}: IconContainerProps) {
  const sizes = {
    sm: 'w-10 h-10 rounded-[14px]',
    md: 'w-14 h-14 rounded-[18px]',
    lg: 'w-16 h-16 rounded-[20px]',
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.08, 
        rotate: 2,
        transition: { duration: 0.25, ease: 'easeOut' }
      }}
      className={`relative flex-shrink-0 flex items-center 
        justify-center ${sizes[size]} ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(255,122,0,0.12) 0%, rgba(255,179,0,0.05) 100%)',
        border: '1px solid rgba(255,122,0,0.25)',
        boxShadow: glow 
          ? '0 0 20px rgba(255,122,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
      }}>
      
      {/* Inner glow top */}
      <div className="absolute top-0 left-0 right-0 h-px rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,122,0,0.4), transparent)'
        }}/>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   GRADIENT DEFS — Reusable SVG gradients
═══════════════════════════════════════ */

export function IconDefs({ id = 'og' }: { id?: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff7a00"/>
        <stop offset="100%" stopColor="#ffb300"/>
      </linearGradient>
      <linearGradient id={`${id}v`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff7a00"/>
        <stop offset="100%" stopColor="#ffb300"/>
      </linearGradient>
      <filter id={`${id}glow`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  )
}

/* ═══════════════════════════════════════
   FEATURE ICONS
═══════════════════════════════════════ */

export const Icon4K = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="i4k"/>
    <rect x="1" y="5" width="26" height="18" rx="3"
      stroke="url(#i4k)" strokeWidth="1.5"
      fill="url(#i4k)" fillOpacity="0.08"
      filter="url(#i4kglow)"/>
    <text x="4" y="18" fontSize="9" fontWeight="900"
      fill="url(#i4k)" fontFamily="system-ui"
      letterSpacing="-0.5">4K</text>
    <text x="16" y="18" fontSize="7" fontWeight="700"
      fill="url(#i4k)" fontFamily="system-ui"
      opacity="0.7">HD</text>
    <path d="M3 8h4M3 20h4"
      stroke="url(#i4k)" strokeWidth="1" opacity="0.4"
      strokeLinecap="round"/>
  </svg>
)

export const IconLiveTV = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="iltv"/>
    <rect x="1" y="4" width="26" height="17" rx="2.5"
      stroke="url(#iltv)" strokeWidth="1.5"
      fill="url(#iltv)" fillOpacity="0.08"
      filter="url(#iltvglow)"/>
    <rect x="4" y="7" width="20" height="11" rx="1.5"
      fill="url(#iltv)" fillOpacity="0.1"/>
    <path d="M12 10.5l5 3-5 3v-6z"
      fill="url(#iltv)" opacity="0.9"/>
    <circle cx="5.5" cy="7.5" r="1.5"
      fill="#ff4444" opacity="0.9"/>
    <path d="M9 23.5h10M14 21v2.5"
      stroke="url(#iltv)" strokeWidth="1.5"
      strokeLinecap="round"/>
  </svg>
)

export const IconStreaming = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="istr"/>
    <path d="M4 14c0-5.523 4.477-10 10-10s10 4.477 10 10"
      stroke="url(#istr)" strokeWidth="1.5"
      strokeLinecap="round" filter="url(#istrglow)"/>
    <path d="M7 14c0-3.866 3.134-7 7-7s7 3.134 7 7"
      stroke="url(#istr)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.7"/>
    <path d="M10.5 14c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5"
      stroke="url(#istr)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.5"/>
    <circle cx="14" cy="14" r="2"
      fill="url(#istr)" filter="url(#istrglow)"/>
    <path d="M14 20v4" stroke="url(#istr)"
      strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 24h6" stroke="url(#istr)"
      strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const IconNoBuffer = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="inb"/>
    <path d="M14 2L3 8v6c0 6 5 10.5 11 13 6-2.5 11-7 11-13V8L14 2z"
      stroke="url(#inb)" strokeWidth="1.5"
      fill="url(#inb)" fillOpacity="0.08"
      strokeLinejoin="round"
      filter="url(#inbglow)"/>
    <path d="M9 14l3 3 7-7"
      stroke="url(#inb)" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      filter="url(#inbglow)"/>
  </svg>
)

export const IconGlobe = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="iglb"/>
    <circle cx="14" cy="14" r="11"
      stroke="url(#iglb)" strokeWidth="1.5"
      fill="url(#iglb)" fillOpacity="0.06"
      filter="url(#iglbglow)"/>
    <path d="M14 3c-3.5 3.5-5 7-5 11s1.5 7.5 5 11c3.5-3.5 5-7 5-11s-1.5-7.5-5-11z"
      stroke="url(#iglb)" strokeWidth="1.5"/>
    <path d="M3 14h22M5 8h18M5 20h18"
      stroke="url(#iglb)" strokeWidth="1" opacity="0.5"
      strokeLinecap="round"/>
  </svg>
)

export const IconNoLock = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="inl"/>
    <path d="M9 11V8a5 5 0 019.5-2.2"
      stroke="url(#inl)" strokeWidth="1.5"
      strokeLinecap="round"
      filter="url(#inlglow)"/>
    <rect x="5" y="11" width="18" height="14" rx="3"
      stroke="url(#inl)" strokeWidth="1.5"
      fill="url(#inl)" fillOpacity="0.08"/>
    <circle cx="14" cy="17" r="2.5"
      fill="url(#inl)" opacity="0.9"/>
    <path d="M14 19.5v2.5"
      stroke="url(#inl)" strokeWidth="1.5"
      strokeLinecap="round"/>
    <path d="M21 4L4 24"
      stroke="url(#inl)" strokeWidth="2"
      strokeLinecap="round" opacity="0.6"/>
  </svg>
)

export const IconSupport = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="isup"/>
    <path d="M4 16v-3a10 10 0 0120 0v3"
      stroke="url(#isup)" strokeWidth="1.5"
      strokeLinecap="round"
      filter="url(#isupglow)"/>
    <rect x="2" y="16" width="5" height="7" rx="2.5"
      stroke="url(#isup)" strokeWidth="1.5"
      fill="url(#isup)" fillOpacity="0.15"/>
    <rect x="21" y="16" width="5" height="7" rx="2.5"
      stroke="url(#isup)" strokeWidth="1.5"
      fill="url(#isup)" fillOpacity="0.15"/>
    <path d="M24 23c0 2-2 3-3.5 3H16"
      stroke="url(#isup)" strokeWidth="1.5"
      strokeLinecap="round"/>
    <circle cx="14" cy="25.5" r="1.5"
      fill="url(#isup)"/>
  </svg>
)

export const IconDevices = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="idev"/>
    <rect x="1" y="5" width="17" height="12" rx="2"
      stroke="url(#idev)" strokeWidth="1.5"
      fill="url(#idev)" fillOpacity="0.08"
      filter="url(#idevglow)"/>
    <rect x="20" y="9" width="7" height="11" rx="1.5"
      stroke="url(#idev)" strokeWidth="1.5"
      fill="url(#idev)" fillOpacity="0.08"/>
    <path d="M8 17v3M5 20h6"
      stroke="url(#idev)" strokeWidth="1.5"
      strokeLinecap="round"/>
    <path d="M23.5 18.5h0"
      stroke="url(#idev)" strokeWidth="2"
      strokeLinecap="round"/>
  </svg>
)

export const IconLightning = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="ilgt"/>
    <path d="M15 2L5 16h8l-1 10 11-14h-8l2-10z"
      fill="url(#ilgt)" fillOpacity="0.2"
      stroke="url(#ilgt)" strokeWidth="1.5"
      strokeLinejoin="round"
      filter="url(#ilgtglow)"/>
    <path d="M13 6l-4 7h5l-1 6 7-9h-5l1-4z"
      fill="url(#ilgt)" opacity="0.4"/>
  </svg>
)

export const IconSports = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="ispt"/>
    <circle cx="14" cy="14" r="11"
      stroke="url(#ispt)" strokeWidth="1.5"
      fill="url(#ispt)" fillOpacity="0.06"
      filter="url(#isptglow)"/>
    <path d="M14 3v22M3 14h22"
      stroke="url(#ispt)" strokeWidth="1" opacity="0.3"/>
    <path d="M6 6.5C8 9 10 10 14 10s6-1 8-3.5"
      stroke="url(#ispt)" strokeWidth="1.2"
      strokeLinecap="round" opacity="0.6"/>
    <path d="M6 21.5C8 19 10 18 14 18s6 1 8 3.5"
      stroke="url(#ispt)" strokeWidth="1.2"
      strokeLinecap="round" opacity="0.6"/>
    <circle cx="14" cy="14" r="3"
      stroke="url(#ispt)" strokeWidth="1.5"
      fill="url(#ispt)" fillOpacity="0.2"/>
  </svg>
)

export const IconMovies = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="imov"/>
    <rect x="2" y="8" width="24" height="17" rx="2"
      stroke="url(#imov)" strokeWidth="1.5"
      fill="url(#imov)" fillOpacity="0.08"
      filter="url(#imovglow)"/>
    <rect x="2" y="4" width="24" height="5" rx="1.5"
      stroke="url(#imov)" strokeWidth="1.5"
      fill="url(#imov)" fillOpacity="0.12"/>
    <path d="M8 4L6 9M14 4l-2 5M20 4l-2 5"
      stroke="url(#imov)" strokeWidth="1.5"
      strokeLinecap="round"/>
    <path d="M11.5 13l6 3.5-6 3.5V13z"
      fill="url(#imov)" opacity="0.9"/>
  </svg>
)

export const IconDiamond = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="idmd"/>
    <path d="M14 2l5 7H9l5-7z"
      stroke="url(#idmd)" strokeWidth="1.5"
      strokeLinejoin="round"
      fill="url(#idmd)" fillOpacity="0.15"
      filter="url(#idmdglow)"/>
    <path d="M9 9l5 17L4 9h5z"
      stroke="url(#idmd)" strokeWidth="1.5"
      strokeLinejoin="round"
      fill="url(#idmd)" fillOpacity="0.08"/>
    <path d="M19 9l-5 17 10-17h-5z"
      stroke="url(#idmd)" strokeWidth="1.5"
      strokeLinejoin="round"
      fill="url(#idmd)" fillOpacity="0.08"/>
    <path d="M9 9h10"
      stroke="url(#idmd)" strokeWidth="1.5"/>
  </svg>
)

export const IconShield = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="ishld"/>
    <path d="M14 2L4 6.5v6c0 5.5 4 10 10 12 6-2 10-6.5 10-12v-6L14 2z"
      stroke="url(#ishld)" strokeWidth="1.5"
      fill="url(#ishld)" fillOpacity="0.1"
      strokeLinejoin="round"
      filter="url(#ishldglow)"/>
    <path d="M10 14l2.5 2.5L18 11"
      stroke="url(#ishld)" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      filter="url(#ishldglow)"/>
  </svg>
)

export const IconRocket = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="irkt"/>
    <path d="M14 2s-7 4.5-7 11c0 2.5 1 4 1 4l6 6s1.5 1 2 0c0 0 1-1.5 1-4 0-2.5 1-5 3-7.5L14 2z"
      stroke="url(#irkt)" strokeWidth="1.5"
      fill="url(#irkt)" fillOpacity="0.1"
      strokeLinejoin="round"
      filter="url(#irktglow)"/>
    <circle cx="14" cy="10" r="2.5"
      fill="url(#irkt)" opacity="0.9"/>
    <path d="M7 17l-3 6M21 17l3 6"
      stroke="url(#irkt)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.5"/>
  </svg>
)

export const IconStar = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="istr2"/>
    <path d="M14 2l3 8h9l-7 5 3 8-8-5-8 5 3-8-7-5h9l3-8z"
      fill="url(#istr2)" fillOpacity="0.9"
      stroke="url(#istr2)" strokeWidth="0.5"
      strokeLinejoin="round"
      filter="url(#istr2glow)"/>
  </svg>
)

export const IconChart = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="ichr"/>
    <path d="M4 22V12l6-5 6 4 8-8"
      stroke="url(#ichr)" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      filter="url(#ichrglow)"/>
    <path d="M4 22h20"
      stroke="url(#ichr)" strokeWidth="1.5"
      strokeLinecap="round"/>
    <circle cx="4" cy="12" r="2" fill="url(#ichr)"/>
    <circle cx="10" cy="7" r="2" fill="url(#ichr)"/>
    <circle cx="16" cy="11" r="2" fill="url(#ichr)"/>
    <circle cx="24" cy="3" r="2" fill="url(#ichr)"/>
  </svg>
)

export const IconUsers = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="iusr"/>
    <circle cx="10" cy="9" r="4"
      stroke="url(#iusr)" strokeWidth="1.5"
      fill="url(#iusr)" fillOpacity="0.1"
      filter="url(#iusrglow)"/>
    <path d="M2 24c0-4 3.6-7 8-7"
      stroke="url(#iusr)" strokeWidth="1.5"
      strokeLinecap="round"/>
    <circle cx="20" cy="11" r="3"
      stroke="url(#iusr)" strokeWidth="1.5"
      fill="url(#iusr)" fillOpacity="0.1"/>
    <path d="M14.5 24c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6"
      stroke="url(#iusr)" strokeWidth="1.5"
      strokeLinecap="round"/>
  </svg>
)

export const IconSettings = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="iset"/>
    <circle cx="14" cy="14" r="3.5"
      stroke="url(#iset)" strokeWidth="1.5"
      fill="url(#iset)" fillOpacity="0.15"
      filter="url(#isetglow)"/>
    <path d="M14 2v3M14 23v3M2 14h3M23 14h3"
      stroke="url(#iset)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.7"/>
    <path d="M5.6 5.6l2.1 2.1M20.3 20.3l2.1 2.1M5.6 22.4l2.1-2.1M20.3 7.7l2.1-2.1"
      stroke="url(#iset)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.5"/>
  </svg>
)

export const IconMoney = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="imny"/>
    <rect x="2" y="7" width="24" height="15" rx="3"
      stroke="url(#imny)" strokeWidth="1.5"
      fill="url(#imny)" fillOpacity="0.08"
      filter="url(#imnyglow)"/>
    <circle cx="14" cy="14.5" r="3.5"
      stroke="url(#imny)" strokeWidth="1.5"
      fill="url(#imny)" fillOpacity="0.15"/>
    <path d="M14 12v1.5l1.5 1"
      stroke="url(#imny)" strokeWidth="1.2"
      strokeLinecap="round"/>
    <path d="M6 14.5h1.5M20.5 14.5H22"
      stroke="url(#imny)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.5"/>
  </svg>
)

export const IconPlay = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="iply"/>
    <circle cx="14" cy="14" r="11"
      stroke="url(#iply)" strokeWidth="1.5"
      fill="url(#iply)" fillOpacity="0.08"
      filter="url(#iplyglow)"/>
    <path d="M11.5 10l8 4-8 4V10z"
      fill="url(#iply)" opacity="0.9"/>
  </svg>
)

export const IconSearch = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="isrh"/>
    <circle cx="12" cy="12" r="8"
      stroke="url(#isrh)" strokeWidth="1.5"
      fill="url(#isrh)" fillOpacity="0.08"
      filter="url(#isrhglow)"/>
    <path d="M18 18l6 6"
      stroke="url(#isrh)" strokeWidth="2"
      strokeLinecap="round"/>
    <path d="M9 12h6M12 9v6"
      stroke="url(#isrh)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.5"/>
  </svg>
)

export const IconMail = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="imail"/>
    <rect x="2" y="6" width="24" height="17" rx="3"
      stroke="url(#imail)" strokeWidth="1.5"
      fill="url(#imail)" fillOpacity="0.08"
      filter="url(#imailglow)"/>
    <path d="M2 9l12 8 12-8"
      stroke="url(#imail)" strokeWidth="1.5"
      strokeLinejoin="round"/>
  </svg>
)

export const IconFile = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="ifile"/>
    <path d="M17 2H7a2 2 0 00-2 2v20a2 2 0 002 2h14a2 2 0 002-2V9l-6-7z"
      stroke="url(#ifile)" strokeWidth="1.5"
      fill="url(#ifile)" fillOpacity="0.08"
      filter="url(#ifileglow)"/>
    <path d="M17 2v7h7"
      stroke="url(#ifile)" strokeWidth="1.5"/>
    <path d="M9 15h10M9 19h7"
      stroke="url(#ifile)" strokeWidth="1.5"
      strokeLinecap="round" opacity="0.6"/>
  </svg>
)

export const IconImage = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="iimg"/>
    <rect x="2" y="4" width="24" height="20" rx="3"
      stroke="url(#iimg)" strokeWidth="1.5"
      fill="url(#iimg)" fillOpacity="0.08"
      filter="url(#iimgglow)"/>
    <circle cx="9" cy="10" r="2.5"
      fill="url(#iimg)" opacity="0.7"/>
    <path d="M2 19l7-6 5 5 4-3 6 5"
      stroke="url(#iimg)" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      fill="url(#iimg)" fillOpacity="0.15"/>
  </svg>
)

export const IconWhatsApp = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
    <IconDefs id="iwa"/>
    <path d="M14 2C7.373 2 2 7.373 2 14c0 2.09.548 4.05 1.504 5.748L2 26l6.396-1.48A11.93 11.93 0 0014 26c6.627 0 12-5.373 12-12S20.627 2 14 2z"
      stroke="url(#iwa)" strokeWidth="1.5"
      fill="url(#iwa)" fillOpacity="0.08"
      filter="url(#iwaglow)"/>
    <path d="M10 10.5s-.5 1 .5 2.5S13 16 15 17s3 .5 3.5 0l-1.5-2-1.5.5s-2-1-3-3l.5-1.5L10 10.5z"
      stroke="url(#iwa)" strokeWidth="1.2"
      strokeLinecap="round" strokeLinejoin="round"
      fill="url(#iwa)" fillOpacity="0.3"/>
  </svg>
)

/* ═══════════════════════════════════════
   COMPLETE ICON WITH CONTAINER
   Ready to use components
═══════════════════════════════════════ */

type IconSize = 'sm' | 'md' | 'lg'

const withContainer = (Icon: React.FC, defaultSize: IconSize = 'md') => {
  return function WrappedIcon({ className = '', size }: { className?: string; size?: IconSize }) {
    return (
      <IconContainer size={size || defaultSize} className={className}>
        <Icon />
      </IconContainer>
    )
  }
}

// Export ready-to-use icon components with containers
export const Feature4K = withContainer(Icon4K)
export const FeatureLiveTV = withContainer(IconLiveTV)
export const FeatureStreaming = withContainer(IconStreaming)
export const FeatureNoBuffer = withContainer(IconNoBuffer)
export const FeatureGlobe = withContainer(IconGlobe)
export const FeatureNoLock = withContainer(IconNoLock)
export const FeatureSupport = withContainer(IconSupport)
export const FeatureDevices = withContainer(IconDevices)
export const FeatureLightning = withContainer(IconLightning)
export const FeatureSports = withContainer(IconSports)
export const FeatureMovies = withContainer(IconMovies)
export const FeatureDiamond = withContainer(IconDiamond)
export const FeatureShield = withContainer(IconShield)
export const FeatureRocket = withContainer(IconRocket)
export const FeatureStar = withContainer(IconStar)
export const FeatureChart = withContainer(IconChart)
export const FeatureUsers = withContainer(IconUsers)
export const FeatureSettings = withContainer(IconSettings)
export const FeatureMoney = withContainer(IconMoney)
export const FeaturePlay = withContainer(IconPlay)
export const FeatureSearch = withContainer(IconSearch)
export const FeatureMail = withContainer(IconMail)
export const FeatureFile = withContainer(IconFile)
export const FeatureImage = withContainer(IconImage)
export const FeatureWhatsApp = withContainer(IconWhatsApp)
