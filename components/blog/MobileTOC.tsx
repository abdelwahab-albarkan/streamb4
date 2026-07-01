'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TOCItem {
  level: number
  text: string
  id: string
}

interface MobileTOCProps {
  toc: TOCItem[]
}

export function MobileTOC({ toc }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (toc.length === 0) return null

  const handleScrollTo = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const offset = 90
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 px-5 py-3 rounded-full text-xs font-black text-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        style={{ background: 'linear-gradient(135deg, #ff7a00, #ffb300)' }}
      >
        📋 Contents
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 z-50 bg-[#0c0c0c] border-t border-white/10 rounded-t-[32px] p-6 lg:hidden max-h-[70vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-anton text-lg text-white uppercase tracking-wider">Article Contents</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pb-8">
                {toc.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleScrollTo(item.id)}
                    className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-2 cursor-pointer text-gray-400 hover:text-white text-sm"
                    style={{ paddingLeft: `${(item.level - 2) * 12 + 12}px` }}
                  >
                    <span className="text-orange-500 font-bold">#</span>
                    <span className="font-bold">{item.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
