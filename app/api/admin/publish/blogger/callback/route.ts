import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, listBloggerBlogs } from '@/services/blogger'
import { connectDB }          from '@/lib/mongodb'
import { PlatformCredential } from '@/lib/models/PlatformCredential'

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID     ?? ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ''
const REDIRECT_URI         = process.env.BLOGGER_REDIRECT_URI ?? 'https://streamb4.com/api/admin/publish/blogger/callback'

/**
 * GET /api/admin/publish/blogger/callback
 * Google redirects here after user grants Blogger access.
 * Exchanges the code for tokens and stores them in MongoDB,
 * then redirects the admin back to the settings page.
 */
export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  const redirectBase = '/admin/settings?tab=publishing'

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`${redirectBase}&blogger_error=${encodeURIComponent(error ?? 'no_code')}`, req.url),
    )
  }

  try {
    const result = await exchangeCodeForTokens({
      code,
      clientId:     GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri:  REDIRECT_URI,
    })

    if (!result.success || !result.tokens) {
      return NextResponse.redirect(
        new URL(`${redirectBase}&blogger_error=${encodeURIComponent(result.error ?? 'token_exchange_failed')}`, req.url),
      )
    }

    const now = new Date().toISOString()
    await connectDB()

    // Fetch the user's first blog to auto-select
    const blogs = await listBloggerBlogs(result.tokens.access_token)
    const firstBlog = blogs[0]

    await PlatformCredential.findOneAndUpdate(
      { platform: 'blogger' },
      {
        platform:               'blogger',
        bloggerAccessToken:     result.tokens.access_token,
        bloggerRefreshToken:    result.tokens.refresh_token,
        bloggerTokenExpiresAt:  result.tokens.expiresAt,
        bloggerConnected:       true,
        enabled:                true,
        ...(firstBlog && {
          bloggerBlogId:  firstBlog.id,
          bloggerBlogUrl: firstBlog.url,
        }),
        updatedAt: now,
        createdAt: now,
      },
      { upsert: true, new: true },
    )

    return NextResponse.redirect(
      new URL(`${redirectBase}&blogger_success=1`, req.url),
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'callback_error'
    return NextResponse.redirect(
      new URL(`${redirectBase}&blogger_error=${encodeURIComponent(msg)}`, req.url),
    )
  }
}
