import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'online_degree_diploma_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'admin';
    name: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin authorization required' });
  }
  next();
};

export const requireStudentOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  next();
};

export const optionalToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        id: decoded.id || decoded._id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };
    } catch (err) {
      // ignore token verification error if optional
    }
  }
  next();
};

export const generateToken = (payload: { id: string; email: string; role: string; name: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
