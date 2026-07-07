/**
 * Publisher Orchestrator Service
 *
 * Central service that coordinates publishing to all platforms.
 *
 * Guarantees:
 * - Never throws — always returns per-platform results.
 * - Continues if one platform fails (Promise.allSettled).
 * - Records every attempt in PublishRecord (upsert, one per post×platform).
 * - Writes a detailed PublishLog entry after each attempt.
 * - Tracks duration (ms) per platform.
 * - Updates PublishAnalytics counters (today's date bucket).
 * - Handles DEV.to 422 recovery (already in devto.ts).
 */

import { connectDB }        from '@/lib/mongodb'
import { Post }             from '@/lib/models/Post'
import { PlatformCredential } from '@/lib/models/PlatformCredential'
import { PublishRecord }    from '@/lib/models/PublishRecord'
import { PublishLog }       from '@/lib/models/PublishLog'
import { PublishAnalytics } from '@/lib/models/PublishAnalytics'
import { buildDevToPayload, publishToDevTo, updateOnDevTo } from './devto'
import {
  publishToBlogger, updateBloggerPost, markdownToHtml,
  refreshAccessToken,
} from './blogger'
import { notifySearchEngines } from './indexing'
import { pingGoogleSitemap }   from './sitemap'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Platform = 'website' | 'devto' | 'blogger'

export interface PublishOptions {
  // Website side-effects
  updateRss?:               boolean
  updateSitemap?:           boolean
  notifySearchEngines?:     boolean
  pingIndexNow?:            boolean
  generateOpenGraph?:       boolean
  generateTwitterCard?:     boolean
  regenerateInternalLinks?: boolean
  // Which platforms to publish to
  platforms:                Platform[]
}

export interface PlatformResult {
  platform:    Platform
  success:     boolean
  action?:     'create' | 'update' | 'retry' | 'skip'
  url?:        string
  platformId?: string
  durationMs?: number
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

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Persist attempt to PublishRecord (upsert — one doc per post × platform). */
async function upsertRecord(postId: string, platform: Platform, result: PlatformResult): Promise<void> {
  try {
    const now = new Date().toISOString()
    const existing = await PublishRecord.findOne({ postId, platform })

    if (existing) {
      existing.status     = result.success ? 'published' : 'failed'
      existing.url        = result.url        ?? existing.url
      existing.platformId = result.platformId ?? existing.platformId
      existing.error      = result.error      ?? ''
      existing.durationMs = result.durationMs ?? existing.durationMs
      existing.completedAt = now
      existing.retryCount  = (existing.retryCount ?? 0) + 1
      existing.retriedAt   = now
      await existing.save()
    } else {
      await new PublishRecord({
        postId,
        platform,
        status:      result.success ? 'published' : 'failed',
        url:         result.url        ?? '',
        platformId:  result.platformId ?? '',
        error:       result.error      ?? '',
        durationMs:  result.durationMs ?? null,
        attemptedAt: now,
        completedAt: now,
        retryCount:  0,
      }).save()
    }
  } catch {
    // Record failures must never block the publish flow
  }
}

/** Write a detailed audit log entry. */
async function writeLog(
  postId:  string,
  platform: Platform,
  result:   PlatformResult,
): Promise<void> {
  try {
    const action: IPublishLog_action = result.skipped
      ? 'skip'
      : (result.action ?? (result.success ? 'create' : 'create'))

    await new PublishLog({
      postId,
      platform,
      action,
      status:     result.success ? 'success' : result.skipped ? 'skipped' : 'failed',
      durationMs: result.durationMs ?? null,
      url:        result.url        ?? '',
      platformId: result.platformId ?? '',
      error:      result.error      ?? '',
      message:    result.skipped
        ? result.skipReason ?? 'Skipped'
        : result.success
          ? `Published to ${platform}`
          : result.error ?? 'Unknown error',
      timestamp: new Date().toISOString(),
    }).save()
  } catch {
    // Log failures must never block the publish flow
  }
}

type IPublishLog_action = 'create' | 'update' | 'retry' | 'delete' | 'skip'

/** Increment today's PublishAnalytics bucket. */
async function incrementAnalytics(
  platform: Platform,
  success: boolean,
  durationMs: number,
): Promise<void> {
  try {
    const today = new Date().toISOString().slice(0, 10)
    await PublishAnalytics.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          total:                      1,
          success:                    success ? 1 : 0,
          failed:                     success ? 0 : 1,
          [platform]:                 1,
          totalDuration:              durationMs,
        },
      },
      { upsert: true },
    )
  } catch {
    // Analytics failures must never block publishing
  }
}

