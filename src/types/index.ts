export interface SiteSettings {
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

export interface College {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  code?: string;
  location: string;
  state: string;
  description: string;
  overview: string;
  approval?: string;
  approvals: string[];
  logo: string;
  banner: string;
  galleryImages?: string[];
  image?: string;
  website: string;
  applyUrl?: string;
  videoUrl?: string;
  brochureUrl?: string;
  establishedYear?: string | number;
  rating?: number;
  naacGrade?: string;
  feesRange?: string;
  placementPercentage?: string;
  averagePackage?: string;
  highestPackage?: string;
  accreditation?: string[];
  highlights?: string[];
  admissionProcess?: string[];
  faqs?: { question: string; answer: string }[];
  displayPriority?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Program {
  _id: string;
  id?: string;
  title: string;
  name?: string;
  slug: string;
  collegeId: string;
  collegeName: string;
  degreeType: 'UG' | 'PG' | 'Diploma' | string;
  duration: string;
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
  syllabusPdfUrl?: string;
  brochurePdfUrl?: string;
  feeStructurePdfUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  phone?: string;
  state?: string;
  status?: 'active' | 'inactive';
  savedPrograms?: string[];
  createdAt?: string;
}

export interface Enquiry {
  _id: string;
  type?: 'general' | 'brochure' | 'fee_structure' | string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  college?: string;
  collegeName?: string;
  program?: string;
  programName?: string;
  qualification?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Follow Up' | 'Converted' | 'Closed' | string;
  remarks?: string;
  notes?: string;
  followUpDate?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Application {
  _id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  collegeId: string;
  collegeName: string;
  programId: string;
  programName: string;
  personalInfo: {
    dob?: string;
    gender?: string;
    address?: string;
    state?: string;
    qualification?: string;
  };
  documents?: {
    idProof?: string;
    marksheets?: string;
    photo?: string;
  };
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
  adminRemarks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DocumentItem {
  _id: string;
  title: string;
  type: 'brochure' | 'syllabus' | 'fee_structure' | 'course_pdf' | 'college_pdf' | string;
  collegeName?: string;
  programName?: string;
  fileUrl: string;
  fileSize?: string;
  uploadedBy?: string;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Testimonial {
  _id: string;
  name: string;
  course: string;
  college: string;
  image: string;
  quote: string;
  rating: number;
  isActive: boolean;
}

export interface HeroSlide {
  _id: string;
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

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalColleges: number;
  totalPrograms: number;
  totalStudents: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalApplications: number;
  convertedLeads: number;
  totalContacts: number;
  monthlyEnquiries: { month: string; count: number }[];
  collegeWiseEnquiries: { name: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
}
