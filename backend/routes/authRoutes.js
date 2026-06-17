import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  updateUser,
  deleteUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  createStaffAccount,
  resendVerificationEmail,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/resend-verification', resendVerificationEmail);

// Private — logged-in user
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Private — Admin only
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.post('/create-staff', protect, admin, createStaffAccount);

export default router;
