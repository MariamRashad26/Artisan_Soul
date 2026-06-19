import Order from '../models/Order.js';
import Revenue from '../models/Revenue.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get orders — admin sees all, user sees own
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'user') {
      query = { user: req.user._id };
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving orders', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
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

// Helper: calculate delivery date string (7–14 business days from today)
function getDeliveryDateRange() {
  const addBusinessDays = (date, days) => {
    let d = new Date(date);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return d;
  };
  const now = new Date();
  const start = addBusinessDays(now, 7);
  const end = addBusinessDays(now, 14);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { patron, model, phase, deadline, status, img, price, shippingAddress, paymentMethod, paymentStatus } = req.body;

    const order = new Order({
      patron,
      model,
      phase: phase || 'Design Prep',
      deadline: deadline || getDeliveryDateRange(),
      status: status || 'normal',
      img,
      price: price || 2500,
      user: req.user ? req.user._id : null,
      shippingAddress: shippingAddress || '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentStatus || 'Pending',
    });

    const createdOrder = await order.save();

    // Send confirmation email — fire-and-forget (never blocks response)
    if (req.user && req.user.email) {
      const deliveryRange = getDeliveryDateRange();
      const html = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf9;">
          <h2 style="color: #1c1917; font-size: 1.5rem; margin-bottom: 8px;">Order Confirmed — Artisan Soul</h2>
          <p style="color: #57534e;">Dear ${req.user.name || patron},</p>
          <p style="color: #57534e;">Your bespoke commission has been received. Here are your order details:</p>
          <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
            <tr><td style="padding:8px 0; color:#a8a29e; font-size:0.85rem;">Order ID</td><td style="padding:8px 0; font-weight:700;">${createdOrder.orderId}</td></tr>
            <tr><td style="padding:8px 0; color:#a8a29e; font-size:0.85rem;">Piece</td><td style="padding:8px 0; font-weight:700;">${model}</td></tr>
            <tr><td style="padding:8px 0; color:#a8a29e; font-size:0.85rem;">Estimated Delivery</td><td style="padding:8px 0; font-weight:700;">${deliveryRange}</td></tr>
            <tr><td style="padding:8px 0; color:#a8a29e; font-size:0.85rem;">Payment</td><td style="padding:8px 0; font-weight:700;">Cash on Delivery — PKR ${(price || 2500).toLocaleString()}</td></tr>
          </table>
          <p style="color:#57534e; font-size:0.85rem;">Payment is due upon delivery. Our concierge will contact you before dispatch.</p>
          <p style="color:#a8a29e; font-size:0.8rem; margin-top:24px;">Thank you for your commission — Artisan Soul Atelier</p>
        </div>
      `;
      // Non-blocking — errors are only logged, never bubble up to the user
      sendEmail(req.user.email, `Order Confirmed — ${createdOrder.orderId}`, html)
        .catch(emailErr => console.error('[Order] Confirmation email failed:', emailErr.message));
    }

    // ── Create Notifications ──────────────────────────────────────
    // 1. Notification for the CUSTOMER
    if (req.user) {
      try {
        await Notification.create({
          title: 'Order Placed Successfully',
          message: `Your order ${createdOrder.orderId} for "${model}" has been confirmed. Payment: Cash on Delivery — PKR ${(price || 2500).toLocaleString()}`,
          type: 'success',
          link: `/track-order/${encodeURIComponent(createdOrder.orderId.replace('#', ''))}`,
          recipient: req.user._id,
          recipientRole: null,
          orderId: createdOrder.orderId
        });
      } catch (notifErr) {
        console.error('Customer notification creation failed:', notifErr.message);
      }
    }

    // 2. Notification for ALL ADMINS
    try {
      await Notification.create({
        title: 'New Order Received',
        message: `${patron} placed order ${createdOrder.orderId} for "${model}" — PKR ${(price || 2500).toLocaleString()} (COD)`,
        type: 'order',
        link: `/admin/orders`,
        recipient: null,
        recipientRole: 'admin',
        orderId: createdOrder.orderId
      });
    } catch (notifErr) {
      console.error('Admin notification creation failed:', notifErr.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: 'Invalid order data', error: error.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = async (req, res) => {
  try {
    const { patron, model, phase, progress, deadline, status, img, artisan, artisan_id, price, paymentStatus } = req.body;
    
    const searchId = req.params.id;
    const searchConditions = [
      { orderId: searchId },
      { order_id: searchId },
      { orderId: `#${searchId}` }
    ];
    if (searchId && searchId.match(/^[0-9a-fA-F]{24}$/)) {
      searchConditions.push({ _id: searchId });
    }
    const order = await Order.findOne({ $or: searchConditions });

    if (order) {
      order.set('patron', patron || order.patron || order.client_id);
      order.set('model', model || order.model);
      order.set('phase', phase || order.phase);
      order.set('progress', progress !== undefined ? progress : order.progress);
      order.set('deadline', deadline || order.deadline);
      order.set('status', status || order.status);
      if (img) order.set('img', img);
      if (artisan) order.set('artisan', artisan);
      if (artisan_id) order.set('artisan_id', artisan_id);
      if (price) order.set('price', price);
      if (req.body.logs) order.set('logs', req.body.logs);
      
      // Allow admin to mark payment as Paid
      if (paymentStatus && ['Pending', 'Paid'].includes(paymentStatus)) {
        order.set('paymentStatus', paymentStatus);
      }
      
      if (progress === 100) {
        order.set('is_delivered', true);
        // Auto-create a Revenue record so Finance ledger is updated automatically
        try {
          const existingRevenue = await Revenue.findOne({ source_id: order._id });
          if (!existingRevenue) {
            await Revenue.create({
              source_type: 'Order',
              amount: order.price || 2500,
              date: new Date(),
              description: `Order completed: ${order.orderId || order._id} — ${order.patron}`,
              source_id: order._id
            });
          }
        } catch (revErr) {
          console.error('Auto-revenue creation failed:', revErr.message);
        }
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
// @access  Private (admin)
export const deleteOrder = async (req, res) => {
  try {
    const searchId = req.params.id;
    const searchConditions = [
      { orderId: searchId },
      { order_id: searchId },
      { orderId: `#${searchId}` }
    ];
    if (searchId && searchId.match(/^[0-9a-fA-F]{24}$/)) {
      searchConditions.push({ _id: searchId });
    }
    const order = await Order.findOneAndDelete({ $or: searchConditions });
    
    if (order) {
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting order', error: error.message });
  }
};
