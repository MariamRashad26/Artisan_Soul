import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
  source_type: { type: String, enum: ['Order', 'Direct Sale', 'Other'], required: true },
  source_id: { type: mongoose.Schema.Types.ObjectId }, // Flexible ref based on source_type
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String }
}, {
  timestamps: true,
  collection: 'revenues'
});

const Revenue = mongoose.model('Revenue', revenueSchema);
export default Revenue;
