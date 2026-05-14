import Revenue from '../models/Revenue.js';
import MaterialPurchase from '../models/MaterialPurchase.js';
import RawMaterial from '../models/RawMaterial.js';
import mongoose from 'mongoose';

// @desc    Get all revenues
// @route   GET /api/finance/revenue
// @access  Private/Admin
export const getRevenues = async (req, res) => {
  try {
    const revenues = await Revenue.find({});
    res.json(revenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log a material purchase
// @route   POST /api/finance/purchases
// @access  Private/Admin
export const createPurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { raw_material_id, supplier_id, quantity, total_cost, status } = req.body;

    const purchase = await MaterialPurchase.create([{
      raw_material_id, supplier_id, quantity, total_cost, status
    }], { session });

    if (status === 'Completed') {
      const material = await RawMaterial.findById(raw_material_id).session(session);
      if (material) {
        material.stock_quantity += quantity;
        await material.save({ session });
      }
    }

    await session.commitTransaction();
    res.status(201).json(purchase[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get all material purchases
// @route   GET /api/finance/purchases
// @access  Private/Admin
export const getPurchases = async (req, res) => {
  try {
    const purchases = await MaterialPurchase.find({})
      .populate('raw_material_id', 'name')
      .populate('supplier_id', 'name');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
