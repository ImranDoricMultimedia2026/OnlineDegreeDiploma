import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  userId: string;
  type: 'info' | 'success' | 'warning';
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: String, default: 'all' },
    type: { type: String, enum: ['info', 'success', 'warning'], default: 'info' },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
