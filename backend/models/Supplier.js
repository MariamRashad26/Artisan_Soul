import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    supplier_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact_numbers: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    payment_terms: {
      type: String,
      default: 'Net 30',
    },
    supplied_materials: {
      type: [String],
      default: [],
    },
    address: {
      city: { type: String, required: false },
      area: { type: String, required: false }
    }
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
