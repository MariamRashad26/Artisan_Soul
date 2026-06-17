import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shift_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ShiftManagement', required: false },
  check_in: { type: Date },
  check_out: { type: Date },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Completed'], default: 'Present' }
}, {
  timestamps: true,
  collection: 'attendance'
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
