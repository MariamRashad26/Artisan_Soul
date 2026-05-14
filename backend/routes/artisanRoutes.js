import express from 'express';
import {
  getArtisanQueue,
  updateOrderStage,
  uploadClip,
  getClips
} from '../controllers/artisanController.js';

const router = express.Router();

router.route('/queue').get(getArtisanQueue);
router.route('/order/:id/stage').put(updateOrderStage);
router.route('/clips')
  .get(getClips)
  .post(uploadClip);

export default router;
