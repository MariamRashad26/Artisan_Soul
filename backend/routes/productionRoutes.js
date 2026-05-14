import express from 'express';
import { getBatches, createBatch, getStages, logStage, getStageLogs } from '../controllers/productionController.js';

const router = express.Router();

router.route('/batches')
  .get(getBatches)
  .post(createBatch);

router.route('/stages')
  .get(getStages);

router.route('/stages/log')
  .get(getStageLogs)
  .post(logStage);

export default router;
