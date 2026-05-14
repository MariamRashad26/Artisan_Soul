import mongoose from 'mongoose';

const materialConsumptionLogSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  raw_material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
  quantity_used: { type: Number, required: true },
  logged_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'material_consumption_logs'
});

const MaterialConsumptionLog = mongoose.model('MaterialConsumptionLog', materialConsumptionLogSchema);
export default MaterialConsumptionLog;
