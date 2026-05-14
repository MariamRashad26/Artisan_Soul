import Material from '../models/Material.js';

// @desc    Get all materials
// @route   GET /api/materials
// @access  Public (Should be admin in prod)
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({}).sort({ createdAt: -1 });

    // Seed generic data if empty
    if (materials.length === 0) {
      const mockMaterials = [
        { materialId: 'RM-001', name: 'Premium Full-Grain Leather', quantity: 450, unit: 'sq ft', reorderLevel: 100, supplier: 'Tuscan Tanneries Ltd' },
        { materialId: 'RM-002', name: 'Vibram Outsoles (Size 9-10)', quantity: 210, unit: 'pairs', reorderLevel: 50, supplier: 'Vibram Corp' },
        { materialId: 'RM-003', name: 'Waxed Cotton Laces', quantity: 1500, unit: 'pairs', reorderLevel: 300, supplier: 'Laces & Co' }
      ];
      await Material.insertMany(mockMaterials);
      return res.json(mockMaterials);
    }

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving materials', error: error.message });
  }
};

// @desc    Get material by ID
// @route   GET /api/materials/:id
// @access  Public
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findOne({ materialId: req.params.id });
    if (material) {
      res.json(material);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving material', error: error.message });
  }
};

// @desc    Create a new material
// @route   POST /api/materials
// @access  Public
export const createMaterial = async (req, res) => {
  try {
    const { materialId, name, quantity, unit, reorderLevel, supplier } = req.body;

    const material = new Material({
      materialId: materialId || 'RM-' + Math.floor(100 + Math.random() * 900),
      name,
      quantity,
      unit,
      reorderLevel,
      supplier
    });

    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    res.status(400).json({ message: 'Invalid material data', error: error.message });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Public
export const updateMaterial = async (req, res) => {
  try {
    const { name, quantity, unit, reorderLevel, supplier } = req.body;

    const material = await Material.findOne({ materialId: req.params.id });

    if (material) {
      material.name = name || material.name;
      material.quantity = quantity !== undefined ? quantity : material.quantity;
      material.unit = unit || material.unit;
      material.reorderLevel = reorderLevel !== undefined ? reorderLevel : material.reorderLevel;
      material.supplier = supplier || material.supplier;

      const updatedMaterial = await material.save();
      res.json(updatedMaterial);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating material', error: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Public
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndDelete({ materialId: req.params.id });

    if (material) {
      res.json({ message: 'Material removed' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting material', error: error.message });
  }
};
