import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Media } from '@/lib/models/Media'
import { serializeDocs, serializeDoc } from '@/lib/serialize'

// 4 MB — leaves margin below Vercel's 4.5 MB route-handler body limit
const MAX_BYTES = 4 * 1024 * 1024

export async function GET() {
  try {
    await connectDB()
    const docs = await Media.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, items: serializeDocs(docs as any[]) })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || !file.size) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File too large — maximum size is 4 MB.' },
        { status: 413 }
      )
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are accepted.' },
        { status: 415 }
      )
    }

    const width   = formData.get('width')   ? Number(formData.get('width'))  : null
    const height  = formData.get('height')  ? Number(formData.get('height')) : null
    const altText = (formData.get('altText') as string | null) ?? ''

    // Convert to base64 data URL (stored directly in MongoDB for portability)
    const bytes   = await file.arrayBuffer()
    const base64  = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    await connectDB()
    const doc = await new Media({
      filename: file.name,
      url:      dataUrl,
      mimeType: file.type,
      size:     file.size,
      width,
      height,
      altText,
    }).save()

    return NextResponse.json({
      success: true,
      item: serializeDoc(doc.toObject() as any),
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id param' }, { status: 400 })
    }
    await connectDB()
    await Media.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
