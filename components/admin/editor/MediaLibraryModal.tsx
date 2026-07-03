'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MediaItem {
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

interface Props {
  /** Called with the selected image URL when the user clicks "Select Image" */
  onSelect: (url: string) => void
  onClose: () => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

/** Read natural width/height of a File before upload */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(blobUrl)
    }
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
      URL.revokeObjectURL(blobUrl)
    }
    img.src = blobUrl
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MediaLibraryModal({ onSelect, onClose }: Props) {
  // Portal mount guard (document.body unavailable on server)
  const [mounted, setMounted] = useState(false)

  const [items, setItems]         = useState<MediaItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected]   = useState<MediaItem | null>(null)
  const [search, setSearch]       = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [altValue, setAltValue]   = useState('')
  const [error, setError]         = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mount + body scroll lock
  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Fetch media on mount
  useEffect(() => {
    ;(async () => {
      try {
        const res  = await fetch('/api/admin/media')
        const data = await res.json()
        if (data.success) setItems(data.items)
        else setError(data.error ?? 'Failed to load media')
      } catch {
        setError('Network error — could not reach media API')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Sync alt text input when selection changes
  useEffect(() => { setAltValue(selected?.altText ?? '') }, [selected?._id])

  // ── Upload handler ──────────────────────────────────────────────────────────
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!list.length) return

    setUploading(true)
    setError('')

    for (const file of list) {
      try {
        const { width, height } = await getImageDimensions(file)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('width', String(width))
        fd.append('height', String(height))

        const res  = await fetch('/api/admin/media', { method: 'POST', body: fd })
        const data = await res.json()

        if (data.success) {
          setItems(prev => [data.item, ...prev])
          setSelected(data.item)
        } else {
          setError(data.error ?? 'Upload failed')
        }
      } catch {
        setError('Upload failed — check your connection')
      }
    }

    setUploading(false)
  }, [])

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files)
    e.target.value = '' // allow re-uploading same file
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.filename}"? This cannot be undone.`)) return
    try {
      await fetch(`/api/admin/media?id=${item._id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(i => i._id !== item._id))
      if (selected?._id === item._id) setSelected(null)
    } catch {
      setError('Delete failed')
    }
  }

  // ── Copy URL ────────────────────────────────────────────────────────────────
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Select ──────────────────────────────────────────────────────────────────
  const handleSelect = () => {
    if (!selected) return
    onSelect(selected.url)
    onClose()
  }

  // ── Drag & drop ─────────────────────────────────────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    uploadFiles(e.dataTransfer.files)
  }
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = items.filter(i =>
    i.filename.toLowerCase().includes(search.toLowerCase())
  )

  // ── Portal guard ────────────────────────────────────────────────────────────
  if (!mounted) return null

  // ────────────────────────────────────────────────────────────────────────────

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media Library"
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Full-area drag indicator */}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-[210] flex items-center justify-center"
          style={{ background: 'rgba(255,122,0,0.06)', border: '3px dashed rgba(255,122,0,0.45)' }}>
          <p className="text-orange-400 text-2xl font-black uppercase tracking-widest drop-shadow-lg">
            Drop to Upload
          </p>
        </div>
      )}

      {/* Modal panel */}
      <div
        className="w-full max-w-6xl flex flex-col rounded-[28px] overflow-hidden"
        style={{
          height: 'min(88vh, 780px)',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        }}
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {/* Title */}
          <h2
            className="text-white font-black text-base uppercase tracking-widest mr-auto"
            style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}
          >
            Media Library
          </h2>

          {/* Error banner */}
          {error && (
            <span className="text-red-400 text-xs font-semibold bg-red-500/10 px-3 py-1 rounded-lg">
              {error}
            </span>
          )}

          {/* Search */}
          <input
            placeholder="Search images…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl text-white text-sm outline-none placeholder-gray-600"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              width: 200,
            }}
          />

          {/* Upload button */}
          <label
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer whitespace-nowrap select-none transition-opacity"
            style={{
              background: uploading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg,#ff7a00,#ffb300)',
              color: uploading ? '#aaa' : '#000',
              pointerEvents: uploading ? 'none' : undefined,
            }}
          >
            {uploading ? (
              <>
                <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Uploading…
              </>
            ) : '↑ Upload New'}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />
          </label>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Media Library"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            ✕
          </button>
        </div>

        {/* ── Body: grid + detail panel ─────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Image grid */}
          <div className="flex-1 overflow-y-auto p-5">
            {loading ? (
              <div className="flex items-center justify-center h-full gap-3">
                <span className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                <span className="text-gray-500 text-sm">Loading media…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-full gap-4 rounded-[20px] cursor-pointer transition-colors"
                style={{ border: '2px dashed rgba(255,255,255,0.08)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-5xl select-none">🖼️</span>
                <p className="text-gray-500 text-sm font-semibold text-center">
                  {search ? 'No images match your search' : 'No images yet — drop files here or click to upload'}
                </p>
              </div>
            ) : (
              <div className="grid gap-2.5"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))' }}>
                {filtered.map((item) => {
                  const isActive = selected?._id === item._id
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelected(item)}
                      className="relative aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-150 hover:scale-[1.03] cursor-pointer focus:outline-none"
                      style={{
                        borderColor: isActive ? '#ff7a00' : 'rgba(255,255,255,0.07)',
                        background: '#111',
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Selected overlay */}
                      {isActive && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: 'rgba(255,122,0,0.22)' }}
                        >
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-black"
                            style={{ background: '#ff7a00' }}
                          >
                            ✓
                          </span>
                        </div>
                      )}

                      {/* Filename on hover */}
                      <div
                        className="absolute inset-x-0 bottom-0 p-1.5 opacity-0 hover:opacity-100 transition-opacity duration-150"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
                      >
                        <p className="text-white text-[9px] font-semibold truncate leading-none">
                          {item.filename}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Detail sidebar ─────────────────────────────────────────────── */}
          <div
            className="w-[240px] flex-shrink-0 flex flex-col border-l overflow-y-auto"
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
              background: '#0d0d0d',
            }}
          >
            {selected ? (
              <>
                {/* Preview */}
                <div
                  className="flex-shrink-0 aspect-square border-b flex items-center justify-center overflow-hidden"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#111' }}
                >
                  <img
                    src={selected.url}
                    alt={selected.altText || selected.filename}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Metadata */}
                <div className="flex-1 p-4 space-y-3 text-xs">
                  <MetaRow label="Filename" value={selected.filename} mono />
                  <MetaRow label="Uploaded"   value={formatDate(selected.createdAt)} />
                  <MetaRow label="File Size"  value={formatBytes(selected.size)} />
                  {selected.width && selected.height ? (
                    <MetaRow label="Dimensions" value={`${selected.width} × ${selected.height} px`} />
                  ) : null}
                  <MetaRow label="Type" value={selected.mimeType} />

                  {/* Alt text */}
                  <div>
                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-1">Alt Text</p>
                    <input
                      value={altValue}
                      onChange={(e) => setAltValue(e.target.value)}
                      placeholder="Describe the image…"
                      className="w-full px-2.5 py-2 rounded-lg text-white text-xs outline-none placeholder-gray-700"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex-shrink-0 p-4 space-y-2 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  {/* Primary: select */}
                  <button
                    type="button"
                    onClick={handleSelect}
                    className="w-full py-2.5 rounded-xl text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb300)' }}
                  >
                    Select Image ✓
                  </button>

                  {/* Copy URL */}
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(selected.url)}
                    className="w-full py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
                    style={{
                      color: copied ? '#4ade80' : '#fff',
                      borderColor: copied ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)',
                      background: copied ? 'rgba(74,222,128,0.06)' : 'transparent',
                    }}
                  >
                    {copied ? 'Copied! ✓' : 'Copy URL'}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(selected)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500/[0.06] transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="text-4xl select-none opacity-30">🖼️</span>
                <p className="text-gray-600 text-xs font-semibold leading-relaxed">
                  Click an image to view details and select it
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: item count ────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#080808' }}
        >
          <span className="text-gray-600 text-[10px] font-semibold">
            {filtered.length} {filtered.length === 1 ? 'image' : 'images'}
            {search ? ` matching "${search}"` : ' in library'}
          </span>
          <span className="text-gray-700 text-[10px]">Press Esc to close</span>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

// ─── Small helper for metadata rows ──────────────────────────────────────────

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-0.5">{label}</p>
      <p
        className={`text-gray-300 text-[11px] break-all leading-snug ${mono ? 'font-mono' : 'font-medium'}`}
      >
        {value}
      </p>
    </div>
  )
}
