import mongoose, { Schema, Document, Model } from 'mongoose'

/**
 * PublishRecord — one document per post × platform.
 *
 * Tracks the current state of a post on each platform:
 * status, URL, platformId, last error, retry count, timing.
 *
 * This is an upsert model (unique per postId + platform).
 * Use PublishLog for the full audit trail of every attempt.
 */
export interface IPublishRecord extends Document {
  postId:       string          // Post.id
  platform:     string          // 'website' | 'devto' | 'blogger'
  status:       string          // 'pending' | 'published' | 'failed'
  url?:         string          // Live URL on the platform
  platformId?:  string          // Platform-native ID
  error?:       string          // Last error message
  durationMs?:  number          // Duration of last attempt (ms)
  options?:     Record<string, unknown>
  attemptedAt:  string          // ISO-8601 of first attempt
  completedAt?: string          // ISO-8601 of last completed attempt
  retriedAt?:   string          // ISO-8601 of last retry
  retryCount:   number          // How many retries beyond the first attempt
}

const PublishRecordSchema = new Schema<IPublishRecord>(
  {
    postId:      { type: String, required: true, index: true },
    platform:    { type: String, required: true },
    status:      { type: String, default: 'pending' },
    url:         { type: String, default: '' },
    platformId:  { type: String, default: '' },
    error:       { type: String, default: '' },
    durationMs:  { type: Number, default: null },
    options:     { type: Schema.Types.Mixed, default: {} },
    attemptedAt: { type: String, default: '' },
    completedAt: { type: String, default: '' },
    retriedAt:   { type: String, default: '' },
    retryCount:  { type: Number, default: 0 },
  },
  { timestamps: false, versionKey: false },
)

// Unique per postId + platform (one record, always upserted)
PublishRecordSchema.index({ postId: 1, platform: 1 }, { unique: true })

export const PublishRecord: Model<IPublishRecord> =
  mongoose.models.PublishRecord ||
  mongoose.model<IPublishRecord>('PublishRecord', PublishRecordSchema)
