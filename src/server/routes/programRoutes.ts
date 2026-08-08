import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { ProgramModel } from '../../../backend/models/Program';

const router = Router();

// GET All Programs (Public)
router.get('/', async (req, res) => {
  try {
    const { degreeType, collegeId, search, category, limit, page, pageSize } = req.query;
    const pageNumber = Math.max(1, Number(page) || 1);
    const requestedLimit = Math.min(100, Math.max(1, Number(limit || pageSize || 20)));
    const skip = (pageNumber - 1) * requestedLimit;

    if (isMongoConnected()) {
      const query: any = {};
      if (degreeType) query.degreeType = new RegExp(String(degreeType), 'i');
      if (collegeId) {
        query.$or = [{ collegeId: String(collegeId) }, { collegeName: new RegExp(String(collegeId), 'i') }];
      }
      if (category) query.category = new RegExp(String(category), 'i');
      if (search) {
        const s = String(search);
        query.$or = [
          { title: new RegExp(s, 'i') },
          { name: new RegExp(s, 'i') },
          { degreeType: new RegExp(s, 'i') },
          { specializations: { $in: [new RegExp(s, 'i')] } },
          { collegeName: new RegExp(s, 'i') }
        ];
      }

      const [total, programs] = await Promise.all([
        (ProgramModel as any).countDocuments(query),
        (ProgramModel as any)
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(requestedLimit)
          .lean()
      ]);
      return res.json({ success: true, count: programs.length, total, totalPages: Math.max(1, Math.ceil(total / requestedLimit)), page: pageNumber, limit: requestedLimit, programs });
    }

    const db = getDb();
    let programs = [...db.programs];

    if (degreeType) {
      const dt = String(degreeType).toLowerCase();
      programs = programs.filter((p) => (p.degreeType || '').toLowerCase() === dt);
    }

    if (collegeId) {
      const cid = String(collegeId);
      programs = programs.filter((p) => p.collegeId === cid || p.collegeName === cid);
    }

    if (search) {
      const s = String(search).toLowerCase();
      programs = programs.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(s) ||
          (p.name && p.name.toLowerCase().includes(s)) ||
          (p.degreeType || '').toLowerCase().includes(s) ||
          (p.collegeName || '').toLowerCase().includes(s) ||
          (p.specializations || []).some((sp: string) => sp.toLowerCase().includes(s))
      );
    }

    const total = programs.length;
    const pagedPrograms = programs.slice(skip, skip + requestedLimit);
    res.json({ success: true, count: pagedPrograms.length, total, totalPages: Math.max(1, Math.ceil(total / requestedLimit)), page: pageNumber, limit: requestedLimit, programs: pagedPrograms });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching programs' });
  }
});

// GET Single Program
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const normalizedValue = String(idOrSlug).trim();
    const isObjectIdLike = /^[a-f\d]{24}$/i.test(normalizedValue);

    if (isMongoConnected()) {
      const program = await (ProgramModel as any)
        .findOne(
          isObjectIdLike ? { $or: [{ _id: normalizedValue }, { slug: normalizedValue }] } : { slug: normalizedValue }
        )
        .lean();

      if (program) {
        return res.json({ success: true, program });
      }
    }

    const db = getDb();
    const program = db.programs.find(
      (p) => p._id === normalizedValue || p.id === normalizedValue || p.slug === normalizedValue
    );

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({ success: true, program });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching program' });
  }
});

