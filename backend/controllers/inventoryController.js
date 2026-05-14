import ProductInventory from '../models/ProductInventory.js';
import PackagingLog from '../models/PackagingLog.js';
import mongoose from 'mongoose';

// @desc    Get inventory
// @route   GET /api/inventory
// @access  Private
export const getInventory = async (req, res) => {
  try {
    const inventory = await ProductInventory.find({}).populate('product_id', 'name price');
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log packaging and update inventory
// @route   POST /api/inventory/packaging
// @access  Private
export const logPackaging = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { batch_id, product_id, quantity_packaged, packaged_by } = req.body;

    // Create log
    const log = await PackagingLog.create([{
      batch_id, product_id, quantity_packaged, packaged_by
    }], { session });

    // Update or create inventory
    let inventory = await ProductInventory.findOne({ product_id }).session(session);
    if (inventory) {
      inventory.quantity_in_stock += quantity_packaged;
      inventory.last_updated = Date.now();
      await inventory.save({ session });
    } else {
      await ProductInventory.create([{
        product_id, quantity_in_stock: quantity_packaged
      }], { session });
    }

    await session.commitTransaction();
    res.status(201).json(log);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
