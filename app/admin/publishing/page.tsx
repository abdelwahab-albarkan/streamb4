'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

type PlatformKey = 'website' | 'blogger' | 'devto'
type PubStatus   = 'idle' | 'publishing' | 'success' | 'error'
type TabKey      = 'publish' | 'analytics' | 'queue' | 'history'

interface PlatformState {
  enabled: boolean
  status:  PubStatus
  url?:    string
  error?:  string
}

interface PublishLog {
  timestamp: string
  platform:  string
  status:    'success' | 'error'
  article:   string
  message:   string
  url?:      string
}

interface SEOCheck {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  blocking: boolean
}

interface FinalReport {
  articleTitle: string
  canonicalUrl: string
  publishedAt: string
  platforms: { name: string; success: boolean; url?: string; error?: string; durationMs: number }[]
  totalDurationMs: number
  successCount: number
  failCount: number
  seoScore: number
  seoWarnings: string[]
  internalLinksAdded: number
  externalLinksAdded: number
  indexing: { sitemapPinged: boolean; indexNow: boolean; rssRefreshed: boolean }
}

interface AnalyticsData {
  total: number
  today: number
  todaySuccess: number
  todayFailed: number
  successRate: number
  avgDurationMs: number
  byPlatform: { website: number; blogger: number; devto: number }
  last7: { date: string; total: number; success: number; failed: number }[]
  failed: number
}

interface QueueItem {
  id: string
  article: any
  platforms: string[]
  scheduledAt?: string
  addedAt: string
  status: string
  result?: any
}

interface VersionItem {
  id: string
  articleSlug: string
  articleTitle: string
  publishedTo: string[]
  savedAt: string
  snapshot: any
}

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<PlatformKey, {
  label: string
  icon:  string
  desc:  string
  info:  string
  color: string
  gradFrom: string
}> = {
  website: {
    label:    'STREAMB4 Website',
    icon:     '🌐',
    desc:     'Your primary Next.js blog',
    info:     'Full article · All SEO metadata · Schema markup',
    color:    '#ff7a00',
    gradFrom: '255,122,0',
  },
  blogger: {
    label:    'Google Blogger',
    icon:     '📝',
    desc:     'Cross-post to reach more readers',
    info:     'HTML content · Labels · Canonical URL → STREAMB4',
    color:    '#f97316',
    gradFrom: '249,115,22',
  },
  devto: {
    label:    'DEV.to',
    icon:     '💻',
    desc:     'Reach the developer community',
    info:     'Markdown · Up to 4 tags · canonical_url → STREAMB4',
    color:    '#818cf8',
    gradFrom: '129,140,248',
  },
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PubStatus }) {
  if (status === 'idle')       return null
  if (status === 'publishing') return (
    <span className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin block" />
  )
  if (status === 'success')    return <span className="text-green-400 text-base font-black">✓</span>
  return <span className="text-red-400 text-base font-black">✗</span>
}

// ─── SEO Check Icon ───────────────────────────────────────────────────────────

