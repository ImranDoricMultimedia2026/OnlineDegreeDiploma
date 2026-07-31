import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, optionalToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { saveApplicationToMongo, isMongoConnected } from '../../../backend/services/mongoService';
import { ApplicationModel } from '../../../backend/models/Application';
import { CollegeModel } from '../../../backend/models/College';
import { ProgramModel } from '../../../backend/models/Program';

const router = Router();

// POST Student Submit Application
router.post(
  '/',
  optionalToken,
  upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'marksheets', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        collegeId,
        programId,
        studentName,
        email,
        phone,
        dob,
        gender,
        address,
        state,
        qualification,
        tenthPercentage,
        twelfthPercentage,
        graduationPercentage
      } = req.body;

      if (!collegeId || !programId) {
        return res.status(400).json({ success: false, message: 'College and program selections are required.' });
      }

      let collegeName = req.body.collegeName || req.body.college || '';
      let programTitle = req.body.programName || req.body.programTitle || req.body.program || '';

      if (isMongoConnected()) {
        if (!collegeName) {
          const col: any =
            (await (CollegeModel as any).findById(collegeId).catch(() => null)) ||
            (await (CollegeModel as any).findOne({ _id: collegeId }).catch(() => null)) ||
            (await (CollegeModel as any).findOne({ slug: collegeId }).catch(() => null));
          if (col && col.name) collegeName = col.name;
        }
        if (!programTitle) {
          const prog: any =
            (await (ProgramModel as any).findById(programId).catch(() => null)) ||
            (await (ProgramModel as any).findOne({ _id: programId }).catch(() => null)) ||
            (await (ProgramModel as any).findOne({ slug: programId }).catch(() => null));
          if (prog && prog.title) programTitle = prog.title;
        }
      }

      if (!collegeName || !programTitle) {
        const db = getDb();
        if (!collegeName) {
          const college = db.colleges.find((c) => c._id === collegeId || c.slug === collegeId || c.name === collegeId);
          if (college) collegeName = college.name;
        }
        if (!programTitle) {
          const program = db.programs.find((p) => p._id === programId || p.slug === programId || p.title === programId);
          if (program) programTitle = program.title;
        }
      }

      if (!collegeName) collegeName = 'Partner University';
      if (!programTitle) programTitle = 'Degree Program';

      const finalStudentName = studentName || req.user?.name || 'Applicant';
      const finalStudentEmail = (email || req.user?.email || '').toLowerCase();
      const finalStudentPhone = phone || (req.user as any)?.phone || '';
      const userId = req.user?.id || 'guest_' + Date.now();

      let idProofUrl = '';
      let marksheetsUrl = '';
      let photoUrl = '';

      if (req.files && (req.files as any).idProof && (req.files as any).idProof[0]) {
        idProofUrl = '/uploads/' + (req.files as any).idProof[0].filename;
      }
      if (req.files && (req.files as any).marksheets && (req.files as any).marksheets[0]) {
        marksheetsUrl = '/uploads/' + (req.files as any).marksheets[0].filename;
      }
      if (req.files && (req.files as any).photo && (req.files as any).photo[0]) {
        photoUrl = '/uploads/' + (req.files as any).photo[0].filename;
      }

      const newApplicationData = {
        _id: 'app_' + Date.now(),
        userId,
        studentName: finalStudentName,
        studentEmail: finalStudentEmail,
        studentPhone: finalStudentPhone,
        collegeId,
        collegeName,
        programId,
        programName: programTitle,
        personalInfo: {
          dob: dob || '',
          gender: gender || '',
          address: address || '',
          state: state || '',
          qualification: qualification || '',
          tenthPercentage: tenthPercentage || '',
          twelfthPercentage: twelfthPercentage || '',
          graduationPercentage: graduationPercentage || ''
        },
        documents: {
          idProof: idProofUrl,
          marksheets: marksheetsUrl,
          photo: photoUrl
        },
        status: 'Pending',
        adminRemarks: 'Application submitted and queued for verification.',
        createdAt: new Date().toISOString()
      };

      if (isMongoConnected()) {
        const createdMongo = await ApplicationModel.create({
          userId,
          studentName: finalStudentName,
          email: finalStudentEmail,
          studentEmail: finalStudentEmail,
          phone: finalStudentPhone,
          studentPhone: finalStudentPhone,
          collegeId,
          collegeName,
          programId,
          programName: programTitle,
          dob: dob || '',
          gender: gender || '',
          address: address || '',
          state: state || '',
          highestQualification: qualification || '',
          status: 'Submitted',
          paymentStatus: 'Pending',
          documents: [
            { title: 'ID Proof', url: idProofUrl, status: 'Uploaded' },
            { title: 'Marksheets', url: marksheetsUrl, status: 'Uploaded' },
            { title: 'Photo', url: photoUrl, status: 'Uploaded' }
          ]
        });
        console.log(`🍃 Submitted Application into MongoDB Atlas for ${finalStudentName}`);

        const db = getDb();
        db.applications.unshift({
          ...newApplicationData,
          _id: createdMongo._id.toString()
        });
        saveDbStore();

        return res.status(201).json({
          success: true,
          message: 'Application submitted successfully to MongoDB Atlas!',
          application: {
            ...createdMongo.toObject(),
            studentEmail: finalStudentEmail,
            studentPhone: finalStudentPhone
          }
        });
      }

      const db = getDb();
      db.applications.unshift(newApplicationData);
      saveDbStore();

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully!',
        application: newApplicationData
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error submitting application' });
    }
  }
);

