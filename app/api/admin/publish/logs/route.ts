import { NextRequest, NextResponse } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import { PublishLog }  from '@/lib/models/PublishLog'

/**
 * GET /api/admin/publish/logs?postId=xxx&platform=devto&limit=100
 *
 * Returns detailed publish audit log entries, newest-first.
 *
 * Query params (all optional):
 *   postId    — filter by post ID (or 'all' for all posts)
 *   platform  — filter by platform ('website' | 'devto' | 'blogger')
 *   status    — filter by status ('success' | 'failed' | 'skipped')
 *   limit     — max results (default 100, max 500)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const postId   = searchParams.get('postId')
    const platform = searchParams.get('platform')
    const status   = searchParams.get('status')
    const limit    = Math.min(Number(searchParams.get('limit') ?? '100'), 500)

    await connectDB()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {}
    if (postId   && postId   !== 'all') query.postId   = postId
    if (platform && platform !== 'all') query.platform = platform
    if (status   && status   !== 'all') query.status   = status

    const logs = await PublishLog
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ success: true, logs })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
