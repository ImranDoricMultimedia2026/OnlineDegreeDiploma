import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  id?: string;
  title: string;
  name?: string;
  code?: string;
  slug: string;
  degreeType: string;
  level?: string;
  category?: string;
  duration: string;
  mode?: string;
  fee: string;
  fees?: string;
  eligibility: string;
  specializations: string[];
  overview: string;
  description?: string;
  image?: string;
  applyUrl?: string;
  semesterInfo?: string;
  careerScope?: string[];
  brochurePdfUrl?: string;
  syllabusPdfUrl?: string;
  feeStructurePdfUrl?: string;
  syllabus?: string[];
  highlights?: string[];
  collegeId: string;
  collegeName: string;
  popular?: boolean;
  isActive: boolean;
}

const ProgramSchema: Schema = new Schema(
  {
    title: { type: String, trim: true },
    name: { type: String, trim: true },
    code: { type: String, uppercase: true, default: 'PROG' },
    slug: { type: String, trim: true },
    degreeType: { type: String, default: 'UG' },
    level: { type: String, default: 'UG' },
    category: { type: String, default: 'Management' },
    duration: { type: String, default: '3 Years' },
    mode: { type: String, default: 'Online' },
    fee: { type: String, default: '₹ 45,000 / Year' },
    fees: { type: String, default: '₹ 45,000 / Year' },
    eligibility: { type: String, default: '10+2 or equivalent' },
    specializations: [{ type: String }],
    overview: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
    semesterInfo: { type: String, default: '' },
    careerScope: [{ type: String }],
    brochurePdfUrl: { type: String, default: '' },
    syllabusPdfUrl: { type: String, default: '' },
    feeStructurePdfUrl: { type: String, default: '' },
    syllabus: [{ type: String }],
    highlights: [{ type: String }],
    collegeId: { type: String, required: true },
    collegeName: { type: String, required: true },
    popular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ProgramModel = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);
