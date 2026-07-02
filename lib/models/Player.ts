import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPlayer extends Document {
  id: string
  name: string
  description: string
  features: string[]
  platforms: string[]
  downloadUrl: string
  apkUrl: string
  version: string
  size: string
  rating: number
  downloads: number
  featured: boolean
  logo: string
  screenshots: string[]
  category: string
  status: string
  createdAt: string
  recommended?: boolean
  enabled?: boolean
  downloaderCode?: string
  website?: string
  lastUpdated?: string
  order?: number
}

const PlayerSchema = new Schema<IPlayer>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  features: [String],
  platforms: [String],
  downloadUrl: { type: String, default: '' },
  apkUrl: { type: String, default: '' },
  version: { type: String, default: '' },
  size: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  logo: { type: String, default: '' },
  screenshots: [String],
  category: { type: String, default: 'IPTV Player' },
  status: { type: String, default: 'active' },
  createdAt: { type: String, default: '' },
  recommended: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  downloaderCode: { type: String, default: '' },
  website: { type: String, default: '' },
  lastUpdated: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: false, versionKey: false })

export const Player: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema)
