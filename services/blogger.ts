/**
 * Blogger Publishing Service
 * Uses Google Blogger API v3 via OAuth 2.0.
 * Docs: https://developers.google.com/blogger/docs/3.0/reference
 */

const GOOGLE_AUTH_URL   = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL  = 'https://oauth2.googleapis.com/token'
const BLOGGER_API_BASE  = 'https://www.googleapis.com/blogger/v3'

const BLOGGER_SCOPE     = 'https://www.googleapis.com/auth/blogger'

// ─── OAuth helpers ──────────────────────────────────────────────────────────

/**
 * Build the Google OAuth consent-screen URL.
 */
export function getBloggerAuthUrl(opts: {
  clientId: string
  redirectUri: string
  state?: string
}): string {
  const params = new URLSearchParams({
    client_id:     opts.clientId,
    redirect_uri:  opts.redirectUri,
    response_type: 'code',
    scope:         BLOGGER_SCOPE,
    access_type:   'offline',
    prompt:        'consent',
    ...(opts.state && { state: opts.state }),
  })
  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export interface BloggerTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  expiresAt: string
}

/**
 * Exchange an auth code for access + refresh tokens.
 */
export async function exchangeCodeForTokens(opts: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}): Promise<{ success: boolean; tokens?: BloggerTokens; error?: string }> {
  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code:          opts.code,
        client_id:     opts.clientId,
        client_secret: opts.clientSecret,
        redirect_uri:  opts.redirectUri,
        grant_type:    'authorization_code',
      }),
    })
    if (!res.ok) {
      const e = await res.text()
      return { success: false, error: e }
    }
    const data = await res.json()
    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()
    return {
      success: true,
      tokens: {
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
        expires_in:    data.expires_in,
        expiresAt,
      },
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Refresh an expired access token using the stored refresh token.
 */
export async function refreshAccessToken(opts: {
  refreshToken: string
  clientId: string
  clientSecret: string
}): Promise<{ success: boolean; accessToken?: string; expiresAt?: string; error?: string }> {
  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: opts.refreshToken,
        client_id:     opts.clientId,
        client_secret: opts.clientSecret,
        grant_type:    'refresh_token',
      }),
    })
    if (!res.ok) {
      const e = await res.text()
      return { success: false, error: e }
    }
    const data = await res.json()
    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()
    return { success: true, accessToken: data.access_token, expiresAt }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ─── Blogger post operations ─────────────────────────────────────────────────

export interface BloggerPostInput {
  title: string
  content: string          // HTML
  labels?: string[]
}

export interface BloggerPostResult {
  success: boolean
  postId?: string
  url?: string
  publishedAt?: string
  error?: string
}

/**
 * Publish a post to Blogger.
 */
export async function publishToBlogger(opts: {
  accessToken: string
  blogId: string
  post: BloggerPostInput
}): Promise<BloggerPostResult> {
  try {
    const res = await fetch(
      `${BLOGGER_API_BASE}/blogs/${opts.blogId}/posts/`,
      {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${opts.accessToken}`,
        },
        body: JSON.stringify({
          kind:    'blogger#post',
          title:   opts.post.title,
          content: opts.post.content,
          labels:  opts.post.labels ?? [],
        }),
      },
    )

    if (!res.ok) {
      const e = await res.text()
      return { success: false, error: `Blogger API ${res.status}: ${e}` }
    }

    const data = await res.json()
    return {
      success:     true,
      postId:      data.id,
      url:         data.url,
      publishedAt: data.published ?? new Date().toISOString(),
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Update an existing Blogger post.
 */
export async function updateBloggerPost(opts: {
  accessToken: string
  blogId: string
  postId: string
  post: BloggerPostInput
}): Promise<BloggerPostResult> {
  try {
    const res = await fetch(
      `${BLOGGER_API_BASE}/blogs/${opts.blogId}/posts/${opts.postId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${opts.accessToken}`,
        },
        body: JSON.stringify({
          kind:    'blogger#post',
          id:      opts.postId,
          title:   opts.post.title,
          content: opts.post.content,
          labels:  opts.post.labels ?? [],
        }),
      },
    )

    if (!res.ok) {
      const e = await res.text()
      return { success: false, error: `Blogger update ${res.status}: ${e}` }
    }

    const data = await res.json()
    return {
      success:     true,
      postId:      data.id,
      url:         data.url,
      publishedAt: data.updated ?? new Date().toISOString(),
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Convert markdown to minimal HTML for Blogger (strips fenced code metadata,
 * converts headings and bold — Blogger renders basic HTML fine).
 */
export function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^(?!<[hH\d]|<ul|<li|<\/)(.*)/gm, (_, p) => p ? `<p>${p}</p>` : '')
    .trim()
}

/**
 * List all Blogger blogs for the authenticated user.
 */
export async function listBloggerBlogs(
  accessToken: string,
): Promise<{ id: string; name: string; url: string }[]> {
  try {
    const res = await fetch(`${BLOGGER_API_BASE}/users/self/blogs`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.items ?? []).map((b: { id: string; name: string; url: string }) => ({
      id:   b.id,
      name: b.name,
      url:  b.url,
    }))
  } catch {
    return []
  }
}
