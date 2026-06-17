import express from 'express';
import { getNotifications, createNotification, markAsRead, markAllAsRead, clearAllNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications)
  .post(protect, createNotification)
  .delete(protect, clearAllNotifications);

router.route('/read-all')
  .put(protect, markAllAsRead);

router.route('/:id/read')
  .put(protect, markAsRead);

export default router;
