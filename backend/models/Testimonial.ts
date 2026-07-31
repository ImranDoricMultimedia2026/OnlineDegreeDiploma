import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  course: string;
  college: string;
  image: string;
  quote: string;
  rating: number;
  isActive: boolean;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    course: { type: String, default: 'Online Degree Student' },
    college: { type: String, default: 'Partner University' },
    image: { type: String, default: '' },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const TestimonialModel = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
