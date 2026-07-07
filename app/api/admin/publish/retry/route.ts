import { NextRequest, NextResponse } from 'next/server'
import { orchestratePublish, type Platform } from '@/services/publisher'

/**
 * POST /api/admin/publish/retry
 * Body: { postId, platform }
 * Retries a single failed platform without affecting other platforms.
 */
export async function POST(req: NextRequest) {
  try {
    const { postId, platform } = await req.json()

    if (!postId || !platform) {
      return NextResponse.json(
        { success: false, error: 'postId and platform are required' },
        { status: 400 },
      )
    }

    const validPlatforms: Platform[] = ['website', 'devto', 'blogger']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { success: false, error: `Unknown platform: ${platform}` },
        { status: 400 },
      )
    }

    const result = await orchestratePublish(postId, {
      platforms:           [platform as Platform],
      notifySearchEngines: platform === 'website',
      pingIndexNow:        platform === 'website',
      updateSitemap:       platform === 'website',
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
