import express from 'express';
import { getLogs, createLog } from '../controllers/maintenanceController.js';

const router = express.Router();

router.route('/')
  .get(getLogs)
  .post(createLog);

export default router;
