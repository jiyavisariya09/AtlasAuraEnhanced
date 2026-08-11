import mongoose, { Schema, Document, models } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  phone?: string
  password: string
  avatar?: string
  bio?: string
  travelStyle?: string[]
  dreamDestinations?: string
  pins?: {
    id: string
    lat: number
    lng: number
    country: string
    note: string
    emoji: string
    mood: string
    date: string
  }[]
  joinedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  password: { type: String, required: true, select: false },
  avatar: { type: String },
  bio: { type: String },
  travelStyle: [{ type: String }],
  dreamDestinations: { type: String },
  pins: [{
    id: String,
    lat: Number,
    lng: Number,
    country: String,
    note: String,
    emoji: String,
    mood: String,
    date: String,
  }],
  joinedAt: { type: Date, default: Date.now },
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export const User = models.User || mongoose.model<IUser>('User', UserSchema)
