import { Router } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { UserModel } from '../../../backend/models/User';
import { CollegeModel } from '../../../backend/models/College';
import { ProgramModel } from '../../../backend/models/Program';
import { EnquiryModel } from '../../../backend/models/Enquiry';
import { ApplicationModel } from '../../../backend/models/Application';
import { ContactModel } from '../../../backend/models/Contact';
import { DocumentItemModel } from '../../../backend/models/Document';
import { FAQModel } from '../../../backend/models/FAQ';

const router = Router();

const getDashboardStats = async () => {
  if (isMongoConnected()) {
    const totalColleges = await CollegeModel.countDocuments();
    const totalPrograms = await ProgramModel.countDocuments();
    const totalStudents = await UserModel.countDocuments({ role: 'student' } as any);
    const totalEnquiries = await EnquiryModel.countDocuments();
    const newEnquiries = await EnquiryModel.countDocuments({ status: 'New' } as any);
    const totalApplications = await ApplicationModel.countDocuments();
    const convertedLeads = await EnquiryModel.countDocuments({ status: 'Converted' } as any);
    const totalContacts = await ContactModel.countDocuments();

    const enquiries = await EnquiryModel.find().lean();
    
    // College wise breakdown
    const collegeCounts: Record<string, number> = {};
    enquiries.forEach((e: any) => {
      const colName = e.collegeName || 'General';
      collegeCounts[colName] = (collegeCounts[colName] || 0) + 1;
    });
    const collegeWiseEnquiries = Object.keys(collegeCounts).map((k) => ({ name: k, count: collegeCounts[k] }));

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    enquiries.forEach((e: any) => {
      const st = e.status || 'New';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });
    const statusBreakdown = Object.keys(statusCounts).map((s) => ({ status: s, count: statusCounts[s] }));

    // Monthly breakdown
    const monthlyEnquiries = [{ month: 'Current', count: enquiries.length }];

    return {
      totalColleges,
      totalPrograms,
      totalStudents,
      totalEnquiries,
      newEnquiries,
      totalApplications,
      convertedLeads,
      totalContacts,
      monthlyEnquiries,
      collegeWiseEnquiries,
      statusBreakdown
    };
  }

  const db = getDb();
  const totalColleges = db.colleges.length;
  const totalPrograms = db.programs.length;
  const totalStudents = db.users.filter((u) => u.role === 'student').length;
  const totalEnquiries = db.enquiries.length;
  const newEnquiries = db.enquiries.filter((e) => e.status === 'New').length;
  const totalApplications = db.applications.length;
  const convertedLeads = db.enquiries.filter((e) => e.status === 'Converted').length;
  const totalContacts = db.contacts.length;

  const collegeCounts: Record<string, number> = {};
  db.enquiries.forEach((e) => {
    const colName = e.collegeName || 'General';
    collegeCounts[colName] = (collegeCounts[colName] || 0) + 1;
  });
  const collegeWiseEnquiries = Object.keys(collegeCounts).map((k) => ({ name: k, count: collegeCounts[k] }));

  const statusCounts: Record<string, number> = {
    New: db.enquiries.filter((e) => e.status === 'New').length,
    Contacted: db.enquiries.filter((e) => e.status === 'Contacted').length,
    Interested: db.enquiries.filter((e) => e.status === 'Interested').length,
    'Follow Up': db.enquiries.filter((e) => e.status === 'Follow Up').length,
    Converted: db.enquiries.filter((e) => e.status === 'Converted').length,
    Closed: db.enquiries.filter((e) => e.status === 'Closed').length
  };
  const statusBreakdown = Object.keys(statusCounts).map((s) => ({ status: s, count: statusCounts[s] }));

  return {
    totalColleges,
    totalPrograms,
    totalStudents,
    totalEnquiries,
    newEnquiries,
    totalApplications,
    convertedLeads,
    totalContacts,
    monthlyEnquiries: [{ month: 'Jul', count: db.enquiries.length }],
    collegeWiseEnquiries,
    statusBreakdown
  };
};

