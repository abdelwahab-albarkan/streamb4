import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// ─── SEO Validation ──────────────────────────────────────────────────────────

interface SEOCheck {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  blocking: boolean
}

function validateSEO(article: any): SEOCheck[] {
  const checks: SEOCheck[] = []
  const content = article.content || ''
  const wordCount = content.split(/\s+/).filter(Boolean).length

  const titleLen = (article.seoTitle || article.title || '').length
  checks.push({
    id: 'meta-title', label: 'Meta Title Length',
    status: titleLen >= 30 && titleLen <= 65 ? 'pass' : titleLen > 0 ? 'warn' : 'fail',
    message: titleLen > 0 ? `${titleLen} chars (ideal 50–60)` : 'Missing meta title',
    blocking: titleLen === 0,
  })

  const descLen = (article.metaDescription || '').length
  checks.push({
    id: 'meta-description', label: 'Meta Description',
    status: descLen >= 100 && descLen <= 165 ? 'pass' : descLen > 0 ? 'warn' : 'fail',
    message: descLen > 0 ? `${descLen} chars (ideal 120–160)` : 'Missing meta description',
    blocking: descLen === 0,
  })

  const hasH1 = !!(article.title || article.seoTitle)
  checks.push({ id: 'h1', label: 'H1 Title', status: hasH1 ? 'pass' : 'fail', message: hasH1 ? 'H1 present' : 'Missing H1 title', blocking: !hasH1 })

  const hasSlug = !!article.slug
  checks.push({ id: 'canonical', label: 'Canonical URL', status: hasSlug ? 'pass' : 'fail', message: hasSlug ? `/blog/${article.slug}` : 'Missing slug', blocking: !hasSlug })

  const hasSchema = !!(article.schema && typeof article.schema === 'object' && Object.keys(article.schema).length > 0)
  checks.push({ id: 'schema', label: 'Schema Markup', status: hasSchema ? 'pass' : 'warn', message: hasSchema ? 'Schema present' : 'No schema found', blocking: false })

  const kw = (article.focusKeyword || '').toLowerCase()
  if (kw && wordCount > 0) {
    const occurrences = (content.toLowerCase().split(kw).length - 1)
    const density = (occurrences / wordCount) * 100
    checks.push({
      id: 'kw-density', label: 'Keyword Density',
      status: density >= 0.5 && density <= 2.5 ? 'pass' : density > 0 ? 'warn' : 'fail',
      message: density > 0 ? `${density.toFixed(2)}% (ideal 0.5–2.5%)` : `"${kw}" not found`,
      blocking: false,
    })
  }

  const hasFeaturedImage = !!article.featuredImage
  checks.push({ id: 'image', label: 'Featured Image', status: hasFeaturedImage ? 'pass' : 'warn', message: hasFeaturedImage ? 'Featured image set' : 'No featured image', blocking: false })

  const intLinks = (article.internalLinks || []).length
  checks.push({ id: 'internal-links', label: 'Internal Links', status: intLinks >= 3 ? 'pass' : intLinks > 0 ? 'warn' : 'fail', message: `${intLinks} internal links (rec. 3+)`, blocking: false })

  const extLinks = (article.externalLinks || []).length
  checks.push({ id: 'external-links', label: 'External Links', status: extLinks >= 1 ? 'pass' : 'warn', message: `${extLinks} external links (rec. 2+)`, blocking: false })

  const rs = article.readabilityScore || 0
  checks.push({ id: 'readability', label: 'Readability Score', status: rs >= 70 ? 'pass' : rs >= 45 ? 'warn' : 'fail', message: rs > 0 ? `${rs}/100` : 'No readability score', blocking: false })

  return checks
}

// ─── Duplicate Detection ─────────────────────────────────────────────────────

