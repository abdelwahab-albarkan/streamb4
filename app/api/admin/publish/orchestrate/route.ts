import { NextRequest, NextResponse } from 'next/server'
import { orchestratePublish, type PublishOptions } from '@/services/publisher'

/**
 * POST /api/admin/publish/orchestrate
 * Body: { postId, platforms, options }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const postId: string    = body.postId
    const platforms: string[] = body.platforms ?? ['website']
    const options: PublishOptions = {
      platforms:               platforms as PublishOptions['platforms'],
      updateRss:               body.updateRss               ?? true,
      updateSitemap:           body.updateSitemap           ?? true,
      notifySearchEngines:     body.notifySearchEngines      ?? true,
      pingIndexNow:            body.pingIndexNow             ?? true,
      generateOpenGraph:       body.generateOpenGraph        ?? true,
      generateTwitterCard:     body.generateTwitterCard      ?? true,
      regenerateInternalLinks: body.regenerateInternalLinks  ?? false,
    }

    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 })
    }

    const result = await orchestratePublish(postId, options)

    return NextResponse.json({ success: true, ...result })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
