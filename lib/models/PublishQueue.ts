import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPublishQueue extends Document {
  id: string
  article: any
  platforms: string[]
  scheduledAt: string
  addedAt: string
  status: string
  result: any
  priority: number
}

const PublishQueueSchema = new Schema<IPublishQueue>({
  id: { type: String, required: true, unique: true },
  article: { type: Schema.Types.Mixed, required: true },
  platforms: [String],
  scheduledAt: { type: String, default: '' },
  addedAt: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  result: { type: Schema.Types.Mixed, default: null },
  priority: { type: Number, default: 0 },
}, { timestamps: false })

export const PublishQueue: Model<IPublishQueue> = mongoose.models.PublishQueue || mongoose.model<IPublishQueue>('PublishQueue', PublishQueueSchema)
