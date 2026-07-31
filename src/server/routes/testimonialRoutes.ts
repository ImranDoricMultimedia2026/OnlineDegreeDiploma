import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { TestimonialModel } from '../../../backend/models/Testimonial';

const router = Router();

// GET Public Active Testimonials
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const query: any = {};
      if (req.query.all !== 'true') {
        query.isActive = true;
      }
      const testimonials = await (TestimonialModel as any).find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, testimonials });
    }

    const db = getDb();
    let testimonials = [...db.testimonials];

    if (req.query.all !== 'true') {
      testimonials = testimonials.filter((t) => t.isActive);
    }

    res.json({ success: true, testimonials });
  } catch (err: any) {
    const db = getDb();
    res.json({ success: true, testimonials: db.testimonials || [] });
  }
});

// POST Admin Add Testimonial
router.post('/', verifyToken, requireAdmin, upload.single('image'), async (req: any, res: Response) => {
  try {
    const { name, course, college, quote, rating, isActive } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ success: false, message: 'Student name and quote are required.' });
    }

    let imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80';
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const tstData = {
      name,
      course: course || 'Online Degree Student',
      college: college || 'Partner University',
      image: imageUrl,
      quote,
      rating: Number(rating) || 5,
      isActive: isActive !== undefined ? Boolean(isActive === 'true' || isActive === true) : true
    };

    if (isMongoConnected()) {
      const created = await (TestimonialModel as any).create(tstData);
      const db = getDb();
      db.testimonials.unshift({ ...created.toObject(), _id: created._id.toString() });
      saveDbStore();
      return res.status(201).json({ success: true, message: 'Testimonial added to MongoDB Atlas!', testimonial: created });
    }

    const db = getDb();
    const newTestimonial = {
      _id: 'tst_' + Date.now(),
      ...tstData
    };

    db.testimonials.unshift(newTestimonial);
    saveDbStore();

    res.status(201).json({ success: true, message: 'Testimonial added successfully!', testimonial: newTestimonial });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error adding testimonial' });
  }
});

// PUT Admin Edit Testimonial
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, course, college, quote, rating, isActive } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (course) updateData.course = course;
    if (college) updateData.college = college;
    if (quote) updateData.quote = quote;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    if (isMongoConnected()) {
      try {
        await (TestimonialModel as any).updateOne({ $or: [{ _id: id }, { id }] }, { $set: updateData });
      } catch (e) {
        await (TestimonialModel as any).findByIdAndUpdate(id, updateData, { new: true }).catch(() => null);
      }
    }

    const db = getDb();
    const tst = db.testimonials.find((t) => t._id === id || t.id === id);
    if (tst) {
      Object.assign(tst, updateData);
      saveDbStore();
    }

    res.json({ success: true, message: 'Testimonial updated successfully!', testimonial: updateData });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating testimonial' });
  }
});

// DELETE Admin Delete Testimonial
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (TestimonialModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (TestimonialModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.testimonials = db.testimonials.filter((t) => t._id !== id && t.id !== id);
    saveDbStore();

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting testimonial' });
  }
});

export default router;
