import mongoose from 'mongoose';

const bespokeDesignSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Draft',
    },
    category: {
      type: String,
      default: 'Drafts',
    },
    img: {
      type: String,
      required: true,
    },
    details: {
      color: String,
      hardware: String,
      sole: String,
      monogram: String,
    }
  },
  {
    timestamps: true,
  }
);

const BespokeDesign = mongoose.model('BespokeDesign', bespokeDesignSchema);

export default BespokeDesign;
