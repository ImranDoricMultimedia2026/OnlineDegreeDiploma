import mongoose, { Schema, Document } from 'mongoose';

export interface ISlider extends Document {
  title: string;
  subtitle: string;
  description?: string;
  badge?: string;
  bgImage: string;
  mobileBgImage?: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  order: number;
  isActive: boolean;
}

const SliderSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    bgImage: { type: String, required: true },
    mobileBgImage: { type: String, default: '' },
    primaryBtnText: { type: String, default: 'Explore Programs' },
    primaryBtnLink: { type: String, default: '/programs' },
    secondaryBtnText: { type: String, default: 'Apply Now' },
    secondaryBtnLink: { type: String, default: '/apply' },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const SliderModel = mongoose.models.Slider || mongoose.model<ISlider>('Slider', SliderSchema);
