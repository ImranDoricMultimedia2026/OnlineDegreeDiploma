import { Router } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// POST Public Subscribe to Newsletter
router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const db = getDb();
  const existing = db.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.json({ success: true, message: 'You are already subscribed to our newsletter updates!' });
  }

  const newSub = {
    _id: 'sub_' + Date.now(),
    email: email.toLowerCase(),
    status: 'active',
    createdAt: new Date().toISOString()
  };

  db.subscribers.unshift(newSub);
  saveDbStore();

  res.status(201).json({ success: true, message: 'Thank you for subscribing to Online Degree Diploma!' });
});

// GET Admin List Subscribers
router.get('/', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  res.json({ success: true, subscribers: db.subscribers });
});

export default router;
