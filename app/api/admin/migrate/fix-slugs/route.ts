/**
 * POST /api/admin/migrate/fix-slugs
 *
 * Idempotent migration that finds every post whose slug is invalid
 * (too long, contains special chars, or was generated from content)
 * and repairs it using the shared generateSlug utility.
 *
 * What "invalid" means:
 *  - length > 80 characters
 *  - contains characters outside [a-z0-9-]
 *  - starts or ends with a hyphen
 *  - contains consecutive hyphens
 *
 * Repair strategy:
 *  - Run the bad slug through generateSlug() — this trims it to ≤80 chars
 *    at a word boundary, lowercases, and strips invalid chars.
 *  - If the repaired slug collides with another post, append -2, -3, …
 *
 * Safety:
 *  - Posts with already-valid slugs are skipped (no DB write).
 *  - Returns a dry-run summary if ?dryRun=true is passed.
 *  - Idempotent — safe to run multiple times.
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB }                 from '@/lib/mongodb'
import { Post }                      from '@/lib/models/Post'
import { generateSlug, isValidSlug } from '@/lib/slugUtils'

export async function POST(request: NextRequest) {
  const dryRun = new URL(request.url).searchParams.get('dryRun') === 'true'

  await connectDB()

  // Load every post's id, slug, title — avoid pulling content
  const posts = await Post.find({}, { id: 1, slug: 1, title: 1 }).lean() as Array<{
    _id: unknown; id: string; slug: string; title: string
  }>

  const summary = {
    total:   posts.length,
    skipped: 0,   // already valid
    fixed:   0,
    errors:  [] as string[],
  }

  // Build a set of all current slugs for uniqueness checking
  const slugSet = new Set(posts.map(p => p.slug ?? ''))

  for (const post of posts) {
    const current = post.slug ?? ''

    if (isValidSlug(current)) {
      summary.skipped++
      continue
    }

    // Repair: prefer title-based slug; fall back to repairing the raw slug
    const base = post.title
      ? generateSlug(post.title)
      : generateSlug(current)

    if (!base) {
      summary.errors.push(`${post.id}: could not generate slug (title="${post.title}", slug="${current}")`)
      continue
    }

    // Ensure uniqueness — exclude the current post's own slug from the set
    slugSet.delete(current)
    let candidate = base
    let counter   = 2
    while (slugSet.has(candidate)) {
      candidate = `${base}-${counter++}`
    }

    if (!dryRun) {
      try {
        await Post.findOneAndUpdate({ id: post.id }, { slug: candidate })
        slugSet.add(candidate)
        summary.fixed++
      } catch (err: any) {
        summary.errors.push(`${post.id}: ${err.message ?? String(err)}`)
        slugSet.add(current) // keep old slug in set to avoid false "unique"
      }
    } else {
      // Dry run — just count what would happen
      slugSet.add(candidate)
      summary.fixed++
    }
  }

  return NextResponse.json({ success: true, dryRun, summary })
}