function SEOIcon({ status }: { status: 'pass' | 'warn' | 'fail' }) {
  if (status === 'pass') return <span className="text-green-400 font-black text-sm">✓</span>
  if (status === 'warn') return <span className="text-yellow-400 font-black text-sm">⚠</span>
  return <span className="text-red-400 font-black text-sm">✗</span>
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}
      className="text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors"
      style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: copied ? '#4ade80' : '#aaa', border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}` }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PublishingCenter() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://streamb4.com'

  const [activeTab, setActiveTab] = useState<TabKey>('publish')
  const [article, setArticle] = useState<any>(null)
  const [platforms, setPlatforms] = useState<Record<PlatformKey, PlatformState>>({
    website: { enabled: true,  status: 'idle' },
    blogger: { enabled: true,  status: 'idle' },
    devto:   { enabled: true,  status: 'idle' },
  })
  const [logs, setLogs]         = useState<PublishLog[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastCanonical, setLastCanonical] = useState('')

  // SEO / duplicate state
  const [seoChecks, setSeoChecks] = useState<SEOCheck[]>([])
  const [seoValidating, setSeoValidating] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<{ isDuplicate: boolean; similar: { title: string; slug: string; score: number }[] } | null>(null)
  const [dismissDuplicate, setDismissDuplicate] = useState(false)
  const [skipValidation, setSkipValidation] = useState(false)

  // Schedule
  const [scheduleAt, setScheduleAt] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)

  // Final report
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null)
  const [socialContent, setSocialContent] = useState<Record<string, string> | null>(null)
  const [showReport, setShowReport] = useState(false)

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // Queue
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [queueLoading, setQueueLoading] = useState(false)
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)

  // History
  const [versions, setVersions] = useState<VersionItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // ── Load article + logs on mount ──────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem('publishing_center_article')
      if (stored) setArticle(JSON.parse(stored))
    } catch {}
    fetchLogs()
  }, [])

  // Auto-validate SEO when article changes
  useEffect(() => {
    if (article) {
      validateArticle(article)
    } else {
      setSeoChecks([])
      setDuplicateWarning(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article])

  // Load tab data
  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics()
    if (activeTab === 'queue')     fetchQueue()
    if (activeTab === 'history')   fetchHistory()
  }, [activeTab])

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/publish')
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
      }
    } catch {}
  }, [])

  const validateArticle = async (art: any) => {
    setSeoValidating(true)
    try {
      const res = await fetch('/api/admin/publish/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: art }),
      })
      if (res.ok) {
        const data = await res.json()
        setSeoChecks(data.seoChecks || [])
        setDuplicateWarning(data.duplicateWarning || null)
      }
    } catch {}
    setSeoValidating(false)
  }

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch('/api/admin/publish/analytics')
      if (res.ok) setAnalytics(await res.json())
    } catch {}
    setAnalyticsLoading(false)
  }

  const fetchQueue = async () => {
    setQueueLoading(true)
    try {
      const res = await fetch('/api/admin/publish/queue')
      if (res.ok) { const d = await res.json(); setQueue(d.queue || []) }
    } catch {}
    setQueueLoading(false)
  }

  const fetchHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/admin/publish/versions')
      if (res.ok) { const d = await res.json(); setVersions(d.versions || []) }
    } catch {}
    setHistoryLoading(false)
  }

  // ── Core publish logic ────────────────────────────────────────────────────
  const runPublish = async (platformKeys: PlatformKey[], overrideSkip?: boolean) => {
    if (!article || !platformKeys.length || isPublishing) return

    setIsPublishing(true)
    setShowReport(false)

    setPlatforms(prev => {
      const next = { ...prev }
      platformKeys.forEach(k => { next[k] = { ...next[k], status: 'publishing' } })
      return next
    })

    try {
      const res = await fetch('/api/admin/publish', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ article, platforms: platformKeys, skipValidation: overrideSkip ?? skipValidation }),
      })

      const data = await res.json()

      if (res.status === 422) {
        // SEO blocking failure
        setSeoChecks(data.seoChecks || [])
        setPlatforms(prev => {
          const next = { ...prev }
          platformKeys.forEach(k => { next[k] = { ...next[k], status: 'idle' } })
          return next
        })
        setIsPublishing(false)
        return
      }

      if (data.canonicalUrl) setLastCanonical(data.canonicalUrl)
      setLogs(data.logs || [])
      if (data.finalReport) { setFinalReport(data.finalReport); setShowReport(true) }
      if (data.socialContent) setSocialContent(data.socialContent)
      if (data.seoChecks) setSeoChecks(data.seoChecks)
      if (data.duplicateWarning) setDuplicateWarning(data.duplicateWarning)

      setPlatforms(prev => {
        const next = { ...prev }
        platformKeys.forEach(k => {
          const r = data.results?.[k]
          if (r?.success) {
            next[k] = { ...next[k], status: 'success', url: r.url, error: undefined }
          } else {
            next[k] = { ...next[k], status: 'error', error: r?.error || 'Unknown error', url: undefined }
          }
        })
        return next
      })
    } catch (err: any) {
      setPlatforms(prev => {
        const next = { ...prev }
        platformKeys.forEach(k => {
          next[k] = { ...next[k], status: 'error', error: err?.message || 'Network error' }
        })
        return next
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePublishEverywhere = () => runPublish(['website', 'blogger', 'devto'])
  const handlePublishSelected = () => {
    const selected = (Object.keys(platforms) as PlatformKey[]).filter(k => platforms[k].enabled)
    runPublish(selected)
  }
  const handleRetry = (k: PlatformKey) => runPublish([k])

  const handleSchedule = async () => {
    if (!article || !scheduleAt) return
    setIsScheduling(true)
    try {
      const selected = (Object.keys(platforms) as PlatformKey[]).filter(k => platforms[k].enabled)
      const res = await fetch('/api/admin/publish/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, platforms: selected.length ? selected : ['website', 'blogger', 'devto'], scheduledAt: scheduleAt }),
      })
      if (res.ok) { alert('Scheduled successfully!'); setScheduleAt('') }
    } catch {}
    setIsScheduling(false)
  }

  const handleAddToQueue = async () => {
    if (!article) return
    try {
      const selected = (Object.keys(platforms) as PlatformKey[]).filter(k => platforms[k].enabled)
      await fetch('/api/admin/publish/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, platforms: selected.length ? selected : ['website', 'blogger', 'devto'] }),
      })
      fetchQueue()
    } catch {}
  }

  const handleProcessQueue = async () => {
    setIsProcessingQueue(true)
    try {
      await fetch('/api/admin/publish/queue', { method: 'PUT' })
      fetchQueue()
    } catch {}
    setIsProcessingQueue(false)
  }

  const handleRemoveFromQueue = async (id: string) => {
    try {
      await fetch(`/api/admin/publish/queue?id=${id}`, { method: 'DELETE' })
      setQueue(q => q.filter(i => i.id !== id))
    } catch {}
  }

  const handleDeleteVersion = async (id: string) => {
    try {
      await fetch(`/api/admin/publish/versions?id=${id}`, { method: 'DELETE' })
      setVersions(v => v.filter(i => i.id !== id))
    } catch {}
  }

  const handleRestoreVersion = (snapshot: any) => {
    setArticle(snapshot)
    try { localStorage.setItem('publishing_center_article', JSON.stringify(snapshot)) } catch {}
    setActiveTab('publish')
  }

  const blockingFailures = seoChecks.filter(c => c.status === 'fail' && c.blocking)
  const canPublish = article && !isPublishing && (skipValidation || blockingFailures.length === 0)
  const enabledCount = Object.values(platforms).filter(p => p.enabled).length
  const anyPublished = Object.values(platforms).some(p => p.status !== 'idle')
  const canonicalUrl = article ? `${SITE_URL}/blog/${article.slug}` : ''

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'publish',   label: 'Publish' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'queue',     label: 'Queue' },
    { key: 'history',   label: 'History' },
  ]

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-0 -m-4 sm:-m-8">

      {/* ═══ TOP BAR ═══ */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 border-b"
        style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-[12px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(255,122,0,0.2),rgba(255,179,0,0.1))', border: '1px solid rgba(255,122,0,0.3)' }}
          >
            <span className="text-lg">📡</span>
          </div>
          <div>
            <h1
              className="font-anton text-xl text-white uppercase leading-tight"
              style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}
            >
              PUBLISHING CENTER
            </h1>
            <p className="text-gray-600 text-xs font-semibold">Multi-Platform Content Distribution</p>
          </div>
        </div>

        <motion.button
          onClick={handlePublishEverywhere}
          disabled={!canPublish}
          whileHover={canPublish ? { scale: 1.02, y: -1 } : {}}
          whileTap={canPublish ? { scale: 0.98 } : {}}
          className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb300)', color: '#000', boxShadow: canPublish ? '0 0 30px rgba(255,122,0,0.35)' : 'none' }}
        >
          {isPublishing ? (
            <><span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" /> Publishing...</>
          ) : (
            <>🚀 Publish Everywhere</>
          )}
        </motion.button>
      </div>

      {/* ═══ TABS ═══ */}
      <div
        className="flex gap-1 px-4 sm:px-8 pt-4 pb-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all cursor-pointer"
            style={{
              color: activeTab === t.key ? '#ff7a00' : '#666',
              background: activeTab === t.key ? 'rgba(255,122,0,0.08)' : 'transparent',
              borderBottom: activeTab === t.key ? '2px solid #ff7a00' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="p-4 sm:p-8 space-y-6">

        {/* ══ PUBLISH TAB ══ */}
        {activeTab === 'publish' && (
          <>
            {/* Article card */}
            <AnimatePresence mode="wait">
              {article ? (
                <motion.div
                  key="article-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 sm:p-6 rounded-[24px] flex items-start gap-4"
                  style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,122,0,0.2)' }}
                >
                  {article.featuredImage && (
                    <img
                      src={article.featuredImage}
                      alt=""
                      className="w-20 h-14 sm:w-28 sm:h-18 object-cover rounded-xl flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-orange-500 font-black tracking-[0.2em] uppercase mb-1">
                      ✅ ARTICLE READY TO PUBLISH
                    </p>
                    <h2 className="text-white font-black text-base sm:text-lg leading-tight">{article.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-orange-500/70 text-[10px] font-semibold">
                        /blog/{article.slug}
                      </span>
                      {article.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-orange-500"
                          style={{ background: 'rgba(255,122,0,0.1)', border: '1px solid rgba(255,122,0,0.2)' }}>
                          {article.category}
                        </span>
                      )}
                      {(article.tags || []).slice(0, 4).map((t: string) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full text-gray-500"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                    {article.metaDescription && (
                      <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {article.metaDescription}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => { setArticle(null); localStorage.removeItem('publishing_center_article') }}
                    className="text-gray-700 hover:text-gray-400 text-base cursor-pointer flex-shrink-0 transition-colors"
                  >
                    ✕
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="no-article"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 rounded-[24px] text-center"
                  style={{ background: 'rgba(15,15,15,0.95)', border: '1px dashed rgba(255,255,255,0.08)' }}
                >
                  <p className="text-3xl mb-3">📝</p>
                  <p className="text-white font-bold text-sm mb-2">No Article Loaded</p>
                  <p className="text-gray-600 text-xs mb-5 max-w-xs mx-auto leading-relaxed">
                    Generate an article in the AI Writer, then click <strong className="text-orange-500">Publish Everywhere</strong> to load it here.
                  </p>
                  <Link
                    href="/admin/ai-writer"
                    className="text-orange-500 text-xs font-black hover:text-orange-400 transition-colors uppercase tracking-wider"
                  >
                    → Go to AI Writer
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Duplicate warning */}
            {!dismissDuplicate && duplicateWarning && duplicateWarning.similar.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-[16px] flex items-start gap-3"
                style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.3)' }}
              >
                <span className="text-yellow-400 text-lg flex-shrink-0">⚠</span>
                <div className="flex-1">
                  <p className="text-yellow-400 font-bold text-xs mb-1">
                    {duplicateWarning.isDuplicate ? 'Potential Duplicate Detected' : 'Similar Articles Found'}
                  </p>
                  <p className="text-yellow-300/60 text-[11px] mb-2">
                    These existing articles may overlap with your content:
                  </p>
                  <div className="space-y-1">
                    {duplicateWarning.similar.map(s => (
                      <div key={s.slug} className="flex items-center gap-2 text-[11px]">
                        <span className="text-yellow-500/60 font-bold">{s.score}%</span>
                        <a href={`/blog/${s.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-yellow-300/80 hover:text-yellow-300 underline underline-offset-2">
                          {s.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setDismissDuplicate(true)}
                  className="text-yellow-600 hover:text-yellow-400 text-base cursor-pointer flex-shrink-0"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* SEO Validation Panel */}
            {article && (
              <div
                className="p-5 rounded-[20px]"
                style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    🔍 SEO Validation
                    {seoValidating && <span className="w-3 h-3 rounded-full border border-orange-500 border-t-transparent animate-spin block" />}
                  </p>
                  {seoChecks.length > 0 && (
                    <span
                      className="text-[10px] font-black px-2 py-1 rounded-full"
                      style={{
                        background: blockingFailures.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.1)',
                        color: blockingFailures.length > 0 ? '#f87171' : '#4ade80',
                        border: `1px solid ${blockingFailures.length > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.2)'}`,
                      }}
                    >
                      {Math.round(seoChecks.filter(c => c.status === 'pass').length / seoChecks.length * 100)}% Score
                    </span>
                  )}
                </div>

                {seoChecks.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {seoChecks.map(check => (
                        <div
                          key={check.id}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg"
                          style={{
                            background: check.status === 'pass' ? 'rgba(34,197,94,0.04)' : check.status === 'warn' ? 'rgba(234,179,8,0.04)' : 'rgba(239,68,68,0.06)',
                            border: `1px solid ${check.status === 'pass' ? 'rgba(34,197,94,0.15)' : check.status === 'warn' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.25)'}`,
                          }}
                        >
                          <SEOIcon status={check.status} />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-300 text-[10px] font-bold">{check.label}</p>
                            <p className="text-gray-600 text-[10px] truncate">{check.message}</p>
                          </div>
                          {check.blocking && check.status === 'fail' && (
                            <span className="text-[9px] text-red-400 font-black bg-red-500/10 px-1.5 py-0.5 rounded flex-shrink-0">BLOCK</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {blockingFailures.length > 0 && (
                      <div
                        className="p-3 rounded-xl flex items-center justify-between gap-3"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        <p className="text-red-400 text-xs font-semibold">
                          {blockingFailures.length} blocking issue{blockingFailures.length > 1 ? 's' : ''} — fix before publishing or override below
                        </p>
                        <button
                          onClick={() => setSkipValidation(true)}
                          className="text-[10px] font-black text-red-300 border border-red-500/40 px-3 py-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer transition-colors flex-shrink-0"
                        >
                          Override &amp; Publish Anyway
                        </button>
                      </div>
                    )}
                    {skipValidation && blockingFailures.length > 0 && (
                      <p className="text-yellow-500 text-[10px] font-semibold mt-2">
                        ⚠ Validation override active — blocking checks will be skipped.{' '}
                        <button onClick={() => setSkipValidation(false)} className="underline cursor-pointer">Undo</button>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-700 text-xs text-center py-4">
                    {seoValidating ? 'Validating…' : 'Validation results will appear here'}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

              {/* LEFT — Platform selection + progress */}
              <div className="space-y-6">

                {/* Platform cards */}
                <div
                  className="p-6 rounded-[24px]"
                  style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5">
                    Select Platforms
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {(Object.keys(PLATFORM_CONFIG) as PlatformKey[]).map(key => {
                      const cfg    = PLATFORM_CONFIG[key]
                      const pState = platforms[key]
                      const isOn   = pState.enabled

                      return (
                        <button
                          key={key}
                          onClick={() => !isPublishing && setPlatforms(prev => ({
                            ...prev,
                            [key]: { ...prev[key], enabled: !prev[key].enabled }
                          }))}
                          disabled={isPublishing}
                          className="relative p-5 rounded-[18px] text-left transition-all duration-200 cursor-pointer"
                          style={{
                            background: isOn
                              ? `rgba(${cfg.gradFrom},0.07)`
                              : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isOn ? `${cfg.color}40` : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          <div className="absolute top-3 right-3">
                            <StatusBadge status={pState.status} />
                          </div>

                          <div className="flex items-center gap-2.5 mb-3">
                            <span className="text-xl">{cfg.icon}</span>
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center border-2 transition-all"
                              style={{
                                background:   isOn ? cfg.color : 'transparent',
                                borderColor:  isOn ? cfg.color : 'rgba(255,255,255,0.2)',
                              }}
                            >
                              {isOn && <span className="text-black text-[9px] font-black leading-none">✓</span>}
                            </div>
                          </div>

                          <p className="text-white font-bold text-sm leading-tight mb-0.5">{cfg.label}</p>
                          <p className="text-gray-500 text-[11px] mb-2">{cfg.desc}</p>
                          <p className="text-[10px] font-semibold" style={{ color: `${cfg.color}90` }}>{cfg.info}</p>

                          {pState.status === 'success' && pState.url && (
                            <a
                              href={pState.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="mt-2.5 text-[10px] text-green-400 hover:underline block truncate"
                            >
                              ✓ {pState.url}
                            </a>
                          )}

                          {pState.status === 'error' && (
                            <div className="mt-2.5" onClick={e => e.stopPropagation()}>
                              <p className="text-[10px] text-red-400 line-clamp-2 mb-1">{pState.error}</p>
                              <button
                                onClick={() => handleRetry(key)}
                                className="text-[10px] text-orange-500 hover:text-orange-300 font-black cursor-pointer transition-colors"
                              >
                                ↺ Retry
                              </button>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-3">
                    {/* Publish Now + Publish Selected */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <motion.button
                        onClick={handlePublishEverywhere}
                        disabled={!canPublish}
                        whileHover={canPublish ? { scale: 1.02 } : {}}
                        whileTap={canPublish ? { scale: 0.98 } : {}}
                        className="flex-1 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb300)', boxShadow: canPublish ? '0 0 30px rgba(255,122,0,0.3)' : 'none' }}
                      >
                        {isPublishing ? '⏳ Publishing...' : '🚀 Publish Everywhere'}
                      </motion.button>

                      <motion.button
                        onClick={handlePublishSelected}
                        disabled={!canPublish || enabledCount === 0}
                        whileHover={canPublish ? { scale: 1.02 } : {}}
                        whileTap={canPublish ? { scale: 0.98 } : {}}
                        className="sm:w-auto px-5 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        Publish Selected ({enabledCount})
                      </motion.button>
                    </div>

                    {/* Schedule + Add to Queue */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex flex-1 gap-2">
                        <input
                          type="datetime-local"
                          value={scheduleAt}
                          onChange={e => setScheduleAt(e.target.value)}
                          disabled={!article}
                          className="flex-1 px-3 py-3 rounded-xl text-xs text-white font-semibold disabled:opacity-30 outline-none"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <motion.button
                          onClick={handleSchedule}
                          disabled={!article || !scheduleAt || isScheduling}
                          whileHover={article && scheduleAt ? { scale: 1.02 } : {}}
                          className="px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                          style={{ background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)', color: '#818cf8' }}
                        >
                          {isScheduling ? '…' : '⏰ Schedule'}
                        </motion.button>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleAddToQueue}
                          disabled={!article}
                          whileHover={article ? { scale: 1.02 } : {}}
                          className="px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#888' }}
                        >
                          + Queue
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            if (!article) return
                            // Save as draft — set status to draft
                            const draft = { ...article, status: 'draft' }
                            setArticle(draft)
                            try { localStorage.setItem('publishing_center_article', JSON.stringify(draft)) } catch {}
                          }}
                          disabled={!article}
                          className="px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#888' }}
                        >
                          Save Draft
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publishing progress */}
                {anyPublished && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-[24px]"
                    style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
                      Publishing Progress
                    </h3>
                    <div className="space-y-3">
                      {(Object.keys(PLATFORM_CONFIG) as PlatformKey[]).map(key => {
                        const cfg    = PLATFORM_CONFIG[key]
                        const pState = platforms[key]
                        if (pState.status === 'idle') return null

                        const bgColor =
                          pState.status === 'success'    ? 'rgba(34,197,94,0.05)'    :
                          pState.status === 'error'      ? 'rgba(239,68,68,0.05)'    :
                          'rgba(255,122,0,0.05)'
                        const bdColor =
                          pState.status === 'success'    ? 'rgba(34,197,94,0.2)'     :
                          pState.status === 'error'      ? 'rgba(239,68,68,0.2)'     :
                          'rgba(255,122,0,0.2)'

                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3.5 rounded-xl"
                            style={{ background: bgColor, border: `1px solid ${bdColor}` }}
                          >
                            <span className="text-lg flex-shrink-0">{cfg.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-bold">{cfg.label}</p>
                              {pState.status === 'success' && pState.url && (
                                <a href={pState.url} target="_blank" rel="noopener noreferrer"
                                  className="text-green-400 text-[10px] hover:underline block truncate mt-0.5">
                                  {pState.url}
                                </a>
                              )}
                              {pState.status === 'error' && (
                                <p className="text-red-400 text-[10px] mt-0.5 line-clamp-2">{pState.error}</p>
                              )}
                              {pState.status === 'publishing' && (
                                <p className="text-orange-400 text-[10px] mt-0.5">Publishing in progress…</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <StatusBadge status={pState.status} />
                              {pState.status === 'error' && (
                                <button
                                  onClick={() => handleRetry(key)}
                                  className="text-[10px] text-orange-500 hover:text-orange-300 font-black cursor-pointer border border-orange-500/30 px-2 py-1 rounded-lg transition-colors"
                                >
                                  Retry
                                </button>
                              )}
                              {pState.status === 'success' && pState.url && (
                                <a
                                  href={pState.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-green-400/70 hover:text-green-400 border border-green-500/20 px-2 py-1 rounded-lg transition-colors"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Final Report */}
                {showReport && finalReport && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-[24px]"
                    style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                        <span className="text-green-400">✓</span> Publish Report
                      </h3>
                      <button onClick={() => setShowReport(false)} className="text-gray-600 hover:text-gray-400 cursor-pointer text-sm">✕</button>
                    </div>

                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { label: 'Published', value: `${finalReport.successCount}/${finalReport.platforms.length}`, color: '#4ade80' },
                          { label: 'SEO Score', value: `${finalReport.seoScore}%`, color: finalReport.seoScore >= 70 ? '#4ade80' : finalReport.seoScore >= 45 ? '#facc15' : '#f87171' },
                          { label: 'Links Added', value: `${finalReport.internalLinksAdded + finalReport.externalLinksAdded}`, color: '#ff7a00' },
                          { label: 'Duration', value: `${(finalReport.totalDurationMs / 1000).toFixed(1)}s`, color: '#818cf8' },
                        ].map(s => (
                          <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <p className="font-black text-lg" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-gray-600 text-[10px] font-semibold mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Canonical + indexing */}
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,122,0,0.05)', border: '1px solid rgba(255,122,0,0.15)' }}>
                        <p className="text-orange-500 text-[10px] font-black tracking-wider uppercase mb-1">🔗 Canonical URL</p>
                        <p className="text-white text-xs font-semibold break-all">{finalReport.canonicalUrl}</p>
                        <div className="flex gap-3 mt-2 flex-wrap">
                          <span className={`text-[10px] font-semibold ${finalReport.indexing.sitemapPinged ? 'text-green-400' : 'text-gray-600'}`}>
                            {finalReport.indexing.sitemapPinged ? '✓' : '○'} Sitemap pinged
                          </span>
                          <span className={`text-[10px] font-semibold ${finalReport.indexing.indexNow ? 'text-green-400' : 'text-gray-600'}`}>
                            {finalReport.indexing.indexNow ? '✓' : '○'} IndexNow
                          </span>
                          <span className={`text-[10px] font-semibold ${finalReport.indexing.rssRefreshed ? 'text-green-400' : 'text-gray-600'}`}>
                            {finalReport.indexing.rssRefreshed ? '✓' : '○'} RSS refreshed
                          </span>
                        </div>
                      </div>

                      {/* Per-platform results */}
                      <div className="space-y-2">
                        {finalReport.platforms.map(p => (
                          <div key={p.name} className="flex items-center gap-3 text-xs">
                            <span className={p.success ? 'text-green-400' : 'text-red-400'}>{p.success ? '✓' : '✗'}</span>
                            <span className="text-gray-400 font-bold uppercase text-[10px] w-16 flex-shrink-0">{p.name}</span>
                            {p.url ? (
                              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-orange-500/70 hover:text-orange-500 text-[10px] truncate flex-1">{p.url}</a>
                            ) : (
                              <span className="text-red-400/70 text-[10px] flex-1 truncate">{p.error}</span>
                            )}
                            <span className="text-gray-700 text-[10px] flex-shrink-0">{(p.durationMs / 1000).toFixed(1)}s</span>
                          </div>
                        ))}
                      </div>

                      {/* Social content */}
                      {socialContent && (
                        <div>
                          <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-2">📣 Social Content</p>
                          <div className="space-y-2">
                            {Object.entries(socialContent).map(([platform, text]) => (
                              <div key={platform} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">{platform}</span>
                                  <CopyButton text={text} />
                                </div>
                                <p className="text-gray-500 text-[10px] leading-relaxed whitespace-pre-wrap line-clamp-4">{text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* RIGHT — Info + logs */}
              <div className="space-y-5">

                {/* Canonical URL */}
                <div
                  className="p-5 rounded-[20px]"
                  style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,122,0,0.15)' }}
                >
                  <p className="text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                    🔗 Canonical URL
                  </p>
                  <p className="text-white text-xs font-semibold break-all leading-relaxed">
                    {canonicalUrl || <span className="text-gray-700">— load an article first —</span>}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-3 leading-relaxed">
                    Blogger and DEV.to will reference this URL as the canonical source.
                    No SEO duplication — Google always attributes traffic to STREAMB4.
                  </p>
                </div>

                {/* Platform format details */}
                <div
                  className="p-5 rounded-[20px]"
                  style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-white text-xs font-bold uppercase tracking-wider mb-4">What Gets Sent</p>
                  <div className="space-y-4">
                    {(Object.keys(PLATFORM_CONFIG) as PlatformKey[]).map(key => {
                      const cfg = PLATFORM_CONFIG[key]
                      return (
                        <div key={key}>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5"
                            style={{ color: cfg.color }}>
                            {cfg.icon} {cfg.label}
                          </p>
                          <p className="text-gray-600 text-[11px] leading-relaxed">{cfg.info}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Publishing logs */}
                <div
                  className="p-5 rounded-[20px]"
                  style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white text-xs font-bold uppercase tracking-wider">Publishing Logs</p>
                    <button
                      onClick={fetchLogs}
                      className="text-gray-600 hover:text-white text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      ↻ Refresh
                    </button>
                  </div>

                  {logs.length === 0 ? (
                    <p className="text-gray-700 text-xs text-center py-6">No publishing history yet</p>
                  ) : (
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {logs.map((log, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-[10px] p-2.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                          <span
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: log.status === 'success' ? '#4ade80' : '#f87171' }}
                          >
                            {log.status === 'success' ? '✓' : '✗'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                              {log.platform}
                            </p>
                            <p className="text-gray-500 leading-relaxed">{log.message}</p>
                            {log.url && (
                              <a
                                href={log.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500/60 hover:text-orange-500 truncate block mt-0.5 transition-colors"
                              >
                                {log.url}
                              </a>
                            )}
                            <p className="text-gray-700 mt-1">
                              {new Date(log.timestamp).toLocaleString('en-US', {
                                month:  'short',
                                day:    'numeric',
                                hour:   '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Last published dates */}
                {logs.length > 0 && (
                  <div
                    className="p-5 rounded-[20px]"
                    style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-white text-xs font-bold uppercase tracking-wider mb-4">Last Published</p>
                    <div className="space-y-3">
                      {(Object.keys(PLATFORM_CONFIG) as PlatformKey[]).map(key => {
                        const cfg        = PLATFORM_CONFIG[key]
                        const lastEntry  = logs.find(l => l.platform === key && l.status === 'success')
                        return (
                          <div key={key} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{cfg.icon}</span>
                              <span className="text-gray-500 text-[11px] font-semibold">{cfg.label}</span>
                            </div>
                            {lastEntry ? (
                              <span className="text-[10px] text-green-500 font-semibold">
                                {new Date(lastEntry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-700">—</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Publishing Analytics</h2>
              <button onClick={fetchAnalytics} className="text-gray-600 hover:text-white text-[10px] font-bold cursor-pointer transition-colors">↻ Refresh</button>
            </div>

            {analyticsLoading ? (
              <p className="text-gray-600 text-xs text-center py-12">Loading analytics…</p>
            ) : analytics ? (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Publications', value: analytics.total, color: '#ff7a00' },
                    { label: 'Today', value: analytics.today, color: '#4ade80' },
                    { label: 'Success Rate', value: `${analytics.successRate}%`, color: analytics.successRate >= 80 ? '#4ade80' : analytics.successRate >= 50 ? '#facc15' : '#f87171' },
                    { label: 'Avg Duration', value: `${(analytics.avgDurationMs / 1000).toFixed(1)}s`, color: '#818cf8' },
                  ].map(s => (
                    <div key={s.label} className="p-5 rounded-[20px] text-center" style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-gray-600 text-[10px] font-semibold mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* By platform */}
                <div className="p-5 rounded-[20px]" style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white text-xs font-bold uppercase tracking-wider mb-4">By Platform</p>
                  <div className="space-y-3">
                    {(Object.keys(analytics.byPlatform) as (keyof typeof analytics.byPlatform)[]).map(p => {
                      const cfg = PLATFORM_CONFIG[p as PlatformKey]
                      const count = analytics.byPlatform[p]
                      const max = Math.max(...Object.values(analytics.byPlatform), 1)
                      return (
                        <div key={p} className="flex items-center gap-3">
                          <span className="text-sm w-6 text-center">{cfg?.icon || '?'}</span>
                          <span className="text-gray-400 text-[10px] font-bold w-20 flex-shrink-0">{cfg?.label || p}</span>
                          <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{ width: `${(count / max) * 100}%`, background: cfg?.color || '#ff7a00' }}
                            />
                          </div>
                          <span className="text-gray-400 text-[10px] font-bold w-6 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Last 7 days bar chart */}
                <div className="p-5 rounded-[20px]" style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white text-xs font-bold uppercase tracking-wider mb-5">Last 7 Days</p>
                  <div className="flex items-end gap-2 h-24">
                    {analytics.last7.map(day => {
                      const max = Math.max(...analytics.last7.map(d => d.total), 1)
                      const heightPct = (day.total / max) * 100
                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-gray-600 text-[9px] font-bold">{day.total || ''}</span>
                          <div className="w-full rounded-t-md transition-all" style={{ height: `${Math.max(heightPct, 4)}%`, background: day.total > 0 ? '#ff7a00' : 'rgba(255,255,255,0.05)', minHeight: '4px' }} />
                          <span className="text-gray-700 text-[9px]">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Today breakdown */}
                {analytics.today > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Today Total', value: analytics.today, color: '#fff' },
                      { label: 'Today Success', value: analytics.todaySuccess, color: '#4ade80' },
                      { label: 'Today Failed', value: analytics.todayFailed, color: '#f87171' },
                    ].map(s => (
                      <div key={s.label} className="p-4 rounded-[16px] text-center" style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="font-black text-xl" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-gray-600 text-[9px] font-semibold mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-700 text-xs text-center py-12">No analytics data yet. Publish something first!</p>
            )}
          </div>
        )}

        {/* ══ QUEUE TAB ══ */}
        {activeTab === 'queue' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Publishing Queue</h2>
              <div className="flex gap-2">
                {article && (
                  <button
                    onClick={handleAddToQueue}
                    className="text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    style={{ background: 'rgba(255,122,0,0.1)', color: '#ff7a00', border: '1px solid rgba(255,122,0,0.3)' }}
                  >
                    + Add Current Article
                  </button>
                )}
                <button
                  onClick={handleProcessQueue}
                  disabled={isProcessingQueue || queue.filter(q => q.status === 'pending').length === 0}
                  className="text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  {isProcessingQueue ? '⏳ Processing…' : '▶ Process Next'}
                </button>
                <button onClick={fetchQueue} className="text-gray-600 hover:text-white text-[10px] font-bold cursor-pointer transition-colors">↻</button>
              </div>
            </div>

            {queueLoading ? (
              <p className="text-gray-600 text-xs text-center py-12">Loading queue…</p>
            ) : queue.length === 0 ? (
              <div className="p-10 rounded-[24px] text-center" style={{ background: 'rgba(15,15,15,0.95)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                <p className="text-2xl mb-3">📋</p>
                <p className="text-white font-bold text-sm mb-2">Queue is Empty</p>
                <p className="text-gray-600 text-xs">Add articles to the queue to publish them in order.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-[18px] flex items-center gap-4"
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: `1px solid ${item.status === 'done' ? 'rgba(34,197,94,0.2)' : item.status === 'failed' ? 'rgba(239,68,68,0.2)' : item.status === 'processing' ? 'rgba(255,122,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs truncate">{item.article?.title || 'Untitled'}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'done' ? 'text-green-400 bg-green-500/10' :
                          item.status === 'failed' ? 'text-red-400 bg-red-500/10' :
                          item.status === 'processing' ? 'text-orange-400 bg-orange-500/10' :
                          'text-gray-500 bg-white/5'
                        }`}>{item.status}</span>
                        <span className="text-gray-600 text-[10px]">{item.platforms?.join(', ')}</span>
                        {item.scheduledAt && (
                          <span className="text-purple-400 text-[10px]">⏰ {new Date(item.scheduledAt).toLocaleString()}</span>
                        )}
                      </div>
                      <p className="text-gray-700 text-[10px] mt-1">Added {new Date(item.addedAt).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromQueue(item.id)}
                      className="text-gray-700 hover:text-red-400 text-sm cursor-pointer transition-colors flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ HISTORY TAB ══ */}
        {activeTab === 'history' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Version History</h2>
              <button onClick={fetchHistory} className="text-gray-600 hover:text-white text-[10px] font-bold cursor-pointer transition-colors">↻ Refresh</button>
            </div>

            {historyLoading ? (
              <p className="text-gray-600 text-xs text-center py-12">Loading history…</p>
            ) : versions.length === 0 ? (
              <div className="p-10 rounded-[24px] text-center" style={{ background: 'rgba(15,15,15,0.95)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                <p className="text-2xl mb-3">🕐</p>
                <p className="text-white font-bold text-sm mb-2">No Versions Yet</p>
                <p className="text-gray-600 text-xs">Each publication saves a version snapshot here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map(v => (
                  <div
                    key={v.id}
                    className="p-4 rounded-[18px] flex items-center gap-4"
                    style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs truncate">{v.articleTitle || v.articleSlug}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-orange-500/60 text-[10px]">/blog/{v.articleSlug}</span>
                        <span className="text-gray-600 text-[10px]">{v.publishedTo?.join(', ')}</span>
                      </div>
                      <p className="text-gray-700 text-[10px] mt-1">
                        {new Date(v.savedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRestoreVersion(v.snapshot)}
                        className="text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                        style={{ background: 'rgba(255,122,0,0.1)', color: '#ff7a00', border: '1px solid rgba(255,122,0,0.3)' }}
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDeleteVersion(v.id)}
                        className="text-gray-700 hover:text-red-400 text-sm cursor-pointer transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
