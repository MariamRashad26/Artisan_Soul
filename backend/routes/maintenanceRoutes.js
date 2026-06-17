import express from 'express';
import { getLogs, createLog, updateLog, deleteLog } from '../controllers/maintenanceController.js';

const router = express.Router();

router.route('/')
  .get(getLogs)
  .post(createLog);

router.route('/:id')
  .put(updateLog)
  .delete(deleteLog);

export default router;
