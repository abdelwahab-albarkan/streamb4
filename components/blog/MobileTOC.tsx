'use client'

import { useState, useEffect, useCallback } from 'react'
import type { TocItem } from '@/lib/tocUtils'

interface Props {
  toc: TocItem[]
}

export function MobileTOC({ toc }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (toc.length === 0) return

    const elements = toc
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id)
        }
      },
      {
        rootMargin: '-88px 0px -68% 0px',
        threshold: 0,
      }
    )

    elements.forEach((el) => observer.observe(el))

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (elements.length > 0) setActiveId(elements[0].id)

    return () => observer.disconnect()
  }, [toc])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
    setIsOpen(false)
  }, [])

  if (toc.length === 0) return null

  const activeItem = toc.find((t) => t.id === activeId)

  return (
    <div
      className="lg:hidden mb-8 rounded-[20px] overflow-hidden"
      style={{
        background: 'rgba(12, 12, 12, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Header / toggle */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
        aria-expanded={isOpen}
        aria-controls="mobile-toc-list"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* List icon */}
          <svg
            viewBox="0 0 18 18"
            fill="none"
            className="w-4 h-4 flex-shrink-0 text-orange-500"
            aria-hidden
          >
            <rect x="1" y="3" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="1" y="8" width="11" height="2" rx="1" fill="currentColor" />
            <rect x="1" y="13" width="13" height="2" rx="1" fill="currentColor" />
          </svg>

          <div className="min-w-0">
            <p className="text-white font-black text-xs uppercase tracking-wider leading-none">
              Table of Contents
            </p>
            {/* Show current section when collapsed */}
            {!isOpen && activeItem && (
              <p className="text-orange-400 text-[10px] font-medium mt-1 truncate max-w-[220px] leading-none">
                {activeItem.text}
              </p>
            )}
          </div>
        </div>

        {/* Chevron */}
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className={[
            'w-4 h-4 flex-shrink-0 text-gray-500',
            'transition-transform duration-300',
            isOpen ? 'rotate-180' : 'rotate-0',
          ].join(' ')}
          aria-hidden
        >
          <path d="M3.5 5.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Collapsible list — uses CSS grid trick for smooth height animation */}
      <div
        id="mobile-toc-list"
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.28s ease',
        }}
      >
        <div className="overflow-hidden">
          <div
            className="border-t px-4 pb-4 pt-3 space-y-0.5"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}
          >
            <ul className="space-y-0.5">
              {toc.map(({ id, text, level }) => {
                const isActive = activeId === id
                const isH3 = level === 3

                return (
                  <li key={id} className={isH3 ? 'pl-4' : ''}>
                    <button
                      onClick={() => scrollTo(id)}
                      className={[
                        'relative w-full text-left py-2 px-3 rounded-lg',
                        'transition-colors duration-150 text-sm leading-snug',
                        isH3 ? 'font-medium' : 'font-semibold',
                        isActive
                          ? 'text-orange-400 bg-orange-500/[0.08]'
                          : 'text-gray-500 active:text-gray-200',
                      ].join(' ')}
                    >
                      <span
                        aria-hidden
                        className={[
                          'absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full',
                          'transition-all duration-200',
                          isActive ? 'h-4 bg-orange-500 opacity-100' : 'h-0 opacity-0',
                        ].join(' ')}
                      />
                      <span className={isActive ? 'pl-1.5' : ''}>{text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
