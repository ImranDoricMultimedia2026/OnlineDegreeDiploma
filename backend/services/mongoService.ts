import mongoose from 'mongoose';
import { UserModel } from '../models/User';
import { CollegeModel } from '../models/College';
import { ProgramModel } from '../models/Program';
import { EnquiryModel } from '../models/Enquiry';
import { ApplicationModel } from '../models/Application';
import { ContactModel } from '../models/Contact';

export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

const getDbName = (): string => {
  return mongoose.connection.db?.databaseName || mongoose.connection.name || 'UnknownDB';
};

// Sync User to MongoDB Atlas
export const saveUserToMongo = async (userData: any) => {
  if (!isMongoConnected()) return;
  try {
    const email = userData.email.toLowerCase();
    const existing = await UserModel.findOne({ email } as any);
    if (!existing) {
      const created = await UserModel.create({
        name: userData.name,
        email: email,
        password: userData.password,
        role: userData.role || 'student',
        phone: userData.phone || '',
        city: userData.state || userData.city || '',
        active: userData.status !== 'inactive'
      });
      console.log(`🍃 User [${email}] WRITTEN to MongoDB Atlas! DB: "${getDbName()}", Collection: "${UserModel.collection.name}", Doc ID: ${created._id}`);
    } else {
      console.log(`ℹ️ User [${email}] already exists in MongoDB Atlas DB "${getDbName()}".`);
    }
  } catch (err) {
    console.error('❌ Error saving user to MongoDB Atlas:', err);
  }
};

// Sync Enquiry to MongoDB Atlas
export const saveEnquiryToMongo = async (enquiryData: any) => {
  if (!isMongoConnected()) return;
  try {
    const created = await EnquiryModel.create({
      name: enquiryData.name,
      email: enquiryData.email.toLowerCase(),
      phone: enquiryData.phone,
      program: enquiryData.programName || enquiryData.program || 'General Enquiry',
      programName: enquiryData.programName || enquiryData.program || 'General Enquiry',
      college: enquiryData.collegeName || enquiryData.college || 'General',
      collegeName: enquiryData.collegeName || enquiryData.college || 'General',
      qualification: enquiryData.qualification || '',
      city: enquiryData.city || enquiryData.state || '',
      state: enquiryData.state || enquiryData.city || '',
      message: enquiryData.message || '',
      status: enquiryData.status || 'New'
    });
    console.log(`🍃 Enquiry from [${enquiryData.email}] WRITTEN to MongoDB Atlas! DB: "${getDbName()}", Collection: "${EnquiryModel.collection.name}", Doc ID: ${created._id}`);
  } catch (err) {
    console.error('❌ Error saving enquiry to MongoDB Atlas:', err);
  }
};

// Sync Application to MongoDB Atlas
export const saveApplicationToMongo = async (appData: any) => {
  if (!isMongoConnected()) return;
  try {
    const created = await ApplicationModel.create({
      userId: appData.userId || '',
      studentName: appData.studentName,
      email: appData.studentEmail?.toLowerCase() || appData.email?.toLowerCase(),
      phone: appData.studentPhone || appData.phone,
      collegeId: appData.collegeId,
      collegeName: appData.collegeName,
      programId: appData.programId,
      programName: appData.programName,
      dob: appData.personalInfo?.dob || '',
      gender: appData.personalInfo?.gender || '',
      address: appData.personalInfo?.address || '',
      state: appData.personalInfo?.state || '',
      highestQualification: appData.personalInfo?.qualification || '',
      status: appData.status || 'Submitted',
      documents: appData.documents ? Object.entries(appData.documents).map(([k, v]) => ({ title: k, url: v as string })) : []
    });
    console.log(`🍃 Application for [${appData.studentEmail || appData.email}] WRITTEN to MongoDB Atlas! DB: "${getDbName()}", Collection: "${ApplicationModel.collection.name}", Doc ID: ${created._id}`);
  } catch (err) {
    console.error('❌ Error saving application to MongoDB Atlas:', err);
  }
};

// Sync Contact Form to MongoDB Atlas
export const saveContactToMongo = async (contactData: any) => {
  if (!isMongoConnected()) return;
  try {
    const created = await ContactModel.create({
      name: contactData.name,
      email: contactData.email.toLowerCase(),
      phone: contactData.phone || '',
      subject: contactData.subject || 'General Inquiry',
      message: contactData.message,
      status: 'Unread'
    });
    console.log(`🍃 Contact message from [${contactData.email}] WRITTEN to MongoDB Atlas! DB: "${getDbName()}", Collection: "${ContactModel.collection.name}", Doc ID: ${created._id}`);
  } catch (err) {
    console.error('❌ Error saving contact to MongoDB Atlas:', err);
  }
};