function checkDuplicates(article: any, posts: any[]): { isDuplicate: boolean; similar: { title: string; slug: string; score: number }[] } {
  const title = (article.title || '').toLowerCase()
  const kw = (article.focusKeyword || '').toLowerCase()
  const slug = article.slug || ''

  const similar = posts
    .filter(p => p.slug !== slug)
    .map(p => {
      const pTitle = (p.title || '').toLowerCase()
      let score = 0
      if (pTitle === title) score += 100
      else if (pTitle.includes(kw) || (kw && title.includes((p.focusKeyword || '').toLowerCase()))) score += 60
      const sharedWords = title.split(' ').filter((w: string) => w.length > 4 && pTitle.includes(w)).length
      score += sharedWords * 10
      return { title: p.title, slug: p.slug, score }
    })
    .filter(p => p.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return { isDuplicate: similar.some(s => s.score >= 80), similar }
}

// ─── Internal Link Enrichment ────────────────────────────────────────────────

const TRUSTED_EXTERNAL: { anchor: string; url: string; topics: string[] }[] = [
  { anchor: 'How IPTV works',   url: 'https://en.wikipedia.org/wiki/Internet_Protocol_television', topics: ['iptv', 'internet protocol', 'television'] },
  { anchor: 'What is a VPN',    url: 'https://www.pcmag.com/explainers/what-is-a-vpn-and-why-do-you-need-one', topics: ['vpn', 'privacy', 'security'] },
  { anchor: 'Amazon Fire Stick setup guide', url: 'https://www.howtogeek.com/amazon-fire-tv', topics: ['firestick', 'fire tv', 'amazon'] },
  { anchor: 'Android TV explained',          url: 'https://en.wikipedia.org/wiki/Android_TV', topics: ['android tv', 'google tv'] },
  { anchor: 'Kodi media center',             url: 'https://kodi.tv/', topics: ['kodi', 'media player'] },
  { anchor: '4K Ultra HD streaming',         url: 'https://en.wikipedia.org/wiki/4K_resolution', topics: ['4k', 'uhd', 'ultra hd'] },
  { anchor: 'Roku streaming devices',        url: 'https://www.techradar.com/best/best-roku-streaming-devices', topics: ['roku'] },
  { anchor: 'Smart TV buying guide',         url: 'https://www.cnet.com/tech/home-entertainment/best-smart-tvs/', topics: ['smart tv', 'television'] },
  { anchor: 'Internet speed for streaming',  url: 'https://www.pcmag.com/explainers/how-much-internet-speed-do-you-need', topics: ['internet speed', 'bandwidth', 'mbps'] },
  { anchor: 'What is M3U playlist',          url: 'https://en.wikipedia.org/wiki/M3U', topics: ['m3u', 'playlist'] },
]

function enrichContent(content: string, article: any, existingPosts: any[], siteUrl: string): { content: string; internalLinksAdded: number; externalLinksAdded: number } {
  let enriched = content
  let internalLinksAdded = 0
  let externalLinksAdded = 0
  const currentSlug = article.slug || ''

  // ── Internal links ──────────────────────────────────────────────────────────
  const kws = [
    (article.focusKeyword || '').toLowerCase(),
    ...(article.secondaryKeywords || []).map((k: string) => k.toLowerCase()),
    ...(article.tags || []).map((t: string) => t.toLowerCase()),
  ].filter(Boolean)

  const relatedPosts = existingPosts
    .filter(p => p.slug !== currentSlug && p.status === 'published')
    .map(p => {
      const pText = `${p.title} ${p.excerpt || ''} ${p.focusKeyword || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
      const score = kws.reduce((acc: number, kw: string) => acc + (pText.includes(kw) ? 1 : 0), 0)
      return { ...p, score }
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  for (const post of relatedPosts) {
    if (internalLinksAdded >= 6) break
    const postUrl = `${siteUrl}/blog/${post.slug}`
    const postKws = [(post.focusKeyword || ''), ...(post.tags || [])].filter(Boolean)

    for (const kw of postKws) {
      if (!kw) continue
      const idx = enriched.toLowerCase().indexOf(kw.toLowerCase())
      if (idx === -1) continue
      const paraEnd = enriched.indexOf('\n\n', idx)
      if (paraEnd === -1) continue
      if (enriched.slice(Math.max(0, idx - 300), paraEnd + 300).includes(postUrl)) continue

      enriched = `${enriched.slice(0, paraEnd)}\n\n> 📖 **Related:** [${post.title}](${postUrl})${enriched.slice(paraEnd)}`
      internalLinksAdded++
      break
    }
  }

  // ── External authority links ────────────────────────────────────────────────
  const contentLower = enriched.toLowerCase()
  for (const src of TRUSTED_EXTERNAL) {
    if (externalLinksAdded >= 3) break
    if (enriched.includes(src.url)) continue
    const hasTopic = src.topics.some(t => contentLower.includes(t))
    if (!hasTopic) continue

    for (const topic of src.topics) {
      const idx = enriched.toLowerCase().indexOf(topic)
      if (idx === -1) continue
      const wordEnd = enriched.indexOf(' ', idx + topic.length)
      if (wordEnd === -1) continue
      const before = enriched.slice(0, wordEnd)
      const after = enriched.slice(wordEnd)
      const nearby = enriched.slice(Math.max(0, wordEnd - 100), wordEnd + 100)
      if (nearby.includes('](') || nearby.includes(src.url)) continue
      enriched = `${before} *(see: [${src.anchor}](${src.url})){rel="noopener nofollow"}*${after}`
      externalLinksAdded++
      break
    }
  }

  return { content: enriched, internalLinksAdded, externalLinksAdded }
}

// ─── Social Content Generation ───────────────────────────────────────────────

function generateSocialContent(article: any, canonicalUrl: string): Record<string, string> {
  const title = article.seoTitle || article.title || ''
  const desc  = article.metaDescription || ''
  const tags  = (article.tags || []).slice(0, 3).map((t: string) => `#${t.replace(/\s+/g, '')}`).join(' ')

  return {
    twitter: `${title}\n\n${desc.slice(0, 140)}\n\n${tags}\n\n🔗 ${canonicalUrl}`,
    facebook: `📺 ${title}\n\n${desc}\n\nRead the full article:\n${canonicalUrl}\n\n${tags}`,
    discord: `**📡 New Article Published**\n\n**${title}**\n${desc}\n\n🔗 ${canonicalUrl}`,
    instagram: `${title} 🎯\n\n${desc.slice(0, 200)}\n\n${tags} #streaming #iptv #streamb4\n\n⬆️ Link in bio`,
  }
}

// ─── Auto Indexing ───────────────────────────────────────────────────────────

async function triggerIndexing(canonicalUrl: string, siteUrl: string): Promise<{ sitemapPinged: boolean; indexNow: boolean; rssRefreshed: boolean }> {
  const result = { sitemapPinged: false, indexNow: false, rssRefreshed: false }
  try {
    const indexNowKey = process.env.INDEXNOW_KEY
    if (indexNowKey) {
      const r = await fetch(`https://api.indexnow.org/indexnow?url=${encodeURIComponent(canonicalUrl)}&key=${indexNowKey}`, { method: 'GET' })
      result.indexNow = r.ok
    }
    const sitemapUrl = `${siteUrl}/sitemap.xml`
    const sr = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { method: 'GET' })
    result.sitemapPinged = sr.ok
  } catch {}
  try {
    await fetch(`${siteUrl}/api/rss`, { method: 'GET' })
    result.rssRefreshed = true
  } catch {}
  return result
}

// ─── Version History ─────────────────────────────────────────────────────────

const VERSIONS_FILE = path.join(process.cwd(), 'data', 'publish-versions.json')

function readVersions(): any[] {
  try {
    if (!fs.existsSync(VERSIONS_FILE)) { fs.writeFileSync(VERSIONS_FILE, '[]', 'utf8'); return [] }
    return JSON.parse(fs.readFileSync(VERSIONS_FILE, 'utf8') || '[]')
  } catch { return [] }
}

function saveVersion(article: any, publishedTo: string[]): void {
  try {
    const versions = readVersions()
    versions.unshift({
      id: `v_${Date.now()}`,
      articleSlug: article.slug,
      articleTitle: article.title,
      publishedTo,
      savedAt: new Date().toISOString(),
      snapshot: { ...article },
    })
    const kept = versions.slice(0, 200)
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(kept, null, 2), 'utf8')
  } catch (e) { console.error('saveVersion error:', e) }
}

// ─── Analytics ───────────────────────────────────────────────────────────────

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'publish-analytics.json')

