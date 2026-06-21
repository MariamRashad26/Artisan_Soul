import express from 'express';
import {
  getArtisans,
  addArtisan,
  updateArtisan,
  deleteArtisan
} from '../controllers/artisanController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();


router.route('/').get(protect, admin, getArtisans);
router.route('/').post(protect, admin, addArtisan);
router.route('/:id').put(protect, admin, updateArtisan);
router.route('/:id').delete(protect, admin, deleteArtisan);

export default router;
