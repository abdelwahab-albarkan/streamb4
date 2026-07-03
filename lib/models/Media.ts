import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMedia extends Document {
  filename: string
  url: string
  mimeType: string
  size: number
  width: number | null
  height: number | null
  altText: string
  createdAt: Date
  updatedAt: Date
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    url:      { type: String, required: true },
    mimeType: { type: String, default: 'image/jpeg' },
    size:     { type: Number, default: 0 },
    width:    { type: Number, default: null },
    height:   { type: Number, default: null },
    altText:  { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
)

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema)