// POST Admin: Add Program
router.post(
  '/',
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'brochure', maxCount: 1 },
    { name: 'syllabus', maxCount: 1 }
  ]),
  async (req: any, res: Response) => {
    try {
      const {
        title,
        name: inputName,
        slug: inputSlug,
        collegeId,
        collegeName: inputCollegeName,
        degreeType,
        duration,
        fee,
        fees,
        eligibility,
        specializations,
        overview,
        description,
        applyUrl,
        isActive
      } = req.body;

      if (!title || !collegeId) {
        return res.status(400).json({ success: false, message: 'Program title and University selection are required.' });
      }

      const slug =
        inputSlug && inputSlug.trim() !== ''
          ? inputSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      let collegeName = inputCollegeName;
      if (!collegeName) {
        const db = getDb();
        const col = db.colleges.find((c) => c._id === collegeId || c.id === collegeId || c.slug === collegeId);
        if (col) collegeName = col.name;
      }
      if (!collegeName) collegeName = 'Partner University';

      let imageUrl = '';
      let brochureUrl = '';
      let syllabusUrl = '';

      if (req.files?.image?.[0]) {
        imageUrl = '/uploads/' + req.files.image[0].filename;
      } else if (req.body.image) {
        imageUrl = req.body.image;
      }

      if (req.files?.brochure?.[0]) {
        brochureUrl = '/uploads/' + req.files.brochure[0].filename;
      } else if (req.body.brochurePdfUrl) {
        brochureUrl = req.body.brochurePdfUrl;
      }

      if (req.files?.syllabus?.[0]) {
        syllabusUrl = '/uploads/' + req.files.syllabus[0].filename;
      } else if (req.body.syllabusPdfUrl) {
        syllabusUrl = req.body.syllabusPdfUrl;
      }

      const parsedSpecs = Array.isArray(specializations)
        ? specializations
        : typeof specializations === 'string'
        ? specializations.split(',').map((s) => s.trim()).filter(Boolean)
        : ['General Management'];

      const finalFee = fee || fees || '₹ 45,000 / Year';

      const programData = {
        title,
        name: inputName || title,
        slug,
        collegeId,
        collegeName,
        degreeType: degreeType || 'UG',
        duration: duration || '3 Years',
        fee: finalFee,
        fees: finalFee,
        eligibility: eligibility || '10+2 or equivalent',
        specializations: parsedSpecs,
        overview: overview || description || '',
        description: description || overview || '',
        image: imageUrl,
        applyUrl: applyUrl || '',
        brochurePdfUrl: brochureUrl,
        syllabusPdfUrl: syllabusUrl,
        isActive: isActive !== undefined ? Boolean(isActive === 'true' || isActive === true) : true
      };

      if (isMongoConnected()) {
        const created = await (ProgramModel as any).create(programData);
        const db = getDb();
        db.programs.unshift({ ...created.toObject(), _id: created._id.toString() });
        saveDbStore();
        return res.status(201).json({ success: true, message: 'Program created in MongoDB Atlas!', program: created });
      }

      const db = getDb();
      const newProgram = {
        _id: 'prog_' + Date.now(),
        ...programData,
        createdAt: new Date().toISOString()
      };

      db.programs.unshift(newProgram);
      saveDbStore();

      res.status(201).json({ success: true, message: 'Program created successfully!', program: newProgram });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error creating program' });
    }
  }
);

// PUT Admin: Edit Program
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'brochure', maxCount: 1 },
    { name: 'syllabus', maxCount: 1 }
  ]),
  async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const {
        title,
        name: inputName,
        slug: inputSlug,
        collegeId,
        collegeName,
        degreeType,
        duration,
        fee,
        fees,
        eligibility,
        specializations,
        overview,
        description,
        applyUrl,
        isActive
      } = req.body;

      const updateData: any = {};
      if (title) updateData.title = title;
      if (inputName) updateData.name = inputName;
      if (inputSlug) updateData.slug = inputSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (collegeId) updateData.collegeId = collegeId;
      if (collegeName) updateData.collegeName = collegeName;
      if (degreeType) updateData.degreeType = degreeType;
      if (duration) updateData.duration = duration;
      if (fee || fees) {
        updateData.fee = fee || fees;
        updateData.fees = fee || fees;
      }
      if (eligibility) updateData.eligibility = eligibility;
      if (overview !== undefined) updateData.overview = overview;
      if (description !== undefined) updateData.description = description;
      if (applyUrl !== undefined) updateData.applyUrl = applyUrl;
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      if (specializations) {
        updateData.specializations = Array.isArray(specializations)
          ? specializations
          : typeof specializations === 'string'
          ? specializations.split(',').map((s) => s.trim()).filter(Boolean)
          : specializations;
      }

      if (req.files?.image?.[0]) {
        updateData.image = '/uploads/' + req.files.image[0].filename;
      } else if (req.body.image) {
        updateData.image = req.body.image;
      }

      if (req.files?.brochure?.[0]) {
        updateData.brochurePdfUrl = '/uploads/' + req.files.brochure[0].filename;
      } else if (req.body.brochurePdfUrl !== undefined) {
        updateData.brochurePdfUrl = req.body.brochurePdfUrl;
      }

      if (req.files?.syllabus?.[0]) {
        updateData.syllabusPdfUrl = '/uploads/' + req.files.syllabus[0].filename;
      } else if (req.body.syllabusPdfUrl !== undefined) {
        updateData.syllabusPdfUrl = req.body.syllabusPdfUrl;
      }

      if (isMongoConnected()) {
        try {
          await (ProgramModel as any).updateOne({ $or: [{ _id: id }, { id }, { slug: id }] }, { $set: updateData });
        } catch (e) {
          await (ProgramModel as any).findByIdAndUpdate(id, updateData, { new: true }).catch(() => null);
        }
      }

      const db = getDb();
      const prog = db.programs.find((p) => p._id === id || p.id === id || p.slug === id);
      if (prog) {
        Object.assign(prog, updateData);
        saveDbStore();
      }

      res.json({ success: true, message: 'Program updated successfully!', program: updateData });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error updating program' });
    }
  }
);

// DELETE Admin: Delete Program
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (ProgramModel as any).deleteMany({ $or: [{ _id: id }, { id }, { slug: id }] });
      } catch (e) {
        await (ProgramModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.programs = db.programs.filter((p) => p._id !== id && p.id !== id && p.slug !== id);
    saveDbStore();

    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting program' });
  }
});

export default router;
