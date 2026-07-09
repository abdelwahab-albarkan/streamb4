import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Media } from '@/lib/models/Media'

/**
 * GET /api/admin/media/:id
 *
 * Serves the raw image binary from the Media document whose `url` field
 * holds a base64 data URL (data:<mime>;base64,<data>).
 *
 * Using a real URL in post.content instead of the full base64 string keeps
 * the content field small and prevents the editor from freezing when many
 * images are present.
 *
 * Cache: 1 year immutable — images stored in MongoDB are never mutated in-place
 * (editing replaces the document).
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const doc = await Media.findById(params.id).select('url mimeType').lean()
    if (!doc) {
      return new NextResponse('Not found', { status: 404 })
    }

    const dataUrl: string = (doc as any).url ?? ''
    const commaIdx = dataUrl.indexOf(',')
    if (!dataUrl.startsWith('data:') || commaIdx === -1) {
      // Shouldn't happen, but guard gracefully
      return new NextResponse('Invalid media record', { status: 500 })
    }

    const mime   = dataUrl.slice(5, commaIdx).replace(';base64', '')
    const buffer = Buffer.from(dataUrl.slice(commaIdx + 1), 'base64')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':  mime || ((doc as any).mimeType ?? 'image/webp'),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(buffer.byteLength),
      },
    })
  } catch (err: any) {
    return new NextResponse('Server error', { status: 500 })
  }
}
