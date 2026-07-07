import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Setting }   from '@/lib/models/Setting'

/**
 * POST /api/admin/ai-outline
 * Generates a detailed article outline based on prompt + SEO settings.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { body = {} }

  const {
    prompt            = '',
    topic             = '',
    primaryKeyword    = '',
    secondaryKeywords = [],
    seoTitle          = '',
    targetAudience    = 'general readers',
    writingStyle      = 'informative',
    tone              = 'professional',
    wordCount         = 3000,
    category          = 'General',
  } = body as Record<string, unknown>

  const kw = (primaryKeyword as string) || (topic as string)

  let apiKey = process.env.ANTHROPIC_API_KEY ?? ''
  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'anthropicApiKey' }).lean() as { value?: string } | null
    if (setting?.value) apiKey = setting.value
  } catch { /* fallback to env */ }

  const userPrompt = `You are an expert content architect for enterprise SEO. Create a detailed outline. Return ONLY valid JSON.

Title: ${seoTitle || topic || kw}
Primary Keyword: ${kw}
Secondary Keywords: ${(secondaryKeywords as string[]).join(', ')}
Target Audience: ${targetAudience} | Style: ${writingStyle} | Tone: ${tone}
Target Word Count: ${wordCount} | Category: ${category}
Context: ${prompt}

Return:
{
  "outline": [
    {
      "id": "s1",
      "level": 1,
      "heading": "H2 section heading",
      "description": "What this section covers in 1-2 sentences",
      "estimatedWords": 300,
      "subsections": [
        { "id": "s1-1", "level": 2, "heading": "H3 subheading", "description": "Purpose", "estimatedWords": 150 }
      ]
    }
  ],
  "totalSections": 8,
  "structureNotes": "Brief strategy note"
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
          max_tokens: 2000,
          messages:   [{ role: 'user', content: userPrompt }],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const raw  = (data.content?.[0]?.text ?? '').trim()
        const m    = raw.match(/\{[\s\S]*\}/)
        if (m) {
          try {
            const parsed = JSON.parse(m[0])
            return NextResponse.json({ success: true, ...parsed })
          } catch { /* fall through */ }
        }
      }
    } catch { /* fall through */ }
  }

  // Deterministic fallback
  const wc = Number(wordCount) || 3000
  const sw = Math.floor(wc / 6)
  return NextResponse.json({
    success: true,
    outline: [
      { id: 's1', level: 1, heading: `Introduction to ${kw}`, description: 'Hook and overview.', estimatedWords: Math.floor(sw * 0.6), subsections: [] },
      { id: 's2', level: 1, heading: `What is ${kw}?`, description: 'Definition.', estimatedWords: sw, subsections: [] },
      { id: 's3', level: 1, heading: `Why ${kw} Matters`, description: 'Benefits and use cases.', estimatedWords: sw, subsections: [] },
      { id: 's4', level: 1, heading: 'How to Get Started', description: 'Step-by-step guide.', estimatedWords: sw, subsections: [] },
      { id: 's5', level: 1, heading: 'Advanced Tips', description: 'Expert strategies.', estimatedWords: sw, subsections: [] },
      { id: 's6', level: 1, heading: 'Common Mistakes to Avoid', description: 'Pitfalls.', estimatedWords: sw, subsections: [] },
      { id: 's7', level: 1, heading: 'FAQ', description: 'Frequently asked questions.', estimatedWords: Math.floor(sw * 0.8), subsections: [] },
      { id: 's8', level: 1, heading: 'Conclusion', description: 'Summary and CTA.', estimatedWords: Math.floor(sw * 0.4), subsections: [] },
    ],
    totalSections: 8,
    structureNotes: 'Balanced outline covering awareness to decision stages.',
    fallback: true,
  })
}
