/**
 * Publisher Orchestrator Service
 *
 * Central service that coordinates publishing to all platforms.
 * - Never throws — returns per-platform results.
 * - Continues if one platform fails (retry-safe).
 * - Records every attempt in the PublishRecord collection.
 */

import { connectDB } from '@/lib/mongodb'
import { Post }      from '@/lib/models/Post'
import { PlatformCredential } from '@/lib/models/PlatformCredential'
import { PublishRecord }      from '@/lib/models/PublishRecord'
import { buildDevToPayload, publishToDevTo, updateOnDevTo } from './devto'
import {
  publishToBlogger, updateBloggerPost, markdownToHtml,
  refreshAccessToken,
} from './blogger'
import { notifySearchEngines }   from './indexing'
import { pingGoogleSitemap }     from './sitemap'

// ─── Types ──────────────────────────────────────────────────────────────────

export type Platform = 'website' | 'devto' | 'blogger'

export interface PublishOptions {
  // Website options
  updateRss?:              boolean
  updateSitemap?:          boolean
  notifySearchEngines?:    boolean
  pingIndexNow?:           boolean
  generateOpenGraph?:      boolean
  generateTwitterCard?:    boolean
  regenerateInternalLinks?: boolean
  // Platform targets
  platforms:               Platform[]
}

export interface PlatformResult {
  platform:    Platform
  success:     boolean
  url?:        string
  platformId?: string
  error?:      string
  skipped?:    boolean
  skipReason?: string
}

