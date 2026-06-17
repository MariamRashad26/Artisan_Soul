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

// @desc    Update a QC report
// @route   PUT /api/qc/:id
export const updateReport = async (req, res) => {
  try {
    const report = await QualityControlReport.findById(req.params.id);
    if (report) {
      report.status = req.body.status || report.status;
      report.defects_found = req.body.defects_found !== undefined ? req.body.defects_found : report.defects_found;
      report.comments = req.body.comments || report.comments;
      
      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a QC report
// @route   DELETE /api/qc/:id
export const deleteReport = async (req, res) => {
  try {
    const report = await QualityControlReport.findById(req.params.id);
    if (report) {
      await QualityControlReport.deleteOne({ _id: report._id });
      res.json({ message: 'QC report removed' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