function readAnalytics(): any {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) return {}
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8') || '{}')
  } catch { return {} }
}

function updateAnalytics(results: Record<string, any>, platforms: string[], durationMs: number): void {
  try {
    const data = readAnalytics()
    const today = new Date().toISOString().slice(0, 10)
    if (!data.byDate) data.byDate = {}
    if (!data.byDate[today]) data.byDate[today] = { total: 0, success: 0, failed: 0, website: 0, blogger: 0, devto: 0, totalDuration: 0 }
    const d = data.byDate[today]
    d.total++
    d.totalDuration = (d.totalDuration || 0) + durationMs
    for (const p of platforms) {
      if (results[p]?.success) { d.success++; d[p] = (d[p] || 0) + 1 }
      else d.failed++
    }
    if (!data.total) data.total = 0
    data.total++
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf8')
  } catch (e) { console.error('updateAnalytics error:', e) }
}

// ─── Publishing Queue ─────────────────────────────────────────────────────────

const QUEUE_FILE = path.join(process.cwd(), 'data', 'publish-queue.json')

function readQueue(): any[] {
  try {
    if (!fs.existsSync(QUEUE_FILE)) { fs.writeFileSync(QUEUE_FILE, '[]', 'utf8'); return [] }
    return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8') || '[]')
  } catch { return [] }
}

