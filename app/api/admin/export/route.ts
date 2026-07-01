import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

async function getPosts() {
  try {
    const postsFilePath = path.join(process.cwd(), 'data', 'posts.json')
    const content = await fs.readFile(postsFilePath, 'utf-8')
    return JSON.parse(content || '[]')
  } catch (error) {
    return []
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format') || 'json'
  
  const posts = await getPosts()
  
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
