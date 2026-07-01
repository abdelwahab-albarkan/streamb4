'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing! Check your inbox soon.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Subscription failed.')
      }
    } catch {
      setStatus('error')
      setMessage('An unexpected error occurred.')
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-20">
      <div
        className="max-w-4xl mx-auto p-8 sm:p-12 rounded-[28px] text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 122, 0, 0.08), rgba(5, 5, 5, 0.98))',
          border: '1px solid rgba(255, 122, 0, 0.15)',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-500/5 rounded-full filter blur-[60px] pointer-events-none" />

        <div className="relative z-10">
          <div className="text-4xl mb-4">📬</div>
          <h3
            className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-wider mb-3"
            style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}
          >
            NEVER MISS A GUIDE
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Get premium streaming guides, hardware configurations, and optimization tips delivered straight to your inbox weekly.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 rounded-xl text-white text-sm outline-none placeholder-gray-600 focus:border-orange-500/40 transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3.5 rounded-xl font-black text-black text-sm uppercase tracking-wide cursor-pointer whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #ff7a00, #ffb300)',
                boxShadow: '0 0 20px rgba(255,122,0,0.25)',
              }}
            >
              {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE →'}
            </motion.button>
          </form>

          {message && (
            <p
              className={`text-xs mt-4 font-bold ${
                status === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-gray-700 text-xs mt-4 uppercase tracking-widest font-semibold">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
export default NewsletterSection
