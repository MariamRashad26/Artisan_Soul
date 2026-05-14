import express from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../controllers/materialController.js';

const router = express.Router();

router.route('/')
  .get(getMaterials)
  .post(createMaterial);

router.route('/:id')
  .get(getMaterialById)
  .put(updateMaterial)
  .delete(deleteMaterial);

export default router;
