import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { PublishQueue } from '@/lib/models/PublishQueue'

export async function GET() {
  try {
    await connectDB()
    const scheduled = await PublishQueue.find({ scheduledAt: { $ne: '' }, status: 'pending' }).lean()
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

    await connectDB()

    const item = {
      id: `s_${Date.now()}`,
      article,
      platforms,
      scheduledAt,
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
