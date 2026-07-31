import { Router, Response } from 'express';
import { upload } from '../middleware/upload';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/upload - Single File Upload (Image / PDF / Document)
router.post('/', verifyToken, requireAdmin, upload.any(), (req: any, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      if (req.file) {
        const fileUrl = '/uploads/' + req.file.filename;
        return res.json({ success: true, fileUrl, fileName: req.file.filename, originalName: req.file.originalname });
      }
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const firstFile = req.files[0];
    const fileUrl = '/uploads/' + firstFile.filename;
    const fileUrls = req.files.map((f: any) => '/uploads/' + f.filename);

    res.json({
      success: true,
      fileUrl,
      fileUrls,
      fileName: firstFile.filename,
      originalName: firstFile.originalname
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'File upload failed' });
  }
});

// POST /api/upload/public - Public/Student document upload (for Application documents)
router.post('/public', upload.single('file'), (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }
    const fileUrl = '/uploads/' + req.file.filename;
    res.json({ success: true, fileUrl, fileName: req.file.filename, originalName: req.file.originalname });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'File upload failed' });
  }
});

export default router;
