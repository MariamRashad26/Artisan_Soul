import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return '#AS-' + Math.floor(1000 + Math.random() * 9000);
    }
  },
  patron: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  phase: {
    type: String,
    enum: ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Finished'],
    default: 'Design Prep'
  },
  progress: {
    type: Number,
    default: 0
  },
  deadline: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['normal', 'urgent'],
    default: 'normal'
  },
  img: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
  strict: false
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
