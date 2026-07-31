import { Express } from 'express';
import { connectMongoDB } from './config/db';
import backendRoutes from './routes/backendRoutes';

/**
 * Initializes the Backend module:
 * - Connects to MongoDB Atlas (if MONGO_URI env var is configured)
 * - Registers Express backend status & diagnostic routes
 */
export const initBackendModule = async (app: Express): Promise<void> => {
  console.log('🚀 Initializing Express.js + MongoDB Backend module...');
  
  // Register backend routes
  app.use('/api/backend', backendRoutes);

  // Attempt MongoDB Atlas connection
  const isConnected = await connectMongoDB();

  if (isConnected) {
    console.log('🟢 MongoDB Atlas backend module initialized successfully.');
  } else {
    console.log('🟡 MongoDB Atlas URI not detected or offline. Local fallback store active.');
  }
};

export * from './config/db';
export * from './models/User';
export * from './models/College';
export * from './models/Program';
export * from './models/Enquiry';
export * from './models/Application';
export * from './models/Document';
export * from './models/FAQ';
export * from './models/Contact';
