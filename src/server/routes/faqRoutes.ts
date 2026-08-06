import { Router } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { FAQModel } from '../../../backend/models/FAQ';

const router = Router();

// GET Public Active FAQs
router.get('/', async (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    if (isMongoConnected()) {
      const query: any = {};
      if (!includeAll) {
        query.$or = [{ isActive: true }, { isActive: { $exists: false } }];
      }
      const faqs = await (FAQModel as any).find(query).sort({ order: 1 }).lean();
      if (faqs.length > 0) {
        return res.json({ success: true, faqs });
      }
    }

    const db = getDb();
    let faqs = [...db.faqs];
    if (!includeAll) {
      faqs = faqs.filter((f) => f.isActive !== false);
    }
    faqs.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, faqs });
  } catch (err: any) {
    const db = getDb();
    let faqs = db.faqs || [];
    if (req.query.all !== 'true') {
      faqs = faqs.filter((f) => f.isActive !== false);
    }
    faqs.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, faqs });
  }
});

// POST Admin Add FAQ
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

    const faqData = {
      question,
      answer,
      category: category || 'General',
      order: Number(order) || 1,
      isActive: isActive !== undefined ? Boolean(isActive === 'true' || isActive === true) : true
    };

    if (isMongoConnected()) {
      const created = await (FAQModel as any).create(faqData);
      const db = getDb();
      db.faqs.push({ ...created.toObject(), _id: created._id.toString() });
      saveDbStore();
      return res.status(201).json({ success: true, message: 'FAQ created in MongoDB Atlas!', faq: created });
    }

    const db = getDb();
    const newFaq = {
      _id: 'faq_' + Date.now(),
      ...faqData
    };

    db.faqs.push(newFaq);
    saveDbStore();

    res.status(201).json({ success: true, message: 'FAQ created successfully!', faq: newFaq });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating FAQ' });
  }
});

// PUT Admin Edit FAQ
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, order, isActive } = req.body;

    const updateData: any = {};
    if (question) updateData.question = question;
    if (answer) updateData.answer = answer;
    if (category) updateData.category = category;
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

    if (isMongoConnected()) {
      try {
        await (FAQModel as any).updateOne({ $or: [{ _id: id }, { id }] }, { $set: updateData });
      } catch (e) {
        await (FAQModel as any).findByIdAndUpdate(id, updateData, { new: true }).catch(() => null);
      }
    }

    const db = getDb();
    const faq = db.faqs.find((f) => f._id === id || f.id === id);
    if (faq) {
      Object.assign(faq, updateData);
      saveDbStore();
    }

    res.json({ success: true, message: 'FAQ updated successfully!', faq: updateData });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating FAQ' });
  }
});

// DELETE Admin Delete FAQ
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (FAQModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (FAQModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.faqs = db.faqs.filter((f) => f._id !== id && f.id !== id);
    saveDbStore();

    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting FAQ' });
  }
});

export default router;
