import mongoose from 'mongoose';

const clipSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true, 
    enum: ['Stitching', 'Polishing', 'Cutting', 'Lasting', 'Hand Stitching']
  },
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '0:15'
  },
  views: {
    type: String,
    enum: ['Seen', 'Sent'],
    default: 'Sent'
  },
  url: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Clip = mongoose.model('Clip', clipSchema);

export default Clip;
