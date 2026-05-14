import express from 'express';
import { getDesigns, createDesign, deleteDesign } from '../controllers/bespokeDesignController.js';

const router = express.Router();

router.route('/').get(getDesigns).post(createDesign);
router.route('/:id').delete(deleteDesign);

export default router;
