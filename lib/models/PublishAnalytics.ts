import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPublishAnalytics extends Document {
  date: string
  total: number
  success: number
  failed: number
  website: number
  blogger: number
  devto: number
  totalDuration: number
}

const PublishAnalyticsSchema = new Schema<IPublishAnalytics>({
  date: { type: String, required: true, unique: true },
  total: { type: Number, default: 0 },
  success: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  website: { type: Number, default: 0 },
  blogger: { type: Number, default: 0 },
  devto: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
}, { timestamps: false, versionKey: false })

export const PublishAnalytics: Model<IPublishAnalytics> = mongoose.models.PublishAnalytics || mongoose.model<IPublishAnalytics>('PublishAnalytics', PublishAnalyticsSchema)
