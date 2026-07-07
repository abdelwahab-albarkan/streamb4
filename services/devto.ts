/**
 * DEV.to Publishing Service
 * Uses the DEV.to Forem API v1.
 * Docs: https://developers.forem.com/api/v1
 */

export interface DevToArticleInput {
  title: string
  body_markdown: string
  published: boolean
  tags?: string[]
  canonical_url?: string
  description?: string
  series?: string
  main_image?: string
}

export interface DevToArticleResult {
  id: number
  url: string
  slug: string
  title: string
  published: boolean
  published_at: string | null
}

export interface DevToPublishResult {
  success: boolean
  id?: number
  url?: string
  publishedAt?: string
  error?: string
}

const DEV_TO_BASE = 'https://dev.to/api'

function headers(apiKey: string) {
  return {
    'Content-Type': 'application/json',
    'api-key': apiKey,
  }
}

/**
 * Find an existing DEV.to article by canonical URL.
 * Searches the authenticated user's articles for a matching canonical_url.
 */
export async function findDevToArticleByCanonicalUrl(
  apiKey: string,
  canonicalUrl: string,
): Promise<number | null> {
  try {
    // Fetch up to 1000 articles in pages of 100
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(`${DEV_TO_BASE}/articles/me/all?per_page=100&page=${page}`, {
        headers: { 'api-key': apiKey },
      })
      if (!res.ok) break
      const articles: Array<{ id: number; canonical_url?: string }> = await res.json()
      if (!articles.length) break
      const match = articles.find(a => a.canonical_url === canonicalUrl)
      if (match) return match.id
    }
  } catch { /* ignore */ }
  return null
}

/**
 * Create a new article on DEV.to.
 * If 422 "Canonical url has already been taken", auto-finds the existing article and updates it.
 */
export async function publishToDevTo(
  apiKey: string,
  article: DevToArticleInput,
): Promise<DevToPublishResult & { recovered?: boolean }> {
  try {
    const res = await fetch(`${DEV_TO_BASE}/articles`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({ article }),
    })

    if (res.status === 422 && article.canonical_url) {
      // Canonical URL already taken — find the existing article and update it
      const body = await res.text()
      if (body.toLowerCase().includes('canonical')) {
        const existingId = await findDevToArticleByCanonicalUrl(apiKey, article.canonical_url)
        if (existingId) {
          const updateResult = await updateOnDevTo(apiKey, existingId, article)
          return { ...updateResult, recovered: true }
        }
        // If we couldn't find the existing article, retry without canonical URL
        const { canonical_url: _removed, ...articleWithoutCanonical } = article
        const retryRes = await fetch(`${DEV_TO_BASE}/articles`, {
          method: 'POST',
          headers: headers(apiKey),
          body: JSON.stringify({ article: articleWithoutCanonical }),
        })
        if (retryRes.ok) {
          const data: DevToArticleResult = await retryRes.json()
          return {
            success: true,
            id: data.id,
            url: data.url,
            publishedAt: data.published_at ?? new Date().toISOString(),
            recovered: true,
          }
        }
        const retryErr = await retryRes.text()
        return { success: false, error: `DEV.to publish failed (${retryRes.status}): ${retryErr}` }
      }
      return { success: false, error: `DEV.to API error 422: ${body}` }
    }

    if (!res.ok) {
      const err = await res.text()
      return { success: false, error: `DEV.to publish failed (${res.status}): ${err}` }
    }

    const data: DevToArticleResult = await res.json()
    return {
      success: true,
      id: data.id,
      url: data.url,
      publishedAt: data.published_at ?? new Date().toISOString(),
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Update an existing article on DEV.to.
 */
export async function updateOnDevTo(
  apiKey: string,
  articleId: number,
  article: Partial<DevToArticleInput>,
): Promise<DevToPublishResult> {
  try {
    const res = await fetch(`${DEV_TO_BASE}/articles/${articleId}`, {
      method: 'PUT',
      headers: headers(apiKey),
      body: JSON.stringify({ article }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { success: false, error: `DEV.to update failed (${res.status}): ${err}` }
    }

    const data: DevToArticleResult = await res.json()
    return {
      success: true,
      id: data.id,
      url: data.url,
      publishedAt: data.published_at ?? new Date().toISOString(),
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Verify a DEV.to API key by fetching the authenticated user.
 */
export async function verifyDevToKey(apiKey: string): Promise<{ valid: boolean; username?: string }> {
  try {
    const res = await fetch(`${DEV_TO_BASE}/users/me`, {
      headers: { 'api-key': apiKey },
    })
    if (!res.ok) return { valid: false }
    const data = await res.json()
    return { valid: true, username: data.username }
  } catch {
    return { valid: false }
  }
}

/**
 * Build the DEV.to article payload from a STREAMB4 post.
 */
export function buildDevToPayload(opts: {
  title: string
  content: string
  tags: string[]
  slug: string
  canonicalUrlEnabled: boolean
  featuredImage?: string
  excerpt?: string
  published: boolean
}): DevToArticleInput {
  const tags = opts.tags
    .slice(0, 4)
    .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)

  return {
    title: opts.title,
    body_markdown: opts.content,
    published: opts.published,
    tags,
    ...(opts.canonicalUrlEnabled && {
      canonical_url: `https://streamb4.com/blog/${opts.slug}`,
    }),
    ...(opts.excerpt && { description: opts.excerpt }),
    ...(opts.featuredImage && { main_image: opts.featuredImage }),
  }
}
