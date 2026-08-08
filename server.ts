import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import { initDbStore } from './src/server/db/dbStore';
import { initBackendModule } from './backend/index';
import authRoutes from './src/server/routes/authRoutes';
import collegeRoutes from './src/server/routes/collegeRoutes';
import programRoutes from './src/server/routes/programRoutes';
import enquiryRoutes from './src/server/routes/enquiryRoutes';
import applicationRoutes from './src/server/routes/applicationRoutes';
import studentRoutes from './src/server/routes/studentRoutes';
import documentRoutes from './src/server/routes/documentRoutes';
import contactRoutes from './src/server/routes/contactRoutes';
import subscriberRoutes from './src/server/routes/subscriberRoutes';
import faqRoutes from './src/server/routes/faqRoutes';
import testimonialRoutes from './src/server/routes/testimonialRoutes';
import sliderRoutes from './src/server/routes/sliderRoutes';
import adminRoutes from './src/server/routes/adminRoutes';
import notificationRoutes from './src/server/routes/notificationRoutes';
import uploadRoutes from './src/server/routes/uploadRoutes';
import settingsRoutes from './src/server/routes/settingsRoutes';

async function startServer() {
  const app = express();
  // Disable ETag to prevent caching of API responses in browsers/proxies
  app.disable('etag');
  const PORT = Number(process.env.PORT) || 3000;

  // Ensure upload directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Body Parsing Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 1. Initialize Backend Module (Connects to MongoDB Atlas & sets up backend routes)
  await initBackendModule(app);

  // 2. Initialize DB Data & Seeds (Seeds data to MongoDB Atlas directly when connected)
  await initDbStore();


  // Static files for Uploads
  app.use('/uploads', express.static(uploadsDir));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });


  // Prevent browser caching for all API routes
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/colleges', collegeRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/enquiries', enquiryRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/contacts', contactRoutes);
  app.use('/api/subscribers', subscriberRoutes);
  app.use('/api/faqs', faqRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/sliders', sliderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/settings', settingsRoutes);

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite Middleware or Production Static Fallback
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Online Degree Diploma Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
