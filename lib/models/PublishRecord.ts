import mongoose, { Schema, Document, Model } from 'mongoose'

/**
 * Tracks every publish attempt per post per platform.
 * Used for Publish History, retry logic, and audit logging.
 */
export interface IPublishRecord extends Document {
  postId: string
  platform: string           // 'website' | 'devto' | 'blogger'
  status: string             // 'pending' | 'published' | 'failed'
  url?: string
  platformId?: string        // Platform-specific ID (devtoId, bloggerPostId)
  error?: string
  options?: Record<string, unknown>
  attemptedAt: string
  completedAt?: string
  retriedAt?: string
  retryCount: number
}

const PublishRecordSchema = new Schema<IPublishRecord>({
  postId:       { type: String, required: true, index: true },
  platform:     { type: String, required: true },
  status:       { type: String, default: 'pending' },
  url:          { type: String, default: '' },
  platformId:   { type: String, default: '' },
  error:        { type: String, default: '' },
  options:      { type: Schema.Types.Mixed, default: {} },
  attemptedAt:  { type: String, default: '' },
  completedAt:  { type: String, default: '' },
  retriedAt:    { type: String, default: '' },
  retryCount:   { type: Number, default: 0 },
}, { timestamps: false, versionKey: false })

PublishRecordSchema.index({ postId: 1, platform: 1 })

export const PublishRecord: Model<IPublishRecord> =
  mongoose.models.PublishRecord ||
  mongoose.model<IPublishRecord>('PublishRecord', PublishRecordSchema)
