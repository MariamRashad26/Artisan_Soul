import mongoose from 'mongoose';

const rawMaterialSchema = new mongoose.Schema({
  material_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  stock_quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true, default: 'units' },
  cost_per_unit: { type: Number, required: true, default: 0 },
  reorder_level: { type: Number, required: true, default: 10 }
}, {
  timestamps: true,
  collection: 'raw_materials'
});

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);
export default RawMaterial;
