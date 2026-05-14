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
