import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  phone?: string;
  highestQualification?: string;
  city?: string;
  active: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    phone: { type: String, default: '' },
    highestQualification: { type: String, default: '' },
    city: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
