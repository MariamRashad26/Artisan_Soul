import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.route('/')
  .get(getMessages)
  .post(sendMessage);

export default router;