// ─── Platform publishers ──────────────────────────────────────────────────────

async function publishWebsite(
  post: Record<string, unknown>,
  opts: PublishOptions,
): Promise<PlatformResult> {
  const t0     = Date.now()
  const postId = post.id  as string
  const slug   = post.slug as string

  try {
    const now = new Date().toISOString()

    const update: Record<string, unknown> = {
      status:     'published',
      lastSyncAt: now,
    }

    // Stamp publishedAt only on first publish
    const current = await Post.findOne({ id: postId }, { publishedAt: 1 }).lean() as { publishedAt?: string } | null
    if (!current?.publishedAt) update.publishedAt = now

    await Post.updateOne({ id: postId }, update)

    // Non-blocking side-effects
    const fx: Promise<unknown>[] = []
    if (opts.notifySearchEngines || opts.pingIndexNow) fx.push(notifySearchEngines(slug))
    if (opts.updateSitemap)                            fx.push(pingGoogleSitemap())
    await Promise.allSettled(fx)

    return {
      platform:   'website',
      success:    true,
      action:     'update',
      url:        `https://streamb4.com/blog/${slug}`,
      durationMs: Date.now() - t0,
    }
  } catch (err: unknown) {
    return {
      platform:   'website',
      success:    false,
      action:     'create',
      error:      err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - t0,
    }
  }
}

