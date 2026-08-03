import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { jsonResponse } from '@/lib/serialize'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format') || 'json'

  await connectDB()
  const posts = await Post.find({}).sort({ isFeatured: -1, featured: -1, publishedAt: -1, createdAt: -1 }).lean()

  if (format === 'csv') {
    const headers = [
      'id','title','slug','status','category',
      'tags','views','seoScore','publishedAt'
    ]

    const csv = [
      headers.join(','),
      ...posts.map((p: any) => [
        p.id || '',
        `"${(p.title || '').replace(/"/g,'""')}"`,
        p.slug || '',
        p.status || '',
        p.category || '',
        `"${(p.tags||[]).join(';')}"`,
        p.views || 0,
        p.seoScore || 0,
        p.publishedAt || ''
      ].join(','))
    ].join('\n')

    const bytes = Buffer.byteLength(csv, 'utf8')
    console.log(`[API Size Log] GET /api/admin/export (CSV): ${bytes} bytes (${(bytes / 1024 / 1024).toFixed(3)} MB)`)

    const MAX_BYTES = 4 * 1024 * 1024 // 4 MB safety limit
    if (bytes > MAX_BYTES) {
      return jsonResponse('GET /api/admin/export [PAYLOAD TOO LARGE]', 
        { success: false, error: 'CSV export too large. Please run the base64 image migration first.' },
        { status: 413 }
      )
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="posts.csv"',
        'Content-Length': String(bytes)
      }
    })
  }

  return jsonResponse('GET /api/admin/export (JSON)', posts)
}
