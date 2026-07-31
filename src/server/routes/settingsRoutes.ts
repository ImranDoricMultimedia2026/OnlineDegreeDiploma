import { Router } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { SettingsModel } from '../../../backend/models/Settings';

const router = Router();

const defaultSettings = {
  phonePrimary: '+91 98765 43210',
  phoneSecondary: '+91 80000 12345',
  whatsappNumber: '919876543210',
  emailPrimary: 'admissions@onlinedegreeportal.in',
  emailSupport: 'support@onlinedegreeportal.in',
  address: 'Building 4B, Knowledge Park III, Greater Noida, UP - 201306',
  googleMapUrl: 'https://maps.google.com/maps?q=Greater+Noida&output=embed',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://twitter.com',
  youtubeUrl: 'https://youtube.com',
  siteName: 'Online Degree Portal',
  siteTitle: 'UGC Approved Online Degree Programs & Top Universities',
  siteLogoUrl: '',
  headerAnnouncement: '🔥 Free Career Counselling & Admission Guidance for 2026 Batch!',
  footerAboutText: "India's leading online higher education portal helping students choose UGC-approved online degree programs from top universities.",
  defaultApplyUrl: '/apply',
  defaultBrochureUrl: '/uploads/sample_official_prospectus.pdf'
};

// GET Public Settings
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      let settings = await SettingsModel.findOne().lean();
      if (!settings) {
        const created = await SettingsModel.create(defaultSettings);
        settings = created.toObject();
      }
      return res.json({ success: true, settings });
    }

    const db = getDb();
    if (!db.settings) {
      db.settings = { ...defaultSettings };
      saveDbStore();
    }
    res.json({ success: true, settings: db.settings });
  } catch (err: any) {
    res.json({ success: true, settings: defaultSettings });
  }
});

// PUT Admin Update Settings
router.put('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (isMongoConnected()) {
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = new SettingsModel(updatedData);
      } else {
        Object.assign(settings, updatedData);
      }
      await settings.save();
      
      const db = getDb();
      db.settings = settings.toObject();
      saveDbStore();

      return res.json({ success: true, message: 'Site contact and CMS settings updated successfully!', settings });
    }

    const db = getDb();
    db.settings = { ...(db.settings || defaultSettings), ...updatedData };
    saveDbStore();

    res.json({ success: true, message: 'Site contact and CMS settings updated successfully!', settings: db.settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating settings' });
  }
});

export default router;
