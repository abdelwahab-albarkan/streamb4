import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'

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

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="posts.csv"'
      }
    })
  }

  return NextResponse.json(posts)
}
