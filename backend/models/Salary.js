import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date },
  month: { type: String, required: true }, // e.g., "October 2023"
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
}, {
  timestamps: true,
  collection: 'salaries'
});

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;
