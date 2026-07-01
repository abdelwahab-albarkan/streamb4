'use client'

import React, { useState, useEffect } from 'react'

interface TOCItem {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [headings, setHeadings] = useState<TOCItem[]>([])

  useEffect(() => {
    if (!content) return
    const matched = (content.match(/^#{2,4} .+/gm) || []).map((h) => {
      const level = h.match(/^#+/)?.[0].length || 2
      const text = h.replace(/^#+\s/, '')
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      return { level, text, id }
    })
    setHeadings(matched)
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      let currentActive = ''
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the element is near the top of the viewport
          if (rect.top <= 120) {
            currentActive = heading.id
          }
        }
      }
      setActiveId(currentActive || headings[0].id)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // run once initially
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) {
    return <p className="text-gray-600 text-xs">No sections found</p>
  }

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 90
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveId(id)
    }
  }

  return (
    <nav className="space-y-1">
      <ul className="space-y-2">
        {headings.map((h, i) => {
          const isActive = activeId === h.id
          return (
            <li key={i} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleScrollTo(e, h.id)}
                className={`text-xs transition-colors duration-150 leading-relaxed block py-0.5 truncate ${
                  isActive
                    ? 'text-orange-500 font-black'
                    : 'text-gray-500 hover:text-white font-medium'
                }`}
              >
                {h.level === 2 ? '▸ ' : '◦ '}
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export default TableOfContents
