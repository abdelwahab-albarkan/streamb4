import mongoose, { Schema, Document, Model } from 'mongoose'

/**
 * Stores per-platform API credentials and OAuth tokens.
 * One document per platform key. Never exposed to the browser.
 */
export interface IPlatformCredential extends Document {
  platform: string        // 'devto' | 'blogger' | 'medium' | 'hashnode' | 'wordpress' | 'ghost'
  enabled: boolean
  // DEV.to
  devtoApiKey?: string
  devtoUsername?: string
  devtoCanonicalUrlEnabled?: boolean
  // Blogger (Google OAuth 2.0)
  bloggerBlogId?: string
  bloggerBlogUrl?: string
  bloggerAccessToken?: string
  bloggerRefreshToken?: string
  bloggerTokenExpiresAt?: string
  bloggerConnected?: boolean
  // Metadata
  updatedAt: string
  createdAt: string
}

const PlatformCredentialSchema = new Schema<IPlatformCredential>({
  platform:                  { type: String, required: true, unique: true },
  enabled:                   { type: Boolean, default: false },
  devtoApiKey:               { type: String, default: '' },
  devtoUsername:             { type: String, default: '' },
  devtoCanonicalUrlEnabled:  { type: Boolean, default: true },
  bloggerBlogId:             { type: String, default: '' },
  bloggerBlogUrl:            { type: String, default: '' },
  bloggerAccessToken:        { type: String, default: '' },
  bloggerRefreshToken:       { type: String, default: '' },
  bloggerTokenExpiresAt:     { type: String, default: '' },
  bloggerConnected:          { type: Boolean, default: false },
  updatedAt:                 { type: String, default: '' },
  createdAt:                 { type: String, default: '' },
}, { timestamps: false, versionKey: false })

export const PlatformCredential: Model<IPlatformCredential> =
  mongoose.models.PlatformCredential ||
  mongoose.model<IPlatformCredential>('PlatformCredential', PlatformCredentialSchema)
