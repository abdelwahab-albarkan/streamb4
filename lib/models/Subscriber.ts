import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISubscriber extends Document {
  id: string
  email: string
  name: string
  status: string
  subscribedAt: string
  source: string
}

const SubscriberSchema = new Schema<ISubscriber>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  status: { type: String, default: 'active' },
  subscribedAt: { type: String, default: '' },
  source: { type: String, default: 'website' },
}, { timestamps: false })

export const Subscriber: Model<ISubscriber> = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)
