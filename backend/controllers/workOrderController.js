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

// @desc    Log material consumption
// @route   POST /api/work-orders/consumption
// @access  Private
export const logConsumption = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { batch_id, raw_material_id, quantity_used, logged_by } = req.body;

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
    res.status(201).json(log[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
