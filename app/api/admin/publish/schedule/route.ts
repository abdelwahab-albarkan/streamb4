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
    const queue = readQueue()
    const scheduled = queue.filter((q: any) => q.scheduledAt && q.status === 'pending')
    return NextResponse.json({ scheduled })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { article, platforms, scheduledAt } = await req.json()
    if (!article || !platforms?.length || !scheduledAt) {
      return NextResponse.json({ error: 'Missing article, platforms, or scheduledAt' }, { status: 400 })
    }

    const queue = readQueue()
    const item = {
      id: `s_${Date.now()}`,
      article,
      platforms,
      scheduledAt,
      addedAt: new Date().toISOString(),
      status: 'pending',
      type: 'scheduled',
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
