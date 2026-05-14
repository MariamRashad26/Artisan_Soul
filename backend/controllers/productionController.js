import ProductionBatch from '../models/ProductionBatch.js';
import ProductionStage from '../models/ProductionStage.js';
import StageLog from '../models/StageLog.js';

// @desc    Get stage logs
// @route   GET /api/production/stages/log
// @access  Private
export const getStageLogs = async (req, res) => {
  try {
    const logs = await StageLog.find({})
      .populate('batch_id', 'batch_number')
      .populate('stage_id', 'stage_name')
      .populate('artisan_id', 'name');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get production batches
// @route   GET /api/production/batches
// @access  Private
export const getBatches = async (req, res) => {
  try {
    const batches = await ProductionBatch.find({})
      .populate('product_id', 'name price')
      .populate('work_order_id');
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a production batch
// @route   POST /api/production/batches
// @access  Private
export const createBatch = async (req, res) => {
  try {
    const { batch_number, product_id, work_order_id, quantity, start_date, end_date } = req.body;
    const batch = await ProductionBatch.create({
      batch_number, product_id, work_order_id, quantity, start_date, end_date
    });
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get production stages
// @route   GET /api/production/stages
// @access  Private
export const getStages = async (req, res) => {
  try {
    const stages = await ProductionStage.find({}).sort({ sequence_number: 1 });
    res.json(stages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log a stage completion
// @route   POST /api/production/stages/log
// @access  Private
export const logStage = async (req, res) => {
  try {
    const { batch_id, stage_id, artisan_id, status, end_time } = req.body;
    const log = await StageLog.create({
      batch_id, stage_id, artisan_id, status, end_time
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