async function publishDevTo(
  post: Record<string, unknown>,
): Promise<PlatformResult> {
  const t0 = Date.now()

  try {
    const cred = await PlatformCredential.findOne({ platform: 'devto' }).lean() as {
      enabled?: boolean
      devtoApiKey?: string
      devtoCanonicalUrlEnabled?: boolean
    } | null

    if (!cred?.enabled) {
      return { platform: 'devto', success: false, skipped: true, skipReason: 'DEV.to not enabled in settings', durationMs: Date.now() - t0 }
    }
    if (!cred.devtoApiKey) {
      return { platform: 'devto', success: false, skipped: true, skipReason: 'DEV.to API key not configured', durationMs: Date.now() - t0 }
    }

    const payload = buildDevToPayload({
      title:               post.title        as string,
      content:             post.content      as string,
      tags:                (post.tags        as string[]) ?? [],
      slug:                post.slug         as string,
      canonicalUrlEnabled: cred.devtoCanonicalUrlEnabled ?? true,
      featuredImage:       post.featuredImage as string | undefined,
      excerpt:             post.excerpt       as string | undefined,
      published:           true,
    })

    const devtoId = post.devtoId as number | undefined

    // SMART UPDATE: if we already have a devtoId, always update — never create
    let result: Awaited<ReturnType<typeof publishToDevTo>>
    let action: 'create' | 'update' = 'create'

    if (devtoId) {
      action = 'update'
      result = await updateOnDevTo(cred.devtoApiKey, devtoId, payload)
    } else {
      // publishToDevTo already handles 422 recovery internally
      result = await publishToDevTo(cred.devtoApiKey, payload)
      // If recovery found and updated an existing article
      if ((result as { recovered?: boolean }).recovered) action = 'update'
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
    } else if (!result.success) {
      await Post.updateOne(
        { id: post.id },
        { devtoStatus: 'failed', devtoError: result.error ?? '' },
      )
    }

    return {
      platform:   'devto',
      success:    result.success,
      action,
      url:        result.url,
      platformId: result.id?.toString(),
      error:      result.error,
      durationMs: Date.now() - t0,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    await Post.updateOne({ id: post.id }, { devtoStatus: 'failed', devtoError: msg }).catch(() => {/* ignore */})
    return { platform: 'devto', success: false, action: 'create', error: msg, durationMs: Date.now() - t0 }
  }
}

async function publishBlogger(
  post: Record<string, unknown>,
): Promise<PlatformResult> {
  const t0 = Date.now()

  try {
    const cred = await PlatformCredential.findOne({ platform: 'blogger' }).lean() as {
      enabled?: boolean
      bloggerConnected?: boolean
      bloggerBlogId?: string
      bloggerAccessToken?: string
      bloggerRefreshToken?: string
      bloggerTokenExpiresAt?: string
    } | null

    if (!cred?.enabled) {
      return { platform: 'blogger', success: false, skipped: true, skipReason: 'Blogger not enabled in settings', durationMs: Date.now() - t0 }
    }
    if (!cred.bloggerConnected || !cred.bloggerBlogId) {
      return { platform: 'blogger', success: false, skipped: true, skipReason: 'Blogger not connected — complete OAuth in Settings → Publishing', durationMs: Date.now() - t0 }
    }

    // Refresh token if within 60s of expiry
    let accessToken = cred.bloggerAccessToken ?? ''
    if (cred.bloggerTokenExpiresAt) {
      const expiresAt = new Date(cred.bloggerTokenExpiresAt).getTime()
      if (Date.now() >= expiresAt - 60_000) {
        const refreshResult = await refreshAccessToken({
          refreshToken: cred.bloggerRefreshToken ?? '',
          clientId:     process.env.GOOGLE_CLIENT_ID     ?? '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        })
        if (refreshResult.success && refreshResult.accessToken) {
          accessToken = refreshResult.accessToken
          await PlatformCredential.updateOne(
            { platform: 'blogger' },
            { bloggerAccessToken: accessToken, bloggerTokenExpiresAt: refreshResult.expiresAt },
          )
        } else {
          return {
            platform: 'blogger', success: false,
            error: 'Token refresh failed — reconnect Blogger in Settings → Publishing',
            durationMs: Date.now() - t0,
          }
        }
      }
    }

    const htmlContent  = markdownToHtml(post.content as string)
    const bloggerPost  = {
      title:   post.title as string,
      content: htmlContent,
      labels:  (post.tags as string[]) ?? [],
    }
    const bloggerPostId = post.bloggerPostId as string | undefined

    let result: Awaited<ReturnType<typeof publishToBlogger>>
    let action: 'create' | 'update' = 'create'

    if (bloggerPostId) {
      action = 'update'
      result = await updateBloggerPost({
        accessToken,
        blogId: cred.bloggerBlogId,
        postId: bloggerPostId,
        post:   bloggerPost,
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
    } else if (!result.success) {
      await Post.updateOne(
        { id: post.id },
        { bloggerStatus: 'failed', bloggerError: result.error ?? '' },
      )
    }

    return {
      platform:   'blogger',
      success:    result.success,
      action,
      url:        result.url,
      platformId: result.postId,
      error:      result.error,
      durationMs: Date.now() - t0,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    await Post.updateOne({ id: post.id }, { bloggerStatus: 'failed', bloggerError: msg }).catch(() => {/* ignore */})
    return { platform: 'blogger', success: false, action: 'create', error: msg, durationMs: Date.now() - t0 }
  }
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

/**
 * Orchestrate publishing to all requested platforms.
 *
 * - Runs all platform tasks concurrently (Promise.allSettled).
 * - One platform failure never blocks the others.
 * - Writes PublishRecord, PublishLog, and PublishAnalytics after every attempt.
 * - Never throws.
 */
export async function orchestratePublish(
  postId: string,
  opts:   PublishOptions,
): Promise<PublishResult> {
  await connectDB()

  const post = await Post.findOne({ id: postId }).lean() as Record<string, unknown> | null
  if (!post) {
    return {
      websiteSuccess: false,
      results: [],
      errors:  [`Post ${postId} not found`],
      completedAt: new Date().toISOString(),
    }
  }

  const platformSet = new Set(opts.platforms)
  const tasks: Promise<PlatformResult>[] = []

  if (platformSet.has('website')) tasks.push(publishWebsite(post, opts))
  if (platformSet.has('devto'))   tasks.push(publishDevTo(post))
  if (platformSet.has('blogger')) tasks.push(publishBlogger(post))

  const settled = await Promise.allSettled(tasks)

  const results: PlatformResult[] = settled.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : {
          platform:   'website' as Platform,
          success:    false,
          action:     'create' as const,
          error:      String((r as PromiseRejectedResult).reason),
          durationMs: 0,
        },
  )

  // Persist records, write logs, update analytics — all non-blocking
  await Promise.allSettled(
    results.flatMap(r => [
      upsertRecord(postId, r.platform, r),
      writeLog(postId, r.platform, r),
      r.skipped ? Promise.resolve() : incrementAnalytics(r.platform, r.success, r.durationMs ?? 0),
    ]),
  )

  const errors        = results.filter(r => !r.success && !r.skipped).map(r => r.error ?? 'Unknown error')
  const websiteSuccess = results.find(r => r.platform === 'website')?.success ?? false

  return {
    websiteSuccess,
    results,
    errors,
    completedAt: new Date().toISOString(),
  }
}
