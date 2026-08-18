import jwt from 'jsonwebtoken';
import { dbStore } from '../services/dataService.js';
import { User } from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fixit_jwt_secret_super_key_2026';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await dbStore.findUserById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User account not found or session expired',
        });
      }

      if (user.status === 'inactive') {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
      }

      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
        error: error.message,
      });
    }
  } else {
    // Try to read token from HttpOnly cookie named `fixit_token`
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/(?:^|; )fixit_token=([^;]+)/);
    if (match && match[1]) {
      token = match[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await dbStore.findUserById(decoded.id);
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        if (user.status === 'inactive') {
          return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
        }
        req.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        };
        return next();
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token', error: err.message });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role "${req.user ? req.user.role : 'unauthenticated'}" is not permitted to access this resource.`,
      });
    }
    next();
  };
};
