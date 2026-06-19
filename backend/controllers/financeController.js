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
  const { raw_material_id, supplier_id, quantity, total_cost, status } = req.body;

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const purchase = await MaterialPurchase.create([{
      raw_material_id, supplier_id, quantity, total_cost, status
    }], { session });

    if (status === 'Completed' || status === 'Received') {
      const material = await RawMaterial.findById(raw_material_id).session(session);
      if (material) {
        material.stock_quantity += quantity;
        await material.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(purchase[0]);
  } catch (error) {
    if (session) {
      try { await session.abortTransaction(); } catch (e) {}
      session.endSession();
    }

    const isTransactionUnsupported =
      error.message?.includes('replica set') ||
      error.message?.includes('Transaction') ||
      error.message?.includes('transaction') ||
      error.code === 20;

    if (isTransactionUnsupported) {
      console.warn('[Finance] MongoDB standalone detected — using non-transactional fallback.');
      try {
        const purchase = await MaterialPurchase.create({
          raw_material_id, supplier_id, quantity, total_cost, status
        });

        if (status === 'Completed' || status === 'Received') {
          const material = await RawMaterial.findById(raw_material_id);
          if (material) {
            material.stock_quantity += quantity;
            await material.save();
          }
        }

        return res.status(201).json(purchase);
      } catch (fallbackError) {
        return res.status(500).json({ message: fallbackError.message });
      }
    }

    res.status(500).json({ message: error.message });
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

// @desc    Update a purchase
// @route   PUT /api/finance/purchases/:id
// @access  Private/Admin
export const updatePurchase = async (req, res) => {
  try {
    const updated = await MaterialPurchase.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a purchase
// @route   DELETE /api/finance/purchases/:id
// @access  Private/Admin
export const deletePurchase = async (req, res) => {
  try {
    const deleted = await MaterialPurchase.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ message: 'Purchase removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a revenue record
// @route   POST /api/finance/revenue
// @access  Private/Admin
export const createRevenue = async (req, res) => {
  try {
    const { source_type, amount, date, description, source_id } = req.body;
    const revenue = await Revenue.create({
      source_type: source_type || 'Other',
      amount: Number(amount),
      date: date || new Date(),
      description,
      source_id
    });
    res.status(201).json(revenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a revenue record
// @route   PUT /api/finance/revenue/:id
// @access  Private/Admin
export const updateRevenue = async (req, res) => {
  try {
    const updated = await Revenue.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Revenue not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a revenue record
// @route   DELETE /api/finance/revenue/:id
// @access  Private/Admin
export const deleteRevenue = async (req, res) => {
  try {
    const deleted = await Revenue.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Revenue not found' });
    }
    res.json({ message: 'Revenue removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
