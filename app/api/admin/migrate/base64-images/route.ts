/**
 * POST /api/admin/migrate/base64-images
 *
 * One-shot, idempotent migration that removes base64 data URLs from every
 * blog post's content and replaces them with short /api/admin/media/<id>
 * endpoint URLs.
 *
 * Idempotency:
 *   - Posts whose content contains NO "data:" src attributes are skipped.
 *   - Before creating a new Media document we hash the base64 payload and
 *     look for an existing Media doc with that hash stored in altText as
 *     "__hash:<sha256>". If found, we reuse its _id.
 *   - The update is a findOneAndUpdate — safe to call multiple times.
 *
 * Vercel timeout:
 *   The route processes every post but streams a progress response so the
 *   serverless function does not time out silently.  We also export
 *   maxDuration = 300 (5 min) for pro plans.
 */

import { NextResponse } from 'next/server'
import { createHash }   from 'crypto'
import { connectDB }    from '@/lib/mongodb'
import { Post }         from '@/lib/models/Post'
import { Media }        from '@/lib/models/Media'

export const maxDuration = 300 // seconds — requires Vercel Pro

// ── helpers ──────────────────────────────────────────────────────────────────

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

/**
 * Extract every  src="data:<mime>;base64,<payload>"  occurrence from a string.
 * Returns an array of { full, mime, payload } objects preserving order.
 */
function extractBase64Images(content: string): Array<{
  full:    string   // the entire   src="data:..."   attribute value (with quotes)
  mime:    string   // e.g. "image/webp"
  payload: string   // raw base64 string
}> {
  const results: Array<{ full: string; mime: string; payload: string }> = []
  // Match  src="data:image/...;base64,<chars>"  (greedy inside quotes is fine
  // because base64 contains no double-quotes).
  const re = /src="(data:(image\/[^;]+);base64,([^"]+))"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) {
    results.push({ full: m[1], mime: m[2], payload: m[3] })
  }
  return results
}

async function migrateBase64Image(payload: string, mime: string, summary: any): Promise<string> {
  const hash    = sha256(payload)
  const hashTag = `__hash:${hash}`

  // Check for an existing Media doc created by a previous migration run
  const existing = await Media.findOne({ altText: hashTag }).select('_id').lean()
  if (existing) {
    summary.imagesReused++
    return String((existing as any)._id)
  }

  // Save the image as a new Media document
  const dataUrl  = `data:${mime};base64,${payload}`
  const buffer   = Buffer.from(payload, 'base64')
  const ext      = mime.split('/')[1] ?? 'webp'
  const filename = `migrated-${hash.slice(0, 8)}.${ext}`

  const doc = await new Media({
    filename,
    url:      dataUrl,
    mimeType: mime,
    size:     buffer.byteLength,
    altText:  hashTag,   // store hash so future runs detect duplicates
  }).save()

  summary.imagesExtracted++
  return String(doc._id)
}

// ── handler ──────────────────────────────────────────────────────────────────

export async function POST() {
  await connectDB()

  // Fetch posts containing base64 in either content or featuredImage
  const posts = await Post.find({
    $or: [
      { content: { $regex: 'data:image/' } },
      { featuredImage: { $regex: '^data:image/' } }
    ]
  }).lean()

  const summary = {
    postsScanned:   posts.length,
    postsUpdated:   0,
    imagesExtracted: 0,
    imagesReused:   0,
    errors:         [] as string[],
  }

  for (const post of posts) {
    try {
      const content = post.content ?? ''
      const featuredImage = post.featuredImage ?? ''
      let newContent = content
      let newFeaturedImage = featuredImage
      let changed = false

      // 1. Migrate featuredImage if it is a base64 string
      if (featuredImage.startsWith('data:image/')) {
        const match = featuredImage.match(/^data:(image\/[^;]+);base64,(.+)$/)
        if (match) {
          const mime = match[1]
          const payload = match[2]
          const mediaId = await migrateBase64Image(payload, mime, summary)
          newFeaturedImage = `/api/admin/media/${mediaId}`
          changed = true
        }
      }

      // 2. Migrate inline images in content
      const matches = extractBase64Images(content)
      if (matches.length > 0) {
        for (const { full, mime, payload } of matches) {
          const mediaId = await migrateBase64Image(payload, mime, summary)
          const endpointUrl = `/api/admin/media/${mediaId}`
          newContent = newContent.replace(
            `src="${full}"`,
            `src="${endpointUrl}"`
          )
          changed = true
        }
      }

      if (changed) {
        await Post.findByIdAndUpdate(post._id, {
          content: newContent,
          featuredImage: newFeaturedImage
        })
        summary.postsUpdated++
      }
    } catch (err: any) {
      summary.errors.push(
        `Post ${post._id}: ${err.message ?? String(err)}`
      )
    }
  }

  return NextResponse.json({ success: true, summary })
}
