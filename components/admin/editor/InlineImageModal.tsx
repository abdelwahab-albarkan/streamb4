'use client'

/**
 * InlineImageModal — Full inline image insertion / editing system
 *
 * Features:
 * - Choice Menu popup:
 *   · Upload Image
 *   · Choose from Media Library
 *   · Drag & Drop
 *   · Paste from Clipboard
 *   · Cancel
 * - WebP automatic client-side compression & conversion
 * - Sliders for Width, Border Radius, Margin Top, Margin Bottom
 * - Alignment controls
 * - Dropdown for Shadows
 * - Reuses existing media library and handles URL inserts
 * - Generates and parses `<figure>` HTML block for backwards compatibility
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageConfig {
  url: string
  alt: string
  caption: string
  title: string
  width: string // e.g. "80%" or "100%"
  alignment: 'left' | 'center' | 'right' | 'full'
  borderRadius: string // e.g. "12px" or "0px"
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  marginTop: string // e.g. "1.5rem"
  marginBottom: string // e.g. "1.5rem"
}

interface MediaItem {
  _id: string
  filename: string
  url: string
  mimeType: string
  size: number
  width: number | null
  height: number | null
  altText: string
  createdAt: string
}

export interface InlineImageModalProps {
  /** Called with the generated figure markdown + config when user inserts/updates */
  onInsert: (markdown: string, config: ImageConfig) => void
  onClose: () => void
  /** Pre-fill from an existing figure block (edit mode) */
  initialConfig?: Partial<ImageConfig>
  editMode?: boolean
}

// ─── Client-side WebP Compression ───────────────────────────────────────────

