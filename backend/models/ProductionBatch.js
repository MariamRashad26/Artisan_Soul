import mongoose from 'mongoose';

const productionBatchSchema = new mongoose.Schema({
  batch_number: { type: String, required: true, unique: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  work_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
  start_date: { type: Date },
  end_date: { type: Date }
}, {
  timestamps: true,
  collection: 'production_batches'
});

const ProductionBatch = mongoose.model('ProductionBatch', productionBatchSchema);
export default ProductionBatch;
