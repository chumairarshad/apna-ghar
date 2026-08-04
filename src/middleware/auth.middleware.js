import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'apnaghar_super_secret_jwt_key_2026_48h';

/**
 * Middleware: Verify 48-Hour JWT Security Token
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Authorization Bearer token missing.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired authentication token (48h maximum session length).'
      });
    }

    req.user = decoded; // Contains userId, email, role, name
    next();
  });
}

/**
 * Middleware: Authorize Specific Roles (USER, DEALER, ADMIN)
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Portal access requires ${allowedRoles.join(' or ')} permissions.`
      });
    }
    next();
  };
}
