'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

interface ArticleFAQProps {
  faqs: FAQItem[]
}

export function ArticleFAQ({ faqs }: ArticleFAQProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="my-12 space-y-4">
      <h3 className="font-anton text-2xl text-white uppercase tracking-wider mb-6"
        style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}>
        Frequently Asked Questions
      </h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index
          return (
            <div
              key={index}
              className="rounded-2xl overflow-hidden border border-white/[0.04]"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-black text-white text-sm uppercase tracking-wide cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-orange-500 text-lg font-black transition-transform duration-200">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-gray-400 text-sm leading-relaxed border-t border-white/[0.03]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ArticleFAQ
