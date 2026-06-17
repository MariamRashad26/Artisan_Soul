import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  category: { type: String, default: 'general' }
}, {
  timestamps: true,
  collection: 'settings'
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
