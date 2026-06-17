import mongoose from 'mongoose';

const shiftManagementSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shift_date: { type: Date, required: true },
  shift_type: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true },
  clock_in: { type: Date },
  clock_out: { type: Date },
  status: { type: String, enum: ['scheduled', 'active', 'completed'], default: 'scheduled' }
}, {
  timestamps: true,
  collection: 'shift_management'
});

const ShiftManagement = mongoose.model('ShiftManagement', shiftManagementSchema);
export default ShiftManagement;
