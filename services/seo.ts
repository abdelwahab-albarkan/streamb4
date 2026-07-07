/**
 * SEO Analysis Service
 * Pure functions — no DB access, no side-effects.
 * Used by the AI Studio Review step and the Publish pipeline.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SeoAnalysis {
  seoScore: number
  readabilityScore: number
  eeatScore: number
  keywordDensity: number
  wordCount: number
  readingTime: number
  headingStructure: HeadingNode[]
  missingAltTags: number
  internalLinksCount: number
  externalLinksCount: number
  hasFaq: boolean
  hasSchemaMarkup: boolean
  schemaValid: boolean
  snippetPreview: SnippetPreview
  issues: SeoIssue[]
  suggestions: string[]
}

export interface HeadingNode {
  level: number   // 1–6
  text: string
}

export interface SnippetPreview {
  title: string
  url: string
  description: string
  titleLength: number
  descLength: number
  titleOk: boolean
  descOk: boolean
}

export interface SeoIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
}

// ─── Word / Reading time ────────────────────────────────────────────────────

export function countWords(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*?|__?/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 238))
}

// ─── Keyword density ────────────────────────────────────────────────────────

export function calcKeywordDensity(content: string, keyword: string): number {
  if (!keyword) return 0
  const plain = content.toLowerCase().replace(/[#*`[\]()>]/g, ' ')
  const words = plain.split(/\s+/).filter(Boolean)
  const kw = keyword.toLowerCase()
  const matches = words.filter(w => w.includes(kw)).length
  return words.length ? parseFloat(((matches / words.length) * 100).toFixed(2)) : 0
}

// ─── Heading structure ──────────────────────────────────────────────────────

export function extractHeadings(content: string): HeadingNode[] {
  const lines = content.split('\n')
  return lines
    .map(line => {
      const m = line.match(/^(#{1,6})\s+(.+)$/)
      if (!m) return null
      return { level: m[1].length, text: m[2].trim() } as HeadingNode
    })
    .filter(Boolean) as HeadingNode[]
}

// ─── Missing alt tags ───────────────────────────────────────────────────────

export function countMissingAltTags(content: string): number {
  const imgRegex = /!\[([^\]]*)\]\([^)]+\)/g
  let missing = 0
  let m: RegExpExecArray | null
  while ((m = imgRegex.exec(content)) !== null) {
    if (!m[1].trim()) missing++
  }
  return missing
}

// ─── Link counts ────────────────────────────────────────────────────────────

export function countLinks(content: string): { internal: number; external: number } {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let internal = 0, external = 0
  let m: RegExpExecArray | null
  while ((m = linkRegex.exec(content)) !== null) {
    const href = m[2]
    if (href.startsWith('http') || href.startsWith('//')) external++
    else internal++
  }
  return { internal, external }
}

// ─── Schema validation ──────────────────────────────────────────────────────

export function validateSchema(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') return false
  const s = schema as Record<string, unknown>
  return Boolean(s['@context'] && s['@type'])
}

// ─── Google Snippet Preview ─────────────────────────────────────────────────

export function buildSnippetPreview(
  seoTitle: string,
  metaDescription: string,
  slug: string,
): SnippetPreview {
  const url = `https://streamb4.com/blog/${slug}`
  return {
    title: seoTitle || 'Untitled',
    url,
    description: metaDescription || '',
    titleLength: seoTitle.length,
    descLength: metaDescription.length,
    titleOk: seoTitle.length >= 30 && seoTitle.length <= 65,
    descOk: metaDescription.length >= 120 && metaDescription.length <= 160,
  }
}

// ─── SEO Score ──────────────────────────────────────────────────────────────

export function calculateSeoScore(opts: {
  content: string
  seoTitle: string
  metaDescription: string
  focusKeyword: string
  wordCount: number
  internalLinks: number
  externalLinks: number
  hasFaq: boolean
  hasSchema: boolean
  headings: HeadingNode[]
  missingAlt: number
}): number {
  let score = 0

  // Title (20 pts)
  if (opts.seoTitle.length >= 30 && opts.seoTitle.length <= 65) score += 10
  if (opts.focusKeyword && opts.seoTitle.toLowerCase().includes(opts.focusKeyword.toLowerCase())) score += 10

  // Meta description (15 pts)
  if (opts.metaDescription.length >= 120 && opts.metaDescription.length <= 160) score += 8
  if (opts.focusKeyword && opts.metaDescription.toLowerCase().includes(opts.focusKeyword.toLowerCase())) score += 7

  // Content (25 pts)
  if (opts.wordCount >= 1500) score += 10
  if (opts.wordCount >= 3000) score += 5
  const density = calcKeywordDensity(opts.content, opts.focusKeyword)
  if (density >= 0.5 && density <= 2.5) score += 10

  // Structure (20 pts)
  const hasH1 = opts.headings.some(h => h.level === 1)
  const hasH2 = opts.headings.some(h => h.level === 2)
  if (hasH1) score += 5
  if (hasH2) score += 5
  if (opts.internalLinks >= 3) score += 5
  if (opts.externalLinks >= 2) score += 5

  // Extras (20 pts)
  if (opts.hasFaq) score += 7
  if (opts.hasSchema) score += 7
  if (opts.missingAlt === 0) score += 6

  return Math.min(100, score)
}

// ─── Readability Score ──────────────────────────────────────────────────────

export function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length === 0) return 0

  const words = countWords(content)
  const avgWordsPerSentence = words / sentences.length

  let score = 100
  if (avgWordsPerSentence > 25) score -= 20
  else if (avgWordsPerSentence > 20) score -= 10

  // Penalise very long paragraphs
  const paragraphs = content.split(/\n{2,}/)
  const longParas = paragraphs.filter(p => countWords(p) > 150).length
  score -= longParas * 5

  // Reward use of lists and headings
  const listItems = (content.match(/^[-*]\s/gm) || []).length
  const headings  = (content.match(/^#{1,6}\s/gm) || []).length
  score += Math.min(15, listItems * 0.5 + headings * 1)

  return Math.max(0, Math.min(100, Math.round(score)))
}

// ─── EEAT Score ─────────────────────────────────────────────────────────────

export function calculateEEATScore(content: string, author: string): number {
  let score = 40  // baseline

  const signals = [
    /according to|research (shows|suggests|indicates)/i,
    /study|survey|report|data|statistics/i,
    /expert|professional|specialist/i,
    /source:|citation|reference/i,
    /\d{4}.*study|published in/i,
    /trust|secure|privacy|policy/i,
    /years of experience|certified|award/i,
    /disclaimer|disclosure/i,
  ]
  for (const rx of signals) {
    if (rx.test(content)) score += 7
  }

  if (author && author !== 'STREAMB4 Editorial Team') score += 5
  if (countWords(content) >= 3000) score += 8

  return Math.min(100, score)
}

// ─── Full analysis ──────────────────────────────────────────────────────────

export function analyzeContent(opts: {
  content: string
  seoTitle: string
  metaDescription: string
  focusKeyword: string
  slug: string
  author: string
  faqs: unknown[]
  schemaMarkup: unknown
}): SeoAnalysis {
  const wordCount     = countWords(opts.content)
  const readingTime   = estimateReadingTime(wordCount)
  const headings      = extractHeadings(opts.content)
  const missingAlt    = countMissingAltTags(opts.content)
  const links         = countLinks(opts.content)
  const hasFaq        = Array.isArray(opts.faqs) && opts.faqs.length > 0
  const hasSchema     = !!opts.schemaMarkup
  const schemaValid   = validateSchema(opts.schemaMarkup)
  const keyDensity    = calcKeywordDensity(opts.content, opts.focusKeyword)
  const snippet       = buildSnippetPreview(opts.seoTitle, opts.metaDescription, opts.slug)
  const seoScore      = calculateSeoScore({
    content:       opts.content,
    seoTitle:      opts.seoTitle,
    metaDescription: opts.metaDescription,
    focusKeyword:  opts.focusKeyword,
    wordCount,
    internalLinks: links.internal,
    externalLinks: links.external,
    hasFaq,
    hasSchema,
    headings,
    missingAlt,
  })
  const readScore     = calculateReadabilityScore(opts.content)
  const eeatScore     = calculateEEATScore(opts.content, opts.author)

  // Build issue list
  const issues: SeoIssue[] = []
  if (!snippet.titleOk) issues.push({ severity: 'warning', message: `SEO title is ${opts.seoTitle.length} chars — aim for 30–65` })
  if (!snippet.descOk)  issues.push({ severity: 'warning', message: `Meta description is ${opts.metaDescription.length} chars — aim for 120–160` })
  if (keyDensity < 0.5) issues.push({ severity: 'warning', message: `Keyword density ${keyDensity}% is low — target 0.5–2.5%` })
  if (keyDensity > 3)   issues.push({ severity: 'error',   message: `Keyword density ${keyDensity}% is too high — risk of over-optimisation` })
  if (missingAlt > 0)   issues.push({ severity: 'warning', message: `${missingAlt} image(s) missing alt text` })
  if (!hasSchema)        issues.push({ severity: 'info',    message: 'No JSON-LD schema markup found' })
  if (!hasFaq)           issues.push({ severity: 'info',    message: 'Adding FAQ section improves rich-snippet eligibility' })
  if (links.internal < 2) issues.push({ severity: 'info',  message: 'Add at least 2–3 internal links' })
  if (wordCount < 1000)  issues.push({ severity: 'error',   message: `Article is only ${wordCount} words — aim for 1500+` })

  const suggestions: string[] = [
    seoScore < 70  ? 'Improve SEO title and meta description with your focus keyword.' : '',
    readScore < 60 ? 'Break long paragraphs into shorter ones for better readability.' : '',
    eeatScore < 60 ? 'Add author bio, citations, and expertise signals to improve EEAT.' : '',
    missingAlt > 0 ? `Add alt text to ${missingAlt} image(s).` : '',
    !hasFaq        ? 'Add a FAQ section to qualify for featured snippets.' : '',
  ].filter(Boolean)

  return {
    seoScore,
    readabilityScore: readScore,
    eeatScore,
    keywordDensity: keyDensity,
    wordCount,
    readingTime,
    headingStructure: headings,
    missingAltTags: missingAlt,
    internalLinksCount: links.internal,
    externalLinksCount: links.external,
    hasFaq,
    hasSchemaMarkup: hasSchema,
    schemaValid,
    snippetPreview: snippet,
    issues,
    suggestions,
  }
}
