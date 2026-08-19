/**
 * One-time SEO data migration
 * Run: node --env-file=.env.local scripts/fix-seo-data.mjs
 *
 * Fixes:
 * 1. Rename slug draft-1784162544682 → best-sports-iptv-providers-2026
 * 2. Add missing metaDescription to is-iptv-legal-in-the-usa-the-complete-2026-guide
 */

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found. Run: node --env-file=.env.local scripts/fix-seo-data.mjs')
  process.exit(1)
}

const PostSchema = new mongoose.Schema({}, { strict: false })
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema)

async function main() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('Connected.')

  // Fix 1: Rename draft slug
  const OLD_SLUG = 'draft-1784162544682'
  const NEW_SLUG = 'best-sports-iptv-providers-2026'

  const draftPost = await Post.findOne({ slug: OLD_SLUG })
  if (!draftPost) {
    console.log(`[1] Post with slug "${OLD_SLUG}" not found — already renamed or removed.`)
  } else {
    console.log(`[1] Found post: "${draftPost.title}" — renaming slug to "${NEW_SLUG}"`)
    const existing = await Post.findOne({ slug: NEW_SLUG })
    if (existing) {
      console.error(`[1] ERROR: Slug "${NEW_SLUG}" already taken by: ${existing.title}`)
    } else {
      await Post.updateOne({ slug: OLD_SLUG }, { $set: { slug: NEW_SLUG } })
      console.log(`[1] ✅ Renamed slug to "${NEW_SLUG}"`)
    }
  }

  // Fix 2: Add meta description to the IPTV legal post
  const LEGAL_SLUG = 'is-iptv-legal-in-the-usa-the-complete-2026-guide'
  const META_DESC = 'Find out if IPTV is legal in the USA in 2026. Learn which services are legal, what the risks are, and how to stream safely and legally with STREAMB4.'

  const legalPost = await Post.findOne({ slug: LEGAL_SLUG })
  if (!legalPost) {
    console.log(`[2] Post with slug "${LEGAL_SLUG}" not found.`)
  } else {
    console.log(`[2] Found post: "${legalPost.title}" — current metaDescription: "${legalPost.metaDescription || '(empty)'}"`)
    if (legalPost.metaDescription && legalPost.metaDescription.trim().length > 0) {
      console.log('[2] Already has a meta description — skipping.')
    } else {
      await Post.updateOne({ slug: LEGAL_SLUG }, { $set: { metaDescription: META_DESC } })
      console.log(`[2] ✅ Set metaDescription: "${META_DESC}"`)
    }
  }

  await mongoose.disconnect()
  console.log('Done.')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  mongoose.disconnect()
  process.exit(1)
})
