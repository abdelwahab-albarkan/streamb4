'use client'

import { CATEGORY_IMAGES } from '@/lib/blogImages'

interface PostImageProps {
  src: string
  alt: string
  className?: string
}

export function PostImage({ src, alt, className }: PostImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = CATEGORY_IMAGES['default']
      }}
    />
  )
}
