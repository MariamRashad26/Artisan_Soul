const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, priority, completed, category, sortBy = 'createdAt', order = 'desc', page = 1, limit = 50 } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === 'true';
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)).lean(),
      Task.countDocuments(query),
    ]);

    res.json({
      success: true,
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, priority, dueDate, tags, category } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate: dueDate || null,
      tags: tags || [],
      category: category || 'General',
    });

    res.status(201).json({ success: true, message: 'Task created', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const allowedUpdates = ['title', 'description', 'completed', 'priority', 'dueDate', 'tags', 'category', 'order'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    res.json({ success: true, message: 'Task updated', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, message: `Task marked as ${task.completed ? 'complete' : 'incomplete'}`, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete completed tasks
// @route   DELETE /api/tasks/bulk/completed
// @access  Private
const deleteCompleted = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, completed: true });
    res.json({ success: true, message: `Deleted ${result.deletedCount} completed tasks` });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories for user
// @route   GET /api/tasks/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Task.distinct('category', { user: req.user._id });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleTask, deleteCompleted, getCategories };
