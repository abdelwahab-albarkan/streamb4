import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPublishVersion extends Document {
  id: string
  articleSlug: string
  articleTitle: string
  publishedTo: string[]
  savedAt: string
  snapshot: any
}

const PublishVersionSchema = new Schema<IPublishVersion>({
  id: { type: String, required: true, unique: true },
  articleSlug: { type: String, required: true },
  articleTitle: { type: String, default: '' },
  publishedTo: [String],
  savedAt: { type: String, default: '' },
  snapshot: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: false, versionKey: false })

PublishVersionSchema.index({ articleSlug: 1, savedAt: -1 })
PublishVersionSchema.index({ savedAt: -1 })
PublishVersionSchema.index({ savedAt: 1 })

export const PublishVersion: Model<IPublishVersion> = mongoose.models.PublishVersion || mongoose.model<IPublishVersion>('PublishVersion', PublishVersionSchema)
