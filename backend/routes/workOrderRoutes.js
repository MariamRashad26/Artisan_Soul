import express from 'express';
import { getWorkOrders, createWorkOrder, logConsumption } from '../controllers/workOrderController.js';

const router = express.Router();

router.route('/')
  .get(getWorkOrders)
  .post(createWorkOrder);

router.route('/consumption')
  .post(logConsumption);

export default router;