// GET Admin Dashboard Aggregated Metrics
router.get('/dashboard', verifyToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Enquiries
router.get('/enquiries', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const enquiries = await EnquiryModel.find().sort({ createdAt: -1 }).lean();
      return res.json({ success: true, enquiries });
    }
    const db = getDb();
    res.json({ success: true, enquiries: db.enquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/enquiries/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, remarks, notes } = req.body;

  try {
    if (isMongoConnected()) {
      let enquiry: any = await (EnquiryModel as any).findById(id);
      if (!enquiry) {
        enquiry = await (EnquiryModel as any).findOne({ _id: id });
      }
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found in MongoDB' });
      }
      if (status) enquiry.status = status;
      if (remarks !== undefined) enquiry.notes = remarks;
      if (notes !== undefined) enquiry.notes = notes;
      await enquiry.save();
      console.log(`🍃 Updated Enquiry [${id}] in MongoDB Atlas to status: ${status}`);
      return res.json({ success: true, enquiry });
    }

    const db = getDb();
    const enquiry = db.enquiries.find((e) => e._id === id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    if (status) enquiry.status = status;
    if (remarks !== undefined) enquiry.notes = remarks;
    if (notes !== undefined) enquiry.notes = notes;
    saveDbStore();
    res.json({ success: true, enquiry });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/enquiries/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      await (EnquiryModel as any).findByIdAndDelete(id);
      await (EnquiryModel as any).deleteOne({ _id: id });
      return res.json({ success: true, message: 'Enquiry deleted successfully' });
    }

    const db = getDb();
    db.enquiries = db.enquiries.filter((e) => e._id !== id);
    saveDbStore();
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Applications
router.get('/applications', verifyToken, requireAdmin, async (req, res) => {
  try {
    const apps: any[] = [];
    if (isMongoConnected()) {
      try {
        const mongoApps = await ApplicationModel.find().sort({ createdAt: -1 }).lean();
        if (mongoApps && mongoApps.length > 0) {
          apps.push(...mongoApps);
        }
      } catch (e) {
        console.error('Error fetching Mongo applications:', e);
      }
    }
    const db = getDb();
    if (db && db.applications) {
      for (const dba of db.applications) {
        if (!apps.some((a) => (a._id && a._id.toString() === dba._id))) {
          apps.push(dba);
        }
      }
    }
    res.json({ success: true, applications: apps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/applications/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body;

  try {
    let updated = false;
    let updatedApp: any = null;

    if (isMongoConnected()) {
      try {
        let app: any = null;
        try {
          app = await (ApplicationModel as any).findOne({ _id: id });
        } catch (e) {}
        if (!app) {
          try {
            app = await (ApplicationModel as any).findById(id);
          } catch (e) {}
        }
        if (app) {
          if (status) app.status = status;
          if (adminRemarks !== undefined) app.adminRemarks = adminRemarks;
          await app.save();
          console.log(`🍃 Updated Application [${id}] in MongoDB Atlas to status: ${status}`);
          updated = true;
          updatedApp = app;
        }
      } catch (mongoErr: any) {
        console.error('Error updating application in Mongo:', mongoErr.message || mongoErr);
      }
    }

    const db = getDb();
    const appIndex = db.applications.findIndex((a) => a._id === id || a._id?.toString() === id);
    if (appIndex !== -1) {
      if (status) db.applications[appIndex].status = status;
      if (adminRemarks !== undefined) db.applications[appIndex].adminRemarks = adminRemarks;
      saveDbStore();
      updated = true;
      if (!updatedApp) updatedApp = db.applications[appIndex];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, application: updatedApp });
  } catch (err: any) {
    console.error('Error updating application status:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update application status' });
  }
});

router.delete('/applications/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (ApplicationModel as any).deleteOne({ _id: id });
        try {
          await (ApplicationModel as any).findByIdAndDelete(id);
        } catch (e) {}
      } catch (e) {}
    }

    const db = getDb();
    db.applications = db.applications.filter((a) => a._id !== id && a._id?.toString() !== id);
    saveDbStore();
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Documents
router.get('/documents', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const documents = await DocumentItemModel.find().sort({ createdAt: -1 }).lean();
      return res.json({ success: true, documents });
    }
    const db = getDb();
    res.json({ success: true, documents: db.documents });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/documents', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const created = await DocumentItemModel.create({
        userId: req.body.userId || 'admin',
        studentName: req.body.studentName || 'Admin',
        title: req.body.title || 'Document',
        type: req.body.type || 'brochure',
        url: req.body.fileUrl || req.body.url || '/downloads/sample.pdf',
        status: 'Verified'
      });
      console.log(`🍃 Uploaded Document into MongoDB Atlas: ${created.title}`);
      return res.json({ success: true, document: created });
    }

    const db = getDb();
    const newDoc = {
      _id: 'doc_' + Date.now(),
      title: req.body.title || 'Document',
      type: req.body.type || 'brochure',
      collegeName: req.body.collegeName || '',
      programName: req.body.programName || '',
      fileUrl: req.body.fileUrl || '/downloads/sample.pdf',
      createdAt: new Date().toISOString()
    };
    db.documents.unshift(newDoc);
    saveDbStore();
    res.json({ success: true, document: newDoc });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/documents/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      await (DocumentItemModel as any).findByIdAndDelete(id);
      await (DocumentItemModel as any).deleteOne({ _id: id });
      return res.json({ success: true, message: 'Document deleted successfully' });
    }

    const db = getDb();
    db.documents = db.documents.filter((d) => d._id !== id);
    saveDbStore();
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin FAQs
router.get('/faqs', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const faqs = await FAQModel.find().lean();
      return res.json({ success: true, faqs });
    }
    const db = getDb();
    res.json({ success: true, faqs: db.faqs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Colleges CRUD
router.post('/colleges', verifyToken, requireAdmin, async (req, res) => {
  try {
    const name = req.body.name || 'Partner University';
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const code = (req.body.code || name.substring(0, 4)).toUpperCase();

    if (isMongoConnected()) {
      const created = await CollegeModel.create({
        name,
        code,
        slug,
        location: req.body.location || 'India',
        state: req.body.state || 'India',
        description: req.body.description || '',
        overview: req.body.overview || '',
        approvals: Array.isArray(req.body.approvals) ? req.body.approvals : ['UGC Approved'],
        website: req.body.website || '',
        logo: req.body.logo || 'https://images.unsplash.com/photo-1592280771190-3e2923b92552?w=150',
        banner: req.body.banner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000'
      });
      console.log(`🍃 Created College in MongoDB Atlas: ${created.name}`);
      
      const db = getDb();
      db.colleges.unshift({
        _id: created._id.toString(),
        name,
        slug,
        location: req.body.location || 'India',
        state: req.body.state || 'India',
        description: req.body.description || '',
        overview: req.body.overview || '',
        approvals: Array.isArray(req.body.approvals) ? req.body.approvals : ['UGC Approved'],
        website: req.body.website || '',
        logo: req.body.logo || 'https://images.unsplash.com/photo-1592280771190-3e2923b92552?w=150',
        banner: req.body.banner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000',
        rating: 4.8,
        establishedYear: 2005,
        isPopular: true
      });
      saveDbStore();

      return res.json({ success: true, college: created });
    }

    const db = getDb();
    const newCol = {
      _id: 'col_' + Date.now(),
      name,
      slug,
      location: req.body.location || 'India',
      state: req.body.state || 'India',
      description: req.body.description || '',
      overview: req.body.overview || '',
      approvals: Array.isArray(req.body.approvals) ? req.body.approvals : ['UGC Approved'],
      website: req.body.website || '',
      logo: req.body.logo || 'https://images.unsplash.com/photo-1592280771190-3e2923b92552?w=150',
      banner: req.body.banner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000',
      rating: 4.8,
      establishedYear: 2005,
      isPopular: true
    };
    db.colleges.unshift(newCol);
    saveDbStore();
    res.json({ success: true, college: newCol });
  } catch (err: any) {
    console.error('Error creating college:', err);
    res.status(500).json({ success: false, message: err.message || 'Error creating college' });
  }
});

router.put('/colleges/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (CollegeModel as any).updateOne(
          { $or: [{ _id: id }, { id }] },
          { $set: req.body }
        );
      } catch (e) {
        await (CollegeModel as any).findByIdAndUpdate(id, req.body, { new: true }).catch(() => null);
      }
    }

    const db = getDb();
    const col = db.colleges.find((c) => c._id === id || c.id === id);
    if (col) {
      Object.assign(col, req.body);
      saveDbStore();
    }
    res.json({ success: true, message: 'College updated successfully', college: req.body });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating college' });
  }
});

