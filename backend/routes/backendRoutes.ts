import { Router, Request, Response } from 'express';
import { getMongoStatus } from '../config/db';
import { UserModel } from '../models/User';
import { CollegeModel } from '../models/College';
import { ProgramModel } from '../models/Program';
import { EnquiryModel } from '../models/Enquiry';
import { ApplicationModel } from '../models/Application';

const router = Router();

/**
 * GET /api/backend/status
 * Returns current status of MongoDB Atlas connection & Express backend
 */
router.get('/status', async (req: Request, res: Response) => {
  const mongoStatus = getMongoStatus();

  let counts = {
    users: 0,
    colleges: 0,
    programs: 0,
    enquiries: 0,
    applications: 0,
  };

  if (mongoStatus.isConnected) {
    try {
      counts.users = await UserModel.countDocuments();
      counts.colleges = await CollegeModel.countDocuments();
      counts.programs = await ProgramModel.countDocuments();
      counts.enquiries = await EnquiryModel.countDocuments();
      counts.applications = await ApplicationModel.countDocuments();
    } catch (e) {
      console.error('Error getting MongoDB document counts:', e);
    }
  }

  res.json({
    success: true,
    backend: 'Express.js + TypeScript',
    database: 'MongoDB Atlas',
    connection: mongoStatus,
    modelsCount: counts,
    mongoUriConfigured: Boolean(process.env.MONGO_URI || process.env.MONGODB_URI),
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
  });
});

export default router;
