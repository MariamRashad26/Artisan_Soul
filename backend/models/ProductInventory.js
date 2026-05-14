import mongoose from 'mongoose';

const productInventorySchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  quantity_in_stock: { type: Number, required: true, default: 0 },
  warehouse_location: { type: String },
  last_updated: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'product_inventory'
});

const ProductInventory = mongoose.model('ProductInventory', productInventorySchema);
export default ProductInventory;
