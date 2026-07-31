import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  program: string;
  programName?: string;
  college: string;
  collegeName?: string;
  qualification?: string;
  city?: string;
  state?: string;
  message?: string;
  type?: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Closed';
  notes?: string;
  userId?: string;
  createdAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    program: { type: String, default: 'General Enquiry' },
    programName: { type: String, default: 'General Enquiry' },
    college: { type: String, default: 'General' },
    collegeName: { type: String, default: 'General' },
    qualification: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    message: { type: String, default: '' },
    type: { type: String, default: 'general' },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Converted', 'Closed'],
      default: 'New',
    },
    notes: { type: String, default: '' },
    userId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const EnquiryModel = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
