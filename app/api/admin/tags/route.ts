import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { Setting } from '@/lib/models/Setting'

async function getTags(): Promise<{ id: string; name: string; slug: string; color?: string }[]> {
  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'tags' }).lean() as { value?: string } | null
    if (setting?.value) return JSON.parse(setting.value)
  } catch { /* ignore */ }
  return []
}

export async function GET() {
  const tags = await getTags()
  await connectDB()
  const enriched = await Promise.all(tags.map(async (t) => {
    const count = await Post.countDocuments({ tags: t.name })
    return { ...t, postCount: count }
  }))
  return NextResponse.json({ success: true, tags: enriched })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, slug, color } = body as Record<string, string>
  if (!name?.trim()) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 })
  await connectDB()
  const tags = await getTags()
  const id = Date.now().toString()
  const newSlug = slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (tags.find(t => t.slug === newSlug)) {
    return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
  }
  tags.push({ id, name: name.trim(), slug: newSlug, color: color || '#6366f1' })
  await Setting.findOneAndUpdate(
    { key: 'tags' },
    { key: 'tags', value: JSON.stringify(tags), type: 'json' },
    { upsert: true, new: true }
  )
  return NextResponse.json({ success: true, tag: tags[tags.length - 1] })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, name, slug, color } = body as Record<string, string>
  if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
  await connectDB()
  const tags = await getTags()
  const idx = tags.findIndex(t => t.id === id)
  if (idx === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  if (name?.trim()) tags[idx].name = name.trim()
  if (slug?.trim()) tags[idx].slug = slug.trim()
  if (color) tags[idx].color = color
  await Setting.findOneAndUpdate(
    { key: 'tags' },
    { key: 'tags', value: JSON.stringify(tags), type: 'json' },
    { upsert: true }
  )
  return NextResponse.json({ success: true, tag: tags[idx] })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
  await connectDB()
  const tags = await getTags()
  const filtered = tags.filter(t => t.id !== id)
  await Setting.findOneAndUpdate(
    { key: 'tags' },
    { key: 'tags', value: JSON.stringify(filtered), type: 'json' },
    { upsert: true }
  )
  return NextResponse.json({ success: true })
}
