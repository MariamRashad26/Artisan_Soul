import express from 'express';
import { getReports, createReport, updateReport, deleteReport } from '../controllers/qcController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getReports)
  .post(protect, createReport);

router.route('/:id')
  .put(protect, admin, updateReport)
  .delete(protect, admin, deleteReport);

export default router;
