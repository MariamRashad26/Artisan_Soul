import WorkOrder from '../models/WorkOrder.js';
import MaterialConsumptionLog from '../models/MaterialConsumptionLog.js';
import RawMaterial from '../models/RawMaterial.js';
import mongoose from 'mongoose';

// @desc    Get all work orders
// @route   GET /api/work-orders
// @access  Private
export const getWorkOrders = async (req, res) => {
  try {
    const orders = await WorkOrder.find({})
      .populate('order_id')
      .populate('assigned_to', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a work order
// @route   POST /api/work-orders
// @access  Private
export const createWorkOrder = async (req, res) => {
  try {
    const { order_id, assigned_to, deadline, instructions } = req.body;
    const workOrder = await WorkOrder.create({
      order_id, assigned_to, deadline, instructions
    });
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a work order
// @route   PUT /api/work-orders/:id
// @access  Private
export const updateWorkOrder = async (req, res) => {
  try {
    const { deadline, instructions, status } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    if (deadline) workOrder.deadline = deadline;
    if (instructions) workOrder.instructions = instructions;
    if (status) workOrder.status = status;
    
    await workOrder.save();
    const updated = await WorkOrder.findById(workOrder._id).populate('order_id').populate('assigned_to', 'name email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a work order
// @route   DELETE /api/work-orders/:id
// @access  Private
export const deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (workOrder) {
      await WorkOrder.deleteOne({ _id: workOrder._id });
      res.json({ message: 'Work order removed' });
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log material consumption
// @route   POST /api/work-orders/consumption
// @access  Private
export const logConsumption = async (req, res) => {
  const { batch_id, raw_material_id, quantity_used, logged_by } = req.body;

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Check material stock
    const material = await RawMaterial.findById(raw_material_id).session(session);
    if (!material || material.stock_quantity < quantity_used) {
      throw new Error('Insufficient material stock');
    }

    // Deduct stock
    material.stock_quantity -= quantity_used;
    await material.save({ session });

    // Create log
    const log = await MaterialConsumptionLog.create([{
      batch_id, raw_material_id, quantity_used, logged_by
    }], { session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(log[0]);
  } catch (error) {
    if (session) {
      try { await session.abortTransaction(); } catch (e) {}
      session.endSession();
    }

    // Pass insufficient stock directly — not a transaction error
    if (error.message === 'Insufficient material stock') {
      return res.status(400).json({ message: error.message });
    }

    const isTransactionUnsupported =
      error.message?.includes('replica set') ||
      error.message?.includes('Transaction') ||
      error.message?.includes('transaction') ||
      error.code === 20;

    if (isTransactionUnsupported) {
      console.warn('[WorkOrder] MongoDB standalone detected — using non-transactional fallback.');
      try {
        const material = await RawMaterial.findById(raw_material_id);
        if (!material || material.stock_quantity < quantity_used) {
          return res.status(400).json({ message: 'Insufficient material stock' });
        }

        material.stock_quantity -= quantity_used;
        await material.save();

        const log = await MaterialConsumptionLog.create({
          batch_id, raw_material_id, quantity_used, logged_by
        });

        return res.status(201).json(log);
      } catch (fallbackError) {
        return res.status(500).json({ message: fallbackError.message });
      }
    }

    res.status(500).json({ message: error.message });
  }
};
