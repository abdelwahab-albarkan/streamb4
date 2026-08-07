'use client'
import { useState } from 'react'

export default function FAQClient({
  question,
  answer
}: {
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      onClick={() => setOpen(!open)}
      className="rounded-[16px] overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        background: open
          ? 'rgba(255,140,0,0.04)'
          : 'rgba(17,17,17,0.8)',
        border: open
          ? '1px solid rgba(255,140,0,0.2)'
          : '1px solid rgba(255,255,255,0.06)',
      }}>

      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <p className="text-white font-semibold text-sm leading-snug">
          {question}
        </p>
        <div
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-250"
          style={{
            background: open
              ? 'linear-gradient(135deg,#FF8C00,#FFB300)'
              : 'rgba(255,255,255,0.06)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"
            stroke={open ? '#000' : '#fff'} strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease-in-out' }}>
        <div className="overflow-hidden">
          <div className="px-6 pb-5 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-[#A1A1AA] text-sm leading-relaxed pt-4">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
