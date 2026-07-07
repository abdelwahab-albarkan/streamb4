import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { Setting } from '@/lib/models/Setting'

// Categories are stored as a Setting document (key: 'categories')
// Value is JSON array: [{ id, name, slug, description, color }]

async function getCategories(): Promise<{ id: string; name: string; slug: string; description?: string; color?: string }[]> {
  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'categories' }).lean() as { value?: string } | null
    if (setting?.value) return JSON.parse(setting.value)
  } catch { /* ignore */ }
  return []
}

export async function GET() {
  const cats = await getCategories()
  // Enrich with post counts
  await connectDB()
  const enriched = await Promise.all(cats.map(async (c) => {
    const count = await Post.countDocuments({ category: c.name })
    return { ...c, postCount: count }
  }))
  return NextResponse.json({ success: true, categories: enriched })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, slug, description, color } = body as Record<string, string>
  if (!name?.trim()) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 })
  await connectDB()
  const cats = await getCategories()
  const id = Date.now().toString()
  const newSlug = slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (cats.find(c => c.slug === newSlug)) {
    return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
  }
  cats.push({ id, name: name.trim(), slug: newSlug, description: description?.trim() || '', color: color || '#FF7A00' })
  await Setting.findOneAndUpdate(
    { key: 'categories' },
    { key: 'categories', value: JSON.stringify(cats), type: 'json' },
    { upsert: true, new: true }
  )
  return NextResponse.json({ success: true, category: cats[cats.length - 1] })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, name, slug, description, color } = body as Record<string, string>
  if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
  await connectDB()
  const cats = await getCategories()
  const idx = cats.findIndex(c => c.id === id)
  if (idx === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  if (name?.trim()) cats[idx].name = name.trim()
  if (slug?.trim()) cats[idx].slug = slug.trim()
  if (description !== undefined) cats[idx].description = description
  if (color) cats[idx].color = color
  await Setting.findOneAndUpdate(
    { key: 'categories' },
    { key: 'categories', value: JSON.stringify(cats), type: 'json' },
    { upsert: true }
  )
  return NextResponse.json({ success: true, category: cats[idx] })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
  await connectDB()
  const cats = await getCategories()
  const filtered = cats.filter(c => c.id !== id)
  await Setting.findOneAndUpdate(
    { key: 'categories' },
    { key: 'categories', value: JSON.stringify(filtered), type: 'json' },
    { upsert: true }
  )
  return NextResponse.json({ success: true })
}
