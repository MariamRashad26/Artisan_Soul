import Order from '../models/Order.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (Should be private/admin in prod)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving orders', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const searchId = req.params.id;
    const searchConditions = [
      { orderId: searchId },
      { order_id: searchId },
      { orderId: `#${searchId}` }
    ];

    if (searchId.match(/^[0-9a-fA-F]{24}$/)) {
      searchConditions.push({ _id: searchId });
    }

    const order = await Order.findOne({ $or: searchConditions });
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving order', error: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { patron, model, phase, deadline, status, img } = req.body;

    const order = new Order({
      patron,
      model,
      phase,
      deadline,
      status,
      img
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: 'Invalid order data', error: error.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Public
export const updateOrder = async (req, res) => {
  try {
    const { patron, model, phase, progress, deadline, status, img } = req.body;
    
    const order = await Order.findOne({ $or: [{ orderId: req.params.id }, { order_id: req.params.id }] });

    if (order) {
      order.set('patron', patron || order.patron || order.client_id);
      order.set('model', model || order.model);
      order.set('phase', phase || order.phase);
      order.set('progress', progress !== undefined ? progress : order.progress);
      order.set('deadline', deadline || order.deadline);
      order.set('status', status || order.status);
      if (img) order.set('img', img);
      
      if (progress === 100) {
        order.set('is_delivered', true);
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order', error: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Public
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ $or: [{ orderId: req.params.id }, { order_id: req.params.id }] });
    
    if (order) {
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting order', error: error.message });
  }
};
