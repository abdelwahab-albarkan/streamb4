import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { PublishQueue } from '@/lib/models/PublishQueue'

export async function GET() {
  try {
    await connectDB()
    const queue = await PublishQueue.find({}).lean()
    return NextResponse.json({ queue })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { article, platforms, scheduledAt } = await req.json()
    if (!article || !platforms?.length) return NextResponse.json({ error: 'Missing article or platforms' }, { status: 400 })

    await connectDB()

    const item = {
      id: `q_${Date.now()}`,
      article,
      platforms,
      scheduledAt: scheduledAt || '',
      addedAt: new Date().toISOString(),
      status: 'pending',
      result: null,
      priority: 0,
    }

    await new PublishQueue(item).save()
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
    await connectDB()
    await PublishQueue.findOneAndDelete({ id })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function PUT() {
  try {
    await connectDB()
    const queue = await PublishQueue.find({}).lean() as any[]
    const now = new Date().toISOString()
    const next = queue.find((q: any) => q.status === 'pending' && (!q.scheduledAt || q.scheduledAt <= now))
    if (!next) return NextResponse.json({ ok: true, message: 'No items ready to process' })

    // Mark as processing
    await PublishQueue.findOneAndUpdate({ id: next.id }, { status: 'processing' })

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: next.article, platforms: next.platforms, skipValidation: true }),
      })
      const data = await res.json()

      await PublishQueue.findOneAndUpdate(
        { id: next.id },
        {
          status: res.ok ? 'done' : 'failed',
          result: data,
        }
      )
      return NextResponse.json({ ok: true, result: data })
    } catch (err: any) {
      await PublishQueue.findOneAndUpdate(
        { id: next.id },
        { status: 'failed', result: { error: err?.message } }
      )
      return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
