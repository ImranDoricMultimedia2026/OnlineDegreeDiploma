import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET Student Notifications
router.get('/', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const notifications = db.notifications.filter((n) => n.userId === req.user?.id || n.userId === 'all');
  res.json({ success: true, notifications });
});

// GET Admin List All Notifications
router.get('/admin', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json({ success: true, notifications: db.notifications });
});

// POST Admin Send Notification
router.post('/admin', verifyToken, (req: AuthRequest, res: Response) => {
  const { title, message, userId, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  const db = getDb();
  const newNotif = {
    _id: 'notif_' + Date.now(),
    title,
    message,
    userId: userId || 'all',
    type: type || 'info',
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.notifications.unshift(newNotif);
  saveDbStore();

  res.status(201).json({ success: true, message: 'Notification sent successfully!', notification: newNotif });
});

// DELETE Admin Delete Notification
router.delete('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.notifications.findIndex((n) => n._id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  db.notifications.splice(index, 1);
  saveDbStore();

  res.json({ success: true, message: 'Notification deleted successfully' });
});

// PATCH Mark Notification as Read
router.patch('/:id/read', verifyToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const notif = db.notifications.find((n) => n._id === id && n.userId === req.user?.id);

  if (!notif) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notif.isRead = true;
  saveDbStore();

  res.json({ success: true, message: 'Notification marked as read' });
});

export default router;
