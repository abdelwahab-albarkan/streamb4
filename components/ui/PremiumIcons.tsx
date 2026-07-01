'use client'

import React from 'react'

export const IconRocket = () => (
  <div className="relative w-12 h-12 shrink-0">
    {/* Glass container */}
    <div className="absolute inset-0 rounded-xl
      bg-gradient-to-br from-white/10 to-white/5
      border border-orange-500/20
      backdrop-blur-sm
      shadow-[0_0_20px_rgba(255,122,0,0.15)]" />
    <svg viewBox="0 0 24 24" className="relative z-10 w-full h-full p-2.5"
      fill="none">
      <defs>
        <linearGradient id="rocketGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a00"/>
          <stop offset="100%" stopColor="#ffb300"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path filter="url(#glow)"
        stroke="url(#rocketGrad)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        d="M12 2C12 2 7 6 7 12c0 2 1 3 1 3l4 4s1 1 3 1c2 0 3-1 3-1V8c0 0-2-6-6-6z"/>
      <circle cx="12" cy="10" r="2" fill="url(#rocketGrad)" 
        filter="url(#glow)" opacity="0.9"/>
      <path stroke="url(#rocketGrad)" strokeWidth="1.5"
        strokeLinecap="round"
        d="M9 15l-2 4M15 15l2 4"/>
    </svg>
  </div>
)

export const IconShield = () => (
  <div className="relative w-12 h-12 shrink-0">
    <div className="absolute inset-0 rounded-xl
      bg-gradient-to-br from-white/10 to-white/5
      border border-orange-500/20
      backdrop-blur-sm
      shadow-[0_0_20px_rgba(255,122,0,0.15)]" />
    <svg viewBox="0 0 24 24" className="relative z-10 w-full h-full p-2.5"
      fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a00"/>
          <stop offset="100%" stopColor="#ffb300"/>
        </linearGradient>
        <filter id="glowShield">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Shield outer */}
      <path filter="url(#glowShield)"
        stroke="url(#shieldGrad)" strokeWidth="1.5"
        strokeLinejoin="round"
        d="M12 2L4 6v6c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V6L12 2z"/>
      {/* Shield inner glow */}
      <path fill="url(#shieldGrad)" opacity="0.15"
        d="M12 4L6 7.5v4.5c0 3.5 2.5 6.5 6 8 3.5-1.5 6-4.5 6-8V7.5L12 4z"/>
      {/* Checkmark */}
      <path filter="url(#glowShield)"
        stroke="url(#shieldGrad)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4"/>
    </svg>
  </div>
)

export const IconTV = () => (
  <div className="relative w-12 h-12 shrink-0">
    <div className="absolute inset-0 rounded-xl
      bg-gradient-to-br from-white/10 to-white/5
      border border-orange-500/20
      backdrop-blur-sm
      shadow-[0_0_20px_rgba(255,122,0,0.15)]" />
    <svg viewBox="0 0 24 24" className="relative z-10 w-full h-full p-2.5"
      fill="none">
      <defs>
        <linearGradient id="tvGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a00"/>
          <stop offset="100%" stopColor="#ffb300"/>
        </linearGradient>
        <filter id="glowTV">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Screen */}
      <rect filter="url(#glowTV)"
        x="2" y="3" width="20" height="14" rx="2"
        stroke="url(#tvGrad)" strokeWidth="1.5"/>
      {/* Screen inner glow */}
      <rect x="4" y="5" width="16" height="10" rx="1"
        fill="url(#tvGrad)" opacity="0.1"/>
      {/* Play button */}
      <path fill="url(#tvGrad)" opacity="0.8"
        filter="url(#glowTV)"
        d="M10 8l5 3-5 3V8z"/>
      {/* Stand */}
      <path stroke="url(#tvGrad)" strokeWidth="1.5"
        strokeLinecap="round"
        d="M8 21h8M12 17v4"/>
    </svg>
  </div>
)

export const IconHeadphones = () => (
  <div className="relative w-12 h-12 shrink-0">
    <div className="absolute inset-0 rounded-xl
      bg-gradient-to-br from-white/10 to-white/5
      border border-orange-500/20
      backdrop-blur-sm
      shadow-[0_0_20px_rgba(255,122,0,0.15)]" />
    <svg viewBox="0 0 24 24" className="relative z-10 w-full h-full p-2.5"
      fill="none">
      <defs>
        <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a00"/>
          <stop offset="100%" stopColor="#ffb300"/>
        </linearGradient>
        <filter id="glowHead">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path filter="url(#glowHead)"
        stroke="url(#headGrad)" strokeWidth="1.5"
        strokeLinecap="round"
        d="M3 14v-2a9 9 0 0118 0v2"/>
      <rect filter="url(#glowHead)"
        x="2" y="14" width="4" height="6" rx="2"
        stroke="url(#headGrad)" strokeWidth="1.5"
        fill="url(#headGrad)" fillOpacity="0.2"/>
      <rect filter="url(#glowHead)"
        x="18" y="14" width="4" height="6" rx="2"
        stroke="url(#headGrad)" strokeWidth="1.5"
        fill="url(#headGrad)" fillOpacity="0.2"/>
    </svg>
  </div>
)

export const IconNoContract = () => (
  <div className="relative w-12 h-12 shrink-0">
    <div className="absolute inset-0 rounded-xl
      bg-gradient-to-br from-white/10 to-white/5
      border border-orange-500/20
      backdrop-blur-sm
      shadow-[0_0_20px_rgba(255,122,0,0.15)]" />
    <svg viewBox="0 0 24 24" className="relative z-10 w-full h-full p-2.5"
      fill="none">
      <defs>
        <linearGradient id="contractGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a00"/>
          <stop offset="100%" stopColor="#ffb300"/>
        </linearGradient>
        <filter id="glowContract">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path filter="url(#glowContract)"
        stroke="url(#contractGrad)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
      <path stroke="url(#contractGrad)" strokeWidth="1.5"
        strokeLinecap="round" d="M14 2v6h6"/>
      <path filter="url(#glowContract)"
        stroke="url(#contractGrad)" strokeWidth="1.5"
        strokeLinecap="round"
        d="M9 15l6-6M15 15l-6-6"/>
    </svg>
  </div>
)

export const IconDiamond = () => (
  <div className="relative w-12 h-12 shrink-0">
    <div className="absolute inset-0 rounded-xl
      bg-gradient-to-br from-white/10 to-white/5
      border border-orange-500/20
      backdrop-blur-sm
      shadow-[0_0_20px_rgba(255,122,0,0.15)]" />
    <svg viewBox="0 0 24 24" className="relative z-10 w-full h-full p-2.5"
      fill="none">
      <defs>
        <linearGradient id="diamondGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a00"/>
          <stop offset="100%" stopColor="#ffb300"/>
        </linearGradient>
        <filter id="glowDiamond">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Diamond shape */}
      <path filter="url(#glowDiamond)"
        stroke="url(#diamondGrad)" strokeWidth="1.5"
        strokeLinejoin="round"
        d="M12 2l4 6H8l4-6zM8 8l4 14L4 8h4zM16 8h4l-8 14 4-14z"/>
      {/* Inner shine */}
      <path fill="url(#diamondGrad)" opacity="0.2"
        d="M12 4l3 4H9l3-4z"/>
    </svg>
  </div>
)
