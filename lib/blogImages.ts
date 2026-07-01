// Pure utility — no 'use client' — safe to import in Server Components

export const CATEGORY_IMAGES: Record<string, string> = {
  'Streaming Guides': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1280&q=80',
  'Device Setup':     'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=1280&q=80',
  'Sports':           'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280&q=80',
  'Movies & Series':  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80',
  'Comparisons':      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1280&q=80',
  'default':          'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1280&q=80',
}

export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES['default']
}

export function getPostImage(post: { featuredImage?: string; category?: string }): string {
  const img = post.featuredImage
  if (img && img !== '' && !img.startsWith('/og-image')) return img
  return getCategoryImage(post.category ?? '')
}
