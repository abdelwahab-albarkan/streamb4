'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastProvider, useToast } from '@/components/admin/ui/Toast'

type Step = 'settings' | 'generating' | 'review'

// ─── Generation progress steps (enterprise has more) ─────────────────────────
const GENERATION_STEPS = [
  { icon: '🔍', label: 'Analyzing keyword intent & search competition...' },
  { icon: '📊', label: 'Researching LSI, NLP, and voice-search keywords...' },
  { icon: '🎯', label: 'Mapping People Also Ask & featured snippet opportunities...' },
  { icon: '📋', label: 'Building enterprise content outline with 15+ sections...' },
  { icon: '✍️', label: 'Writing hero introduction & executive summary...' },
  { icon: '📖', label: 'Generating beginner guide & advanced deep-dive sections...' },
  { icon: '🔧', label: 'Writing step-by-step tutorial & expert tips...' },
  { icon: '⚠️', label: 'Generating common mistakes & best practices...' },
  { icon: '📊', label: 'Creating comparison tables & device compatibility matrix...' },
  { icon: '🔧', label: 'Building troubleshooting guide with solutions...' },
  { icon: '❓', label: 'Generating 12-15 expert FAQ items with schema markup...' },
  { icon: '🔗', label: 'Recommending 10-15 strategic internal & external links...' },
  { icon: '🖼️', label: 'Creating image prompts with alt text & SEO filenames...' },
  { icon: '📊', label: 'Building BlogPosting, FAQ & BreadcrumbList JSON-LD schemas...' },
  { icon: '⚡', label: 'Calculating SEO, readability & EEAT scores...' },
  { icon: '🎨', label: 'Generating featured image with AI...' },
  { icon: '✅', label: 'Enterprise article ready for review!' },
]

// ─── Quality tiers ───────────────────────────────────────────────────────────
const QUALITY_TIERS = [
  {
    id: 'Standard',
    label: 'Standard',
    wordRange: '~2,000 words',
    length: '2000',
    desc: 'Quick article for simple topics',
    color: '#6b7280',
    minWords: 1500,
  },
  {
    id: 'Professional',
    label: 'Professional',
    wordRange: '~3,500 words',
    length: '3500',
    desc: 'Detailed guide with strong SEO',
    color: '#3b82f6',
    minWords: 3000,
  },
  {
    id: 'Enterprise',
    label: 'Enterprise',
    wordRange: '5,000–7,000 words',
    length: '7000',
    desc: 'Authority resource to outrank Page 1',
    color: '#ff7a00',
    minWords: 5000,
    isDefault: true,
  },
]

export default function AIWriterPageWrapper() {
  return (
    <ToastProvider>
      <AIWriterPage />
    </ToastProvider>
  )
}

function AIWriterPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [step, setStep] = useState<Step>('settings')
  const [progress, setProgress] = useState<number[]>([])
  const [generatedArticle, setGeneratedArticle] = useState<any>(null)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [activeSectionAction, setActiveSectionAction] = useState<string | null>(null)

  const [settings, setSettings] = useState({
    keyword: '',
    secondaryKeywords: '',
    country: 'USA',
    language: 'English',
    articleType: 'Guide',
    // length is derived from quality tier — kept for API compat
    length: '7000',
    quality: 'Enterprise',
    style: 'Expert',
    intent: 'Informational',
    ctaStyle: 'Strong',
    category: 'Streaming Guides',
  })

  const activeQuality = QUALITY_TIERS.find(t => t.id === settings.quality) || QUALITY_TIERS[2]

  // ── Word count gate for Enterprise ──────────────────────────────────────────
  const wordCount = generatedArticle?.scores?.wordCount || 0
  const meetsQualityGate =
    settings.quality !== 'Enterprise' || wordCount >= activeQuality.minWords

  // ── Generate ──────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!settings.keyword.trim()) return
    setStep('generating')
    setProgress([])

    // Animate progress steps
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 280))
      setProgress(prev => [...prev, i])
    }

    try {
      const res = await fetch('/api/admin/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: settings.keyword,
          secondaryKeywords: settings.secondaryKeywords,
          country: settings.country,
          language: settings.language,
          articleType: settings.articleType,
          length: settings.length,
          quality: settings.quality,
          style: settings.style,
          intent: settings.intent,
          ctaStyle: settings.ctaStyle,
          category: settings.category,
        })
      })
      if (res.ok) {
        const data = await res.json()
        setGeneratedArticle(data)
        addToast(
          settings.quality === 'Enterprise'
            ? `Enterprise article generated — ${data.scores?.wordCount?.toLocaleString() || '6,500'}+ words!`
            : 'Article generated successfully!',
          'success'
        )
        setStep('review')
      } else {
        addToast('Generation failed', 'error')
        setStep('settings')
      }
    } catch (err) {
      console.error(err)
      addToast('Generation failed', 'error')
      setStep('settings')
    }
  }

  // ── AI section actions ────────────────────────────────────────────────────
  const handleAction = async (
    action: string,
    sectionId: string,
    currentContent: string
  ) => {
    setActiveSectionAction(sectionId)
    try {
      const res = await fetch('/api/admin/ai-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          content: currentContent,
          keyword: settings.keyword
        })
      })
      if (res.ok) {
        const data = await res.json()
        setGeneratedArticle((prev: any) => {
          const updated = { ...prev }
          if (sectionId === 'introduction' || sectionId === 'heroIntroduction') {
            updated.article.heroIntroduction = data.result
            updated.article.introduction = data.result
          } else if (sectionId === 'conclusion') {
            updated.article.conclusion = data.result
          } else {
            const index = updated.article.sections?.findIndex(
              (s: any) => s.id === sectionId
            )
            if (index !== -1 && index !== undefined) {
              updated.article.sections[index].content = data.result
            }
          }
          return updated
        })
        addToast('Section updated via AI!', 'success')
      } else {
        addToast('Action failed', 'error')
      }
    } catch {
      addToast('Action failed', 'error')
    } finally {
      setActiveSectionAction(null)
    }
  }

  // ── Regenerate image ─────────────────────────────────────────────────────
  const generateImage = async () => {
    if (!generatedArticle) return
    setGeneratingImage(true)
    try {
      const imgPrompt = encodeURIComponent(
        generatedArticle.featuredImagePrompt ||
        `${settings.keyword}, premium streaming technology, dark cinematic, orange glow, 4K, no text`
      )
      const url =
        `https://image.pollinations.ai/prompt/${imgPrompt}?width=1280&height=720&nologo=true&seed=${Date.now()}`
      setGeneratedArticle((prev: any) => ({ ...prev, featuredImage: url }))
      addToast('Image regenerated!', 'success')
    } catch {
      addToast('Failed to regenerate image', 'error')
    } finally {
      setGeneratingImage(false)
    }
  }

  // ── Build full markdown for editor/publish ───────────────────────────────
  const buildMarkdown = () => {
    if (!generatedArticle) return ''
    const article = generatedArticle.article
    let md = ''

    const intro = article?.heroIntroduction || article?.introduction || ''
    if (intro) md += `${intro}\n\n`

    if (article?.executiveSummary?.keyTakeaways?.length) {
      md += `## Executive Summary\n\n`
      article.executiveSummary.keyTakeaways.forEach((t: string) => {
        md += `- ${t}\n`
      })
      md += '\n'
    }

    if (article?.sections?.length) {
      article.sections.forEach((section: any) => {
        md += `## ${section.h2}\n\n`

        if (section.callout) {
          md += `> **${section.callout.type?.toUpperCase() || 'TIP'}: ${section.callout.title}**\n> ${section.callout.content}\n\n`
        }

        if (section.content) md += `${section.content}\n\n`

        if (section.bulletList?.length) {
          section.bulletList.forEach((b: string) => { md += `- ${b}\n` })
          md += '\n'
        }

        if (section.numberedList?.length) {
          section.numberedList.forEach((n: string, i: number) => {
            md += `${i + 1}. ${n}\n`
          })
          md += '\n'
        }

        if (section.h3s?.length) {
          section.h3s.forEach((h3: any) => {
            md += `### ${h3.h3}\n\n${h3.content}\n\n`
            if (h3.h4s?.length) {
              h3.h4s.forEach((h4: any) => {
                md += `#### ${h4.h4}\n\n${h4.content}\n\n`
              })
            }
          })
        }

        if (section.imagePrompt) {
          md += `[IMAGE: ${section.imagePrompt.alt}]\n\n`
        }
      })
    }

    // Comparison tables
    if (article?.comparisonTables?.length) {
      article.comparisonTables.forEach((table: any) => {
        md += `## ${table.title}\n\n`
        if (table.headers?.length) {
          md += `| ${table.headers.join(' | ')} |\n`
          md += `| ${table.headers.map(() => '---').join(' | ')} |\n`
          table.rows?.forEach((row: string[]) => {
            md += `| ${row.join(' | ')} |\n`
          })
          md += '\n'
        }
      })
    }

    // Legacy single comparisonTable
    if (!article?.comparisonTables && article?.comparisonTable) {
      const t = article.comparisonTable
      md += `## ${t.title}\n\n`
      md += `| ${t.headers.join(' | ')} |\n`
      md += `| ${t.headers.map(() => '---').join(' | ')} |\n`
      t.rows?.forEach((row: string[]) => { md += `| ${row.join(' | ')} |\n` })
      md += '\n'
    }

    if (article?.prosAndCons) {
      md += `## Pros & Cons\n\n`
      md += `**Pros:**\n${article.prosAndCons.pros.map((p: string) => `- ${p}`).join('\n')}\n\n`
      md += `**Cons:**\n${article.prosAndCons.cons.map((c: string) => `- ${c}`).join('\n')}\n\n`
    }

    // Troubleshooting
    if (article?.troubleshootingGuide?.problems?.length) {
      md += `## ${article.troubleshootingGuide.title || 'Troubleshooting Guide'}\n\n`
      article.troubleshootingGuide.problems.forEach((p: any) => {
        md += `### ${p.problem}\n\n`
        md += `**Cause:** ${p.cause}\n\n`
        md += `**Solution:** ${p.solution}\n\n`
        if (p.prevention) md += `**Prevention:** ${p.prevention}\n\n`
      })
    }

    if (article?.faq?.length) {
      md += `## Frequently Asked Questions\n\n`
      article.faq.forEach((item: any) => {
        md += `### ${item.question}\n\n${item.answer}\n\n`
      })
    }

    if (article?.expertRecommendations?.verdict) {
      md += `## Expert Verdict\n\n${article.expertRecommendations.verdict}\n\n`
    }

    if (article?.conclusion) {
      md += `## Conclusion\n\n${article.conclusion}\n\n`
    }

    if (article?.strongCTA) {
      md += `---\n\n**${article.strongCTA.headline}**\n\n${article.strongCTA.subtext}\n\n`
    }

    return md
  }

  // ── Send to Publishing Center ─────────────────────────────────────────────
  const openInPublishingCenter = () => {
    if (!generatedArticle) return
    const article = generatedArticle.article
    localStorage.setItem('publishing_center_article', JSON.stringify({
      id:                  Date.now().toString(),
      title:               article?.h1 || settings.keyword.toUpperCase(),
      slug:                generatedArticle.seo?.slug || settings.keyword.toLowerCase().replace(/\s+/g, '-'),
      content:             buildMarkdown(),
      excerpt:             article?.excerpt || '',
      seoTitle:            generatedArticle.seo?.metaTitle || generatedArticle.seo?.seoTitle || '',
      metaDescription:     generatedArticle.seo?.metaDescription || '',
      focusKeyword:        generatedArticle.focusKeyword || generatedArticle.seo?.focusKeyword || settings.keyword,
      secondaryKeywords:   generatedArticle.keywordResearch?.secondary || [],
      lsiKeywords:         generatedArticle.keywordResearch?.lsi || [],
      featuredImage:       generatedArticle.featuredImage || '',
      ogTitle:             generatedArticle.seo?.openGraph?.title || '',
      ogDescription:       generatedArticle.seo?.openGraph?.description || '',
      faqs:                article?.faq || [],
      internalLinks:       generatedArticle.internalLinks || [],
      schema:              generatedArticle.schema || {},
      category:            settings.category,
      tags:                article?.tags || [],
      author:              generatedArticle.author || 'STREAMB4 Editorial Team',
      seoScore:            generatedArticle.scores?.seoScore || 0,
      readabilityScore:    generatedArticle.scores?.readabilityScore || 0,
      keywordDensity:      generatedArticle.scores?.keywordDensity || '',
      readingTime:         generatedArticle.scores?.readingTime || 0,
      status:              'draft',
    }))
    router.push('/admin/publishing')
  }

  // ── Open in full editor ───────────────────────────────────────────────────
  const openInEditor = () => {
    if (!generatedArticle) return
    const article = generatedArticle.article

    localStorage.setItem('ai_generated_post', JSON.stringify({
      title: article?.h1 || settings.keyword.toUpperCase(),
      slug: generatedArticle.seo?.slug || settings.keyword.toLowerCase().replace(/\s+/g, '-'),
      content: buildMarkdown(),
      excerpt: article?.excerpt || '',
      seoTitle: generatedArticle.seo?.metaTitle || generatedArticle.seo?.seoTitle || '',
      metaDescription: generatedArticle.seo?.metaDescription || '',
      focusKeyword: generatedArticle.focusKeyword || generatedArticle.seo?.focusKeyword || settings.keyword,
      secondaryKeywords: generatedArticle.keywordResearch?.secondary || [],
      lsiKeywords: generatedArticle.keywordResearch?.lsi || [],
      nlpKeywords: generatedArticle.keywordResearch?.nlpKeywords || [],
      voiceSearchPhrases: generatedArticle.keywordResearch?.voiceSearchPhrases || [],
      featuredImage: generatedArticle.featuredImage || '',
      featuredImagePrompt: generatedArticle.featuredImagePrompt || '',
      ogTitle: generatedArticle.seo?.openGraph?.title || '',
      ogDescription: generatedArticle.seo?.openGraph?.description || '',
      twitterTitle: generatedArticle.seo?.twitterCard?.title || '',
      twitterDescription: generatedArticle.seo?.twitterCard?.description || '',
      faqs: article?.faq || [],
      internalLinks: generatedArticle.internalLinks || [],
      externalLinks: generatedArticle.externalLinks || [],
      schema: generatedArticle.schema || {},
      category: settings.category,
      tags: article?.tags || [],
      author: generatedArticle.author || 'STREAMB4 Editorial Team',
      seoScore: generatedArticle.scores?.seoScore || 0,
      readabilityScore: generatedArticle.scores?.readabilityScore || 0,
      keywordDensity: generatedArticle.scores?.keywordDensity || '',
      readingTime: generatedArticle.scores?.readingTime || 0,
      contentQuality: generatedArticle.scores?.contentQuality || settings.quality,
    }))

    router.push('/admin/posts/new?from=ai-writer')
  }

  // ── Publish directly ──────────────────────────────────────────────────────
  const publishDirectly = async () => {
    if (!generatedArticle) return
    const article = generatedArticle.article

    const postData = {
      id: Date.now().toString(),
      title: article?.h1 || settings.keyword.toUpperCase(),
      slug: generatedArticle.seo?.slug || settings.keyword.toLowerCase().replace(/\s+/g, '-'),
      content: buildMarkdown(),
      excerpt: article?.excerpt || '',
      seoTitle: generatedArticle.seo?.metaTitle || generatedArticle.seo?.seoTitle || '',
      metaDescription: generatedArticle.seo?.metaDescription || '',
      focusKeyword: generatedArticle.focusKeyword || settings.keyword,
      secondaryKeywords: generatedArticle.keywordResearch?.secondary || [],
      lsiKeywords: generatedArticle.keywordResearch?.lsi || [],
      featuredImage: generatedArticle.featuredImage || '',
      ogTitle: generatedArticle.seo?.openGraph?.title || '',
      ogDescription: generatedArticle.seo?.openGraph?.description || '',
      twitterTitle: generatedArticle.seo?.twitterCard?.title || '',
      twitterDescription: generatedArticle.seo?.twitterCard?.description || '',
      faqs: article?.faq || [],
      internalLinks: generatedArticle.internalLinks || [],
      externalLinks: generatedArticle.externalLinks || [],
      schema: generatedArticle.schema || {},
      category: settings.category,
      tags: article?.tags || [],
      status: 'published',
      author: generatedArticle.author || 'STREAMB4 Editorial Team',
      seoScore: generatedArticle.scores?.seoScore || 0,
      readabilityScore: generatedArticle.scores?.readabilityScore || 0,
      keywordDensity: generatedArticle.scores?.keywordDensity || '',
      readingTime: generatedArticle.scores?.readingTime || 0,
      views: 0,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })

    if (res.ok) {
      addToast('Published successfully!', 'success')
      router.push(`/blog/${postData.slug}`)
    } else {
      addToast('Publish failed', 'error')
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-0 -m-4 sm:-m-8">

      {/* ═══ TOP BAR ═══ */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 border-b"
        style={{
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255,255,255,0.06)'
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-[12px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,rgba(255,122,0,0.2),rgba(255,179,0,0.1))',
              border: '1px solid rgba(255,122,0,0.3)'
            }}
          >
            <span className="text-lg">✨</span>
          </div>
          <div>
            <h1
              className="font-anton text-xl text-white uppercase leading-tight"
              style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}
            >
              AI CONTENT WRITER
            </h1>
            <p className="text-gray-600 text-xs font-semibold">
              Enterprise SEO Article Generator
              {settings.quality === 'Enterprise' && (
                <span className="ml-2 text-orange-500">· ENTERPRISE MODE</span>
              )}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="hidden sm:flex items-center gap-3">
          {['Settings', 'Generating', 'Review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                  step === s.toLowerCase()
                    ? 'text-black'
                    : i < ['settings', 'generating', 'review'].indexOf(step)
                      ? 'text-green-500'
                      : 'text-gray-700'
                }`}
                style={
                  step === s.toLowerCase()
                    ? { background: 'linear-gradient(135deg,#ff7a00,#ffb300)' }
                    : i < ['settings', 'generating', 'review'].indexOf(step)
                      ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {i < ['settings', 'generating', 'review'].indexOf(step) ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-bold hidden md:block ${
                step === s.toLowerCase() ? 'text-white' : 'text-gray-600'
              }`}>
                {s}
              </span>
              {i < 2 && <div className="w-8 h-px bg-white/10 hidden md:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <AnimatePresence mode="wait">

          {/* ════════════════════════════════════════════
              STEP 1 — SETTINGS
          ════════════════════════════════════════════ */}
          {step === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

                {/* LEFT — Main inputs */}
                <div className="space-y-5">

                  {/* Keyword */}
                  <div
                    className="p-6 sm:p-8 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,122,0,0.15)',
                      boxShadow: '0 0 40px rgba(255,122,0,0.04)'
                    }}
                  >
                    <label className="text-white font-black text-xs uppercase tracking-[0.2em] block mb-4">
                      🎯 Main Target Keyword
                    </label>
                    <input
                      value={settings.keyword}
                      onChange={e => setSettings(s => ({ ...s, keyword: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                      placeholder="e.g. Best IPTV service for Firestick 2026"
                      autoFocus
                      className="w-full bg-transparent text-white font-black placeholder-gray-800 outline-none border-b pb-4 mb-2"
                      style={{
                        fontSize: 'clamp(1.2rem,3vw,1.75rem)',
                        borderColor: 'rgba(255,255,255,0.06)'
                      }}
                    />
                    <p className="text-gray-700 text-xs font-semibold">
                      Enter your primary SEO keyword. Be specific for better results.
                    </p>
                  </div>

                  {/* Secondary keywords */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <label className="text-white font-bold text-xs uppercase tracking-wider block mb-3">
                      Secondary Keywords
                    </label>
                    <input
                      value={settings.secondaryKeywords}
                      onChange={e => setSettings(s => ({ ...s, secondaryKeywords: e.target.value }))}
                      placeholder="iptv service, streaming app, firestick setup..."
                      className="w-full bg-transparent text-gray-300 text-sm outline-none border-b pb-3 placeholder-gray-700"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    />
                    <p className="text-gray-700 text-xs mt-2 font-semibold">Separate with commas</p>
                  </div>

                  {/* Article type */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <label className="text-white font-bold text-xs uppercase tracking-wider block mb-4">
                      Article Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {['Guide', 'Comparison', 'Review', 'Tutorial', 'Top List', 'How To'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSettings(s => ({ ...s, articleType: type }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 text-center cursor-pointer ${
                            settings.articleType === type
                              ? 'text-black font-black'
                              : 'text-gray-600 hover:text-white'
                          }`}
                          style={settings.articleType === type ? {
                            background: 'linear-gradient(135deg,#ff7a00,#ffb300)'
                          } : {
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)'
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Country + Language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <label className="text-white font-bold text-xs uppercase tracking-wider block mb-3">
                        Target Country
                      </label>
                      <select
                        value={settings.country}
                        onChange={e => setSettings(s => ({ ...s, country: e.target.value }))}
                        className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
                        style={{ background: 'transparent' }}
                      >
                        {['USA', 'UK', 'Canada', 'Australia', 'Global'].map(c => (
                          <option key={c} value={c} style={{ background: '#111' }}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <label className="text-white font-bold text-xs uppercase tracking-wider block mb-3">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}
                        className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
                        style={{ background: 'transparent' }}
                      >
                        {['English', 'French', 'Spanish', 'German'].map(l => (
                          <option key={l} value={l} style={{ background: '#111' }}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Quality & Settings */}
                <div className="space-y-5">

                  {/* ═══ CONTENT QUALITY SELECTOR ═══ */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,122,0,0.2)',
                      boxShadow: '0 0 30px rgba(255,122,0,0.04)'
                    }}
                  >
                    <label className="text-white font-black text-xs uppercase tracking-[0.2em] block mb-4">
                      Content Quality
                    </label>
                    <div className="space-y-2">
                      {QUALITY_TIERS.map(tier => (
                        <button
                          key={tier.id}
                          onClick={() => setSettings(s => ({
                            ...s,
                            quality: tier.id,
                            length: tier.length,
                            style: tier.id === 'Enterprise' ? 'Expert' : s.style
                          }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-left"
                          style={{
                            background: settings.quality === tier.id
                              ? `rgba(${tier.id === 'Enterprise' ? '255,122,0' : tier.id === 'Professional' ? '59,130,246' : '107,114,128'},0.08)`
                              : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${settings.quality === tier.id
                              ? `${tier.color}40`
                              : 'rgba(255,255,255,0.06)'}`
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0 transition-all"
                              style={{
                                background: settings.quality === tier.id ? tier.color : 'rgba(255,255,255,0.1)'
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p
                                  className="text-sm font-black uppercase tracking-wide"
                                  style={{
                                    color: settings.quality === tier.id ? tier.color : '#9ca3af'
                                  }}
                                >
                                  {tier.label}
                                </p>
                                {tier.isDefault && (
                                  <span
                                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                                    style={{
                                      background: 'rgba(255,122,0,0.15)',
                                      color: '#ff7a00',
                                      border: '1px solid rgba(255,122,0,0.3)'
                                    }}
                                  >
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-[11px] font-semibold">{tier.desc}</p>
                            </div>
                          </div>
                          <span
                            className="text-[11px] font-black uppercase tracking-wider flex-shrink-0"
                            style={{ color: settings.quality === tier.id ? tier.color : '#4b5563' }}
                          >
                            {tier.wordRange}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Enterprise badge */}
                    {settings.quality === 'Enterprise' && (
                      <div
                        className="mt-4 p-3 rounded-xl"
                        style={{
                          background: 'rgba(255,122,0,0.06)',
                          border: '1px solid rgba(255,122,0,0.15)'
                        }}
                      >
                        <p className="text-orange-500 text-[11px] font-black uppercase tracking-wider mb-1">
                          ⚡ Enterprise Mode Active
                        </p>
                        <p className="text-gray-600 text-[11px] leading-relaxed">
                          Generates 5,000–7,000 word authority articles with 15+ sections,
                          12+ FAQs, 4 comparison tables, troubleshooting guide, and full JSON-LD schema.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Writing Style */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <label className="text-white font-bold text-xs uppercase tracking-wider block mb-3">
                      Writing Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Professional', 'Friendly', 'Expert', 'Technical'].map(s => (
                        <button
                          key={s}
                          onClick={() => setSettings(prev => ({ ...prev, style: s }))}
                          className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                            settings.style === s ? 'text-black font-black' : 'text-gray-600 hover:text-white'
                          }`}
                          style={settings.style === s ? {
                            background: 'linear-gradient(135deg,#ff7a00,#ffb300)'
                          } : {
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)'
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate button */}
                  <motion.button
                    onClick={handleGenerate}
                    disabled={!settings.keyword.trim()}
                    whileHover={settings.keyword ? { scale: 1.02, y: -2 } : {}}
                    whileTap={settings.keyword ? { scale: 0.98 } : {}}
                    className="w-full py-4 mt-4 rounded-[20px] font-black text-lg uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                    style={settings.keyword ? {
                      background: 'linear-gradient(135deg,#ff7a00,#ffb300)',
                      color: '#000',
                      boxShadow: '0 0 50px rgba(255,122,0,0.4)'
                    } : {
                      background: 'rgba(255,255,255,0.05)',
                      color: '#333'
                    }}
                  >
                    ⚡ GENERATE {settings.quality.toUpperCase()} ARTICLE
                  </motion.button>

                  {/* Estimated output */}
                  {settings.keyword && (
                    <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-600 font-semibold">
                      <span>~{activeQuality.wordRange}</span>
                      <span>·</span>
                      <span>{settings.quality === 'Enterprise' ? '12-15 FAQs' : settings.quality === 'Professional' ? '8-10 FAQs' : '5-6 FAQs'}</span>
                      <span>·</span>
                      <span>{settings.quality === 'Enterprise' ? '10-15 int. links' : '4-6 int. links'}</span>
                      <span>·</span>
                      <span>Full JSON-LD schema</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════
              STEP 2 — GENERATING
          ════════════════════════════════════════════ */}
          {step === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto py-16"
            >
              {/* Animated loader */}
              <div className="flex justify-center mb-12">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full"
                    style={{
                      background: 'radial-gradient(circle,rgba(255,122,0,0.4),transparent 70%)',
                      filter: 'blur(20px)'
                    }}
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className="w-20 h-20 rounded-full"
                      style={{
                        background: 'conic-gradient(#ff7a00, #ffb300, transparent)',
                        maskImage: 'radial-gradient(circle, transparent 35px, black 36px)',
                        WebkitMaskImage: 'radial-gradient(circle, transparent 35px, black 36px)'
                      }}
                    />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">✨</span>
                  </div>
                </div>
              </div>

              <h2
                className="font-anton text-3xl text-white text-center uppercase mb-1"
                style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}
              >
                GENERATING {settings.quality.toUpperCase()} ARTICLE
              </h2>
              <p className="text-gray-600 text-center text-sm mb-2">"{settings.keyword}"</p>
              <p className="text-orange-500/60 text-center text-xs font-semibold mb-10">
                Target: {activeQuality.wordRange}
              </p>

              {/* Progress steps */}
              <div className="space-y-3">
                {GENERATION_STEPS.slice(0, progress.length + 1).map((s, i) => {
                  const isDone = progress.includes(i)
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-3 rounded-xl"
                      style={isDone ? {
                        background: 'rgba(255,122,0,0.04)',
                        border: '1px solid rgba(255,122,0,0.1)'
                      } : {}}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm transition-all duration-300 ${
                          isDone
                            ? 'bg-green-500 text-white'
                            : 'border-2 border-orange-500 animate-pulse text-orange-500'
                        }`}
                      >
                        {isDone ? '✓' : s.icon}
                      </div>
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          isDone ? 'text-gray-200' : 'text-orange-400 font-medium'
                        }`}
                      >
                        {s.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════
              STEP 3 — REVIEW
          ════════════════════════════════════════════ */}
          {step === 'review' && generatedArticle && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >

              {/* ─── Quality Gate Banner ──────────────────────────────── */}
              {settings.quality === 'Enterprise' && !meetsQualityGate && (
                <div
                  className="p-4 rounded-[16px] flex items-start gap-3"
                  style={{
                    background: 'rgba(234,179,8,0.06)',
                    border: '1px solid rgba(234,179,8,0.2)'
                  }}
                >
                  <span className="text-yellow-500 text-lg flex-shrink-0">⚠️</span>
                  <div>
                    <p className="text-yellow-500 font-black text-xs uppercase tracking-wider mb-1">
                      Enterprise Quality Gate
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      This article has {wordCount.toLocaleString()} words. Enterprise mode requires
                      5,000+ words for publication. Use the <strong className="text-white">Expand</strong> buttons
                      on each section to increase word count, or regenerate the article.
                    </p>
                  </div>
                </div>
              )}

              {/* ─── Scores Dashboard ─────────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { label: 'SEO Score',     value: generatedArticle.scores?.seoScore || 0,          suffix: '/100',  color: '#22c55e' },
                  { label: 'Readability',   value: generatedArticle.scores?.readabilityScore || 0,  suffix: '/100',  color: '#3b82f6' },
                  { label: 'EEAT Score',    value: generatedArticle.scores?.eeatScore || 0,         suffix: '/100',  color: '#a855f7' },
                  { label: 'Uniqueness',    value: generatedArticle.scores?.uniquenessScore || 0,   suffix: '%',     color: '#22c55e' },
                  { label: 'Word Count',    value: (generatedArticle.scores?.wordCount || 0).toLocaleString(), suffix: '', color: '#ff7a00' },
                  { label: 'Read Time',     value: generatedArticle.scores?.readingTime || 0,       suffix: ' min',  color: '#ff7a00' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="p-4 rounded-[16px] text-center"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: `1px solid ${s.color}20`
                    }}
                  >
                    <p
                      className="font-anton text-2xl"
                      style={{ color: s.color, fontFamily: 'var(--font-anton), Anton, sans-serif' }}
                    >
                      {s.value}{s.suffix}
                    </p>
                    <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-wider font-semibold">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Extended score row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: 'FAQ Items',      value: generatedArticle.article?.faq?.length || generatedArticle.scores?.faqCount || 0,            suffix: '',    color: '#ffb300' },
                  { label: 'Int. Links',     value: generatedArticle.scores?.internalLinks || (generatedArticle.internalLinks || []).length,    suffix: '',    color: '#22c55e' },
                  { label: 'Ext. Links',     value: generatedArticle.scores?.externalLinks || (generatedArticle.externalLinks || []).length,    suffix: '',    color: '#6b7280' },
                  { label: 'Kw. Density',    value: generatedArticle.scores?.keywordDensity || '—',                                           suffix: '',    color: '#3b82f6' },
                  { label: 'Images',         value: generatedArticle.scores?.imageCount || (generatedArticle.imagePrompts || []).length || 0, suffix: '',    color: '#ec4899' },
                  { label: 'Schema Valid',   value: generatedArticle.scores?.schemaValid ? '✓' : '—',                                        suffix: '',    color: '#22c55e' },
                  { label: 'Quality',        value: generatedArticle.scores?.contentQuality || settings.quality,                              suffix: '',    color: '#ff7a00' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="p-3 rounded-[14px] text-center"
                    style={{
                      background: 'rgba(15,15,15,0.8)',
                      border: `1px solid ${s.color}15`
                    }}
                  >
                    <p
                      className="font-bold text-lg leading-none"
                      style={{ color: s.color }}
                    >
                      {s.value}{s.suffix}
                    </p>
                    <p className="text-gray-700 text-[9px] mt-1 uppercase tracking-wider font-semibold">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ─── Review Grid ──────────────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

                {/* LEFT — Article outline */}
                <div className="space-y-6">

                  {/* H1 Title */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <h3 className="text-orange-500 text-xs font-black tracking-widest uppercase mb-2">
                      H1 ARTICLE TITLE
                    </h3>
                    <h2 className="text-white text-xl sm:text-2xl font-black">
                      {generatedArticle.article?.h1}
                    </h2>
                  </div>

                  {/* Executive Summary */}
                  {generatedArticle.article?.executiveSummary?.keyTakeaways?.length > 0 && (
                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,122,0,0.1)'
                      }}
                    >
                      <h3 className="text-orange-500 text-xs font-black tracking-widest uppercase mb-3">
                        EXECUTIVE SUMMARY
                      </h3>
                      <ul className="space-y-2">
                        {generatedArticle.article.executiveSummary.keyTakeaways.map(
                          (t: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                              <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                              {t}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Introduction */}
                  <div
                    className="p-6 rounded-[24px] relative"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-orange-500 text-xs font-black tracking-widest uppercase">
                        HERO INTRODUCTION
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(
                            'rewrite',
                            'heroIntroduction',
                            generatedArticle.article?.heroIntroduction || generatedArticle.article?.introduction || ''
                          )}
                          disabled={activeSectionAction !== null}
                          className="text-[10px] bg-white/[0.03] hover:bg-orange-500/20 border border-white/[0.06] text-gray-400 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          Rewrite
                        </button>
                        <button
                          onClick={() => handleAction(
                            'expand',
                            'heroIntroduction',
                            generatedArticle.article?.heroIntroduction || generatedArticle.article?.introduction || ''
                          )}
                          disabled={activeSectionAction !== null}
                          className="text-[10px] bg-white/[0.03] hover:bg-orange-500/20 border border-white/[0.06] text-gray-400 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          Expand
                        </button>
                      </div>
                    </div>
                    {activeSectionAction === 'heroIntroduction' ? (
                      <p className="text-orange-400 text-sm animate-pulse">AI is transforming section...</p>
                    ) : (
                      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                        {generatedArticle.article?.heroIntroduction || generatedArticle.article?.introduction}
                      </p>
                    )}
                  </div>

                  {/* Sections */}
                  {generatedArticle.article?.sections?.map((section: any) => (
                    <div
                      key={section.id}
                      className="p-6 rounded-[24px] relative"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-orange-500 text-xs font-black tracking-widest uppercase truncate pr-4">
                          {section.h2}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleAction('rewrite', section.id, section.content)}
                            disabled={activeSectionAction !== null}
                            className="text-[10px] bg-white/[0.03] hover:bg-orange-500/20 border border-white/[0.06] text-gray-400 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Rewrite
                          </button>
                          <button
                            onClick={() => handleAction('expand', section.id, section.content)}
                            disabled={activeSectionAction !== null}
                            className="text-[10px] bg-white/[0.03] hover:bg-orange-500/20 border border-white/[0.06] text-gray-400 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Expand
                          </button>
                        </div>
                      </div>

                      {activeSectionAction === section.id ? (
                        <p className="text-orange-400 text-sm animate-pulse">AI is transforming section...</p>
                      ) : (
                        <>
                          <p className="text-gray-400 text-sm leading-relaxed mb-4">{section.content}</p>

                          {section.bulletList?.length > 0 && (
                            <ul className="space-y-1 mb-4">
                              {section.bulletList.map((b: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-gray-500 text-xs">
                                  <span className="text-orange-500 flex-shrink-0">•</span>{b}
                                </li>
                              ))}
                            </ul>
                          )}

                          {section.numberedList?.length > 0 && (
                            <ol className="space-y-1 mb-4 list-decimal list-inside">
                              {section.numberedList.map((n: string, i: number) => (
                                <li key={i} className="text-gray-500 text-xs">{n}</li>
                              ))}
                            </ol>
                          )}

                          {section.callout && (
                            <div
                              className="p-4 rounded-xl mb-4"
                              style={{
                                background: 'rgba(255,122,0,0.05)',
                                border: '1px solid rgba(255,122,0,0.1)'
                              }}
                            >
                              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">
                                {section.callout.type?.replace('_', ' ').toUpperCase()}: {section.callout.title}
                              </span>
                              <p className="text-gray-400 text-xs leading-relaxed">
                                {section.callout.content}
                              </p>
                            </div>
                          )}

                          {section.imagePrompt && (
                            <div
                              className="p-3 rounded-xl"
                              style={{
                                background: 'rgba(236,72,153,0.04)',
                                border: '1px solid rgba(236,72,153,0.1)'
                              }}
                            >
                              <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-1">
                                📷 IMAGE PLACEHOLDER
                              </span>
                              <p className="text-gray-500 text-[11px]">
                                <strong className="text-gray-400">ALT:</strong> {section.imagePrompt.alt}
                              </p>
                              {section.imagePrompt.filename && (
                                <p className="text-gray-600 text-[10px] mt-0.5">
                                  File: {section.imagePrompt.filename}
                                </p>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  {/* Troubleshooting preview */}
                  {generatedArticle.article?.troubleshootingGuide?.problems?.length > 0 && (
                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <h3 className="text-orange-500 text-xs font-black tracking-widest uppercase mb-3">
                        TROUBLESHOOTING GUIDE ({generatedArticle.article.troubleshootingGuide.problems.length} Issues)
                      </h3>
                      <div className="space-y-3">
                        {generatedArticle.article.troubleshootingGuide.problems.map(
                          (p: any, i: number) => (
                            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                              <p className="text-white text-xs font-bold mb-1">{p.problem}</p>
                              <p className="text-gray-600 text-[11px]">{p.cause}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* FAQ preview */}
                  {generatedArticle.article?.faq?.length > 0 && (
                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <h3 className="text-orange-500 text-xs font-black tracking-widest uppercase mb-3">
                        FAQ — {generatedArticle.article.faq.length} ITEMS
                      </h3>
                      <div className="space-y-3">
                        {generatedArticle.article.faq.slice(0, 6).map((f: any, i: number) => (
                          <div key={i} className="border-b border-white/[0.04] pb-3 last:border-0 last:pb-0">
                            <p className="text-white text-xs font-bold mb-1">{f.question}</p>
                            <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{f.answer}</p>
                          </div>
                        ))}
                        {generatedArticle.article.faq.length > 6 && (
                          <p className="text-gray-600 text-xs text-center">
                            + {generatedArticle.article.faq.length - 6} more FAQ items in the full editor
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT — Sidebar */}
                <div className="space-y-6">

                  {/* Publishing actions */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <h3 className="text-white font-bold text-sm uppercase mb-4">Publishing Actions</h3>
                    <div className="space-y-3">
                      {/* ─── PUBLISH EVERYWHERE ─── */}
                      <button
                        onClick={openInPublishingCenter}
                        disabled={!meetsQualityGate}
                        title={!meetsQualityGate ? 'Article must reach 5,000+ words for Enterprise publishing' : 'Send to Publishing Center'}
                        className="w-full py-3.5 rounded-xl font-black text-xs uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        style={meetsQualityGate ? {
                          background: 'linear-gradient(135deg,#6d28d9,#a855f7)',
                          color: '#fff',
                          boxShadow: '0 0 24px rgba(168,85,247,0.35)',
                        } : {
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#555',
                        }}
                      >
                        🌐 Publish Everywhere
                      </button>
                      <button
                        onClick={openInEditor}
                        className="w-full py-3.5 rounded-xl text-black font-black text-xs uppercase cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #ff7a00, #ffb300)' }}
                      >
                        Open In Full Editor ✏️
                      </button>
                      <button
                        onClick={publishDirectly}
                        disabled={!meetsQualityGate}
                        title={
                          !meetsQualityGate
                            ? 'Article must reach 5,000+ words for Enterprise publishing'
                            : 'Publish article directly'
                        }
                        className="w-full py-3.5 rounded-xl text-white font-black text-xs uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        {meetsQualityGate
                          ? 'Publish Directly ⚡'
                          : `⚠️ ${wordCount.toLocaleString()} / 5,000 words`}
                      </button>
                      <button
                        onClick={() => setStep('settings')}
                        className="w-full py-3.5 rounded-xl text-gray-500 hover:text-white font-black text-xs uppercase cursor-pointer transition-colors"
                      >
                        Discard & Restart
                      </button>
                    </div>
                  </div>

                  {/* Featured image */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <h3 className="text-white font-bold text-sm uppercase mb-3">Featured Image</h3>
                    {generatedArticle.featuredImage && (
                      <div className="rounded-xl overflow-hidden aspect-video mb-4">
                        <img
                          src={generatedArticle.featuredImage}
                          alt="Featured"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <button
                      onClick={generateImage}
                      disabled={generatingImage}
                      className="w-full py-2.5 rounded-xl text-gray-400 hover:text-white font-bold text-xs uppercase border border-white/[0.08] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      {generatingImage ? 'Regenerating...' : 'Regenerate Image 🎨'}
                    </button>
                  </div>

                  {/* SEO Details */}
                  <div
                    className="p-6 rounded-[24px]"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <h3 className="text-white font-bold text-sm uppercase mb-4">SEO Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">
                          SEO Title
                        </span>
                        <p className="text-white text-xs leading-normal font-semibold mt-1">
                          {generatedArticle.seo?.metaTitle || generatedArticle.seo?.seoTitle}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">
                          Meta Description
                        </span>
                        <p className="text-white text-xs leading-normal font-semibold mt-1">
                          {generatedArticle.seo?.metaDescription}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">
                          Slug
                        </span>
                        <p className="text-orange-500 text-xs font-semibold mt-1">
                          /{generatedArticle.seo?.slug}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">
                          Focus Keyword
                        </span>
                        <p className="text-white text-xs font-semibold mt-1">
                          {generatedArticle.focusKeyword || generatedArticle.seo?.focusKeyword}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">
                          OG Title
                        </span>
                        <p className="text-gray-300 text-xs font-semibold mt-1">
                          {generatedArticle.seo?.openGraph?.title}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">
                          Twitter Title
                        </span>
                        <p className="text-gray-300 text-xs font-semibold mt-1">
                          {generatedArticle.seo?.twitterCard?.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Keyword Research */}
                  {generatedArticle.keywordResearch && (
                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <h3 className="text-white font-bold text-sm uppercase mb-4">Keyword Research</h3>
                      <div className="space-y-3">
                        {generatedArticle.keywordResearch.secondary?.length > 0 && (
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block mb-1.5">
                              Secondary Keywords
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {generatedArticle.keywordResearch.secondary.slice(0, 6).map(
                                (kw: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-2 py-1 rounded-lg font-semibold"
                                    style={{
                                      background: 'rgba(255,255,255,0.04)',
                                      color: '#9ca3af',
                                      border: '1px solid rgba(255,255,255,0.06)'
                                    }}
                                  >
                                    {kw}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {generatedArticle.keywordResearch.lsi?.length > 0 && (
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block mb-1.5">
                              LSI Keywords
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {generatedArticle.keywordResearch.lsi.slice(0, 5).map(
                                (kw: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-2 py-1 rounded-lg font-semibold"
                                    style={{
                                      background: 'rgba(59,130,246,0.05)',
                                      color: '#6b7280',
                                      border: '1px solid rgba(59,130,246,0.1)'
                                    }}
                                  >
                                    {kw}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {generatedArticle.keywordResearch.longTail?.length > 0 && (
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block mb-1.5">
                              Long-Tail Keywords
                            </span>
                            <div className="space-y-1">
                              {generatedArticle.keywordResearch.longTail.slice(0, 4).map(
                                (kw: string, i: number) => (
                                  <p key={i} className="text-gray-600 text-[11px]">• {kw}</p>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Internal Links */}
                  {generatedArticle.internalLinks?.length > 0 && (
                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <h3 className="text-white font-bold text-sm uppercase mb-4">
                        Internal Links ({generatedArticle.internalLinks.length})
                      </h3>
                      <div className="space-y-2">
                        {generatedArticle.internalLinks.slice(0, 8).map(
                          (link: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 p-2 rounded-lg"
                              style={{ background: 'rgba(255,255,255,0.02)' }}
                            >
                              <span className="text-orange-500 text-xs flex-shrink-0 mt-0.5">→</span>
                              <div className="min-w-0">
                                <p className="text-white text-[11px] font-semibold truncate">
                                  {link.anchor}
                                </p>
                                <p className="text-orange-500/70 text-[10px]">{link.url}</p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Schema validation */}
                  {generatedArticle.schema && (
                    <div
                      className="p-6 rounded-[24px]"
                      style={{
                        background: 'rgba(15,15,15,0.95)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <h3 className="text-white font-bold text-sm uppercase mb-3">Schema Generated</h3>
                      <div className="space-y-2">
                        {[
                          { key: 'blogPosting', label: 'BlogPosting', fallback: 'article' },
                          { key: 'faq', label: 'FAQPage', fallback: 'faq' },
                          { key: 'breadcrumb', label: 'BreadcrumbList', fallback: 'breadcrumb' },
                          { key: 'organization', label: 'Organization', fallback: null },
                        ].map(({ key, label, fallback }) => {
                          const exists = !!(
                            generatedArticle.schema[key] ||
                            (fallback && generatedArticle.schema[fallback])
                          )
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <span className={`text-xs ${exists ? 'text-green-500' : 'text-gray-600'}`}>
                                {exists ? '✓' : '○'}
                              </span>
                              <span className={`text-xs font-semibold ${exists ? 'text-gray-300' : 'text-gray-600'}`}>
                                {label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