function writeQueue(queue: any[]): void {
  try { fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8') } catch {}
}

// ─── Log storage ─────────────────────────────────────────────────────────────

const LOGS_FILE = path.join(process.cwd(), 'data', 'publish-logs.json')

function readLogs(): any[] {
  try {
    if (!fs.existsSync(LOGS_FILE)) {
      fs.mkdirSync(path.dirname(LOGS_FILE), { recursive: true })
      fs.writeFileSync(LOGS_FILE, '[]', 'utf8')
      return []
    }
    return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8') || '[]')
  } catch {
    return []
  }
}

function writeLogs(logs: any[]): void {
  try {
    fs.mkdirSync(path.dirname(LOGS_FILE), { recursive: true })
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8')
  } catch (e) {
    console.error('publish-logs write error:', e)
  }
}

function addLog(logs: any[], entry: Omit<any, 'timestamp'>): any[] {
  const updated = [{ ...entry, timestamp: new Date().toISOString() }, ...logs]
  return updated.slice(0, 500)
}

// ─── Markdown → HTML (for Blogger) ───────────────────────────────────────────

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}

function markdownToHtml(md: string): string {
  if (!md) return ''
  const lines = md.split('\n')
  const out: string[] = []
  let listTag = ''

  const closeList = () => {
    if (listTag) { out.push(`</${listTag}>`); listTag = '' }
  }

  for (const raw of lines) {
    // Headers
    if (/^####\s/.test(raw)) { closeList(); out.push(`<h4>${formatInline(raw.slice(5))}</h4>`); continue }
    if (/^###\s/.test(raw))  { closeList(); out.push(`<h3>${formatInline(raw.slice(4))}</h3>`); continue }
    if (/^##\s/.test(raw))   { closeList(); out.push(`<h2>${formatInline(raw.slice(3))}</h2>`); continue }
    if (/^#\s/.test(raw))    { closeList(); out.push(`<h1>${formatInline(raw.slice(2))}</h1>`); continue }

    // Blockquote
    if (/^>\s/.test(raw)) {
      closeList()
      out.push(`<blockquote style="border-left:4px solid #ff7a00;padding:8px 16px;margin:16px 0;background:#0f0f0f;color:#aaa">${formatInline(raw.slice(2))}</blockquote>`)
      continue
    }

    // HR
    if (/^---+$/.test(raw.trim())) { closeList(); out.push('<hr style="border:none;border-top:1px solid #333;margin:24px 0">'); continue }

    // Bullet
    if (/^-\s/.test(raw)) {
      if (listTag !== 'ul') { closeList(); out.push('<ul style="padding-left:24px;margin:16px 0">'); listTag = 'ul' }
      out.push(`<li style="margin:4px 0;color:#ccc">${formatInline(raw.slice(2))}</li>`)
      continue
    }

    // Numbered
    if (/^\d+\.\s/.test(raw)) {
      if (listTag !== 'ol') { closeList(); out.push('<ol style="padding-left:24px;margin:16px 0">'); listTag = 'ol' }
      out.push(`<li style="margin:4px 0;color:#ccc">${formatInline(raw.replace(/^\d+\.\s/, ''))}</li>`)
      continue
    }

    // Image placeholder (from AI writer)
    if (/^\[IMAGE:/.test(raw)) {
      closeList(); continue // skip image placeholders
    }

    // Blank line
    if (!raw.trim()) { closeList(); continue }

    // Paragraph
    closeList()
    out.push(`<p style="margin:12px 0;line-height:1.7;color:#ddd">${formatInline(raw)}</p>`)
  }

  closeList()
  return out.join('\n')
}

// ─── Blogger helpers ──────────────────────────────────────────────────────────

async function getBloggerAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.BLOGGER_CLIENT_ID!,
      client_secret: process.env.BLOGGER_CLIENT_SECRET!,
      refresh_token: process.env.BLOGGER_REFRESH_TOKEN!,
      grant_type:    'refresh_token',
    }).toString(),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Blogger token refresh failed: ${txt}`)
  }
  const data = await res.json()
  if (!data.access_token) throw new Error('No access_token in Blogger response')
  return data.access_token as string
}

async function getBlogId(accessToken: string): Promise<string> {
  // Prefer env var (faster, avoids extra round-trip)
  if (process.env.BLOGGER_BLOG_ID?.trim()) return process.env.BLOGGER_BLOG_ID.trim()

  const res = await fetch('https://www.googleapis.com/blogger/v3/users/self/blogs', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Could not list Blogger blogs: ${await res.text()}`)
  const data = await res.json()
  if (!data.items?.length) throw new Error('No Blogger blogs found on this account')
  return data.items[0].id as string
}

async function publishToBlogger(
  article: any,
  canonicalUrl: string,
): Promise<{ url: string; id: string }> {
  if (!process.env.BLOGGER_CLIENT_ID || !process.env.BLOGGER_CLIENT_SECRET || !process.env.BLOGGER_REFRESH_TOKEN) {
    throw new Error('Blogger credentials not configured in .env.local')
  }

  const accessToken = await getBloggerAccessToken()
  const blogId      = await getBlogId(accessToken)

  const bodyHtml = markdownToHtml(article.content || '')

  const fullHtml = [
    // Featured image
    article.featuredImage
      ? `<img src="${article.featuredImage}" alt="${article.title}" style="width:100%;max-width:1280px;height:auto;border-radius:8px;margin-bottom:24px;display:block">`
      : '',
    // SEO / meta description callout
    article.metaDescription
      ? `<p style="background:rgba(255,122,0,0.08);border-left:4px solid #ff7a00;padding:12px 16px;border-radius:4px;color:#aaa;font-style:italic;margin-bottom:24px">${article.metaDescription}</p>`
      : '',
    // Main content
    bodyHtml,
    // Canonical reference (visible + structured)
    `<hr style="border:none;border-top:1px solid #333;margin:32px 0">`,
    `<p style="color:#888;font-size:0.875rem">
      Originally published at
      <a href="${canonicalUrl}" rel="canonical" style="color:#ff7a00">${canonicalUrl}</a>.
      Read the full version on <a href="https://streamb4.com" style="color:#ff7a00">STREAMB4</a>.
    </p>`,
  ].filter(Boolean).join('\n')

  // Labels: category + tags (max 20)
  const labels = [
    article.category || 'IPTV',
    ...(article.tags || []),
  ].slice(0, 20)

  const payload = {
    kind:    'blogger#post',
    title:   article.seoTitle || article.title,
    content: fullHtml,
    labels,
  }

  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/?isDraft=false`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Blogger publish failed (${res.status}): ${err}`)
  }

  const data = await res.json()
  return { url: data.url as string, id: data.id as string }
}

