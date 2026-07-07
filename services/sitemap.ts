/**
 * Sitemap Service
 * Triggers sitemap revalidation after a post is published.
 * The sitemap is generated dynamically by app/sitemap.ts.
 */

export interface SitemapResult {
  success: boolean
  error?: string
}

/**
 * Revalidate the sitemap.xml after a new post is published.
 * Returns immediately — the actual sitemap is generated on next request.
 */
export async function revalidateSitemap(baseUrl = 'https://streamb4.com'): Promise<SitemapResult> {
  try {
    const revalidateSecret = process.env.REVALIDATE_SECRET ?? ''

    if (revalidateSecret) {
      const res = await fetch(
        `${baseUrl}/api/revalidate?secret=${revalidateSecret}&path=/sitemap.xml`,
        { method: 'GET' },
      )
      return { success: res.ok }
    }

    // Dynamic sitemap — always reads live data, no cache to bust
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Ping Google Search Console's sitemap endpoint.
 * This tells Google to re-crawl the sitemap.
 */
export async function pingGoogleSitemap(baseUrl = 'https://streamb4.com'): Promise<SitemapResult> {
  try {
    const sitemapUrl = encodeURIComponent(`${baseUrl}/sitemap.xml`)
    const pingUrl    = `https://www.google.com/ping?sitemap=${sitemapUrl}`
    const res = await fetch(pingUrl, { method: 'GET' })
    return { success: res.ok || res.status === 200 }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}
