import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  materialId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'units'
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  supplier: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
