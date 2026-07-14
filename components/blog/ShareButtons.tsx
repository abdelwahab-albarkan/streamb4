'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : ''

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        console.error('Failed to copy link')
      }
      return
    }

    let url = ''
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        })
      } catch {
        console.error('Native share failed')
      }
    } else {
      handleShare('copy')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-gray-600 text-xs font-bold uppercase tracking-wider">Share:</span>
      <button
        onClick={() => handleShare('twitter')}
        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:scale-105 cursor-pointer bg-white/[0.04] border border-white/[0.08] hover:text-orange-400"
      >
        Twitter
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:scale-105 cursor-pointer bg-white/[0.04] border border-white/[0.08] hover:text-orange-400"
      >
        Facebook
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:scale-105 cursor-pointer bg-white/[0.04] border border-white/[0.08] hover:text-orange-400"
      >
        LinkedIn
      </button>
      <button
        onClick={handleNativeShare}
        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:scale-105 cursor-pointer bg-white/[0.04] border border-white/[0.08] hover:text-orange-400"
      >
        {copied ? 'Copied! ✓' : 'Share Link'}
      </button>
    </div>
  )
}
export default ShareButtons
