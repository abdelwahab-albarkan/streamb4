const ADMIN_PREFIX = '/api/admin/media/'
const PUBLIC_PREFIX = '/api/media/'
const BASE = 'https://streamb4.com'

/**
 * Converts an admin media URL to the public-facing media URL.
 * Handles both relative (/api/admin/media/id) and absolute (https://streamb4.com/api/admin/media/id) forms.
 * Non-admin URLs are returned unchanged.
 */
export function toPublicMediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith(BASE + ADMIN_PREFIX)) {
    return BASE + PUBLIC_PREFIX + url.slice((BASE + ADMIN_PREFIX).length)
  }
  if (url.startsWith(ADMIN_PREFIX)) {
    return PUBLIC_PREFIX + url.slice(ADMIN_PREFIX.length)
  }
  return url
}

/**
 * Same as toPublicMediaUrl but always returns an absolute URL.
 * Relative paths are prefixed with the production base URL.
 */
export function toPublicMediaUrlAbsolute(
  url: string | null | undefined,
  fallback = `${BASE}/og-image.jpg`
): string {
  const result = toPublicMediaUrl(url)
  if (!result) return fallback
  if (result.startsWith('/')) return BASE + result
  return result
}

/**
 * Replaces all /api/admin/media/ occurrences in markdown content with the public path.
 * Run server-side before passing content to the markdown renderer.
 */
export function transformMediaUrlsInContent(content: string): string {
  if (!content) return content
  return content.replaceAll(ADMIN_PREFIX, PUBLIC_PREFIX)
}
