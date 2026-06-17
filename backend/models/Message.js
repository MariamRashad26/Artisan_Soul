import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  // thread_id scopes the message to a conversation (e.g. order ID or 'global')
  thread_id: { type: String, default: 'global', index: true },
  // order_id links back to the specific Order this message belongs to
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
}, {
  timestamps: true,
  collection: 'messages'
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
