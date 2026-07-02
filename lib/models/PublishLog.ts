import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPublishLog extends Document {
  timestamp: string
  platform: string
  status: string
  article: string
  message: string
  url: string
}

const PublishLogSchema = new Schema<IPublishLog>({
  timestamp: { type: String, default: '' },
  platform: { type: String, required: true },
  status: { type: String, required: true },
  article: { type: String, default: '' },
  message: { type: String, default: '' },
  url: { type: String, default: '' },
}, { timestamps: false, versionKey: false })

export const PublishLog: Model<IPublishLog> = mongoose.models.PublishLog || mongoose.model<IPublishLog>('PublishLog', PublishLogSchema)
