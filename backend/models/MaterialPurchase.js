import mongoose from 'mongoose';

const materialPurchaseSchema = new mongoose.Schema({
  raw_material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  quantity: { type: Number, required: true },
  total_cost: { type: Number, required: true },
  purchase_date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled', 'Ordered', 'Received'], default: 'Pending' }
}, {
  timestamps: true,
  collection: 'material_purchases'
});

const MaterialPurchase = mongoose.model('MaterialPurchase', materialPurchaseSchema);
export default MaterialPurchase;
