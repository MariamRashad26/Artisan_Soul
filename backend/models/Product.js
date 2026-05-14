import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    sizes_available: {
      type: [Number],
      default: [],
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    details: {
      color: { type: String, default: 'Black' },
      material: { type: String, default: 'Leather' }
    },
    discount: {
      type: Number,
      default: null,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    // Keep internal fields for UI compatibility
    category: {
      type: String,
      default: 'Formal'
    },
    imageUrl: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
