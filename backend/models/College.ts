import mongoose, { Schema, Document } from 'mongoose';

export interface ICollege extends Document {
  id?: string;
  name: string;
  code: string;
  slug: string;
  location: string;
  state: string;
  rating: number;
  approval: string;
  approvals?: string[];
  logo?: string;
  banner?: string;
  galleryImages?: string[];
  image?: string;
  website?: string;
  applyUrl?: string;
  videoUrl?: string;
  description: string;
  overview?: string;
  featured: boolean;
  popular: boolean;
  programsCount: number;
  establishedYear: number | string;
  totalStudents: string;
  placementPercentage: string;
  averagePackage: string;
  highestPackage?: string;
  accreditation: string[];
  highlightTags: string[];
  feesRange: string;
  rankings?: string;
  naacGrade?: string;
  highlights?: string[];
  brochureUrl?: string;
  admissionProcess?: string[];
  placementSupport?: string;
  scholarships?: string;
  displayPriority?: number;
  isActive?: boolean;
  faqs?: { question: string; answer: string }[];
}

const CollegeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    location: { type: String, default: '' },
    state: { type: String, default: '' },
    rating: { type: Number, default: 4.8 },
    approval: { type: String, default: 'UGC Entitled' },
    approvals: [{ type: String }],
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    galleryImages: [{ type: String }],
    image: { type: String, default: '' },
    website: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    overview: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    programsCount: { type: Number, default: 0 },
    establishedYear: { type: Schema.Types.Mixed, default: 2005 },
    totalStudents: { type: String, default: '15,000+' },
    placementPercentage: { type: String, default: '88%' },
    averagePackage: { type: String, default: '₹ 5.2 LPA' },
    highestPackage: { type: String, default: '₹ 22.5 LPA' },
    accreditation: [{ type: String }],
    highlightTags: [{ type: String }],
    feesRange: { type: String, default: '₹ 45,000 - ₹ 1,80,000' },
    rankings: { type: String, default: 'Top 50 Online Universities' },
    naacGrade: { type: String, default: 'A++' },
    highlights: [{ type: String }],
    brochureUrl: { type: String, default: '' },
    admissionProcess: [{ type: String }],
    placementSupport: { type: String, default: '' },
    scholarships: { type: String, default: '' },
    displayPriority: { type: Number, default: 9999 },
    faqs: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ]
  },
  { timestamps: true }
);

CollegeSchema.index({ displayPriority: 1, createdAt: -1 });
CollegeSchema.index({ state: 1, isActive: 1 });

export const CollegeModel = mongoose.models.College || mongoose.model<ICollege>('College', CollegeSchema);
