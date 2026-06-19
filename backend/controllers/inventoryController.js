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
  const { batch_id, product_id, quantity_packaged, packaged_by } = req.body;

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

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
    session.endSession();
    res.status(201).json(log[0]);
  } catch (error) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (e) {}
      session.endSession();
    }

    const isTransactionUnsupported = 
      error.message.includes('replica set') || 
      error.message.includes('Transaction') ||
      error.message.includes('transaction') ||
      error.message.includes('retryWrites') ||
      error.code === 20;

    if (isTransactionUnsupported) {
      console.warn('MongoDB deployment does not support transactions. Falling back to non-transactional execution.');
      try {
        const log = await PackagingLog.create({
          batch_id, product_id, quantity_packaged, packaged_by
        });

        let inventory = await ProductInventory.findOne({ product_id });
        if (inventory) {
          inventory.quantity_in_stock += quantity_packaged;
          inventory.last_updated = Date.now();
          await inventory.save();
        } else {
          await ProductInventory.create({
            product_id, quantity_in_stock: quantity_packaged
          });
        }
        return res.status(201).json(log);
      } catch (fallbackError) {
        return res.status(500).json({ message: fallbackError.message });
      }
    }

    res.status(500).json({ message: error.message });
  }
};
export const createInventory = async (req, res) => {
  try {
    const { product_id, quantity_in_stock, warehouse_location } = req.body;
    let inventory = await ProductInventory.findOne({ product_id });
    if (inventory) {
      inventory.quantity_in_stock += (quantity_in_stock || 0);
      if (warehouse_location) {
        inventory.warehouse_location = warehouse_location;
      }
      inventory.last_updated = Date.now();
      await inventory.save();
      return res.status(200).json(inventory);
    }
    inventory = await ProductInventory.create({
      product_id,
      quantity_in_stock: quantity_in_stock || 0,
      warehouse_location,
    });
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const updated = await ProductInventory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const item = await ProductInventory.findById(req.params.id);
    if (item) {
      await ProductInventory.deleteOne({ _id: item._id });
      res.json({ message: 'Inventory item removed' });
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
