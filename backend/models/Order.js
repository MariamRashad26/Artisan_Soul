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
    default: 'normal'
  },
  img: {
    type: String,
    required: false
  },
  artisan: {
    type: String,
    default: null
  },
  artisan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  price: {
    type: Number,
    default: 2500
  },
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  shippingAddress: {
    type: String,
    default: ''
  },
}, {
  timestamps: true,
  strict: false
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
