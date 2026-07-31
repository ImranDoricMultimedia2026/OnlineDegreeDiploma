import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { SliderModel } from '../../../backend/models/Slider';

const router = Router();

// GET Public Active Sliders
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const query: any = {};
      if (req.query.all !== 'true') {
        query.isActive = true;
      }
      const sliders = await (SliderModel as any).find(query).sort({ order: 1 }).lean();
      return res.json({ success: true, sliders });
    }

    const db = getDb();
    let sliders = [...db.sliders];

    if (req.query.all !== 'true') {
      sliders = sliders.filter((s) => s.isActive);
    }

    sliders.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, sliders });
  } catch (err: any) {
    const db = getDb();
    res.json({ success: true, sliders: db.sliders || [] });
  }
});

// POST Admin Add Slider
router.post(
  '/',
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: 'bgImage', maxCount: 1 },
    { name: 'mobileBgImage', maxCount: 1 }
  ]),
  async (req: any, res: Response) => {
    try {
      const {
        title,
        subtitle,
        description,
        badge,
        bgImage: inputBg,
        mobileBgImage: inputMobileBg,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        order,
        isActive
      } = req.body;

      if (!title || !subtitle) {
        return res.status(400).json({ success: false, message: 'Slide title and subtitle are required.' });
      }

      let bgImageUrl = inputBg || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=600&fit=crop&q=80';
      let mobileBgImageUrl = inputMobileBg || bgImageUrl;

      if (req.files?.bgImage?.[0]) {
        bgImageUrl = '/uploads/' + req.files.bgImage[0].filename;
      }
      if (req.files?.mobileBgImage?.[0]) {
        mobileBgImageUrl = '/uploads/' + req.files.mobileBgImage[0].filename;
      }

      const slideData = {
        title,
        subtitle,
        description: description || '',
        badge: badge || '2026 Admissions Open',
        bgImage: bgImageUrl,
        mobileBgImage: mobileBgImageUrl,
        primaryBtnText: primaryBtnText || 'Explore Programs',
        primaryBtnLink: primaryBtnLink || '/programs',
        secondaryBtnText: secondaryBtnText || 'Free Guidance',
        secondaryBtnLink: secondaryBtnLink || '/contact',
        order: Number(order) || 1,
        isActive: isActive !== undefined ? Boolean(isActive === 'true' || isActive === true) : true
      };

      if (isMongoConnected()) {
        const created = await (SliderModel as any).create(slideData);
        const db = getDb();
        db.sliders.push({ ...created.toObject(), _id: created._id.toString() });
        saveDbStore();
        return res.status(201).json({ success: true, message: 'Hero slide created in MongoDB Atlas!', slider: created });
      }

      const db = getDb();
      const newSlide = {
        _id: 'sld_' + Date.now(),
        ...slideData
      };

      db.sliders.push(newSlide);
      saveDbStore();

      res.status(201).json({ success: true, message: 'Hero slide created successfully!', slider: newSlide });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error creating slider' });
    }
  }
);

// PUT Admin Edit Slider
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: 'bgImage', maxCount: 1 },
    { name: 'mobileBgImage', maxCount: 1 }
  ]),
  async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const {
        title,
        subtitle,
        description,
        badge,
        bgImage: inputBg,
        mobileBgImage: inputMobileBg,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        order,
        isActive
      } = req.body;

      const updateData: any = {};
      if (title) updateData.title = title;
      if (subtitle) updateData.subtitle = subtitle;
      if (description !== undefined) updateData.description = description;
      if (badge !== undefined) updateData.badge = badge;
      if (primaryBtnText) updateData.primaryBtnText = primaryBtnText;
      if (primaryBtnLink) updateData.primaryBtnLink = primaryBtnLink;
      if (secondaryBtnText !== undefined) updateData.secondaryBtnText = secondaryBtnText;
      if (secondaryBtnLink !== undefined) updateData.secondaryBtnLink = secondaryBtnLink;
      if (order !== undefined) updateData.order = Number(order);
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      if (req.files?.bgImage?.[0]) {
        updateData.bgImage = '/uploads/' + req.files.bgImage[0].filename;
      } else if (inputBg) {
        updateData.bgImage = inputBg;
      }

      if (req.files?.mobileBgImage?.[0]) {
        updateData.mobileBgImage = '/uploads/' + req.files.mobileBgImage[0].filename;
      } else if (inputMobileBg) {
        updateData.mobileBgImage = inputMobileBg;
      }

      if (isMongoConnected()) {
        try {
          await (SliderModel as any).updateOne({ $or: [{ _id: id }, { id }] }, { $set: updateData });
        } catch (e) {
          await (SliderModel as any).findByIdAndUpdate(id, updateData, { new: true }).catch(() => null);
        }
      }

      const db = getDb();
      const slider = db.sliders.find((s) => s._id === id || s.id === id);
      if (slider) {
        Object.assign(slider, updateData);
        saveDbStore();
      }

      res.json({ success: true, message: 'Hero slide updated successfully!', slider: updateData });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error updating slider' });
    }
  }
);

// DELETE Admin Delete Slider
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (SliderModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (SliderModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.sliders = db.sliders.filter((s) => s._id !== id && s.id !== id);
    saveDbStore();

    res.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting slider' });
  }
});

export default router;
