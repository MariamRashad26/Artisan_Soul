import mongoose from 'mongoose';

const qualityControlReportSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  inspector_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Passed', 'Failed', 'Rework'], required: true },
  defects_found: { type: String },
  comments: { type: String },
  report_date: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'quality_control_reports'
});

const QualityControlReport = mongoose.model('QualityControlReport', qualityControlReportSchema);
export default QualityControlReport;
