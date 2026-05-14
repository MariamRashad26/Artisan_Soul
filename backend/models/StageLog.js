import mongoose from 'mongoose';

const stageLogSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionBatch', required: true },
  stage_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionStage', required: true },
  artisan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Started', 'Completed', 'Paused'], default: 'Started' },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date }
}, {
  timestamps: true,
  collection: 'stage_logs'
});

const StageLog = mongoose.model('StageLog', stageLogSchema);
export default StageLog;
