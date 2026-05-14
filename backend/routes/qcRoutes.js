import express from 'express';
import { getReports, createReport } from '../controllers/qcController.js';

const router = express.Router();

router.route('/')
  .get(getReports)
  .post(createReport);

export default router;
