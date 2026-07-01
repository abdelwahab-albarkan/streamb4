'use client'

import React from 'react'

interface ContentBlockProps {
  type: 'tip' | 'warning' | 'info' | 'cta'
  title?: string
  children: React.ReactNode
}

export function ContentBlock({ type, title, children }: ContentBlockProps) {
  const getStyles = () => {
    switch (type) {
      case 'tip':
        return {
          bg: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          badgeColor: '#22c55e',
          badgeBg: 'rgba(34, 197, 94, 0.1)',
          label: '💡 TIP',
        }
      case 'warning':
        return {
          bg: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          badgeColor: '#ef4444',
          badgeBg: 'rgba(239, 68, 68, 0.1)',
          label: '⚠️ WARNING',
        }
      case 'cta':
        return {
          bg: 'linear-gradient(145deg, rgba(255, 122, 0, 0.08), rgba(5, 5, 5, 0.98))',
          border: '1px solid rgba(255, 122, 0, 0.2)',
          badgeColor: '#ff7a00',
          badgeBg: 'rgba(255, 122, 0, 0.1)',
          label: '⚡ ACTION REQUIRED',
        }
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          badgeColor: '#3b82f6',
          badgeBg: 'rgba(59, 130, 246, 0.1)',
          label: 'ℹ️ INFO',
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className="my-8 p-6 rounded-2xl relative overflow-hidden"
      style={{
        background: styles.bg,
        border: styles.border,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
          style={{
            background: styles.badgeBg,
            color: styles.badgeColor,
            border: `1px solid ${styles.badgeColor}25`,
          }}
        >
          {styles.label}
        </span>
        {title && <span className="text-white font-bold text-xs uppercase tracking-wider">{title}</span>}
      </div>
      <div className="text-gray-400 text-sm leading-relaxed prose-p:my-0">{children}</div>
    </div>
  )
}
export default ContentBlock