// GET My Applications (Student)
router.get('/my-applications', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const userId = req.user?.id;

    if (isMongoConnected()) {
      const query: any = {
        $or: [
          ...(userId ? [{ userId }] : []),
          ...(userEmail ? [{ email: userEmail }, { studentEmail: userEmail }] : [])
        ]
      };
      const applicationsRaw = await ApplicationModel.find(query).sort({ createdAt: -1 }).lean();
      const applications = applicationsRaw.map((a: any) => ({
        ...a,
        studentEmail: a.studentEmail || a.email || userEmail || '',
        studentPhone: a.studentPhone || a.phone || (req.user as any)?.phone || '',
        email: a.email || a.studentEmail || userEmail || '',
        phone: a.phone || a.studentPhone || (req.user as any)?.phone || ''
      }));
      return res.json({ success: true, applications });
    }

    const db = getDb();
    const apps = db.applications
      .filter(
        (a) =>
          (userId && a.userId === userId) ||
          (userEmail &&
            ((a.studentEmail && a.studentEmail.toLowerCase() === userEmail) ||
             (a.email && a.email.toLowerCase() === userEmail)))
      )
      .map((a: any) => ({
        ...a,
        studentEmail: a.studentEmail || a.email || userEmail || '',
        studentPhone: a.studentPhone || a.phone || (req.user as any)?.phone || '',
        email: a.email || a.studentEmail || userEmail || '',
        phone: a.phone || a.studentPhone || (req.user as any)?.phone || ''
      }));

    res.json({ success: true, applications: apps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Applications (Student: own; Admin: all)
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoConnected()) {
      let query: any = {};
      if (req.user?.role === 'student') {
        const userEmail = req.user?.email?.toLowerCase();
        const userId = req.user?.id;
        query = {
          $or: [
            ...(userId ? [{ userId }] : []),
            ...(userEmail ? [{ email: userEmail }, { studentEmail: userEmail }] : [])
          ]
        };
      } else if (req.user?.role === 'admin') {
        const status = req.query.status ? String(req.query.status) : '';
        const search = req.query.search ? String(req.query.search).toLowerCase() : '';

        if (status) {
          query.status = new RegExp(status, 'i');
        }

        if (search) {
          query.$or = [
            { studentName: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { studentEmail: new RegExp(search, 'i') },
            { collegeName: new RegExp(search, 'i') },
            { programName: new RegExp(search, 'i') }
          ];
        }
      }

      const applicationsRaw = await ApplicationModel.find(query).sort({ createdAt: -1 }).lean();
      const applications = applicationsRaw.map((a: any) => ({
        ...a,
        studentEmail: a.studentEmail || a.email || '',
        studentPhone: a.studentPhone || a.phone || '',
        email: a.email || a.studentEmail || '',
        phone: a.phone || a.studentPhone || ''
      }));
      return res.json({ success: true, applications });
    }

    const db = getDb();
    let apps = db.applications.map((a: any) => ({
      ...a,
      studentEmail: a.studentEmail || a.email || '',
      studentPhone: a.studentPhone || a.phone || '',
      email: a.email || a.studentEmail || '',
      phone: a.phone || a.studentPhone || ''
    }));

    if (req.user?.role === 'student') {
      const userEmail = req.user?.email?.toLowerCase();
      const userId = req.user?.id;
      apps = apps.filter(
        (a) =>
          (userId && a.userId === userId) ||
          (userEmail &&
            ((a.studentEmail && a.studentEmail.toLowerCase() === userEmail) ||
             (a.email && a.email.toLowerCase() === userEmail)))
      );
    } else if (req.user?.role === 'admin') {
      const status = req.query.status ? String(req.query.status) : '';
      const search = req.query.search ? String(req.query.search).toLowerCase() : '';

      if (status) {
        apps = apps.filter((a) => a.status.toLowerCase() === status.toLowerCase());
      }

      if (search) {
        apps = apps.filter(
          (a) =>
            a.studentName.toLowerCase().includes(search) ||
            a.studentEmail.toLowerCase().includes(search) ||
            a.email.toLowerCase().includes(search) ||
            a.collegeName.toLowerCase().includes(search) ||
            a.programName.toLowerCase().includes(search)
        );
      }
    }

    res.json({ success: true, applications: apps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Single Application
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      let app: any = await (ApplicationModel as any).findById(id).lean();
      if (!app) {
        app = await (ApplicationModel as any).findOne({ _id: id }).lean();
      }
      if (!app) {
        return res.status(404).json({ success: false, message: 'Application record not found in MongoDB' });
      }
      return res.json({ success: true, application: app });
    }

    const db = getDb();
    const app = db.applications.find((a) => a._id === id);

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    res.json({ success: true, application: app });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH Admin Update Application Status & Remarks
router.patch('/:id/status', verifyToken, requireAdmin, async (req, res) => {
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
          updated = true;
          updatedApp = app;
        }
      } catch (mongoErr: any) {
        console.error('Error updating status in Mongo:', mongoErr.message || mongoErr);
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
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    res.json({ success: true, message: 'Application status updated successfully!', application: updatedApp });
  } catch (err: any) {
    console.error('Error updating application status:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update application status' });
  }
});

// DELETE Admin Delete Application
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      try {
        await (ApplicationModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (ApplicationModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.applications = db.applications.filter((a) => a._id !== id && a.id !== id && a._id?.toString() !== id);
    saveDbStore();

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
