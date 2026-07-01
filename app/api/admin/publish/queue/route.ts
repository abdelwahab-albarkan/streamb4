import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const QUEUE_FILE = path.join(process.cwd(), 'data', 'publish-queue.json')

function readQueue(): any[] {
  try {
    if (!fs.existsSync(QUEUE_FILE)) { fs.writeFileSync(QUEUE_FILE, '[]', 'utf8'); return [] }
    return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8') || '[]')
  } catch { return [] }
}

function writeQueue(queue: any[]): void {
  try {
    fs.mkdirSync(path.dirname(QUEUE_FILE), { recursive: true })
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8')
  } catch {}
}

export async function GET() {
  try {
    return NextResponse.json({ queue: readQueue() })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { article, platforms, scheduledAt } = await req.json()
    if (!article || !platforms?.length) return NextResponse.json({ error: 'Missing article or platforms' }, { status: 400 })

    const queue = readQueue()
    const item = {
      id: `q_${Date.now()}`,
      article,
      platforms,
      scheduledAt: scheduledAt || null,
      addedAt: new Date().toISOString(),
      status: 'pending',
    }
    queue.push(item)
    writeQueue(queue)
    return NextResponse.json({ ok: true, item })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const queue = readQueue().filter((q: any) => q.id !== id)
    writeQueue(queue)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function PUT() {
  try {
    const queue = readQueue()
    const now = new Date().toISOString()
    const next = queue.find((q: any) => q.status === 'pending' && (!q.scheduledAt || q.scheduledAt <= now))
    if (!next) return NextResponse.json({ ok: true, message: 'No items ready to process' })

    // Mark as processing
    next.status = 'processing'
    writeQueue(queue)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: next.article, platforms: next.platforms, skipValidation: true }),
      })
      const data = await res.json()

      next.status = res.ok ? 'done' : 'failed'
      next.processedAt = new Date().toISOString()
      next.result = data

      const updated = readQueue().map((q: any) => q.id === next.id ? next : q)
      writeQueue(updated)
      return NextResponse.json({ ok: true, result: data })
    } catch (err: any) {
      next.status = 'failed'
      next.error = err?.message
      const updated = readQueue().map((q: any) => q.id === next.id ? next : q)
      writeQueue(updated)
      return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
