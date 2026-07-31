import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  userId?: string;
  studentName: string;
  email: string;
  studentEmail?: string;
  phone: string;
  studentPhone?: string;
  collegeId: string;
  collegeName: string;
  programId: string;
  programName: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  highestQualification?: string;
  marksPercentage?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Approved' | 'Rejected' | 'Pending' | 'In Review';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  documents: { title: string; url: string; status: string }[];
  createdAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    userId: { type: String, default: '' },
    studentName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    studentEmail: { type: String, default: '' },
    phone: { type: String, required: true },
    studentPhone: { type: String, default: '' },
    collegeId: { type: String, required: true },
    collegeName: { type: String, required: true, default: 'Partner University' },
    programId: { type: String, required: true },
    programName: { type: String, required: true, default: 'Degree Program' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    highestQualification: { type: String, default: '' },
    marksPercentage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Under Review', 'Accepted', 'Approved', 'Rejected', 'Pending', 'In Review'],
      default: 'Submitted',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    documents: [
      {
        title: String,
        url: String,
        status: { type: String, default: 'Uploaded' },
      },
    ],
  },
  { timestamps: true }
);

export const ApplicationModel =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
