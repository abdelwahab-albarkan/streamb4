import { NextRequest, NextResponse } from 'next/server'
import { connectDB }     from '@/lib/mongodb'
import { PublishRecord } from '@/lib/models/PublishRecord'

/**
 * GET /api/admin/publish/history?postId=xxx
 * Returns all publish records for a given post.
 */
export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('postId')
    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 })
    }

    await connectDB()
    const records = await PublishRecord.find({ postId })
      .sort({ attemptedAt: -1 })
      .lean()

    return NextResponse.json({ success: true, records })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
