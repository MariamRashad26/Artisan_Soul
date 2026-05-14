const express = require('express');
const { body } = require('express-validator');
const {
  getTasks, createTask, updateTask, deleteTask,
  toggleTask, deleteCompleted, getCategories,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

router.get('/', getTasks);
router.get('/categories', getCategories);
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  createTask
);
router.put('/:id', updateTask);
router.delete('/bulk/completed', deleteCompleted);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

module.exports = router;
