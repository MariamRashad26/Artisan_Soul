import express from 'express';
import { 
  getInventory, 
  createInventory, 
  updateInventory, 
  deleteInventory, 
  logPackaging 
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getInventory)
  .post(protect, admin, createInventory);

router.route('/:id')
  .put(protect, admin, updateInventory)
  .delete(protect, admin, deleteInventory);

router.route('/packaging')
  .post(protect, admin, logPackaging);

export default router;