async function compressAndConvertToWebP(file: File, quality = 0.8): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/svg+xml') return file

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.naturalWidth
        let height = img.naturalHeight

        // Max dimension limits to keep MongoDB base64 data URL size small
        const MAX_LIMIT = 1600
        if (width > MAX_LIMIT || height > MAX_LIMIT) {
          if (width > height) {
            height = Math.round((height * MAX_LIMIT) / width)
            width = MAX_LIMIT
          } else {
            width = Math.round((width * MAX_LIMIT) / height)
            height = MAX_LIMIT
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFilename = file.name.replace(/\.[^.]+$/, '') + '.webp'
              const compressedFile = new File([blob], newFilename, {
                type: 'image/webp',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/webp',
          quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

// ─── HTML Generation & Parsing ───────────────────────────────────────────────

/** Build responsive <figure> HTML from image config */
export function generateFigureHTML(cfg: ImageConfig): string {
  const esc = (s: string) => (s || '').replace(/"/g, '&quot;')

  // Image styles
  const imgStyles: string[] = ['max-width:100%', 'height:auto', 'display:block']
  if (cfg.alignment === 'center' || cfg.alignment === 'full') imgStyles.push('margin:0 auto')
  
  if (cfg.borderRadius && cfg.borderRadius !== '0px') {
    imgStyles.push(`border-radius:${cfg.borderRadius}`)
  }

  // Shadow mappings
  const shadowStyles: Record<string, string> = {
    none: '',
    sm: 'box-shadow:0 2px 8px rgba(0,0,0,0.25)',
    md: 'box-shadow:0 8px 24px rgba(0,0,0,0.35)',
    lg: 'box-shadow:0 16px 40px rgba(0,0,0,0.45)',
    xl: 'box-shadow:0 24px 60px rgba(0,0,0,0.55)'
  }
  if (cfg.shadow && cfg.shadow !== 'none' && shadowStyles[cfg.shadow]) {
    imgStyles.push(shadowStyles[cfg.shadow])
  }

  // Figure wrapper styles
  const figStyles: string[] = []
  if (cfg.marginTop) figStyles.push(`margin-top:${cfg.marginTop}`)
  if (cfg.marginBottom) figStyles.push(`margin-bottom:${cfg.marginBottom}`)

  switch (cfg.alignment) {
    case 'center':
      figStyles.push('text-align:center')
      if (cfg.width !== '100%') figStyles.push(`max-width:${cfg.width}`, 'margin-left:auto', 'margin-right:auto')
      break
    case 'left':
      figStyles.push('float:left', 'margin-right:2rem', 'margin-bottom:1rem')
      if (cfg.width !== '100%') figStyles.push(`max-width:${cfg.width}`)
      break
    case 'right':
      figStyles.push('float:right', 'margin-left:2rem', 'margin-bottom:1rem')
      if (cfg.width !== '100%') figStyles.push(`max-width:${cfg.width}`)
      break
    case 'full':
      figStyles.push('width:100%')
      break
  }

  const imgAttrs = [
    `src="${esc(cfg.url)}"`,
    `alt="${esc(cfg.alt || '')}"`,
    ...(cfg.title ? [`title="${esc(cfg.title)}"`] : []),
    'loading="lazy"',
    'decoding="async"',
    `style="${imgStyles.join(';')}"`,
  ]

  let html = `<figure style="${figStyles.join(';')}">\n`
  html += `  <img ${imgAttrs.join(' ')} />\n`
  if (cfg.caption) {
    const safeCap = cfg.caption.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    html += `  <figcaption style="font-size:0.875rem;color:#9ca3af;margin-top:0.5rem;text-align:center;font-style:italic">${safeCap}</figcaption>\n`
  }
  html += `</figure>`

  return '\n\n' + html + '\n\n'
}

/** Parse a <figure> HTML block back into an ImageConfig */
export function parseFigureBlock(html: string): ImageConfig | null {
  const urlMatch = html.match(/src="([^"]*)"/)
  if (!urlMatch) return null

  const altMatch     = html.match(/alt="([^"]*)"/)
  const titleMatch   = html.match(/title="([^"]*)"/)
  const captionMatch = html.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)
  
  // Find styles on the figure itself
  const figStyleMatch = html.match(/<figure[^>]*style="([^"]*)"/)
  const figStyle = figStyleMatch ? figStyleMatch[1] : ''

  // Find styles on the img itself
  const imgStyleMatch = html.match(/<img[^>]*style="([^"]*)"/)
  const imgStyle = imgStyleMatch ? imgStyleMatch[1] : ''

  // Parse margins
  const mtMatch = figStyle.match(/margin-top:\s*([^;]+)/)
  const mbMatch = figStyle.match(/margin-bottom:\s*([^;]+)/)
  const marginTop = mtMatch ? mtMatch[1].trim() : '1.5rem'
  const marginBottom = mbMatch ? mbMatch[1].trim() : '1.5rem'

  // Parse border radius
  const brMatch = imgStyle.match(/border-radius:\s*([^;]+)/)
  const borderRadius = brMatch ? brMatch[1].trim() : '12px'

  // Parse width
  const maxWMatch = figStyle.match(/max-width:\s*([^;]+)/)
  const width = maxWMatch ? maxWMatch[1].trim() : '100%'

  // Parse shadow
  let shadow: ImageConfig['shadow'] = 'none'
  if (imgStyle.includes('box-shadow')) {
    if (imgStyle.includes('0 2px 8px')) shadow = 'sm'
    else if (imgStyle.includes('0 8px 24px')) shadow = 'md'
    else if (imgStyle.includes('0 16px 40px')) shadow = 'lg'
    else if (imgStyle.includes('0 24px 60px')) shadow = 'xl'
    else shadow = 'md' // fallback
  }

  let alignment: ImageConfig['alignment'] = 'center'
  if      (figStyle.includes('float:left'))  alignment = 'left'
  else if (figStyle.includes('float:right')) alignment = 'right'
  else if (figStyle.includes('width:100%') || (!maxWMatch && !figStyle.includes('margin-left:auto'))) alignment = 'full'

  const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'")

  return {
    url:       unescape(urlMatch[1]),
    alt:       unescape(altMatch?.[1]     || ''),
    title:     unescape(titleMatch?.[1]   || ''),
    caption:   (captionMatch?.[1] || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
    width,
    alignment,
    borderRadius,
    shadow,
    marginTop,
    marginBottom,
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise(resolve => {
    const img = new Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload  = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(blobUrl) }
    img.onerror = () => { resolve({ width: 0, height: 0 }); URL.revokeObjectURL(blobUrl) }
    img.src = blobUrl
  })
}

