import mongoose, { Schema, Document, Model } from 'mongoose'

/**
 * PublishLog — one document per publish action on a platform.
 *
 * Stores: platform, action, timing, HTTP status, error, articleId.
 * Used for audit trail, dashboard log view, and debugging.
 */
export interface IPublishLog extends Document {
  postId:      string         // Post.id (our internal id)
  platform:    string         // 'website' | 'devto' | 'blogger'
  action:      string         // 'create' | 'update' | 'retry' | 'delete' | 'skip'
  status:      string         // 'success' | 'failed' | 'skipped'
  httpStatus?: number         // HTTP response code from the platform API
  durationMs?: number         // wall-clock ms from start to finish
  url?:        string         // Published article URL
  platformId?: string         // Platform-native ID (devtoId, bloggerPostId)
  error?:      string         // Error message if status === 'failed'
  message?:    string         // Human-readable summary
  timestamp:   string         // ISO-8601
}

const PublishLogSchema = new Schema<IPublishLog>(
  {
    postId:     { type: String, required: true, index: true },
    platform:   { type: String, required: true, index: true },
    action:     { type: String, required: true },           // create | update | retry | skip
    status:     { type: String, required: true },           // success | failed | skipped
    httpStatus: { type: Number, default: null },
    durationMs: { type: Number, default: null },
    url:        { type: String, default: '' },
    platformId: { type: String, default: '' },
    error:      { type: String, default: '' },
    message:    { type: String, default: '' },
    timestamp:  { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false, versionKey: false },
)

// Compound index for fast log queries per post or per platform
PublishLogSchema.index({ postId: 1, timestamp: -1 })
PublishLogSchema.index({ platform: 1, timestamp: -1 })

export const PublishLog: Model<IPublishLog> =
  mongoose.models.PublishLog ||
  mongoose.model<IPublishLog>('PublishLog', PublishLogSchema)
