import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  createStaffAccount,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Private — logged-in user
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Private — Admin only
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.post('/create-staff', protect, admin, createStaffAccount);

export default router;
