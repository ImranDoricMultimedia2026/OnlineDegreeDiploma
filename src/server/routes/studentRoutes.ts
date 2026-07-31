import { Router, Response } from 'express';
import { getDb, saveDbStore } from '../db/dbStore';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET Admin: List All Students
router.get('/', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  let students = db.users
    .filter((u) => u.role === 'student')
    .map((u) => {
      const uCopy = { ...u };
      delete uCopy.password;
      return uCopy;
    });

  const search = req.query.search ? String(req.query.search).toLowerCase() : '';
  if (search) {
    students = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        (s.phone && s.phone.includes(search))
    );
  }

  res.json({ success: true, students });
});

// GET Admin: Get Student Detail with Enquiries & Applications
router.get('/:id', verifyToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const student = db.users.find((u) => u._id === id && u.role === 'student');

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student account not found' });
  }

  const studentObj = { ...student };
  delete studentObj.password;

  const enquiries = db.enquiries.filter(
    (e) => e.userId === id || e.email.toLowerCase() === student.email.toLowerCase()
  );
  const applications = db.applications.filter((a) => a.userId === id);

  res.json({
    success: true,
    student: studentObj,
    enquiries,
    applications
  });
});

// PATCH Admin: Activate / Deactivate Student Account
router.patch('/:id/status', verifyToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const db = getDb();
  const student = db.users.find((u) => u._id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student account not found' });
  }

  student.status = status === 'inactive' ? 'inactive' : 'active';
  saveDbStore();

  res.json({ success: true, message: `Student status updated to ${student.status}` });
});

// DELETE Admin: Delete Student Account
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.users.findIndex((u) => u._id === id && u.role === 'student');

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student account not found' });
  }

  db.users.splice(index, 1);
  saveDbStore();

  res.json({ success: true, message: 'Student account deleted successfully' });
});

// POST Student: Toggle Saved/Favorite Program
router.post('/saved-programs', verifyToken, (req: AuthRequest, res: Response) => {
  const { programId } = req.body;
  if (!programId) {
    return res.status(400).json({ success: false, message: 'Program ID is required' });
  }

  const db = getDb();
  const user = db.users.find((u) => u._id === req.user?.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!user.savedPrograms) {
    user.savedPrograms = [];
  }

  const index = user.savedPrograms.indexOf(programId);
  let isSaved = false;

  if (index > -1) {
    user.savedPrograms.splice(index, 1);
    isSaved = false;
  } else {
    user.savedPrograms.push(programId);
    isSaved = true;
  }

  saveDbStore();

  res.json({
    success: true,
    isSaved,
    savedPrograms: user.savedPrograms,
    message: isSaved ? 'Program saved to your favorites!' : 'Program removed from favorites'
  });
});

export default router;
