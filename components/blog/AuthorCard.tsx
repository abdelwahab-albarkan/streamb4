'use client'

interface AuthorCardProps {
  author: string
}

export function AuthorCard({ author }: AuthorCardProps) {
  const authorName = author || 'STREAMB4 Team'
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
      >
        {initials}
      </div>

      {/* Details info */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <p className="text-white font-black text-lg mb-1">{authorName}</p>
        <p className="text-orange-500/80 text-[10px] font-black uppercase tracking-wider mb-2">
          STREAMING EXPERT & AUTHOR
        </p>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          Professional writer and streaming technician at STREAMB4. Specializing in IPTV setup guides, smart device installations, software tutorials, and streaming performance optimization.
        </p>
        <div className="flex justify-center sm:justify-start gap-4">
          {['Twitter', 'LinkedIn'].map((platform) => (
            <button
              key={platform}
              className="text-xs text-gray-600 hover:text-orange-400 font-bold transition-colors cursor-pointer"
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
export default AuthorCard
