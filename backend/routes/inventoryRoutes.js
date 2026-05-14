import express from 'express';
import { getInventory, logPackaging } from '../controllers/inventoryController.js';

const router = express.Router();

router.route('/')
  .get(getInventory);

router.route('/packaging')
  .post(logPackaging);

export default router;
