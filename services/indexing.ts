/**
 * Search Engine Indexing Service
 * - IndexNow (Bing, Yandex, Seznam)
 * - Google Search Console URL Inspection API (notify)
 */

const INDEXNOW_KEY  = process.env.INDEXNOW_KEY ?? ''
const INDEXNOW_HOST = 'streamb4.com'

export interface IndexingResult {
  service: string
  success: boolean
  status?: number
  error?: string
}

// ─── IndexNow ───────────────────────────────────────────────────────────────

/**
 * Submit a URL to IndexNow (Bing + Yandex via api.indexnow.org).
 */
export async function pingIndexNow(url: string): Promise<IndexingResult> {
  if (!INDEXNOW_KEY) {
    return { service: 'IndexNow', success: false, error: 'INDEXNOW_KEY env var not set' }
  }

  try {
    const body = {
      host:          INDEXNOW_HOST,
      key:           INDEXNOW_KEY,
      keyLocation:   `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList:       [url],
    }

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:    JSON.stringify(body),
    })

    return { service: 'IndexNow', success: res.ok || res.status === 202, status: res.status }
  } catch (err: unknown) {
    return { service: 'IndexNow', success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ─── Google Search Console ───────────────────────────────────────────────────

/**
 * Notify Google of a new/updated URL via the Indexing API.
 * Requires GOOGLE_INDEXING_SA_KEY (JSON service-account key, base64-encoded).
 */
export async function notifyGoogleIndexing(url: string): Promise<IndexingResult> {
  const saKeyBase64 = process.env.GOOGLE_INDEXING_SA_KEY ?? ''
  if (!saKeyBase64) {
    return { service: 'Google Indexing', success: false, error: 'GOOGLE_INDEXING_SA_KEY not set' }
  }

  try {
    // Decode service-account JSON
    const saKey = JSON.parse(Buffer.from(saKeyBase64, 'base64').toString('utf-8'))

    // Build a signed JWT for Google's OAuth token endpoint
    const now = Math.floor(Date.now() / 1000)
    const claim = {
      iss:   saKey.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud:   'https://oauth2.googleapis.com/token',
      exp:   now + 3600,
      iat:   now,
    }

    // Sign JWT using the service-account private key
    // (We use the native Web Crypto API available in Node 18+ / Edge)
    const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify(claim))
    const unsigned = `${header}.${payload}`

    const pemKey = saKey.private_key as string
    const keyData = pemKey
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\s/g, '')
    const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign'],
    )

    const sig = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(unsigned),
    )
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    const jwt    = `${unsigned}.${sigB64}`

    // Exchange JWT for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    })
    if (!tokenRes.ok) return { service: 'Google Indexing', success: false, error: `Token exchange ${tokenRes.status}` }
    const { access_token } = await tokenRes.json()

    // Submit URL
    const notifyRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
      body:    JSON.stringify({ url, type: 'URL_UPDATED' }),
    })

    return { service: 'Google Indexing', success: notifyRes.ok, status: notifyRes.status }
  } catch (err: unknown) {
    return { service: 'Google Indexing', success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Ping both IndexNow and Google for a given article URL.
 * Always resolves — never throws.
 */
export async function notifySearchEngines(slug: string): Promise<IndexingResult[]> {
  const url = `https://streamb4.com/blog/${slug}`
  const results = await Promise.allSettled([
    pingIndexNow(url),
    notifyGoogleIndexing(url),
  ])

  return results.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : { service: 'unknown', success: false, error: String((r as PromiseRejectedResult).reason) }
  )
}
