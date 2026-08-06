import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { NotificationModel } from '../../../backend/models/Notification';

const router = Router();

// GET Student Notifications
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoConnected()) {
      const notifications = await NotificationModel.find({
        $or: [{ userId: req.user?.id }, { userId: 'all' }]
      })
        .sort({ createdAt: -1 })
        .lean();
      return res.json({ success: true, notifications });
    }

    const db = getDb();
    const notifications = db.notifications.filter((n) => n.userId === req.user?.id || n.userId === 'all');
    res.json({ success: true, notifications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Admin List All Notifications
router.get('/admin', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoConnected()) {
      const notifications = await NotificationModel.find().sort({ createdAt: -1 }).lean();
      return res.json({ success: true, notifications });
    }

    const db = getDb();
    res.json({ success: true, notifications: db.notifications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Admin Send Notification
router.post('/admin', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { title, message, userId, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  try {
    if (isMongoConnected()) {
      const newNotif = await NotificationModel.create({
        title,
        message,
        userId: userId || 'all',
        type: type || 'info',
        isRead: false
      });

      return res.status(201).json({ success: true, message: 'Notification sent successfully!', notification: newNotif });
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Admin Delete Notification
router.delete('/admin/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      await NotificationModel.deleteOne({ _id: id });
    }

    const db = getDb();
    db.notifications = db.notifications.filter((n) => n._id !== id && n.id !== id);
    saveDbStore();

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH Mark Notification as Read
router.patch('/:id/read', verifyToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      const notif = await NotificationModel.findOne({
        _id: id,
        $or: [{ userId: req.user?.id }, { userId: 'all' }]
      });
      if (!notif) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      notif.isRead = true;
      await notif.save();
      return res.json({ success: true, message: 'Notification marked as read' });
    }

    const db = getDb();
    const notif = db.notifications.find((n) => n._id === id && n.userId === req.user?.id);

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notif.isRead = true;
    saveDbStore();

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
