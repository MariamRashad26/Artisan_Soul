import express from 'express';
import { 
  getRevenues, 
  getPurchases, 
  createPurchase,
  updatePurchase,
  deletePurchase,
  createRevenue,
  updateRevenue,
  deleteRevenue
} from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/revenue')
  .get(protect, getRevenues)          // any authenticated user can view
  .post(protect, admin, createRevenue); // only admin can create

router.route('/revenue/:id')
  .put(protect, admin, updateRevenue)
  .delete(protect, admin, deleteRevenue);

router.route('/purchases')
  .get(protect, getPurchases)           // any authenticated user can view
  .post(protect, admin, createPurchase); // only admin can create

router.route('/purchases/:id')
  .put(protect, admin, updatePurchase)
  .delete(protect, admin, deletePurchase);

export default router;
