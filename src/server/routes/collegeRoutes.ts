import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { CollegeModel } from '../../../backend/models/College';
import { ProgramModel } from '../../../backend/models/Program';

const router = Router();

// GET All Colleges (Public)
router.get('/', async (req, res) => {
  try {
    const { search, state, approval, popular, featured } = req.query;

    if (isMongoConnected()) {
      const query: any = {};
      if (search) {
        query.$or = [
          { name: new RegExp(String(search), 'i') },
          { location: new RegExp(String(search), 'i') },
          { state: new RegExp(String(search), 'i') },
          { description: new RegExp(String(search), 'i') }
        ];
      }
      if (state) query.state = new RegExp(String(state), 'i');
      if (approval) query.approvals = { $in: [new RegExp(String(approval), 'i')] };
      if (popular === 'true') query.popular = true;
      if (featured === 'true') query.featured = true;

      const colleges = await (CollegeModel as any).find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: colleges.length, colleges });
    }

    const db = getDb();
    let colleges = [...db.colleges];

    if (search) {
      const s = String(search).toLowerCase();
      colleges = colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.location.toLowerCase().includes(s) ||
          c.state.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s)
      );
    }

    if (state) {
      const st = String(state).toLowerCase();
      colleges = colleges.filter((c) => c.state.toLowerCase().includes(st));
    }

    if (approval) {
      const app = String(approval).toLowerCase();
      colleges = colleges.filter((c) => c.approvals.some((a: string) => a.toLowerCase().includes(app)));
    }

    if (popular === 'true') colleges = colleges.filter((c) => c.popular);
    if (featured === 'true') colleges = colleges.filter((c) => c.featured);

    res.json({ success: true, count: colleges.length, colleges });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching colleges' });
  }
});

