import express from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../controllers/materialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getMaterials)
  .post(protect, admin, createMaterial);

router.route('/:id')
  .get(protect, admin, getMaterialById)
  .put(protect, admin, updateMaterial)
  .delete(protect, admin, deleteMaterial);

export default router;
