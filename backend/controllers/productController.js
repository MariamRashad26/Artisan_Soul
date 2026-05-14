import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    let product;
    
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    }
    
    if (!product) {
      product = await Product.findOne({ product_id: req.params.id });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { 
      product_id, name, price, sizes_available, is_available, 
      details, discount, description, category, imageUrl, inStock 
    } = req.body;

    const product = new Product({
      product_id: product_id || `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'New Model',
      price: price || 0,
      sizes_available: sizes_available || [],
      is_available: is_available !== undefined ? is_available : true,
      details: details || { color: 'Black', material: 'Leather' },
      discount: discount || null,
      description: description || 'Premium Craftsmanship',
      category: category || 'Formal',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
      inStock: inStock !== undefined ? inStock : true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: false }
    );

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
