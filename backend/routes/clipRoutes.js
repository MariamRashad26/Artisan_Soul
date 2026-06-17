// import express from 'express';
// import { getClips, createClip, updateClip, deleteClip } from '../controllers/clipController.js';

// const router = express.Router();

// router.route('/')
//   .get(getClips)
//   .post(createClip);

// router.route('/:id')
//   .put(updateClip)
//   .delete(deleteClip);

// export default router;
// import express from 'express';
// import { getClips, getClipById, createClip, updateClip, deleteClip } from '../controllers/clipController.js';

// const router = express.Router();

// router.route('/').get(getClips).post(createClip);
// router.route('/:id').get(getClipById).put(updateClip).delete(deleteClip);

// export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getClips, 
  createClip, 
  getClipById, 
  updateClip, 
  deleteClip 
} from '../controllers/clipController.js';

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: 'uploads/clips/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', getClips);
router.post('/', upload.single('video'), createClip);
router.get('/:id', getClipById);
router.put('/:id', updateClip);
router.delete('/:id', deleteClip);

export default router;