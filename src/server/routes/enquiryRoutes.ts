import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { saveEnquiryToMongo, isMongoConnected } from '../../../backend/services/mongoService';
import { EnquiryModel } from '../../../backend/models/Enquiry';

const router = Router();

// POST Public Submit Enquiry (General, Brochure, Fee Structure)
router.post('/', async (req: any, res: Response) => {
  try {
    const { name, email, phone, state, city, qualification, collegeName, programName, college, program, message, type } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone number are required.' });
    }

    const finalCity = city || state || req.body.city || req.body.state || '';
    const finalState = state || city || req.body.state || req.body.city || '';
    const finalCollege = collegeName || college || req.body.collegeName || req.body.college || 'General';
    const finalProgram = programName || program || req.body.programName || req.body.program || 'General Enquiry';
    const finalQualification = qualification || req.body.qualification || '';

    const newEnquiry = {
      _id: 'enq_' + Date.now(),
      type: type || 'general',
      name,
      email: email.toLowerCase(),
      phone,
      city: finalCity,
      state: finalState,
      qualification: finalQualification,
      college: finalCollege,
      collegeName: finalCollege,
      program: finalProgram,
      programName: finalProgram,
      message: message || '',
      status: 'New',
      userId: req.body.userId || '',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      await EnquiryModel.create({
        name,
        email: email.toLowerCase(),
        phone,
        college: finalCollege,
        collegeName: finalCollege,
        program: finalProgram,
        programName: finalProgram,
        city: finalCity,
        state: finalState,
        qualification: finalQualification,
        message: message || '',
        type: type || 'general',
        status: 'New',
        userId: req.body.userId || ''
      });
      console.log(`🍃 Saved Enquiry into MongoDB Atlas for ${name}`);
    } else {
      const db = getDb();
      db.enquiries.unshift(newEnquiry);
      saveDbStore();
    }

    let downloadUrl = null;
    if (type === 'brochure') {
      downloadUrl = '/uploads/sample_official_prospectus.pdf';
    } else if (type === 'fee_structure') {
      downloadUrl = '/uploads/sample_fee_breakdown.pdf';
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! An academic counsellor will contact you shortly.',
      enquiry: newEnquiry,
      downloadUrl
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error processing enquiry' });
  }
});

// GET My Enquiries (Student)
router.get('/my-enquiries', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const userId = req.user?.id;

    if (isMongoConnected()) {
      const query: any = {
        $or: [
          ...(userId ? [{ userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : [])
        ]
      };
      const enquiries = await EnquiryModel.find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, enquiries });
    }

    const db = getDb();
    const enquiries = db.enquiries.filter(
      (e) =>
        (userId && e.userId === userId) ||
        (userEmail && e.email && e.email.toLowerCase() === userEmail)
    );

    res.json({ success: true, enquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET List Enquiries (Admin views all; Student views own)
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoConnected()) {
      let query: any = {};
      if (req.user?.role === 'student') {
        const userEmail = req.user.email.toLowerCase();
        query = {
          $or: [
            { userId: req.user.id },
            { email: userEmail }
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
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { phone: new RegExp(search, 'i') },
            { collegeName: new RegExp(search, 'i') },
            { programName: new RegExp(search, 'i') }
          ];
        }
      }

      const enquiries = await EnquiryModel.find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, enquiries });
    }

    const db = getDb();
    let enquiries = [...db.enquiries];

    if (req.user?.role === 'student') {
      enquiries = enquiries.filter(
        (e) => e.userId === req.user?.id || e.email.toLowerCase() === req.user?.email.toLowerCase()
      );
    } else if (req.user?.role === 'admin') {
      const status = req.query.status ? String(req.query.status) : '';
      const search = req.query.search ? String(req.query.search).toLowerCase() : '';

      if (status) {
        enquiries = enquiries.filter((e) => e.status.toLowerCase() === status.toLowerCase());
      }

      if (search) {
        enquiries = enquiries.filter(
          (e) =>
            e.name.toLowerCase().includes(search) ||
            e.email.toLowerCase().includes(search) ||
            e.phone.includes(search) ||
            e.collegeName?.toLowerCase().includes(search) ||
            e.programName?.toLowerCase().includes(search)
        );
      }
    }

    res.json({ success: true, enquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH Admin Update Enquiry Status, Remarks & Follow-up
router.patch('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, remarks, followUpDate } = req.body;

  try {
    let updated = false;
    let enquiryObj: any = null;

    if (isMongoConnected()) {
      try {
        let enquiry: any = null;
        try {
          enquiry = await (EnquiryModel as any).findOne({ _id: id });
        } catch (e) {}
        if (!enquiry) {
          try {
            enquiry = await (EnquiryModel as any).findById(id);
          } catch (e) {}
        }

        if (enquiry) {
          if (status) enquiry.status = status;
          if (remarks !== undefined) enquiry.notes = remarks;
          await enquiry.save();
          updated = true;
          enquiryObj = enquiry;
        }
      } catch (e) {
        console.error('Error updating enquiry in Mongo:', e);
      }
    }

    const db = getDb();
    const jsonEnq = db.enquiries.find((e) => e._id === id || e.id === id);

    if (jsonEnq) {
      if (status) jsonEnq.status = status;
      if (remarks !== undefined) jsonEnq.remarks = remarks;
      if (followUpDate !== undefined) jsonEnq.followUpDate = followUpDate;
      jsonEnq.updatedAt = new Date().toISOString();
      saveDbStore();
      updated = true;
      if (!enquiryObj) enquiryObj = jsonEnq;
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found' });
    }

    res.json({ success: true, message: 'Enquiry updated successfully!', enquiry: enquiryObj });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Admin Delete Enquiry
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      try {
        await (EnquiryModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (EnquiryModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.enquiries = db.enquiries.filter((e) => e._id !== id && e.id !== id);
    saveDbStore();

    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
