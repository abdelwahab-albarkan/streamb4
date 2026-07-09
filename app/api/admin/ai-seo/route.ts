import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Setting }   from '@/lib/models/Setting'
import { generateSlug } from '@/lib/slugUtils'

/**
 * POST /api/admin/ai-seo
 * Generates SEO metadata from a prompt and primary keyword. Lightweight single call.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { body = {} }

  const {
    prompt            = '',
    topic             = '',
    primaryKeyword    = '',
    secondaryKeywords = [],
    country           = 'US',
    language          = 'English',
    tone              = 'Professional',
    category          = 'General',
  } = body as Record<string, unknown>

  const kw = (primaryKeyword as string) || (topic as string)
  if (!kw) {
    return NextResponse.json({ success: false, error: 'topic or primaryKeyword required' }, { status: 400 })
  }

  // Load API key from DB or env
  let apiKey = process.env.ANTHROPIC_API_KEY ?? ''
  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'anthropicApiKey' }).lean() as { value?: string } | null
    if (setting?.value) apiKey = setting.value
  } catch { /* fallback to env */ }

  const userPrompt = `You are an enterprise SEO strategist for the streaming/IPTV niche. Generate SEO metadata. Return ONLY valid JSON, no markdown.

Topic: ${topic}
Primary Keyword: ${kw}
Secondary Keywords: ${(secondaryKeywords as string[]).join(', ')}
Country: ${country} | Language: ${language} | Tone: ${tone} | Category: ${category}
Extra context: ${prompt}

Return exactly:
{
  "seoTitle": "60-65 char title with keyword near start",
  "metaDescription": "145-160 char description with keyword and value prop",
  "slug": "url-friendly-slug",
  "ogTitle": "Engaging OG title",
  "ogDescription": "OG description 100-120 chars",
  "socialDescription": "150-200 char social caption",
  "focusKeyword": "${kw}",
  "lsiKeywords": ["5","semantic","related","keywords","here"],
  "twitterTitle": "Twitter card title",
  "twitterDescription": "Twitter description under 125 chars"
}`

  if (apiKey) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-3-5-haiku-20241022',
          max_tokens: 800,
          messages:   [{ role: 'user', content: userPrompt }],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const raw  = (data.content?.[0]?.text ?? '').trim()
        const m    = raw.match(/\{[\s\S]*\}/)
        if (m) {
          try {
            const seo = JSON.parse(m[0])
            // Always sanitise the LLM-returned slug — it may be too long
            // or generated from the full title rather than just the keyword.
            if (typeof seo.slug === 'string') {
              seo.slug = generateSlug(seo.slug || kw)
            } else {
              seo.slug = generateSlug(kw)
            }
            return NextResponse.json({ success: true, seo })
          } catch { /* fall through to fallback */ }
        }
      }
    } catch { /* fall through to fallback */ }
  }

  // Deterministic fallback — always generated from keyword, never content
  const slug = generateSlug(kw)
  return NextResponse.json({
    success: true,
    seo: {
      seoTitle:          `${kw} — Complete Guide ${new Date().getFullYear()}`,
      metaDescription:   `Discover everything about ${kw}. Our expert guide covers tips, tricks, and best practices for ${new Date().getFullYear()}.`,
      slug,
      ogTitle:           `${kw} — Complete Guide ${new Date().getFullYear()}`,
      ogDescription:     `Expert guide to ${kw} with proven strategies.`,
      socialDescription: `Your ultimate guide to ${kw} for ${new Date().getFullYear()}. Click to learn more!`,
      focusKeyword:      kw,
      lsiKeywords:       [],
      twitterTitle:      `${kw} Guide ${new Date().getFullYear()}`,
      twitterDescription:`Everything you need to know about ${kw}.`,
    },
    fallback: true,
  })
}
