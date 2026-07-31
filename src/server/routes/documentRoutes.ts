import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { isMongoConnected } from '../../../backend/services/mongoService';
import { DocumentItemModel } from '../../../backend/models/Document';

const router = Router();

// GET List Documents (Public/Admin)
router.get('/', async (req, res) => {
  try {
    const type = req.query.type ? String(req.query.type) : '';
    const college = req.query.college ? String(req.query.college).toLowerCase() : '';
    const search = req.query.search ? String(req.query.search).toLowerCase() : '';

    if (isMongoConnected()) {
      const query: any = {};
      if (type) query.type = type;
      if (college) query.collegeName = new RegExp(college, 'i');
      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { collegeName: new RegExp(search, 'i') },
          { programName: new RegExp(search, 'i') }
        ];
      }

      const docs = await (DocumentItemModel as any).find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, documents: docs });
    }

    const db = getDb();
    let docs = [...db.documents];

    if (type) {
      docs = docs.filter((d) => d.type === type);
    }

    if (college) {
      docs = docs.filter((d) => d.collegeName && d.collegeName.toLowerCase().includes(college));
    }

    if (search) {
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          (d.collegeName && d.collegeName.toLowerCase().includes(search)) ||
          (d.programName && d.programName.toLowerCase().includes(search))
      );
    }

    res.json({ success: true, documents: docs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching documents' });
  }
});

// POST Admin Upload Document
router.post('/', verifyToken, requireAdmin, upload.single('file'), async (req: any, res: Response) => {
  try {
    const { title, type, collegeName, programName, fileUrl: inputUrl } = req.body;

    if (!title && !req.file) {
      return res.status(400).json({ success: false, message: 'Document title and file are required.' });
    }

    let fileUrl = inputUrl || '';
    let fileSizeMB = '1.2 MB';

    if (req.file) {
      fileUrl = '/uploads/' + req.file.filename;
      fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';
    }

    const docData = {
      title: title || 'University Brochure',
      type: type || 'brochure',
      collegeName: collegeName || '',
      programName: programName || '',
      fileUrl,
      fileSize: fileSizeMB,
      uploadedBy: req.user?.name || 'Admin',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const created = await (DocumentItemModel as any).create(docData);
      const db = getDb();
      db.documents.unshift({ ...created.toObject(), _id: created._id.toString() });
      saveDbStore();
      return res.status(201).json({ success: true, message: 'Brochure uploaded to MongoDB Atlas!', document: created });
    }

    const db = getDb();
    const newDoc = {
      _id: 'doc_' + Date.now(),
      ...docData
    };

    db.documents.unshift(newDoc);
    saveDbStore();

    res.status(201).json({ success: true, message: 'Document uploaded successfully!', document: newDoc });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error uploading document' });
  }
});

// PUT Admin Edit Document
router.put('/:id', verifyToken, requireAdmin, upload.single('file'), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, collegeName, programName, fileUrl: inputUrl } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (type) updateData.type = type;
    if (collegeName !== undefined) updateData.collegeName = collegeName;
    if (programName !== undefined) updateData.programName = programName;

    if (req.file) {
      updateData.fileUrl = '/uploads/' + req.file.filename;
      updateData.fileSize = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';
    } else if (inputUrl) {
      updateData.fileUrl = inputUrl;
    }

    if (isMongoConnected()) {
      try {
        await (DocumentItemModel as any).updateOne({ $or: [{ _id: id }, { id }] }, { $set: updateData });
      } catch (e) {
        await (DocumentItemModel as any).findByIdAndUpdate(id, updateData, { new: true }).catch(() => null);
      }
    }

    const db = getDb();
    const doc = db.documents.find((d) => d._id === id || d.id === id);
    if (doc) {
      Object.assign(doc, updateData);
      saveDbStore();
    }

    res.json({ success: true, message: 'Document updated successfully!', document: updateData });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating document' });
  }
});

// DELETE Admin Delete Document
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      try {
        await (DocumentItemModel as any).deleteMany({ $or: [{ _id: id }, { id }] });
      } catch (e) {
        await (DocumentItemModel as any).findByIdAndDelete(id).catch(() => null);
      }
    }

    const db = getDb();
    db.documents = db.documents.filter((d) => d._id !== id && d.id !== id);
    saveDbStore();

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting document' });
  }
});

export default router;
