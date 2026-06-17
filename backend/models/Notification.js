import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['alert', 'info', 'success', 'warning', 'order'], default: 'info' },
  read: { type: Boolean, default: false },
  link: { type: String },
  // Who this notification is for
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Role-based targeting: 'admin' notifications are visible to all admins
  recipientRole: { type: String, enum: ['admin', 'user', 'artisan', null], default: null },
  // Reference to the related order (if applicable)
  orderId: { type: String, default: null }
}, {
  timestamps: true,
  collection: 'notifications'
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
