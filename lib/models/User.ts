import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  id: string
  email: string
  password: string
  name: string
  role: string
  avatar: string
  createdAt: string
  lastLogin: string
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  role: { type: String, default: 'editor' },
  avatar: { type: String, default: '' },
  createdAt: { type: String, default: '' },
  lastLogin: { type: String, default: '' },
}, { timestamps: false })

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
