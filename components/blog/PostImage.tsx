'use client'

import Image from 'next/image'
import { CATEGORY_IMAGES } from '@/lib/blogImages'

// Whitelisted hostnames that Next.js image optimization can handle (remotePatterns in next.config.ts)
const OPTIMIZED_HOSTS = new Set([
  'images.unsplash.com',
  'image.pollinations.ai',
  'image.tmdb.org',
  'streamb4.com',
  'res.cloudinary.com',
  'img.youtube.com',
])

function isUnoptimized(src: string): boolean {
  try {
    const { hostname } = new URL(src)
    return !OPTIMIZED_HOSTS.has(hostname)
  } catch {
    return false // relative path — always optimized
  }
}

interface PostImageProps {
  src: string
  alt: string
  className?: string
}

export function PostImage({ src, alt, className }: PostImageProps) {
  return (
    <div className="relative w-full aspect-video">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        className={`object-cover ${className ?? ''}`}
        unoptimized={isUnoptimized(src)}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = CATEGORY_IMAGES['default']
        }}
      />
    </div>
  )
}
