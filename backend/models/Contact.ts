import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Responded' | 'Closed';
  createdAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['Unread', 'Responded', 'Closed'],
      default: 'Unread',
    },
  },
  { timestamps: true }
);

export const ContactModel = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
