import express from 'express';
import { getRawMaterials, createRawMaterial, getConsumptionLogs, logConsumption } from '../controllers/rawMaterialController.js';

const router = express.Router();

router.route('/')
  .get(getRawMaterials)
  .post(createRawMaterial);

router.route('/consume')
  .get(getConsumptionLogs)
  .post(logConsumption);

export default router;
