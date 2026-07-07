import { NextRequest, NextResponse } from 'next/server'
import { connectDB }            from '@/lib/mongodb'
import { PlatformCredential }   from '@/lib/models/PlatformCredential'
import { verifyDevToKey }       from '@/services/devto'

/**
 * GET /api/admin/platforms
 * Returns all platform settings (with secrets masked).
 */
export async function GET() {
  try {
    await connectDB()
    const creds = await PlatformCredential.find({}).lean()

    // Mask secrets before sending to browser
    const safe = creds.map((c: Record<string, unknown>) => ({
      ...c,
      devtoApiKey:           c.devtoApiKey           ? '••••••••' : '',
      bloggerAccessToken:    c.bloggerAccessToken     ? '••••••••' : '',
      bloggerRefreshToken:   c.bloggerRefreshToken    ? '••••••••' : '',
    }))

    return NextResponse.json({ success: true, platforms: safe })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

/**
 * POST /api/admin/platforms
 * Upserts platform credentials.
 * Body: { platform, ...fields }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { platform, ...fields } = body

    if (!platform) {
      return NextResponse.json({ success: false, error: 'platform is required' }, { status: 400 })
    }

    await connectDB()

    // Verify DEV.to key if being updated
    if (platform === 'devto' && fields.devtoApiKey && fields.devtoApiKey !== '••••••••') {
      const verify = await verifyDevToKey(fields.devtoApiKey)
      if (!verify.valid) {
        return NextResponse.json(
          { success: false, error: 'Invalid DEV.to API key — verification failed' },
          { status: 400 },
        )
      }
      fields.devtoUsername = verify.username
    }

    // Don't overwrite existing secrets with the masked placeholder
    const existing = await PlatformCredential.findOne({ platform }).lean() as Record<string, unknown> | null
    const update: Record<string, unknown> = { ...fields, platform, updatedAt: new Date().toISOString() }

    if (fields.devtoApiKey === '••••••••' && existing?.devtoApiKey) {
      delete update.devtoApiKey
    }
    if (fields.bloggerAccessToken === '••••••••' && existing?.bloggerAccessToken) {
      delete update.bloggerAccessToken
    }

    if (!existing) update.createdAt = new Date().toISOString()

    await PlatformCredential.findOneAndUpdate(
      { platform },
      update,
      { upsert: true, new: true },
    )

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
