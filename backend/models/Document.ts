import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentItem extends Document {
  userId: string;
  studentName?: string;
  title: string;
  type: string;
  url: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  uploadedAt: Date;
}

const DocumentItemSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    studentName: { type: String, default: 'Student' },
    title: { type: String, required: true },
    type: { type: String, default: 'PDF' },
    url: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const DocumentItemModel =
  mongoose.models.DocumentItem || mongoose.model<IDocumentItem>('DocumentItem', DocumentItemSchema);
