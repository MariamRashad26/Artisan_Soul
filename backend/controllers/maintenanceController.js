import MaintenanceLog from '../models/MaintenanceLog.js';

export const getLogs = async (req, res) => {
  try {
    const logs = await MaintenanceLog.find({}).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLog = async (req, res) => {
  try {
    const { machine, issue, urgency } = req.body;
    const log = await MaintenanceLog.create({ machine, issue, urgency });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a maintenance log
// @route   PUT /api/maintenance/:id
export const updateLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id);
    if (log) {
      log.machine = req.body.machine || log.machine;
      log.issue = req.body.issue || log.issue;
      log.urgency = req.body.urgency || log.urgency;
      log.status = req.body.status || log.status;
      
      const updatedLog = await log.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a maintenance log
// @route   DELETE /api/maintenance/:id
export const deleteLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id);
    if (log) {
      await MaintenanceLog.deleteOne({ _id: log._id });
      res.json({ message: 'Maintenance log removed' });
    } else {
      res.status(404).json({ message: 'Log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
