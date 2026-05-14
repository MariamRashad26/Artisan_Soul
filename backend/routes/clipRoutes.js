import express from 'express';
import { getClips, createClip } from '../controllers/clipController.js';

const router = express.Router();

router.route('/')
  .get(getClips)
  .post(createClip);

export default router;
