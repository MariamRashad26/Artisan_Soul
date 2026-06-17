import User from '../models/User.js';

// Middleware to ensure the user is an admin
export const admin = async (req, res, next) => {
  try {
    // protect middleware should have already attached req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
