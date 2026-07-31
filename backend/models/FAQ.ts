import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  featured: boolean;
}

const FAQSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FAQModel = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
