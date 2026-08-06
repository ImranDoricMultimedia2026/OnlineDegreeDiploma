import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  emailPrimary: string;
  emailSupport: string;
  address: string;
  googleMapUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  siteName: string;
  siteTitle: string;
  siteLogoUrl: string;
  headerAnnouncement: string;
  footerAboutText: string;
  defaultApplyUrl: string;
  defaultBrochureUrl: string;
}

const SettingsSchema: Schema = new Schema(
  {
    phonePrimary: { type: String, default: '+91 98765 43210' },
    phoneSecondary: { type: String, default: '+91 80000 12345' },
    whatsappNumber: { type: String, default: '919876543210' },
    emailPrimary: { type: String, default: 'admissions@onlinedegreeportal.in' },
    emailSupport: { type: String, default: 'addmission@onlinedegreediplomaludhiana.com' },
    address: { type: String, default: 'Building 4B, Knowledge Park III, Greater Noida, UP - 201306' },
    googleMapUrl: { type: String, default: 'https://maps.google.com/maps?q=Greater+Noida&output=embed' },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    linkedinUrl: { type: String, default: 'https://linkedin.com' },
    twitterUrl: { type: String, default: 'https://twitter.com' },
    youtubeUrl: { type: String, default: 'https://youtube.com' },
    siteName: { type: String, default: 'Online Degree Portal' },
    siteTitle: { type: String, default: 'UGC Approved Online Degree Programs & Top Universities' },
    siteLogoUrl: { type: String, default: '' },
    headerAnnouncement: { type: String, default: '🔥 Free Career Counselling & Admission Guidance for 2026 Batch!' },
    footerAboutText: { type: String, default: "India's leading online higher education portal helping students choose UGC-approved online degree programs from top universities." },
    defaultApplyUrl: { type: String, default: '/apply' },
    defaultBrochureUrl: { type: String, default: '/uploads/sample_official_prospectus.pdf' }
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
