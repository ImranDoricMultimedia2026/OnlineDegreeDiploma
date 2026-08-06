import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { saveContactToMongo, isMongoConnected } from '../../../backend/services/mongoService';
import { sendAdminNotification } from '../../../backend/services/emailService';
import { ContactModel } from '../../../backend/models/Contact';

const router = Router();

// POST Public Submit Contact Form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    let savedContact: any = null;
    if (isMongoConnected()) {
      savedContact = await ContactModel.create({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message
      });
      console.log(`🍃 Saved Contact form entry into MongoDB Atlas for ${name}`);
    } else {
      const db = getDb();
      savedContact = {
        _id: 'cnt_' + Date.now(),
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      db.contacts.unshift(savedContact);
      saveDbStore();
    }

    try {
      await sendAdminNotification({
        subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
        heading: 'New Contact Inquiry Received',
        details: [
          { label: 'Name', value: name },
          { label: 'Email', value: email },
          { label: 'Phone', value: phone || 'N/A' },
          { label: 'Subject', value: subject || 'General Inquiry' },
          { label: 'Message', value: message }
        ],
        message: 'This enquiry has been successfully stored in the system and is ready for review in the Admin Panel.'
      });
    } catch (error) {
      console.warn('Contact email notification failed:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our team will reply to your message shortly.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error saving message' });
  }
});

// GET Admin List Contacts
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const contacts = await ContactModel.find().sort({ createdAt: -1 }).lean();
      return res.json({ success: true, contacts });
    }

    const db = getDb();
    res.json({ success: true, contacts: db.contacts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH Admin Mark Contact Read
router.patch('/:id/read', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      try {
        await (ContactModel as any).updateOne({ $or: [{ _id: id }, { id }] }, { $set: { status: 'Responded', isRead: true } });
      } catch (e) {}
    }

    const db = getDb();
    const contact = db.contacts.find((c) => c._id === id || c.id === id);

    if (contact) {
      contact.isRead = true;
      saveDbStore();
    }

    res.json({ success: true, message: 'Contact marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Admin Delete Contact
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      try {
        await (ContactModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {}
    }

    const db = getDb();
    db.contacts = db.contacts.filter((c) => c._id !== id && c.id !== id);
    saveDbStore();

    res.json({ success: true, message: 'Contact message deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
