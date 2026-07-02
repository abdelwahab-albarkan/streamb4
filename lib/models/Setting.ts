import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISetting extends Document {
  key: string
  value: any
}

const SettingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed },
}, { timestamps: false, versionKey: false })

export const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)