// Seed initial Colleges & Programs to MongoDB Atlas if empty
export const seedInitialDataToMongo = async (colleges: any[], programs: any[], defaultUsers: any[]) => {
  if (!isMongoConnected()) {
    console.log('⚠️ MongoDB not connected yet. Cannot seed data into Atlas.');
    return;
  }
  const dbName = getDbName();
  console.log(`🚀 Checking seed data for MongoDB Atlas DB "${dbName}"...`);

  try {
    const userCount = await UserModel.countDocuments();
    console.log(`📊 Current MongoDB Atlas users count: ${userCount} (DB: "${dbName}")`);
    if (userCount === 0 && defaultUsers && defaultUsers.length > 0) {
      for (const u of defaultUsers) {
        await UserModel.create({
          name: u.name,
          email: u.email.toLowerCase(),
          password: u.password,
          role: u.role || 'student',
          phone: u.phone || '',
          active: true
        });
      }
      console.log(`🍃 SUCCESS: Seeded ${defaultUsers.length} users into MongoDB Atlas! Collection: "${UserModel.collection.name}"`);
    }

    const collegeCount = await CollegeModel.countDocuments();
    console.log(`📊 Current MongoDB Atlas colleges count: ${collegeCount} (DB: "${dbName}")`);
    if (collegeCount === 0 && colleges && colleges.length > 0) {
      for (const c of colleges) {
        await CollegeModel.create({
          name: c.name,
          code: c.code || 'COL',
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          location: c.location || '',
          state: c.state || '',
          rating: c.rating || 4.8,
          approval: c.approval || 'UGC Entitled',
          approvals: c.approvals || c.accreditations || ['UGC Approved', 'NAAC A+'],
          logo: c.logo || c.image || '',
          banner: c.banner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200',
          image: c.image || c.logo || '',
          website: c.website || '',
          description: c.description || '',
          overview: c.overview || c.description || '',
          featured: c.featured || false,
          popular: c.popular || false,
          programsCount: c.programsCount || 5,
          establishedYear: c.establishedYear || 2005,
          totalStudents: c.totalStudents || '15,000+',
          placementPercentage: c.placementPercentage || '88%',
          averagePackage: c.averagePackage || '₹ 5.2 LPA',
          highestPackage: c.highestPackage || '₹ 22 LPA',
          accreditation: c.accreditations || c.approvals || ['UGC', 'NAAC A+'],
          highlightTags: c.highlightTags || ['100% Online', 'Live Webinars', 'Placement Cell'],
          feesRange: c.feesRange || c.feeRange || '₹ 45,000 - ₹ 1,80,000',
          rankings: c.rankings || 'Top Rated Online University',
          naacGrade: c.naacGrade || 'A++',
          highlights: c.highlights || [
            '100% Flexible Online & Distance Learning',
            'Live Interactive Classes & Recorded Seminars',
            'Dedicated Student Mentorship & Career Guidance',
            'UGC-DEB Entitled & Globally Accepted Degree'
          ]
        });
      }
      console.log(`🍃 SUCCESS: Seeded ${colleges.length} colleges into MongoDB Atlas! Collection: "${CollegeModel.collection.name}"`);
    }

    const programCount = await ProgramModel.countDocuments();
    console.log(`📊 Current MongoDB Atlas programs count: ${programCount} (DB: "${dbName}")`);
    if (programCount === 0 && programs && programs.length > 0) {
      for (const p of programs) {
        await ProgramModel.create({
          name: p.title || p.name,
          code: p.code || 'PRG',
          level: p.level || 'UG',
          category: p.category || 'Management',
          duration: p.duration || '2 Years',
          mode: p.mode || 'Online',
          fees: p.fees || '₹ 50,000',
          eligibility: p.eligibility || 'Graduation',
          description: p.description || '',
          collegeId: p.collegeId || '',
          collegeName: p.collegeName || ''
        });
      }
      console.log(`🍃 SUCCESS: Seeded ${programs.length} programs into MongoDB Atlas! Collection: "${ProgramModel.collection.name}"`);
    }
  } catch (err) {
    console.error('❌ Error seeding initial data to MongoDB Atlas:', err);
  }
};

