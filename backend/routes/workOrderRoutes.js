import express from 'express';
import { getWorkOrders, createWorkOrder, updateWorkOrder, deleteWorkOrder, logConsumption } from '../controllers/workOrderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getWorkOrders)
  .post(protect, createWorkOrder);

router.route('/:id')
  .put(protect, updateWorkOrder)
  .delete(protect, deleteWorkOrder);

router.route('/consumption')
  .post(protect, logConsumption);

export default router;
