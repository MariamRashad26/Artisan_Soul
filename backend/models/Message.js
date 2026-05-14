import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for global/broadcast
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }
}, {
  timestamps: true,
  collection: 'messages'
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
