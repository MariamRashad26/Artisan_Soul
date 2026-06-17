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

// @desc    Update a production batch
// @route   PUT /api/production/batches/:id
// @access  Private
export const updateBatch = async (req, res) => {
  try {
    const updatedBatch = await ProductionBatch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedBatch) {
      return res.status(404).json({ message: 'Production batch not found' });
    }
    res.json(updatedBatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a production batch
// @route   DELETE /api/production/batches/:id
// @access  Private
export const deleteBatch = async (req, res) => {
  try {
    const deletedBatch = await ProductionBatch.findByIdAndDelete(req.params.id);
    if (!deletedBatch) {
      return res.status(404).json({ message: 'Production batch not found' });
    }
    res.json({ message: 'Production batch removed successfully' });
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

// @desc    Create a production stage
// @route   POST /api/production/stages
// @access  Private
export const createStage = async (req, res) => {
  try {
    const { stage_name, description, sequence_number } = req.body;
    const stage = await ProductionStage.create({
      stage_name, description, sequence_number
    });
    res.status(201).json(stage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a production stage
// @route   PUT /api/production/stages/:id
// @access  Private
export const updateStage = async (req, res) => {
  try {
    const updatedStage = await ProductionStage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedStage) {
      return res.status(404).json({ message: 'Production stage not found' });
    }
    res.json(updatedStage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a production stage
// @route   DELETE /api/production/stages/:id
// @access  Private
export const deleteStage = async (req, res) => {
  try {
    const deletedStage = await ProductionStage.findByIdAndDelete(req.params.id);
    if (!deletedStage) {
      return res.status(404).json({ message: 'Production stage not found' });
    }
    res.json({ message: 'Production stage removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log a stage completion
// @route   POST /api/production/stages/log
// @access  Private
export const logStage = async (req, res) => {
  try {
    const { batch_id, stage_id, artisan_id, status, start_time, end_time } = req.body;
    const log = await StageLog.create({
      batch_id, stage_id, artisan_id, status, start_time, end_time
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a stage log
// @route   DELETE /api/production/stages/log/:id
// @access  Private
export const deleteStageLog = async (req, res) => {
  try {
    const deletedLog = await StageLog.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ message: 'Stage log not found' });
    }
    res.json({ message: 'Stage log removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
