import mongoose from 'mongoose';

const packagingLogSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionBatch', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity_packaged: { type: Number, required: true },
  packaged_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'packaging_logs'
});

const PackagingLog = mongoose.model('PackagingLog', packagingLogSchema);
export default PackagingLog;
