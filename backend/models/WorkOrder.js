import mongoose from 'mongoose';

const workOrderSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
  instructions: { type: String }
}, {
  timestamps: true,
  collection: 'work_orders'
});

const WorkOrder = mongoose.model('WorkOrder', workOrderSchema);
export default WorkOrder;
