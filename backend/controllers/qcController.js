import QualityControlReport from '../models/QualityControlReport.js';

// @desc    Get QC reports
// @route   GET /api/qc
// @access  Private
export const getReports = async (req, res) => {
  try {
    const reports = await QualityControlReport.find({})
      .populate('batch_id', 'orderId')
      .populate('inspector_id', 'name');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create QC report
// @route   POST /api/qc
// @access  Private
export const createReport = async (req, res) => {
  try {
    const { batch_id, inspector_id, status, defects_found, comments } = req.body;
    const report = await QualityControlReport.create({
      batch_id, inspector_id, status, defects_found, comments
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
