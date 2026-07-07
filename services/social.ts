/**
 * Social Media Metadata Service
 * Generates OpenGraph, Twitter Card, and social post copy.
 * Pure functions — no DB access.
 */

export interface SocialMeta {
  og: OgMeta
  twitter: TwitterMeta
  socialCopy: SocialCopy
}

export interface OgMeta {
  title: string
  description: string
  url: string
  image: string
  type: string
  siteName: string
}

export interface TwitterMeta {
  card: string
  title: string
  description: string
  image: string
  site: string
}

export interface SocialCopy {
  twitter: string
  linkedin: string
  facebook: string
  whatsapp: string
}

/**
 * Generate complete social metadata for a blog post.
 */
export function generateSocialMeta(opts: {
  title: string
  seoTitle?: string
  ogTitle?: string
  metaDescription?: string
  ogDescription?: string
  socialDescription?: string
  slug: string
  featuredImage?: string
  category?: string
  tags?: string[]
}): SocialMeta {
  const url   = `https://streamb4.com/blog/${opts.slug}`
  const image = opts.featuredImage || `https://streamb4.com/opengraph-image?slug=${opts.slug}`

  const ogTitle  = opts.ogTitle    || opts.seoTitle    || opts.title
  const ogDesc   = opts.ogDescription || opts.metaDescription || opts.socialDescription || ''
  const twTitle  = ogTitle
  const twDesc   = (opts.socialDescription || ogDesc).slice(0, 200)

  const hashTags = (opts.tags ?? [])
    .slice(0, 3)
    .map(t => `#${t.replace(/\s+/g, '')}`)
    .join(' ')

  return {
    og: {
      title:    ogTitle,
      description: ogDesc,
      url,
      image,
      type:     'article',
      siteName: 'STREAMB4',
    },
    twitter: {
      card:        'summary_large_image',
      title:       twTitle,
      description: twDesc,
      image,
      site:        '@streamb4tv',
    },
    socialCopy: {
      twitter:  `${twTitle}\n\n${twDesc.slice(0, 200)}\n\n${hashTags}\n\n🔗 ${url}`,
      linkedin: `${ogTitle}\n\n${ogDesc}\n\nRead more → ${url}`,
      facebook: `📰 ${ogTitle}\n\n${ogDesc}\n\n👉 ${url}`,
      whatsapp: `*${ogTitle}*\n\n${ogDesc.slice(0, 300)}\n\n${url}`,
    },
  }
}

/**
 * Build a social-ready excerpt from raw markdown content.
 * Strips markdown syntax, takes first 300 chars.
 */
export function buildSocialExcerpt(content: string, maxLen = 300): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*?|__?/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[>\-*]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLen)
    .concat('…')
}
