import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IComment extends Document {
  id: string
  postSlug: string
  postTitle: string
  author: string
  email: string
  content: string
  status: string
  createdAt: string
  likes: number
  avatar: string
}

const CommentSchema = new Schema<IComment>({
  id: { type: String, required: true, unique: true },
  postSlug: { type: String, required: true },
  postTitle: { type: String, default: '' },
  author: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
}, { timestamps: false, versionKey: false })

export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