export interface PublishResult {
  websiteSuccess: boolean
  results:        PlatformResult[]
  errors:         string[]
  completedAt:    string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function recordAttempt(postId: string, platform: Platform, result: PlatformResult): Promise<void> {
  try {
    const now = new Date().toISOString()
    const existing = await PublishRecord.findOne({ postId, platform })
    if (existing) {
      existing.status      = result.success ? 'published' : 'failed'
      existing.url         = result.url     ?? existing.url
      existing.platformId  = result.platformId ?? existing.platformId
      existing.error       = result.error   ?? ''
      existing.completedAt = now
      existing.retryCount  = (existing.retryCount ?? 0) + 1
      existing.retriedAt   = now
      await existing.save()
    } else {
      await new PublishRecord({
        postId,
        platform,
        status:      result.success ? 'published' : 'failed',
        url:         result.url       ?? '',
        platformId:  result.platformId ?? '',
        error:       result.error      ?? '',
        attemptedAt: now,
        completedAt: now,
        retryCount:  0,
      }).save()
    }
  } catch {
    // Record failures must not block publishing
  }
}

// ─── Platform publishers ─────────────────────────────────────────────────────

async function publishWebsite(post: Record<string, unknown>, opts: PublishOptions): Promise<PlatformResult> {
  try {
    const now    = new Date().toISOString()
    const postId = post.id as string
    const slug   = post.slug as string

    const update: Record<string, unknown> = {
      status:      'published',
      lastSyncAt:  now,
    }

    // Only stamp publishedAt on first publish
    const existing = await Post.findOne({ id: postId }, { publishedAt: 1 }).lean() as { publishedAt?: string } | null
    if (!existing?.publishedAt) update.publishedAt = now

    await Post.updateOne({ id: postId }, update)

    // Fire-and-forget side effects (do NOT block on failures)
    const sideEffects: Promise<unknown>[] = []
    if (opts.notifySearchEngines || opts.pingIndexNow) {
      sideEffects.push(notifySearchEngines(slug))
    }
    if (opts.updateSitemap) {
      sideEffects.push(pingGoogleSitemap())
    }
    await Promise.allSettled(sideEffects)

    return { platform: 'website', success: true, url: `https://streamb4.com/blog/${slug}` }
  } catch (err: unknown) {
    return { platform: 'website', success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

async function publishDevTo(post: Record<string, unknown>): Promise<PlatformResult> {
  try {
    const cred = await PlatformCredential.findOne({ platform: 'devto' }).lean() as {
      enabled?: boolean; devtoApiKey?: string; devtoCanonicalUrlEnabled?: boolean
      devtoUsername?: string
    } | null

    if (!cred?.enabled) {
      return { platform: 'devto', success: false, skipped: true, skipReason: 'DEV.to not enabled in settings' }
    }
    if (!cred.devtoApiKey) {
      return { platform: 'devto', success: false, skipped: true, skipReason: 'DEV.to API key not configured' }
    }

    const payload = buildDevToPayload({
      title:               post.title as string,
      content:             post.content as string,
      tags:                (post.tags as string[]) ?? [],
      slug:                post.slug as string,
      canonicalUrlEnabled: cred.devtoCanonicalUrlEnabled ?? true,
      featuredImage:       post.featuredImage as string | undefined,
      excerpt:             post.excerpt as string | undefined,
      published:           true,
    })

    // Update or create
    const devtoId = post.devtoId as number | undefined
    let result
    if (devtoId) {
      result = await updateOnDevTo(cred.devtoApiKey, devtoId, payload)
    } else {
      result = await publishToDevTo(cred.devtoApiKey, payload)
    }

    if (result.success && result.id) {
      await Post.updateOne(
        { id: post.id },
        {
          devtoId:          result.id,
          devtoUrl:         result.url,
          devtoPublishedAt: result.publishedAt,
          devtoStatus:      'published',
          devtoError:       '',
        },
      )
    } else {
      await Post.updateOne({ id: post.id }, { devtoStatus: 'failed', devtoError: result.error ?? '' })
    }

    return {
      platform:   'devto',
      success:    result.success,
      url:        result.url,
      platformId: result.id?.toString(),
      error:      result.error,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    await Post.updateOne({ id: post.id }, { devtoStatus: 'failed', devtoError: msg })
    return { platform: 'devto', success: false, error: msg }
  }
}

async function publishBlogger(post: Record<string, unknown>): Promise<PlatformResult> {
  try {
    const cred = await PlatformCredential.findOne({ platform: 'blogger' }).lean() as {
      enabled?: boolean; bloggerConnected?: boolean; bloggerBlogId?: string
      bloggerAccessToken?: string; bloggerRefreshToken?: string; bloggerTokenExpiresAt?: string
    } | null

    if (!cred?.enabled) {
      return { platform: 'blogger', success: false, skipped: true, skipReason: 'Blogger not enabled in settings' }
    }
    if (!cred.bloggerConnected || !cred.bloggerBlogId) {
      return { platform: 'blogger', success: false, skipped: true, skipReason: 'Blogger not connected — complete OAuth in Settings → Publishing' }
    }

    // Refresh token if expired
    let accessToken = cred.bloggerAccessToken ?? ''
    if (cred.bloggerTokenExpiresAt) {
      const expiresAt = new Date(cred.bloggerTokenExpiresAt).getTime()
      if (Date.now() >= expiresAt - 60_000) {
        const googleClientId     = process.env.GOOGLE_CLIENT_ID ?? ''
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ''
        const refreshResult = await refreshAccessToken({
          refreshToken:  cred.bloggerRefreshToken ?? '',
          clientId:      googleClientId,
          clientSecret:  googleClientSecret,
        })
        if (refreshResult.success && refreshResult.accessToken) {
          accessToken = refreshResult.accessToken
          await PlatformCredential.updateOne(
            { platform: 'blogger' },
            { bloggerAccessToken: accessToken, bloggerTokenExpiresAt: refreshResult.expiresAt },
          )
        } else {
          return { platform: 'blogger', success: false, error: 'Token refresh failed — reconnect Blogger in Settings' }
        }
      }
    }

    const htmlContent = markdownToHtml(post.content as string)
    const bloggerPost = {
      title:   post.title as string,
      content: htmlContent,
      labels:  (post.tags as string[]) ?? [],
    }

    const bloggerPostId = post.bloggerPostId as string | undefined
    let result
    if (bloggerPostId) {
      result = await updateBloggerPost({
        accessToken,
        blogId:  cred.bloggerBlogId,
        postId:  bloggerPostId,
        post:    bloggerPost,
      })
    } else {
      result = await publishToBlogger({
        accessToken,
        blogId: cred.bloggerBlogId,
        post:   bloggerPost,
      })
    }

    if (result.success && result.postId) {
      await Post.updateOne(
        { id: post.id },
        {
          bloggerPostId:      result.postId,
          bloggerUrl:         result.url,
          bloggerPublishedAt: result.publishedAt,
          bloggerStatus:      'published',
          bloggerError:       '',
        },
      )
    } else {
      await Post.updateOne({ id: post.id }, { bloggerStatus: 'failed', bloggerError: result.error ?? '' })
    }

    return {
      platform:   'blogger',
      success:    result.success,
      url:        result.url,
      platformId: result.postId,
      error:      result.error,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    await Post.updateOne({ id: post.id }, { bloggerStatus: 'failed', bloggerError: msg })
    return { platform: 'blogger', success: false, error: msg }
  }
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

/**
 * Orchestrate publishing to all requested platforms.
 * - Runs platforms concurrently.
 * - Records every attempt.
 * - Never throws.
 */
export async function orchestratePublish(
  postId: string,
  opts: PublishOptions,
): Promise<PublishResult> {
  await connectDB()

  const post = await Post.findOne({ id: postId }).lean() as Record<string, unknown> | null
  if (!post) {
    return {
      websiteSuccess: false,
      results: [],
      errors: [`Post ${postId} not found`],
      completedAt: new Date().toISOString(),
    }
  }

  const platformSet = new Set(opts.platforms)
  const tasks: Promise<PlatformResult>[] = []

  if (platformSet.has('website'))  tasks.push(publishWebsite(post, opts))
  if (platformSet.has('devto'))    tasks.push(publishDevTo(post))
  if (platformSet.has('blogger'))  tasks.push(publishBlogger(post))

  const settled = await Promise.allSettled(tasks)
  const results: PlatformResult[] = settled.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : { platform: 'website' as Platform, success: false, error: String((r as PromiseRejectedResult).reason) }
  )

  // Record all attempts
  await Promise.allSettled(results.map(r => recordAttempt(postId, r.platform, r)))

  const errors = results.filter(r => !r.success && !r.skipped).map(r => r.error ?? 'Unknown error')
  const websiteSuccess = results.find(r => r.platform === 'website')?.success ?? false

  return {
    websiteSuccess,
    results,
    errors,
    completedAt: new Date().toISOString(),
  }
}
