import express from 'express';
import { getDesigns, createDesign, deleteDesign, updateDesign } from '../controllers/bespokeDesignController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getDesigns).post(protect, createDesign);
router.route('/:id').put(protect, updateDesign).delete(protect, deleteDesign);

export default router;
