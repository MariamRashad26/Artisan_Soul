import express from 'express';
import { getRawMaterials, createRawMaterial, getConsumptionLogs, logConsumption } from '../controllers/rawMaterialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { artisan } from '../middleware/artisanMiddleware.js';

const router = express.Router();

// Artisans need to READ raw materials to log consumption
router.route('/')
  .get(protect, artisan, getRawMaterials)   // artisan + admin can view stock
  .post(protect, admin, createRawMaterial); // only admin can create new materials

// Artisans log consumption; admin can also view all consumption logs
router.route('/consume')
  .get(protect, artisan, getConsumptionLogs)   // both can view
  .post(protect, artisan, logConsumption);      // artisan logs usage

export default router;
