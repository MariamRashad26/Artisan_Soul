import express from 'express';
import { 
  getBatches, 
  createBatch, 
  updateBatch, 
  deleteBatch, 
  getStages, 
  createStage, 
  updateStage, 
  deleteStage, 
  logStage, 
  getStageLogs,
  deleteStageLog 
} from '../controllers/productionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { artisan } from '../middleware/artisanMiddleware.js';

const router = express.Router();

router.route('/batches')
  .get(protect, artisan, getBatches)
  .post(protect, admin, createBatch);

router.route('/batches/:id')
  .put(protect, artisan, updateBatch)
  .delete(protect, admin, deleteBatch);

router.route('/stages')
  .get(protect, artisan, getStages)
  .post(protect, admin, createStage);

router.route('/stages/:id')
  .put(protect, admin, updateStage)
  .delete(protect, admin, deleteStage);

router.route('/stages/log')
  .get(protect, artisan, getStageLogs)
  .post(protect, artisan, logStage);

router.route('/stages/log/:id')
  .delete(protect, admin, deleteStageLog);

export default router;
