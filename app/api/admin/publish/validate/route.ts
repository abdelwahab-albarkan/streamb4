import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

export async function POST(req: NextRequest) {
  try {
    const { article } = await req.json()
    if (!article) return NextResponse.json({ error: 'Missing article' }, { status: 400 })

    let existingPosts: any[] = []
    try {
      const postsFile = path.join(process.cwd(), 'data', 'posts.json')
      if (fs.existsSync(postsFile)) {
        existingPosts = JSON.parse(fs.readFileSync(postsFile, 'utf8') || '[]')
      }
    } catch {}

    const seoChecks = validateSEO(article)
    const duplicateWarning = checkDuplicates(article, existingPosts)
    const seoScore = Math.round(seoChecks.filter(c => c.status === 'pass').length / seoChecks.length * 100)
    const blockingFailures = seoChecks.filter(c => c.status === 'fail' && c.blocking)

    return NextResponse.json({ seoChecks, seoScore, duplicateWarning, blockingFailures })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
