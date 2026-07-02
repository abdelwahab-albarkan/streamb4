import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPost extends Document {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  seoTitle: string
  metaDescription: string
  focusKeyword: string
  secondaryKeywords: string[]
  lsiKeywords: string[]
  featuredImage: string
  ogTitle: string
  ogDescription: string
  faqs: any[]
  internalLinks: any[]
  schema: any
  category: string
  tags: string[]
  author: string
  seoScore: number
  readabilityScore: number
  keywordDensity: string
  readingTime: number
  status: string
  views: number
  likes: number
  publishedAt: string
  updatedAt: string
  createdAt: string
}

const PostSchema = new Schema<IPost>({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  seoTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  focusKeyword: { type: String, default: '' },
  secondaryKeywords: [String],
  lsiKeywords: [String],
  featuredImage: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  faqs: { type: Schema.Types.Mixed, default: [] },
  internalLinks: { type: Schema.Types.Mixed, default: [] },
  schema: { type: Schema.Types.Mixed, default: {} },
  category: { type: String, default: 'General' },
  tags: [String],
  author: { type: String, default: 'STREAMB4 Editorial Team' },
  seoScore: { type: Number, default: 0 },
  readabilityScore: { type: Number, default: 0 },
  keywordDensity: { type: String, default: '' },
  readingTime: { type: Number, default: 0 },
  status: { type: String, default: 'draft' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  publishedAt: { type: String, default: '' },
  updatedAt: { type: String, default: '' },
  createdAt: { type: String, default: '' },
}, { timestamps: false, versionKey: false })

export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
