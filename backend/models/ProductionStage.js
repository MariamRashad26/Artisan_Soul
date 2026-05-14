import mongoose from 'mongoose';

const productionStageSchema = new mongoose.Schema({
  stage_name: { type: String, required: true, unique: true },
  description: { type: String },
  sequence_number: { type: Number, required: true, unique: true }
}, {
  timestamps: true,
  collection: 'production_stages'
});

const ProductionStage = mongoose.model('ProductionStage', productionStageSchema);
export default ProductionStage;
