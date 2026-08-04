import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'apnaghar_super_secret_jwt_key_2026_48h';

// Authenticate JWT Token (48h expiry check)
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token expired (48h max) or invalid authentication.' });
    }
    req.user = decoded; // { userId, email, role, name }
    next();
  });
}

// Role Authorization Middleware
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Portal requires ${allowedRoles.join(' or ')} permission.` 
      });
    }
    next();
  };
}
