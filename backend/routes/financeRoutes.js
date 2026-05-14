import express from 'express';
import { getRevenues, getPurchases, createPurchase } from '../controllers/financeController.js';

const router = express.Router();

router.route('/revenue')
  .get(getRevenues);

router.route('/purchases')
  .get(getPurchases)
  .post(createPurchase);

export default router;
