import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  featured: boolean;
  order: number;
  isActive: boolean;
}

const FAQSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const FAQModel = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
