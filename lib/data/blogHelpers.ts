import { POSTS, StaticPost } from './posts'

export type { StaticPost }

function sortPosts(posts: StaticPost[]): StaticPost[] {
  return [...posts].sort((a, b) => {
    if (b.isFeatured !== a.isFeatured) return b.isFeatured ? 1 : -1
    if (b.featured !== a.featured) return b.featured ? 1 : -1
    const bDate = new Date(b.publishedAt || b.createdAt).getTime()
    const aDate = new Date(a.publishedAt || a.createdAt).getTime()
    return bDate - aDate
  })
}

export function getAllPosts(): StaticPost[] {
  return sortPosts(POSTS.filter(p => p.status === 'published'))
}

export function getPostBySlug(slug: string): StaticPost | undefined {
  return POSTS.find(p => p.slug === slug && p.status === 'published')
}

export function getRelatedPosts(category: string, currentId: string, limit = 3): StaticPost[] {
  return sortPosts(
    POSTS.filter(p => p.category === category && p.id !== currentId && p.status === 'published')
  ).slice(0, limit)
}

export function getAllSlugs(): { slug: string }[] {
  return POSTS.filter(p => p.status === 'published').map(p => ({ slug: p.slug }))
}

export function searchPosts(query: string): StaticPost[] {
  const q = query.toLowerCase()
  return sortPosts(
    POSTS.filter(p => p.status === 'published').map(p => {
      let score = 0
      if (p.title.toLowerCase().includes(q)) score += 10
      if (p.tags?.some(t => t.toLowerCase().includes(q))) score += 8
      if (p.category?.toLowerCase().includes(q)) score += 6
      if (p.excerpt?.toLowerCase().includes(q)) score += 4
      if (p.content?.toLowerCase().includes(q)) score += 2
      return { ...p, _score: score }
    })
    .filter(p => (p as StaticPost & { _score: number })._score > 0)
    .sort((a, b) => (b as StaticPost & { _score: number })._score - (a as StaticPost & { _score: number })._score)
  ).slice(0, 10)
}
