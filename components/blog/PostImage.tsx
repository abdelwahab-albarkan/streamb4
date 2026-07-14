'use client'

import Image from 'next/image'
import { CATEGORY_IMAGES } from '@/lib/blogImages'

interface PostImageProps {
  src: string
  alt: string
  className?: string
}

export function PostImage({ src, alt, className }: PostImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      className={className}
      unoptimized={src.startsWith('http')}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = CATEGORY_IMAGES['default']
      }}
    />
  )
}