// ─── DEV.to helper ───────────────────────────────────────────────────────────

async function publishToDevTo(
  article: any,
  canonicalUrl: string,
): Promise<{ url: string; id: number }> {
  const apiKey = process.env.DEVTO_API_KEY
  if (!apiKey) throw new Error('DEV.to API key not configured in .env.local')

  // DEV.to tags: alphanumeric only, max 4, max 30 chars each
  const rawTags: string[] = (article.tags || [])
  const tags = rawTags
    .map((t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter((t: string) => t.length >= 1 && t.length <= 30)
    .slice(0, 4)

  // Prepend canonical reference to markdown body
  const bodyMarkdown = [
    article.content || '',
    '',
    '---',
    '',
    `*Originally published at [STREAMB4](${canonicalUrl})*`,
  ].join('\n')

  const payload = {
    article: {
      title:         article.seoTitle || article.title,
      body_markdown: bodyMarkdown,
      published:     true,
      canonical_url: canonicalUrl,
      description:   article.metaDescription || '',
      tags,
      ...(article.featuredImage ? { main_image: article.featuredImage } : {}),
    },
  }

  const res = await fetch('https://dev.to/api/articles', {
    method:  'POST',
    headers: {
      'api-key':      apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DEV.to publish failed (${res.status}): ${err}`)
  }

  const data = await res.json()
  return { url: data.url as string, id: data.id as number }
}

// ─── Website helper ───────────────────────────────────────────────────────────

async function publishToWebsite(article: any): Promise<{ url: string }> {
  const postsFile = path.join(process.cwd(), 'data', 'posts.json')
  let posts: any[] = []

  try {
    if (fs.existsSync(postsFile)) {
      posts = JSON.parse(fs.readFileSync(postsFile, 'utf8') || '[]')
    }
  } catch {}

  const now = new Date().toISOString()
  const existing = posts.findIndex((p: any) => p.slug === article.slug)

  if (existing !== -1) {
    posts[existing] = { ...posts[existing], ...article, status: 'published', updatedAt: now }
  } else {
    posts.unshift({
      ...article,
      id:          article.id || Date.now().toString(),
      status:      'published',
      views:       0,
      publishedAt: now,
      createdAt:   now,
      updatedAt:   now,
    })
  }

  fs.mkdirSync(path.dirname(postsFile), { recursive: true })
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), 'utf8')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://streamb4.com'
  return { url: `${siteUrl}/blog/${article.slug}` }
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const startTime = Date.now()
    const body = await req.json()
    const { article, platforms, skipValidation } = body as {
      article: Record<string, any>
      platforms: string[]
      skipValidation?: boolean
    }

    if (!article?.slug || !platforms?.length) {
      return NextResponse.json({ error: 'Missing article or platforms' }, { status: 400 })
    }

    const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL || 'https://streamb4.com'
    const canonicalUrl = `${siteUrl}/blog/${article.slug}`

    // ── Read existing posts ───────────────────────────────────────────────────
    let existingPosts: any[] = []
    try {
      const postsFile = path.join(process.cwd(), 'data', 'posts.json')
      if (fs.existsSync(postsFile)) {
        existingPosts = JSON.parse(fs.readFileSync(postsFile, 'utf8') || '[]')
      }
    } catch {}

    // ── SEO Validation ────────────────────────────────────────────────────────
    const seoChecks = validateSEO(article)
    const blockingFailures = seoChecks.filter(c => c.status === 'fail' && c.blocking)
    if (blockingFailures.length > 0 && !skipValidation) {
      return NextResponse.json({
        error: 'SEO validation failed',
        seoChecks,
        blockingFailures,
      }, { status: 422 })
    }

    // ── Duplicate detection ───────────────────────────────────────────────────
    const duplicateWarning = checkDuplicates(article, existingPosts)

    // ── Content enrichment ────────────────────────────────────────────────────
    const enrichResult = enrichContent(article.content || '', article, existingPosts, siteUrl)
    const enrichedArticle = { ...article, content: enrichResult.content }

    // ── Save version snapshot ─────────────────────────────────────────────────
    saveVersion(article, platforms)

    let logs    = readLogs()
    const results: Record<string, { success: boolean; url?: string; id?: any; error?: string }> = {}
    const platformTimings: Record<string, number> = {}

    for (const platform of platforms) {
      const platformStart = Date.now()
      try {
        if (platform === 'website') {
          const r = await publishToWebsite(enrichedArticle)
          results.website = { success: true, url: r.url }
          logs = addLog(logs, { platform: 'website', status: 'success', article: article.title, url: r.url, message: 'Published to STREAMB4 website' })

        } else if (platform === 'blogger') {
          const r = await publishToBlogger(enrichedArticle, canonicalUrl)
          results.blogger = { success: true, url: r.url, id: r.id }
          logs = addLog(logs, { platform: 'blogger', status: 'success', article: article.title, url: r.url, message: 'Published to Google Blogger' })

        } else if (platform === 'devto') {
          const r = await publishToDevTo(enrichedArticle, canonicalUrl)
          results.devto = { success: true, url: r.url, id: r.id }
          logs = addLog(logs, { platform: 'devto', status: 'success', article: article.title, url: r.url, message: 'Published to DEV.to' })
        }

      } catch (err: any) {
        const msg = err?.message || 'Unknown error'
        results[platform] = { success: false, error: msg }
        logs = addLog(logs, { platform, status: 'error', article: article.title, message: `Failed: ${msg}` })
      }
      platformTimings[platform] = Date.now() - platformStart
    }

    writeLogs(logs)

    // ── Post-publish pipeline ─────────────────────────────────────────────────
    const totalDuration = Date.now() - startTime
    updateAnalytics(results, platforms, totalDuration)
    const indexingResult = await triggerIndexing(canonicalUrl, siteUrl)
    const socialContent  = generateSocialContent(article, canonicalUrl)

    const successCount = Object.values(results).filter(r => r.success).length
    const finalReport = {
      articleTitle:       article.title,
      canonicalUrl,
      publishedAt:        new Date().toISOString(),
      platforms:          platforms.map(p => ({
        name:    p,
        success: results[p]?.success ?? false,
        url:     results[p]?.url,
        error:   results[p]?.error,
        durationMs: platformTimings[p] ?? 0,
      })),
      totalDurationMs:     totalDuration,
      successCount,
      failCount:           platforms.length - successCount,
      seoScore:            Math.round(seoChecks.filter(c => c.status === 'pass').length / seoChecks.length * 100),
      seoWarnings:         seoChecks.filter(c => c.status !== 'pass').map(c => c.message),
      internalLinksAdded:  enrichResult.internalLinksAdded,
      externalLinksAdded:  enrichResult.externalLinksAdded,
      indexing:            indexingResult,
    }

    return NextResponse.json({ results, logs: logs.slice(0, 30), canonicalUrl, finalReport, seoChecks, socialContent, duplicateWarning })

  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  const logs = readLogs()
  return NextResponse.json({ logs })
}