const DEFAULT_CONFIG: ImageConfig = {
  url:       '',
  alt:       '',
  caption:   '',
  title:     '',
  width:     '100%',
  alignment: 'center',
  borderRadius: '12px',
  shadow:    'md',
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InlineImageModal({ onInsert, onClose, initialConfig, editMode }: InlineImageModalProps) {
  const [mounted,    setMounted]    = useState(false)
  const [step,       setStep]       = useState<'choice' | 'pick' | 'configure'>(editMode ? 'configure' : 'choice')
  const [activeTab,  setActiveTab]  = useState<'upload' | 'library' | 'url'>('upload')
  const [config,     setConfig]     = useState<ImageConfig>({ ...DEFAULT_CONFIG, ...initialConfig })

  // Library state
  const [mediaItems,   setMediaItems]   = useState<MediaItem[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaSearch,  setMediaSearch]  = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  // Upload state
  const [uploading,    setUploading]    = useState(false)
  const [uploadError,  setUploadError]  = useState('')
  const [isDragging,   setIsDragging]   = useState(false)

  // URL tab
  const [urlInput, setUrlInput] = useState('')

  const fileInputRef     = useRef<HTMLInputElement>(null)
  const openPickerAfterStep = useRef(false)

  // Mount + scroll lock
  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  // After transitioning to 'pick', auto-open the native file picker if requested
  useEffect(() => {
    if (step === 'pick' && openPickerAfterStep.current) {
      openPickerAfterStep.current = false
      // rAF gives AnimatePresence time to mount the tab content before we click
      requestAnimationFrame(() => fileInputRef.current?.click())
    }
  }, [step])

  // Load media library when tab is switched to 'library' or from choice selection
  const loadMediaLibrary = useCallback(async () => {
    setMediaLoading(true)
    try {
      const res  = await fetch('/api/admin/media')
      const data = await res.json()
      if (data.success) setMediaItems(data.items)
    } catch { /* silent */ }
    finally { setMediaLoading(false) }
  }, [])

  useEffect(() => {
    if (activeTab === 'library' || step === 'pick') {
      void loadMediaLibrary()
    }
  }, [activeTab, step, loadMediaLibrary])

  // Clipboard paste inside the modal (upload view)
  useEffect(() => {
    if (step !== 'pick' || activeTab !== 'upload') return
    const fn = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith('image/'))
      if (!item) return
      e.preventDefault()
      const file = item.getAsFile()
      if (file) void uploadFile(file)
    }
    document.addEventListener('paste', fn)
    return () => document.removeEventListener('paste', fn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, activeTab])

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Only image files are accepted.'); return }

    setUploading(true)
    setUploadError('')
    try {
      // 1. Process client side conversion & compression
      const webpFile = await compressAndConvertToWebP(file)
      const { width, height } = await getImageDimensions(webpFile)
      
      if (webpFile.size > 4 * 1024 * 1024) { setUploadError('File too large — max 4 MB.'); return }

      const fd = new FormData()
      fd.append('file',   webpFile)
      fd.append('width',  String(width))
      fd.append('height', String(height))

      const res  = await fetch('/api/admin/media', { method: 'POST', body: fd })
      const data = await res.json()

      if (data.success) {
        const autoAlt = webpFile.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        const newCfg = { ...DEFAULT_CONFIG, url: data.item.url, alt: data.item.altText || autoAlt }
        
        // If not in edit mode, insert immediately!
        if (!editMode) {
          onInsert(generateFigureHTML(newCfg), newCfg)
          onClose()
        } else {
          setConfig(newCfg)
          setMediaItems(prev => [data.item, ...prev])
          setStep('configure')
        }
      } else {
        setUploadError(data.error ?? 'Upload failed')
      }
    } catch {
      setUploadError('Upload failed — check your connection')
    } finally {
      setUploading(false)
    }
  }, [editMode, onClose, onInsert])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) void uploadFile(file)
  }

  // ── Library select ────────────────────────────────────────────────────────
  const handleLibrarySelect = (item: MediaItem) => {
    setSelectedItem(item)
    setConfig(c => ({
      ...c,
      url: item.url,
      alt: item.altText || item.filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    }))
  }

  const handleLibraryInsert = () => {
    if (!selectedItem) return
    const cfg = {
      ...DEFAULT_CONFIG,
      url: selectedItem.url,
      alt: selectedItem.altText || selectedItem.filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
    }
    onInsert(generateFigureHTML(cfg), cfg)
    onClose()
  }

  // ── URL continue ──────────────────────────────────────────────────────────
  const handleUrlContinue = () => {
    const url = urlInput.trim()
    if (!url) return
    const cfg = { ...DEFAULT_CONFIG, url }
    
    if (!editMode) {
      onInsert(generateFigureHTML(cfg), cfg)
      onClose()
    } else {
      setConfig(cfg)
      setStep('configure')
    }
  }

  // ── Insert / Update ────────────────────────────────────────────────────────
  const handleInsert = () => {
    if (!config.url) return
    onInsert(generateFigureHTML(config), config)
    onClose()
  }

  const setC = (patch: Partial<ImageConfig>) => setConfig(c => ({ ...c, ...patch }))

  const filteredMedia = mediaItems.filter(i =>
    i.filename.toLowerCase().includes(mediaSearch.toLowerCase())
  )

  if (!mounted) return null

  // Live preview figure styles
  const previewFigStyle: React.CSSProperties = {
    marginTop: config.marginTop,
    marginBottom: config.marginBottom,
    maxWidth: config.alignment === 'full' ? '100%' : config.width,
    width: '100%',
    textAlign: 'center',
  }
  
  // Shadow CSS mapping
  const shadowStyles: Record<string, string> = {
    none: 'none',
    sm: '0 2px 8px rgba(0,0,0,0.25)',
    md: '0 8px 24px rgba(0,0,0,0.35)',
    lg: '0 16px 40px rgba(0,0,0,0.45)',
    xl: '0 24px 60px rgba(0,0,0,0.55)'
  }

  const previewImgStyle: React.CSSProperties = {
    maxWidth:     '100%',
    height:       'auto',
    display:      'block',
    margin:       '0 auto',
    borderRadius: config.borderRadius,
    boxShadow:    shadowStyles[config.shadow] || 'none',
    border:       config.borderRadius !== '0px' ? '1px solid rgba(255,255,255,0.08)' : undefined,
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={editMode ? 'Edit Image' : 'Insert Image'}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        className="w-full flex flex-col rounded-[24px] overflow-hidden"
        style={{
          maxWidth: '960px',
          height: 'min(90vh, 760px)',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 140px rgba(0,0,0,0.95)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-xl">{editMode ? '✏️' : '🖼️'}</span>
          <h2
            className="text-white font-black text-sm uppercase tracking-widest mr-auto"
            style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}
          >
            {editMode ? 'Configure Image Block' : 'Insert Image'}
          </h2>
          {step !== 'choice' && !editMode && (
            <button
              onClick={() => setStep('choice')}
              className="text-gray-500 hover:text-white text-xs font-bold transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
            >
              ← Change Method
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>

            {/* ══ STEP 0: CHOICE MENU POPUP ══ */}
            {step === 'choice' && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col justify-center items-center p-8 space-y-6"
              >
                <div className="text-center space-y-2 max-w-sm">
                  <p className="text-white font-extrabold text-lg uppercase tracking-wide">Add Inline Image</p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Select a method to insert an image directly at your editor cursor position.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  <button
                    onClick={() => {
                      openPickerAfterStep.current = true
                      setActiveTab('upload')
                      setStep('pick')
                    }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] hover:border-orange-500/40 hover:bg-orange-500/[0.03] transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-all duration-200">⬆️</span>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Upload Image</span>
                    <span className="text-gray-600 text-[10px] text-center">Select file from device</span>
                  </button>

                  <button
                    onClick={() => { setStep('pick'); setActiveTab('library') }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] hover:border-orange-500/40 hover:bg-orange-500/[0.03] transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-all duration-200">🗂️</span>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Media Library</span>
                    <span className="text-gray-600 text-[10px] text-center">Choose existing uploads</span>
                  </button>

                  <button
                    onClick={() => { setStep('pick'); setActiveTab('upload') }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] hover:border-orange-500/40 hover:bg-orange-500/[0.03] transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-all duration-200">🎯</span>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Drag & Drop</span>
                    <span className="text-gray-600 text-[10px] text-center">Drop file onto canvas</span>
                  </button>

                  <button
                    onClick={() => { setStep('pick'); setActiveTab('upload') }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] hover:border-orange-500/40 hover:bg-orange-500/[0.03] transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-all duration-200">📋</span>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Clipboard Paste</span>
                    <span className="text-gray-600 text-[10px] text-center">Paste from clipboard</span>
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-gray-500 hover:text-white text-xs font-bold transition-all bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] cursor-pointer"
                >
                  Cancel
                </button>
              </motion.div>
            )}

            {/* ══ STEP 1: PICK ══ */}
            {step === 'pick' && (
              <motion.div
                key="pick"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="h-full flex flex-col"
              >
                {/* Tabs */}
                <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {(['upload', 'library', 'url'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                        activeTab === tab
                          ? 'text-orange-500 border-b-2 border-orange-500'
                          : 'text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      {tab === 'upload' ? '⬆ Upload' : tab === 'library' ? '🗂 Library' : '🔗 URL'}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait" initial={false}>

                    {/* ── Upload ── */}
                    {activeTab === 'upload' && (
                      <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col gap-4">
                        <div
                          className="flex-1 flex flex-col items-center justify-center gap-5 rounded-[20px] border-2 border-dashed transition-all duration-200 cursor-pointer select-none min-h-[280px] p-8"
                          style={{
                            borderColor: isDragging ? '#ff7a00' : 'rgba(255,255,255,0.08)',
                            background:  isDragging ? 'rgba(255,122,0,0.03)' : 'rgba(255,255,255,0.01)',
                          }}
                          onDrop={onDrop}
                          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                          onDragLeave={() => setIsDragging(false)}
                          onClick={() => !uploading && fileInputRef.current?.click()}
                        >
                          {uploading ? (
                            <>
                              <div className="w-12 h-12 rounded-full border-[3px] border-orange-500/20 border-t-orange-500 animate-spin" />
                              <p className="text-gray-400 text-sm font-semibold">Uploading & compressing WebP…</p>
                            </>
                          ) : (
                            <>
                              <div
                                className="w-16 h-16 rounded-[20px] flex items-center justify-center text-3xl"
                                style={{ background: 'rgba(255,122,0,0.06)', border: '1px solid rgba(255,122,0,0.15)' }}
                              >
                                📥
                              </div>
                              <div className="text-center space-y-1.5">
                                <p className="text-white font-bold text-sm">
                                  {isDragging ? 'Drop it here!' : 'Drag & drop image file'}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  or <span className="text-orange-400 font-semibold">browse computer</span> · paste from clipboard
                                </p>
                              </div>
                              <p className="text-gray-700 text-[10px]">Max 4 MB · Auto WebP compression · Auto Media Library save</p>
                            </>
                          )}
                        </div>
                        {uploadError && (
                          <p className="text-red-400 text-xs font-semibold text-center bg-red-500/[0.06] border border-red-500/10 rounded-xl px-4 py-3">
                            {uploadError}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* ── Library ── */}
                    {activeTab === 'library' && (
                      <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 h-full">
                        <input
                          placeholder="Search uploads…"
                          value={mediaSearch}
                          onChange={e => setMediaSearch(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-white text-xs outline-none flex-shrink-0 bg-white/[0.04] border border-white/[0.06] focus:border-orange-500/30 transition-all"
                        />
                        {mediaLoading ? (
                          <div className="flex-1 flex items-center justify-center gap-3">
                            <span className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                            <span className="text-gray-500 text-xs font-semibold">Loading media library…</span>
                          </div>
                        ) : filteredMedia.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center gap-3">
                            <span className="text-3xl opacity-20">🖼️</span>
                            <p className="text-gray-600 text-xs">
                              {mediaSearch ? 'No images match your search' : 'No images in library'}
                            </p>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-y-auto pr-1">
                            <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px,1fr))' }}>
                              {filteredMedia.map(item => {
                                const isActive = selectedItem?._id === item._id
                                return (
                                  <button
                                    key={item._id}
                                    type="button"
                                    onClick={() => handleLibrarySelect(item)}
                                    className="relative aspect-square rounded-[16px] overflow-hidden border-2 transition-all hover:scale-[1.02] cursor-pointer focus:outline-none"
                                    style={{
                                      borderColor: isActive ? '#ff7a00' : 'rgba(255,255,255,0.06)',
                                      background: '#0d0d0d',
                                    }}
                                  >
                                    <img
                                      src={item.url}
                                      alt={item.altText || item.filename}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                    {isActive && (
                                      <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{ background: 'rgba(255,122,0,0.18)' }}
                                      >
                                        <span
                                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-black bg-orange-500"
                                        >✓</span>
                                      </div>
                                    )}
                                    <div
                                      className="absolute inset-x-0 bottom-0 p-1.5 opacity-0 hover:opacity-100 transition-opacity"
                                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
                                    >
                                      <p className="text-white text-[8px] font-semibold truncate">{item.filename}</p>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        {selectedItem && (
                          <div
                            className="flex items-center gap-3 pt-3 border-t flex-shrink-0"
                            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                          >
                            <img src={selectedItem.url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold truncate">{selectedItem.filename}</p>
                              <p className="text-gray-500 text-[10px]">
                                {formatBytes(selectedItem.size)}
                                {selectedItem.width ? ` · ${selectedItem.width}×${selectedItem.height}` : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleLibraryInsert}
                              className="px-4 py-2 rounded-xl text-black text-xs font-black cursor-pointer flex-shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg transition-all"
                            >
                              Insert Image
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── URL ── */}
                    {activeTab === 'url' && (
                      <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                        <div>
                          <label className="text-gray-500 text-[9px] font-black uppercase tracking-widest block mb-2">Web Image URL</label>
                          <div className="flex gap-2">
                            <input
                              placeholder="https://example.com/image.jpg"
                              value={urlInput}
                              onChange={e => setUrlInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleUrlContinue() }}
                              className="flex-1 px-4 py-2.5 rounded-xl text-white text-xs outline-none bg-white/[0.04] border border-white/[0.06] focus:border-orange-500/30 transition-all"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={handleUrlContinue}
                              disabled={!urlInput.trim()}
                              className="px-4 py-2.5 rounded-xl text-black text-xs font-black cursor-pointer disabled:opacity-40 bg-gradient-to-r from-orange-500 to-amber-500"
                            >
                              Continue →
                            </button>
                          </div>
                        </div>
                        {urlInput.trim() && (
                          <div
                            className="rounded-[16px] overflow-hidden border"
                            style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0e0e0e' }}
                          >
                            <img
                              src={urlInput}
                              alt="Preview"
                              className="w-full max-h-52 object-contain"
                              onError={() => {}}
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
              </motion.div>
            )}

            {/* ══ STEP 2: CONFIGURE (EDIT OPTIONS) ══ */}
            {step === 'configure' && (
              <motion.div
                key="configure"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.18 }}
                className="h-full flex overflow-hidden"
              >
                {/* Left: live preview */}
                <div
                  className="flex-1 flex flex-col overflow-hidden border-r"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="px-4 py-2.5 border-b flex-shrink-0"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest text-center">Live Preview</p>
                  </div>

                  <div
                    className="flex-1 overflow-auto p-8 flex items-center justify-center"
                    style={{ background: '#040404' }}
                  >
                    <figure style={previewFigStyle}>
                      {config.url ? (
                        <img src={config.url} alt={config.alt || 'Preview'} style={previewImgStyle} />
                      ) : (
                        <div
                          className="w-full h-40 rounded-xl flex items-center justify-center text-gray-700 text-xs"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.06)' }}
                        >
                          No image selected
                        </div>
                      )}
                      {config.caption && (
                        <figcaption style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem', textAlign: 'center', fontStyle: 'italic' }}>
                          {config.caption}
                        </figcaption>
                      )}
                    </figure>
                  </div>

                  {/* Footer: replace + insert */}
                  <div
                    className="flex gap-2 p-4 border-t flex-shrink-0"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    {editMode ? (
                      <button
                        type="button"
                        onClick={() => { setStep('choice') }}
                        className="flex-1 py-2.5 rounded-xl text-gray-400 text-xs font-bold border border-white/[0.06] hover:border-orange-500/20 hover:text-white transition-all cursor-pointer"
                      >
                        Replace Image
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setStep('choice')}
                        className="flex-1 py-2.5 rounded-xl text-gray-400 text-xs font-bold border border-white/[0.06] hover:border-orange-500/20 hover:text-white transition-all cursor-pointer"
                      >
                        ← Reselect Method
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleInsert}
                      disabled={!config.url}
                      className="flex-1 py-2.5 rounded-xl text-black text-xs font-black cursor-pointer disabled:opacity-40 transition-all bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg"
                    >
                      {editMode ? '✓ Update Image Block' : '✓ Insert Image Block'}
                    </button>
                  </div>
                </div>

                {/* Right: settings panel */}
                <div className="w-[300px] flex-shrink-0 overflow-y-auto p-5 space-y-5">
                  <h3 className="text-white font-extrabold text-xs uppercase tracking-wider border-b border-white/[0.06] pb-2">Block Parameters</h3>

                  {/* Alt Text */}
                  <SettingField label="Alt Text" hint="Image description for SEO & accessibility">
                    <textarea
                      value={config.alt}
                      onChange={e => setC({ alt: e.target.value })}
                      placeholder="e.g. Streams playing in Ultra HD"
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none resize-none leading-relaxed bg-white/[0.03] border border-white/[0.06] focus:border-orange-500/30 transition-all"
                    />
                  </SettingField>

                  {/* Caption */}
                  <SettingField label="Caption" hint="Caption shown under image">
                    <input
                      value={config.caption}
                      onChange={e => setC({ caption: e.target.value })}
                      placeholder="e.g. Figure 1: App layout options"
                      className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none bg-white/[0.03] border border-white/[0.06] focus:border-orange-500/30 transition-all"
                    />
                  </SettingField>

                  {/* Title */}
                  <SettingField label="Title" hint="Tooltip displayed when user hovers">
                    <input
                      value={config.title}
                      onChange={e => setC({ title: e.target.value })}
                      placeholder="Tooltip on hover"
                      className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none bg-white/[0.03] border border-white/[0.06] focus:border-orange-500/30 transition-all"
                    />
                  </SettingField>

                  {/* Width Slider */}
                  <SettingField label={`Width: ${config.width}`} hint="Adjust block width scale">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={parseInt(config.width) || 100}
                      onChange={e => setC({ width: `${e.target.value}%` })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </SettingField>

                  {/* Border Radius Slider */}
                  <SettingField label={`Border Radius: ${config.borderRadius}`} hint="Adjust image corner curvature">
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={parseInt(config.borderRadius) || 0}
                      onChange={e => setC({ borderRadius: `${e.target.value}px` })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </SettingField>

                  {/* Margin Top Slider */}
                  <SettingField label={`Margin Top: ${config.marginTop}`} hint="Spacing above this block">
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={Math.round((parseFloat(config.marginTop) || 0) * 16)}
                      onChange={e => setC({ marginTop: `${parseFloat(e.target.value) / 16}rem` })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </SettingField>

                  {/* Margin Bottom Slider */}
                  <SettingField label={`Margin Bottom: ${config.marginBottom}`} hint="Spacing below this block">
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={Math.round((parseFloat(config.marginBottom) || 0) * 16)}
                      onChange={e => setC({ marginBottom: `${parseFloat(e.target.value) / 16}rem` })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </SettingField>

                  {/* Shadow Dropdown */}
                  <SettingField label="Box Shadow Depth" hint="Set outer elevation style">
                    <select
                      value={config.shadow}
                      onChange={e => setC({ shadow: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none bg-[#0e0e0e] border border-white/[0.08] cursor-pointer focus:border-orange-500 transition-all font-semibold"
                    >
                      <option value="none">No Shadow</option>
                      <option value="sm">Subtle / Small</option>
                      <option value="md">Standard / Medium</option>
                      <option value="lg">Heavy / Large</option>
                      <option value="xl">Ambient / Extra Large</option>
                    </select>
                  </SettingField>

                  {/* Alignment */}
                  <SettingField label="Block Alignment">
                    <div className="grid grid-cols-4 gap-1.5">
                      {([
                        { v: 'left',   icon: '⬅',  label: 'Left'   },
                        { v: 'center', icon: '↔',   label: 'Center' },
                        { v: 'right',  icon: '➡',  label: 'Right'  },
                        { v: 'full',   icon: '⟺',  label: 'Full'   },
                      ] as const).map(a => {
                        const active = config.alignment === a.v
                        return (
                          <button
                            key={a.v}
                            type="button"
                            onClick={() => setC({ alignment: a.v })}
                            title={a.label}
                            className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-black transition-all cursor-pointer"
                            style={{
                              background: active ? 'rgba(255,122,0,0.14)' : 'rgba(255,255,255,0.03)',
                              border:     `1px solid ${active ? 'rgba(255,122,0,0.35)' : 'rgba(255,255,255,0.06)'}`,
                              color:      active ? '#ff7a00' : '#888',
                            }}
                          >
                            <span className="text-sm">{a.icon}</span>
                            <span>{a.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </SettingField>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )

  // Always-rendered hidden file input — must be outside AnimatePresence so the
  // ref is never null, regardless of which modal step is currently active.
  const hiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={e => {
        const file = e.target.files?.[0]
        if (file) void uploadFile(file)
        e.target.value = ''
      }}
    />
  )

  return createPortal(<>{modal}{hiddenFileInput}</>, document.body)
}

// ─── Helper sub-component ─────────────────────────────────────────────────────

function SettingField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">{label}</p>
      {hint && <p className="text-gray-600 text-[9px] leading-tight">{hint}</p>}
      <div className="pt-0.5">{children}</div>
    </div>
  )
}
