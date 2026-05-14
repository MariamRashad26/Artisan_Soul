import Supplier from '../models/Supplier.js';

// @desc    Fetch all suppliers
// @route   GET /api/suppliers
// @access  Public (or semi-private)
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single supplier
// @route   GET /api/suppliers/:id
// @access  Public
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private/Admin
export const createSupplier = async (req, res) => {
  try {
    const { 
      supplier_id, name, contact_numbers, email, 
      rating, is_verified, payment_terms, supplied_materials, address 
    } = req.body;

    const supplier = new Supplier({
      supplier_id: supplier_id || `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'New Supplier',
      contact_numbers: contact_numbers || [],
      email: email || '',
      rating: rating || 0,
      is_verified: is_verified !== undefined ? is_verified : false,
      payment_terms: payment_terms || '30 Days',
      supplied_materials: supplied_materials || [],
      address: address || { city: '', area: '' }
    });

    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
export const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: false }
    );

    if (updatedSupplier) {
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
      await Supplier.deleteOne({ _id: supplier._id });
      res.json({ message: 'Supplier removed' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
