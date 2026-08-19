import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Media } from '@/lib/models/Media'

/**
 * GET /api/media/:id
 *
 * Public endpoint for serving blog images stored in MongoDB.
 * No authentication required — blog visitors and Googlebot must be able to fetch these.
 *
 * Images are stored as base64 data URLs in the Media collection.
 * This route decodes and streams the binary, identical to /api/admin/media/[id]
 * but without the /api/admin/ prefix that robots.txt disallows for crawlers.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const doc = await Media.findById(id).select('url mimeType').lean()

    if (!doc) {
      return new NextResponse('Not found', { status: 404 })
    }

    const dataUrl: string = (doc as any).url ?? ''

    // If migrated to external storage (S3/Blob), redirect there
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      return NextResponse.redirect(dataUrl, { status: 302 })
    }

    const commaIdx = dataUrl.indexOf(',')
    if (!dataUrl.startsWith('data:') || commaIdx === -1) {
      return new NextResponse('Invalid media record', { status: 500 })
    }

    const mime   = dataUrl.slice(5, commaIdx).replace(';base64', '')
    const buffer = Buffer.from(dataUrl.slice(commaIdx + 1), 'base64')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':   mime || ((doc as any).mimeType ?? 'image/jpeg'),
        'Cache-Control':  'public, max-age=31536000, immutable',
        'Content-Length': String(buffer.byteLength),
      },
    })
  } catch {
    return new NextResponse('Server error', { status: 500 })
  }
}
