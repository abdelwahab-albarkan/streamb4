import { NextRequest, NextResponse } from 'next/server'
import { connectDB }     from '@/lib/mongodb'
import { PublishRecord } from '@/lib/models/PublishRecord'

/**
 * GET /api/admin/publish/history?postId=xxx
 * GET /api/admin/publish/history?postId=all   — returns all records (last 200)
 *
 * Returns publish records sorted newest-first.
 */
export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('postId')
    const limit  = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '200'), 500)

    await connectDB()

    const query = (!postId || postId === 'all') ? {} : { postId }

    const records = await PublishRecord
      .find(query)
      .sort({ attemptedAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ success: true, records })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
