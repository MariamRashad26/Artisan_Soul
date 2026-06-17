import express from 'express';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getSuppliers)
  .post(protect, admin, createSupplier);

router.route('/:id')
  .get(protect, admin, getSupplierById)
  .put(protect, admin, updateSupplier)
  .delete(protect, admin, deleteSupplier);

export default router;
