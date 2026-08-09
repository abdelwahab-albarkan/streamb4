'use client'
import Link from 'next/link'

interface AuthorCardProps {
  author: string
}

const EXPERTISE_AREAS = [
  'IPTV Setup',
  'Firestick & Android TV',
  'Smart TV Configuration',
  '4K Streaming',
  'Buffering Fixes',
  'VPN & Privacy',
]

const SOCIAL_LINKS = [
  {
    label: 'Follow STREAMB4 on X (Twitter)',
    href: 'https://x.com/streamb4t',
    text: 'X / Twitter',
  },
  {
    label: 'Follow STREAMB4 on Facebook',
    href: 'https://www.facebook.com/profile.php?id=61591545360371',
    text: 'Facebook',
  },
]

export function AuthorCard({ author }: AuthorCardProps) {
  const authorName = author || 'STREAMB4 Editorial Team'
  const initials = authorName[0].toUpperCase()

  return (
    <div
      className="p-6 rounded-[24px] mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden"
      style={{
        background: 'rgba(15,15,15,0.95)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(255,122,0,0.04),transparent_60%)] pointer-events-none" />

      {/* Avatar block */}
      <div
        className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xl text-black shadow-md"
        style={{
          background: 'linear-gradient(135deg, #ff7a00, #ffb300)',
        }}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Details */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <p className="text-white font-black text-lg mb-0.5">{authorName}</p>
        <p className="text-orange-500/80 text-[10px] font-black uppercase tracking-wider mb-2">
          Streaming Technology Expert · STREAMB4
        </p>
        <p className="text-gray-500 text-sm leading-relaxed mb-3">
          IPTV setup technicians and streaming specialists at STREAMB4. Every guide is tested on real hardware — Firestick, Android TV boxes, Samsung, LG, Sony Smart TVs — before publication.{' '}
          <Link href="/editorial-policy" className="text-orange-500/70 hover:text-orange-400 transition-colors">
            See our editorial process →
          </Link>
        </p>

        {/* Expertise tags */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-4">
          {EXPERTISE_AREAS.map((area) => (
            <span
              key={area}
              className="px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {area}
            </span>
          ))}
        </div>

        {/* Social links */}
        <div className="flex justify-center sm:justify-start gap-4">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.text}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:text-orange-400 font-bold transition-colors"
            >
              {s.text}
            </a>
          ))}
          <Link
            href="/about"
            className="text-xs text-gray-600 hover:text-orange-400 font-bold transition-colors"
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  )
}
export default AuthorCard
