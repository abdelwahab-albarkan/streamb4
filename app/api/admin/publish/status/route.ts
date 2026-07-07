import { NextRequest, NextResponse } from 'next/server'
import { connectDB }          from '@/lib/mongodb'
import { Post }               from '@/lib/models/Post'
import { PublishRecord }      from '@/lib/models/PublishRecord'
import { PlatformCredential } from '@/lib/models/PlatformCredential'

/**
 * GET /api/admin/publish/status?postId=xxx
 *
 * Returns a unified status object for all platforms for a given post.
 * Used by the Platform Status Panel (Part 3).
 *
 * Response shape:
 * {
 *   platforms: [
 *     {
 *       key: 'website',
 *       label: 'STREAMB4 Website',
 *       enabled: true,
 *       configured: true,
 *       status: 'published' | 'failed' | 'pending' | 'disabled',
 *       url: 'https://...',
 *       platformId: '',
 *       lastPublishedAt: '2024-...',
 *       lastError: '',
 *       retryCount: 0,
 *       durationMs: 123,
 *     },
 *     ...
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('postId')
    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId required' }, { status: 400 })
    }

    await connectDB()

    const [post, records, creds] = await Promise.all([
      Post.findOne({ id: postId }, {
        status: 1, slug: 1, publishedAt: 1,
        devtoId: 1, devtoUrl: 1, devtoPublishedAt: 1, devtoStatus: 1, devtoError: 1,
        bloggerPostId: 1, bloggerUrl: 1, bloggerPublishedAt: 1, bloggerStatus: 1, bloggerError: 1,
      }).lean() as Promise<Record<string, unknown> | null>,
      PublishRecord.find({ postId }).lean(),
      PlatformCredential.find({}).lean() as Promise<Array<{
        platform: string; enabled?: boolean; bloggerConnected?: boolean; devtoApiKey?: string
      }>>,
    ])

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    const recordByPlatform = Object.fromEntries(
      records.map(r => [r.platform, r])
    )

    const credByPlatform = Object.fromEntries(
      creds.map(c => [c.platform, c])
    )

    const devtoCred   = credByPlatform['devto']
    const bloggerCred = credByPlatform['blogger']

    const platforms = [
      {
        key:             'website',
        label:           'STREAMB4 Website',
        icon:            'globe',
        enabled:         true,
        configured:      true,
        status:          post.status === 'published' ? 'published' : 'pending',
        url:             post.status === 'published' ? `https://streamb4.com/blog/${post.slug as string}` : '',
        platformId:      '',
        lastPublishedAt: (post.publishedAt as string) ?? '',
        lastError:       '',
        retryCount:      recordByPlatform['website']?.retryCount ?? 0,
        durationMs:      recordByPlatform['website']?.durationMs ?? null,
      },
      {
        key:             'devto',
        label:           'DEV.to',
        icon:            'monitor',
        enabled:         devtoCred?.enabled ?? false,
        configured:      !!(devtoCred?.devtoApiKey),
        status:          !devtoCred?.enabled
          ? 'disabled'
          : (post.devtoStatus as string) ?? recordByPlatform['devto']?.status ?? 'pending',
        url:             (post.devtoUrl as string) ?? recordByPlatform['devto']?.url ?? '',
        platformId:      String(post.devtoId ?? recordByPlatform['devto']?.platformId ?? ''),
        lastPublishedAt: (post.devtoPublishedAt as string) ?? '',
        lastError:       (post.devtoError as string) ?? recordByPlatform['devto']?.error ?? '',
        retryCount:      recordByPlatform['devto']?.retryCount ?? 0,
        durationMs:      recordByPlatform['devto']?.durationMs ?? null,
      },
      {
        key:             'blogger',
        label:           'Google Blogger',
        icon:            'book-open',
        enabled:         bloggerCred?.enabled ?? false,
        configured:      !!(bloggerCred?.bloggerConnected),
        status:          !bloggerCred?.enabled
          ? 'disabled'
          : (post.bloggerStatus as string) ?? recordByPlatform['blogger']?.status ?? 'pending',
        url:             (post.bloggerUrl as string) ?? recordByPlatform['blogger']?.url ?? '',
        platformId:      (post.bloggerPostId as string) ?? recordByPlatform['blogger']?.platformId ?? '',
        lastPublishedAt: (post.bloggerPublishedAt as string) ?? '',
        lastError:       (post.bloggerError as string) ?? recordByPlatform['blogger']?.error ?? '',
        retryCount:      recordByPlatform['blogger']?.retryCount ?? 0,
        durationMs:      recordByPlatform['blogger']?.durationMs ?? null,
      },
      // Future placeholders
      { key: 'medium',    label: 'Medium',    icon: 'bookmark', enabled: false, configured: false, status: 'disabled', url: '', platformId: '', lastPublishedAt: '', lastError: '', retryCount: 0, durationMs: null },
      { key: 'hashnode',  label: 'Hashnode',  icon: 'hash',     enabled: false, configured: false, status: 'disabled', url: '', platformId: '', lastPublishedAt: '', lastError: '', retryCount: 0, durationMs: null },
      { key: 'wordpress', label: 'WordPress', icon: 'layout',   enabled: false, configured: false, status: 'disabled', url: '', platformId: '', lastPublishedAt: '', lastError: '', retryCount: 0, durationMs: null },
    ]

    return NextResponse.json({ success: true, platforms })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
