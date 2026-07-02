'use client'

import { useState, useEffect, useCallback } from 'react'
import type { TocItem } from '@/lib/tocUtils'

interface Props {
  toc: TocItem[]
}

export function TableOfContents({ toc }: Props) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (toc.length === 0) return

    const elements = toc
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost heading that is currently intersecting
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id)
        }
      },
      {
        // Trigger when heading enters the upper portion of the viewport
        rootMargin: '-88px 0px -68% 0px',
        threshold: 0,
      }
    )

    elements.forEach((el) => observer.observe(el))

    // Set initial active to the first heading
    if (!activeId && elements.length > 0) {
      setActiveId(elements[0].id)
    }

    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toc])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  if (toc.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {toc.map(({ id, text, level }) => {
          const isActive = activeId === id
          const isH3 = level === 3

          return (
            <li key={id} className={isH3 ? 'pl-4' : ''}>
              <button
                onClick={() => scrollTo(id)}
                title={text}
                className={[
                  'group relative w-full text-left py-1.5 px-3 rounded-lg',
                  'transition-all duration-200 text-[11px] leading-snug',
                  isH3 ? 'font-medium' : 'font-semibold tracking-wide',
                  isActive
                    ? 'text-orange-400 bg-orange-500/[0.08]'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]',
                ].join(' ')}
              >
                {/* Orange active indicator */}
                <span
                  aria-hidden
                  className={[
                    'absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full',
                    'transition-all duration-200',
                    isActive ? 'h-4 bg-orange-500 opacity-100' : 'h-0 opacity-0',
                  ].join(' ')}
                />
                <span className={isActive ? 'pl-1.5' : ''}>
                  {text}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TableOfContents
