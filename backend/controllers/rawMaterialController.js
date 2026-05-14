import RawMaterial from '../models/RawMaterial.js';
import MaterialConsumptionLog from '../models/MaterialConsumptionLog.js';

// @desc    Get all raw materials
// @route   GET /api/raw-materials
// @access  Private/Admin
export const getRawMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find({}).populate('supplier_id', 'name');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a raw material
// @route   POST /api/raw-materials
// @access  Private/Admin
export const createRawMaterial = async (req, res) => {
  try {
    const { material_id, name, supplier_id, stock_quantity, unit, cost_per_unit, reorder_level } = req.body;

    const materialExists = await RawMaterial.findOne({ material_id });
    if (materialExists) {
      return res.status(400).json({ message: 'Material ID already exists' });
    }

    const material = await RawMaterial.create({
      material_id, name, supplier_id, stock_quantity, unit, cost_per_unit, reorder_level
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get consumption logs
// @route   GET /api/raw-materials/consume
// @access  Private
export const getConsumptionLogs = async (req, res) => {
  try {
    const logs = await MaterialConsumptionLog.find({})
      .populate('batch_id', 'orderId')
      .populate('raw_material_id', 'name unit')
      .populate('logged_by', 'name');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log consumption
// @route   POST /api/raw-materials/consume
// @access  Private
export const logConsumption = async (req, res) => {
  try {
    const { batch_id, raw_material_id, quantity_used, logged_by } = req.body;
    const log = await MaterialConsumptionLog.create({
      batch_id, raw_material_id, quantity_used, logged_by
    });
    // Decrease stock
    const material = await RawMaterial.findById(raw_material_id);
    if (material) {
      material.stock_quantity -= quantity_used;
      await material.save();
    }
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
