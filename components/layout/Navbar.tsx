'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Features', href: '/features' },
  { label: 'Install', href: '/install' },
  { label: 'Blog', href: '/blog' },
]

const MORE_ITEMS = [
  {
    label: 'Devices',
    href: '/devices',
    desc: 'All compatible devices',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="mg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8C00"/>
            <stop offset="100%" stopColor="#FFB300"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="15" height="11" rx="2"
          stroke="url(#mg1)" strokeWidth="1.5"
          fill="url(#mg1)" fillOpacity="0.1"/>
        <rect x="19" y="8" width="3" height="8" rx="1"
          stroke="url(#mg1)" strokeWidth="1.5"/>
        <path d="M7 15v2M5 17h6"
          stroke="url(#mg1)" strokeWidth="1.5"
          strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label: 'Reseller',
    href: '/reseller',
    desc: 'Start your IPTV business',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="mg2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8C00"/>
            <stop offset="100%" stopColor="#FFB300"/>
          </linearGradient>
        </defs>
        <path d="M12 2L2 7l10 5 10-5-10-5z"
          stroke="url(#mg2)" strokeWidth="1.5"
          strokeLinejoin="round"
          fill="url(#mg2)" fillOpacity="0.1"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="url(#mg2)" strokeWidth="1.5"
          strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label: 'Restream',
    href: '/restream',
    desc: 'Broadcast to any platform',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="mg3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8C00"/>
            <stop offset="100%" stopColor="#FFB300"/>
          </linearGradient>
        </defs>
        <path d="M4 12s0-8 8-8 8 8 8 8-8 8-8 8-8-8z" 
          stroke="url(#mg3)" strokeWidth="1.5"
          fill="url(#mg3)" fillOpacity="0.1"/>
        <circle cx="12" cy="12" r="3"
          fill="url(#mg3)"/>
        <path d="M2 12h2M20 12h2M12 2v2M12 20v2"
          stroke="url(#mg3)" strokeWidth="1.5"
          strokeLinecap="round" opacity="0.5"/>
      </svg>
    )
  },
  {
    label: 'FAQ',
    href: '/faq',
    desc: 'Common questions answered',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="mg4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8C00"/>
            <stop offset="100%" stopColor="#FFB300"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="9"
          stroke="url(#mg4)" strokeWidth="1.5"
          fill="url(#mg4)" fillOpacity="0.08"/>
        <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4"
          stroke="url(#mg4)" strokeWidth="1.5"
          strokeLinecap="round"/>
        <circle cx="12" cy="17" r="1"
          fill="url(#mg4)"/>
      </svg>
    )
  },
  {
    label: 'Contact',
    href: '/contact',
    desc: 'Get in touch with us',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="mg5" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8C00"/>
            <stop offset="100%" stopColor="#FFB300"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="3"
          stroke="url(#mg5)" strokeWidth="1.5"
          fill="url(#mg5)" fillOpacity="0.08"/>
        <path d="M2 8l10 7 10-7"
          stroke="url(#mg5)" strokeWidth="1.5"
          strokeLinejoin="round"/>
      </svg>
    )
  },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const pathname = usePathname()
  const moreRef = useRef<HTMLDivElement>(null)

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
  }, [pathname])

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => document.body.classList.remove('menu-open')
  }, [mobileOpen])

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])


  return (
    <>
      {/* ═══ NAVBAR ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: 'clamp(60px, 8vw, 80px)',
          background: scrolled
            ? 'rgba(5,5,5,0.97)'
            : 'rgba(5,5,5,0.65)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,140,0,0.08)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 4px 30px rgba(0,0,0,0.4)'
            : 'none',
        }}>

        <div
          className="h-full mx-auto flex items-center justify-between w-full"
          style={{
            maxWidth: '1400px',
            paddingLeft: 'clamp(1rem, 4vw, 2.5rem)',
            paddingRight: 'clamp(1rem, 4vw, 2.5rem)',
          }}>

          {/* ═══ LOGO ═══ */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <motion.div
              whileHover={{
                scale: 1.05,
                filter: 'drop-shadow(0 0 12px rgba(255,140,0,0.5))'
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3">

              {/* Logo icon */}
              <div style={{ width: '38px', height: '38px' }}>
                <svg viewBox="0 0 44 44" fill="none"
                  className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FF8C00"/>
                      <stop offset="100%" stopColor="#FFB300"/>
                    </linearGradient>
                  </defs>
                  <circle cx="22" cy="22" r="20"
                    fill="none"
                    stroke="url(#logoGrad)"
                    strokeWidth="1.5"/>
                  <circle cx="22" cy="22" r="15"
                    fill="rgba(255,140,0,0.06)"/>
                  <polygon
                    points="17,14 17,30 33,22"
                    fill="url(#logoGrad)"/>
                </svg>
              </div>

              {/* Wordmark */}
              <span
                className="font-black text-[22px] tracking-tight leading-none hidden sm:block"
                style={{ letterSpacing: '-0.03em' }}>
                <span className="text-white">STREAM</span>
                <span style={{
                  background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>B4</span>
              </span>
            </motion.div>
          </Link>

          {/* ═══ DESKTOP NAV ═══ */}
          <div className="hidden lg:flex items-center"
            style={{ gap: '4px', marginLeft: '40px' }}>

            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link key={link.href} href={link.href}>
                  <div className="relative px-4 py-2 group cursor-pointer">
                    <span
                      className="text-sm font-semibold transition-colors duration-200 relative z-10"
                      style={{
                        color: isActive ? '#FF8C00' : '#A1A1AA',
                        letterSpacing: '0.01em',
                        fontSize: '15px',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) (e.target as HTMLElement).style.color = '#fff'
                      }}
                      onMouseLeave={e => {
                        if (!isActive) (e.target as HTMLElement).style.color = '#A1A1AA'
                      }}>
                      {link.label}
                    </span>
                    {/* Animated underline */}
                    <motion.div
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                      style={{
                        background: 'linear-gradient(90deg,#FF8C00,#FFB300)',
                        transformOrigin: 'left',
                        scaleX: isActive ? 1 : 0,
                      }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}/>
                  </div>
                </Link>
              )
            })}

            {/* MORE DROPDOWN */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1.5 px-4 py-2 group cursor-pointer"
                style={{ background: 'none', border: 'none' }}>
                <span
                  className="text-sm font-semibold transition-colors duration-200"
                  style={{
                    color: moreOpen ? '#FF8C00' : '#A1A1AA',
                    letterSpacing: '0.01em',
                    fontSize: '15px',
                  }}>
                  More
                </span>
                <motion.svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  animate={{ rotate: moreOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: moreOpen ? '#FF8C00' : '#A1A1AA' }}>
                  <path d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                </motion.svg>
              </button>

              {/* MEGA DROPDOWN */}
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3
                      w-[280px] rounded-[20px] overflow-hidden py-2"
                    style={{
                      background: 'rgba(15,15,15,0.97)',
                      border: '1px solid rgba(255,140,0,0.15)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
                    }}>

                    {/* Top glow line */}
                    <div className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: 'linear-gradient(90deg,transparent,rgba(255,140,0,0.4),transparent)'
                      }}/>

                    {/* Dropdown header */}
                    <div className="px-4 py-3 border-b"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-[10px] font-black text-orange-500
                        uppercase tracking-[0.2em]">
                        Explore More
                      </p>
                    </div>

                    {/* Items */}
                    <div className="py-2">
                      {MORE_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href}
                          onClick={() => setMoreOpen(false)}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-3.5 px-4 py-3
                              mx-2 rounded-[12px] cursor-pointer
                              transition-all duration-150 group"
                            style={{ background: 'transparent' }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(255,140,0,0.06)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent'
                            }}>

                            {/* Icon container */}
                            <div className="w-9 h-9 rounded-[10px] flex-shrink-0
                              flex items-center justify-center"
                              style={{
                                background: 'rgba(255,140,0,0.08)',
                                border: '1px solid rgba(255,140,0,0.12)',
                              }}>
                              {item.icon}
                            </div>

                            <div>
                              <p className="text-white text-sm font-semibold
                                group-hover:text-orange-100 transition-colors">
                                {item.label}
                              </p>
                              <p className="text-[#A1A1AA] text-xs mt-0.5">
                                {item.desc}
                              </p>
                            </div>

                            {/* Arrow */}
                            <svg className="w-3.5 h-3.5 text-gray-700 ml-auto
                              group-hover:text-orange-500 transition-colors"
                              viewBox="0 0 24 24" fill="none">
                              <path d="M9 18l6-6-6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"/>
                            </svg>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ═══ SPACER ═══ */}
          <div className="flex-1"/>

          {/* ═══ CTA BUTTONS — DESKTOP ═══ */}
          <div className="hidden lg:flex items-center gap-3">

            {/* VIEW PRICING */}
            <Link href="/pricing">
              <motion.div
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="relative px-5 py-2.5 rounded-[12px]
                  font-black text-black text-sm uppercase
                  tracking-wide overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                  boxShadow: '0 0 20px rgba(255,140,0,0.25)',
                  letterSpacing: '0.04em',
                }}>
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="black">
                    <path d="M13 2L4.09 12.26a1 1 0 00.91 1.64l5.5-.78-1 8.62L20 11.74a1 1 0 00-.91-1.64l-5.5.78L13 2z"/>
                  </svg>
                  VIEW PRICING
                </span>
              </motion.div>
            </Link>

            {/* CLIENT AREA */}
            <Link href="/contact">
              <motion.div
                whileHover={{
                  scale: 1.02,
                  background: 'rgba(255,140,0,0.12)',
                  borderColor: 'rgba(255,140,0,0.5)',
                }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-[12px] font-bold
                  text-sm uppercase tracking-wide transition-all duration-200 cursor-pointer"
                style={{
                  background: 'rgba(255,140,0,0.06)',
                  border: '1px solid rgba(255,140,0,0.25)',
                  color: '#FF8C00',
                  letterSpacing: '0.04em',
                }}>
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  CLIENT AREA
                </span>
              </motion.div>
            </Link>
          </div>

          {/* ═══ MOBILE HAMBURGER ═══ */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col justify-center items-center
              w-10 h-10 rounded-[10px] transition-colors duration-200 cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            aria-label="Toggle menu">
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-[18px] h-[1.5px] rounded-full bg-white mb-[5px]"/>
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-[18px] h-[1.5px] rounded-full bg-white mb-[5px]"/>
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-[18px] h-[1.5px] rounded-full bg-white"/>
          </button>
        </div>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}/>

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 lg:hidden
                flex flex-col overflow-y-auto"
              style={{
                width: 'min(340px,90vw)',
                background: 'rgba(8,8,8,0.99)',
                backdropFilter: 'blur(24px)',
                borderLeft: '1px solid rgba(255,140,0,0.1)',
              }}>

              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="font-black text-lg" style={{ letterSpacing: '-0.02em' }}>
                  <span className="text-white">STREAM</span>
                  <span style={{
                    background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>B4</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                    text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 px-4 py-6">
                <p className="text-[10px] font-black text-orange-500
                  uppercase tracking-[0.2em] px-3 mb-3">
                  Navigation
                </p>
                <div className="space-y-0.5 mb-8">
                  {NAV_LINKS.map((link, i) => {
                    const isActive = pathname === link.href ||
                      (link.href !== '/' && pathname.startsWith(link.href))
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.25 }}>
                        <Link href={link.href}
                          onClick={() => setMobileOpen(false)}>
                          <div className="flex items-center gap-3 px-3 py-3.5
                            rounded-[12px] transition-all duration-150"
                            style={{
                              background: isActive ? 'rgba(255,140,0,0.08)' : 'transparent',
                              color: isActive ? '#FF8C00' : '#A1A1AA',
                            }}
                            onMouseEnter={e => {
                              if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                            }}
                            onMouseLeave={e => {
                              if (!isActive) e.currentTarget.style.background = 'transparent'
                            }}>
                            <span className="font-semibold text-sm">{link.label}</span>
                            {isActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"/>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* More section */}
                <p className="text-[10px] font-black text-orange-500
                  uppercase tracking-[0.2em] px-3 mb-3">
                  More
                </p>
                <div className="space-y-0.5">
                  {MORE_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (NAV_LINKS.length + i) * 0.05 }}>
                      <Link href={item.href}
                        onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-3
                          rounded-[12px] transition-all duration-150"
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,140,0,0.06)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                          }}>
                          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center
                            flex-shrink-0"
                            style={{
                              background: 'rgba(255,140,0,0.08)',
                              border: '1px solid rgba(255,140,0,0.1)',
                            }}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{item.label}</p>
                            <p className="text-[#A1A1AA] text-xs">{item.desc}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile CTAs */}
              <div className="px-4 pb-8 pt-4 space-y-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Link href="/pricing" onClick={() => setMobileOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-[14px] font-black
                      text-black text-sm uppercase tracking-wide
                      flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg,#FF8C00,#FFB300)',
                      boxShadow: '0 0 20px rgba(255,140,0,0.25)',
                    }}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="black">
                      <path d="M13 2L4.09 12.26a1 1 0 00.91 1.64l5.5-.78-1 8.62L20 11.74a1 1 0 00-.91-1.64l-5.5.78L13 2z"/>
                    </svg>
                    VIEW PRICING
                  </motion.div>
                </Link>

                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-[14px] font-bold
                      text-sm uppercase tracking-wide
                      flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: 'rgba(255,140,0,0.06)',
                      border: '1px solid rgba(255,140,0,0.25)',
                      color: '#FF8C00',
                    }}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    CLIENT AREA
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
