import { NextRequest, NextResponse } from 'next/server'
import { getBloggerAuthUrl, exchangeCodeForTokens, listBloggerBlogs } from '@/services/blogger'
import { connectDB }          from '@/lib/mongodb'
import { PlatformCredential } from '@/lib/models/PlatformCredential'

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID     ?? ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ''
const REDIRECT_URI         = process.env.BLOGGER_REDIRECT_URI ?? 'https://streamb4.com/api/admin/publish/blogger/callback'

/**
 * GET /api/admin/publish/blogger?action=auth
 * Returns the Google OAuth consent-screen URL.
 *
 * GET /api/admin/publish/blogger?action=blogs
 * Lists the user's Blogger blogs (requires connected account).
 */
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action')

  if (action === 'auth') {
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_CLIENT_ID env var not set' },
        { status: 500 },
      )
    }
    const url = getBloggerAuthUrl({
      clientId:    GOOGLE_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      state:       'blogger_connect',
    })
    return NextResponse.json({ success: true, url })
  }

  if (action === 'blogs') {
    await connectDB()
    const cred = await PlatformCredential.findOne({ platform: 'blogger' }).lean() as {
      bloggerAccessToken?: string; bloggerConnected?: boolean
    } | null

    if (!cred?.bloggerConnected || !cred.bloggerAccessToken) {
      return NextResponse.json({ success: false, error: 'Blogger not connected' }, { status: 400 })
    }

    const blogs = await listBloggerBlogs(cred.bloggerAccessToken)
    return NextResponse.json({ success: true, blogs })
  }

  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
}

/**
 * POST /api/admin/publish/blogger
 * Body: { code } — exchange code for tokens (used after OAuth redirect in non-redirect flow).
 */
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ success: false, error: 'code is required' }, { status: 400 })

    const result = await exchangeCodeForTokens({
      code,
      clientId:     GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri:  REDIRECT_URI,
    })

    if (!result.success || !result.tokens) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    const now = new Date().toISOString()
    await connectDB()
    await PlatformCredential.findOneAndUpdate(
      { platform: 'blogger' },
      {
        platform:               'blogger',
        bloggerAccessToken:     result.tokens.access_token,
        bloggerRefreshToken:    result.tokens.refresh_token,
        bloggerTokenExpiresAt:  result.tokens.expiresAt,
        bloggerConnected:       true,
        updatedAt:              now,
        createdAt:              now,
      },
      { upsert: true, new: true },
    )

    // Fetch blog list to auto-populate
    const blogs = await listBloggerBlogs(result.tokens.access_token)

    return NextResponse.json({ success: true, blogs })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/admin/publish/blogger
 * Disconnect Blogger (removes tokens from DB).
 */
export async function DELETE() {
  try {
    await connectDB()
    await PlatformCredential.findOneAndUpdate(
      { platform: 'blogger' },
      {
        bloggerAccessToken:    '',
        bloggerRefreshToken:   '',
        bloggerTokenExpiresAt: '',
        bloggerConnected:      false,
        bloggerBlogId:         '',
        bloggerBlogUrl:        '',
        updatedAt:             new Date().toISOString(),
      },
    )
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