router.delete('/colleges/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (CollegeModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (CollegeModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.colleges = db.colleges.filter((c) => c._id !== id && c.id !== id);
    saveDbStore();
    res.json({ success: true, message: 'College deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting college' });
  }
});

// Admin Programs CRUD
router.post('/programs', verifyToken, requireAdmin, async (req, res) => {
  try {
    const title = req.body.title || 'Online Degree Program';
    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let collegeId = req.body.collegeId || 'col_default';
    let collegeName = req.body.collegeName || '';

    if (!collegeName) {
      const db = getDb();
      const matchCol = db.colleges.find((c) => c._id === collegeId || c.id === collegeId);
      if (matchCol) collegeName = matchCol.name;
    }
    if (!collegeName) collegeName = 'Partner University';

    if (isMongoConnected()) {
      const created = await ProgramModel.create({
        title,
        name: title,
        slug,
        collegeId,
        collegeName,
        degreeType: req.body.degreeType || 'UG',
        duration: req.body.duration || '3 Years',
        fee: req.body.fee || '₹50,000 / Year',
        fees: req.body.fee || '₹50,000 / Year',
        eligibility: req.body.eligibility || '10+2',
        specializations: Array.isArray(req.body.specializations) ? req.body.specializations : ['General'],
        overview: req.body.overview || '',
        description: req.body.overview || '',
        isActive: true
      });
      console.log(`🍃 Created Program in MongoDB Atlas: ${created.title}`);

      const db = getDb();
      db.programs.unshift({
        _id: created._id.toString(),
        title,
        slug,
        collegeId,
        collegeName,
        degreeType: req.body.degreeType || 'UG',
        duration: req.body.duration || '3 Years',
        fee: req.body.fee || '₹50,000 / Year',
        eligibility: req.body.eligibility || '10+2',
        specializations: Array.isArray(req.body.specializations) ? req.body.specializations : ['General'],
        overview: req.body.overview || '',
        syllabus: ['Semester 1 Basics', 'Semester 2 Advanced'],
        isActive: true
      });
      saveDbStore();

      return res.json({ success: true, program: created });
    }

    const db = getDb();
    const newProg = {
      _id: 'prog_' + Date.now(),
      title,
      slug,
      collegeId,
      collegeName,
      degreeType: req.body.degreeType || 'UG',
      duration: req.body.duration || '3 Years',
      fee: req.body.fee || '₹50,000 / Year',
      eligibility: req.body.eligibility || '10+2',
      specializations: Array.isArray(req.body.specializations) ? req.body.specializations : ['General'],
      overview: req.body.overview || '',
      syllabus: ['Semester 1 Basics', 'Semester 2 Advanced'],
      isActive: true
    };
    db.programs.unshift(newProg);
    saveDbStore();
    res.json({ success: true, program: newProg });
  } catch (err: any) {
    console.error('Error creating program:', err);
    res.status(500).json({ success: false, message: err.message || 'Error creating program' });
  }
});

router.put('/programs/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (ProgramModel as any).updateOne(
          { $or: [{ _id: id }, { id }] },
          { $set: req.body }
        );
      } catch (e) {
        await (ProgramModel as any).findByIdAndUpdate(id, req.body, { new: true }).catch(() => null);
      }
    }

    const db = getDb();
    const prog = db.programs.find((p) => p._id === id || p.id === id);
    if (prog) {
      Object.assign(prog, req.body);
      saveDbStore();
    }
    res.json({ success: true, message: 'Program updated successfully', program: req.body });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating program' });
  }
});

router.delete('/programs/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (ProgramModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (ProgramModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.programs = db.programs.filter((p) => p._id !== id && p.id !== id);
    saveDbStore();
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting program' });
  }
});

export default router;
