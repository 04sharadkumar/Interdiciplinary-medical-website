// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // .js extension mandatory in ESM

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ success: false, message: 'Account deactivated' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, message: 'User not authenticated' });

    if (!roles.includes(req.user.role))
      return res
        .status(403)
        .json({ success: false, message: `Role ${req.user.role} not authorized` });

    next();
  };
};
