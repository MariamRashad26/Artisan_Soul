import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema({
  machine: { type: String, required: true },
  issue: { type: String, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' }
}, {
  timestamps: true,
  collection: 'maintenance_logs'
});

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema);
export default MaintenanceLog;