// GET Single College by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const normalizedValue = String(idOrSlug).trim();
    const isObjectIdLike = /^[a-f\d]{24}$/i.test(normalizedValue);

    if (isMongoConnected()) {
      const college = await (CollegeModel as any)
        .findOne(
          isObjectIdLike ? { $or: [{ _id: normalizedValue }, { slug: normalizedValue }] } : { slug: normalizedValue }
        )
        .lean();

      if (college) {
        const programs = await (ProgramModel as any)
          .find({
            $or: [
              { collegeId: college._id?.toString?.() || college._id },
              { collegeName: college.name },
              { collegeName: new RegExp(`^${String(college.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
            ]
          })
          .sort({ createdAt: -1 })
          .limit(8)
          .lean();

        const relatedColleges = await (CollegeModel as any)
          .find({ _id: { $ne: college._id }, isActive: true })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean();

        return res.json({ success: true, college, programs, relatedColleges });
      }
    }

    const db = getDb();
    const college = db.colleges.find(
      (c) => c._id === normalizedValue || c.id === normalizedValue || c.slug === normalizedValue
    );

    if (!college) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    const programs = db.programs.filter(
      (p) => p.collegeId === college._id || p.collegeId === college.id || p.collegeName === college.name
    );
    const relatedColleges = db.colleges
      .filter((c) => c._id !== college._id && c.isActive !== false)
      .slice(0, 4);

    res.json({ success: true, college, programs, relatedColleges });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching university' });
  }
});

// POST Admin: Add University
router.post(
  '/',
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  async (req: any, res: Response) => {
    try {
      const {
        name,
        code,
        slug: inputSlug,
        location,
        state,
        description,
        overview,
        approvals,
        website,
        applyUrl,
        videoUrl,
        establishedYear,
        rating,
        naacGrade,
        feesRange,
        placementPercentage,
        averagePackage,
        highestPackage,
        brochureUrl: inputBrochureUrl,
        isActive
      } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: 'University name is required.' });
      }

      const slug =
        inputSlug && inputSlug.trim() !== ''
          ? inputSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      let logoUrl = 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80';
      let bannerUrl = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop&q=80';
      let brochurePdfUrl = inputBrochureUrl || '';

      if (req.files?.logo?.[0]) {
        logoUrl = '/uploads/' + req.files.logo[0].filename;
      } else if (req.body.logo) {
        logoUrl = req.body.logo;
      }

      if (req.files?.banner?.[0]) {
        bannerUrl = '/uploads/' + req.files.banner[0].filename;
      } else if (req.body.banner) {
        bannerUrl = req.body.banner;
      }

      if (req.files?.brochure?.[0]) {
        brochurePdfUrl = '/uploads/' + req.files.brochure[0].filename;
      }

      const parsedApprovals = Array.isArray(approvals)
        ? approvals
        : typeof approvals === 'string'
        ? approvals.split(',').map((s) => s.trim()).filter(Boolean)
        : ['UGC Entitled', 'NAAC Accredited'];

      let galleryImagesList: string[] = [];
      if (req.body.galleryImages) {
        if (Array.isArray(req.body.galleryImages)) {
          galleryImagesList = req.body.galleryImages;
        } else if (typeof req.body.galleryImages === 'string') {
          try {
            galleryImagesList = JSON.parse(req.body.galleryImages);
          } catch (e) {
            galleryImagesList = req.body.galleryImages.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        }
      }

      const universityData = {
        name,
        code: code || slug.substring(0, 4).toUpperCase(),
        slug,
        location: location || 'Online / Pan India',
        state: state || 'India',
        description: description || '',
        overview: overview || description || '',
        approvals: parsedApprovals,
        logo: logoUrl,
        banner: bannerUrl,
        image: logoUrl,
        galleryImages: galleryImagesList,
        website: website || '',
        applyUrl: applyUrl || '',
        videoUrl: videoUrl || '',
        brochureUrl: brochurePdfUrl,
        establishedYear: establishedYear || 2005,
        rating: Number(rating) || 4.8,
        naacGrade: naacGrade || 'A+',
        feesRange: feesRange || '₹ 30,000 - ₹ 1,50,000',
        placementPercentage: placementPercentage || '85%',
        averagePackage: averagePackage || '₹ 4.5 LPA',
        highestPackage: highestPackage || '₹ 18.0 LPA',
        isActive: isActive !== undefined ? Boolean(isActive === 'true' || isActive === true) : true
      };

      if (isMongoConnected()) {
        const created = await (CollegeModel as any).create(universityData);
        const db = getDb();
        db.colleges.unshift({ ...created.toObject(), _id: created._id.toString() });
        saveDbStore();
        return res.status(201).json({
          success: true,
          message: 'University created in MongoDB Atlas!',
          college: created
        });
      }

      const db = getDb();
      const newCollege = {
        _id: 'col_' + Date.now(),
        ...universityData,
        createdAt: new Date().toISOString()
      };

      db.colleges.unshift(newCollege);
      saveDbStore();

      res.status(201).json({ success: true, message: 'University created successfully!', college: newCollege });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error creating university' });
    }
  }
);

// PUT Admin: Edit University
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const {
        name,
        code,
        slug: inputSlug,
        location,
        state,
        description,
        overview,
        approvals,
        website,
        applyUrl,
        videoUrl,
        establishedYear,
        rating,
        naacGrade,
        feesRange,
        placementPercentage,
        averagePackage,
        highestPackage,
        brochureUrl: inputBrochureUrl,
        isActive
      } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (code) updateData.code = code;
      if (inputSlug) updateData.slug = inputSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (location !== undefined) updateData.location = location;
      if (state !== undefined) updateData.state = state;
      if (description !== undefined) updateData.description = description;
      if (overview !== undefined) updateData.overview = overview;
      if (website !== undefined) updateData.website = website;
      if (applyUrl !== undefined) updateData.applyUrl = applyUrl;
      if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
      if (establishedYear !== undefined) updateData.establishedYear = establishedYear;
      if (rating !== undefined) updateData.rating = Number(rating);
      if (naacGrade !== undefined) updateData.naacGrade = naacGrade;
      if (feesRange !== undefined) updateData.feesRange = feesRange;
      if (placementPercentage !== undefined) updateData.placementPercentage = placementPercentage;
      if (averagePackage !== undefined) updateData.averagePackage = averagePackage;
      if (highestPackage !== undefined) updateData.highestPackage = highestPackage;
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      if (approvals) {
        updateData.approvals = Array.isArray(approvals)
          ? approvals
          : typeof approvals === 'string'
          ? approvals.split(',').map((s) => s.trim()).filter(Boolean)
          : approvals;
      }

      if (req.body.galleryImages) {
        if (Array.isArray(req.body.galleryImages)) {
          updateData.galleryImages = req.body.galleryImages;
        } else if (typeof req.body.galleryImages === 'string') {
          try {
            updateData.galleryImages = JSON.parse(req.body.galleryImages);
          } catch (e) {
            updateData.galleryImages = req.body.galleryImages.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        }
      }

      if (req.files?.logo?.[0]) {
        updateData.logo = '/uploads/' + req.files.logo[0].filename;
      } else if (req.body.logo) {
        updateData.logo = req.body.logo;
      }

      if (req.files?.banner?.[0]) {
        updateData.banner = '/uploads/' + req.files.banner[0].filename;
      } else if (req.body.banner) {
        updateData.banner = req.body.banner;
      }

      if (req.files?.brochure?.[0]) {
        updateData.brochureUrl = '/uploads/' + req.files.brochure[0].filename;
      } else if (inputBrochureUrl !== undefined) {
        updateData.brochureUrl = inputBrochureUrl;
      }

      if (isMongoConnected()) {
        try {
          await (CollegeModel as any).updateOne({ $or: [{ _id: id }, { id }, { slug: id }] }, { $set: updateData });
        } catch (e) {
          await (CollegeModel as any).findByIdAndUpdate(id, updateData, { new: true }).catch(() => null);
        }
      }

      const db = getDb();
      const college = db.colleges.find((c) => c._id === id || c.id === id || c.slug === id);
      if (college) {
        Object.assign(college, updateData);
        saveDbStore();
      }

      res.json({ success: true, message: 'University updated successfully!', college: updateData });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error updating university' });
    }
  }
);

// DELETE Admin: Delete University
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (CollegeModel as any).deleteMany({ $or: [{ _id: id }, { id }, { slug: id }] });
      } catch (e) {
        await (CollegeModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.colleges = db.colleges.filter((c) => c._id !== id && c.id !== id && c.slug !== id);
    saveDbStore();

    res.json({ success: true, message: 'University deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting university' });
  }
});

export default router;
