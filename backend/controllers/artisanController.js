import Order from '../models/Order.js';
import Clip from '../models/Clip.js';

// @desc    Get all active artisan orders in queue
// @route   GET /api/artisan/queue
// @access  Public (should be Private in prod)
export const getArtisanQueue = async (req, res) => {
  try {
    const orders = await Order.find({});
    // If empty DB, insert some mock data
    if (orders.length === 0) {
      const mockOrders = [
        { orderId: '#AS-9421', patron: 'Eleanor Maura', model: 'Oxford No. 4 Custom', phase: 'Stitching', progress: 65, deadline: 'Oct 15, 2026', status: 'urgent' },
        { orderId: '#AS-9425', patron: 'Sarah Jenkins', model: 'Brogue Artisan', phase: 'Design Prep', progress: 25, deadline: 'Oct 20, 2026', status: 'normal' },
        { orderId: '#AS-9428', patron: 'Marcus Chen', model: 'Monk Strap Elite', phase: 'Final Polish', progress: 90, deadline: 'Oct 28, 2026', status: 'normal' }
      ];
      await Order.insertMany(mockOrders);
      return res.json(mockOrders);
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving queue', error: error.message });
  }
};

// @desc    Update order phase
// @route   PUT /api/artisan/order/:id/stage
// @access  Public
export const updateOrderStage = async (req, res) => {
  try {
    const { phase, progress } = req.body;
    const order = await Order.findOne({ orderId: req.params.id });

    if (order) {
      order.phase = phase || order.phase;
      order.progress = progress !== undefined ? progress : order.progress;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating stage' });
  }
};

// @desc    Upload new workshop clip
// @route   POST /api/artisan/clips
// @access  Public
export const uploadClip = async (req, res) => {
  try {
    const { orderId, tag, title, url, duration } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'Media URL is required' });
    }

    const clip = new Clip({
      orderId: orderId || '#AS-9999',
      tag: tag || 'Stitching',
      title: title || 'New Workshop Update',
      url,
      duration: duration || '0:15',
      views: 'Sent'
    });

    const createdClip = await clip.save();
    res.status(201).json(createdClip);
  } catch (error) {
    res.status(500).json({ message: 'Server error uploading clip', error: error.message });
  }
};

// @desc    Get all workshop clips
// @route   GET /api/artisan/clips
// @access  Public
export const getClips = async (req, res) => {
  try {
    const clips = await Clip.find({}).sort({ createdAt: -1 });
    
    // Seed generic clips if empty
    if (clips.length === 0) {
      const mockClips = [
        { orderId: '#AS-8812', tag: 'Polishing', title: 'Chestnut Patina Finish', duration: '0:15', views: 'Seen', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCim8wtadXtnKEufK_mYVM0lMVqSKQ0rSHTOwminc19AUqdfFHu8s02TyKjBMJ_ZPHQCJtV3YDdmtFQ9g4WEqHWVrbQoFbZ3PWbnZ9FQeiRClqBAunnEH5vKpHAn6syVUiA4uijDV9vJJlcVjq845wMjUIomQ7MHemBHlXv8mNLTcqEdZdS5l1kNJlgMkL9tWCLEUW_rYz8-L1drZ-7JRT1KiXSX9DgR5mciyroF3lvM7yN3n-UvQWxGlREkAngm-Yw0MJ6B99zRMTu' },
        { orderId: '#AS-9421', tag: 'Hand Stitching', title: 'Welt Attaching Oxford', duration: '0:42', views: 'Sent', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYcbgfCe2orIt1gTXg7dm8GPoYN_q0LMQknpHo7BIGtHjzqiDRBNptp5HR3Lrz4wfmWnr3ncUavxpWDO4GBArsC7Y9TTPtPEclVhBR6HmlkyI12iPOoTZOseb-nwioQ0Yr_bmD6txq3rQbXbt8e7R79s59EKu-ekAv55CnVXWWOJhEYNL3r65WcaS9_xeD-idipUJjw8tgesKpbl8PVq8bTwXKdRbjHSarqMnAA67ZbZ5jKQTSsfK-O-HcZ6vVudpQKdEMW-oksSjL' },
        { orderId: '#AS-8790', tag: 'Cutting', title: 'Calfskin Pattern Slicing', duration: '0:12', views: 'Seen', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC38ZqD6oE1kniLvDNXzPtPckdrkAz8PqO-ZR0Jzg_2x-eI4iEt--BFwoghe_RWTX4LyGFjzlloPlZgJoB2um-p7RzpqfPY8ET1tZZOG-RmTOYq8JzUody3DsSxHuccbvDNjazYP_K3b8ihVwXS-OWaVvMZWBwEWA5NgmdO2vEXzWkQ2eE-SyU4IdH0wwJGZtVr5OL0f5HyaVW6C0YoLC3FPm2_uJPGO-lSYVpdiI6-40w4FK6KKu4BGYpi6TwitWU0YXIUR_Nli9ho' }
      ];
      await Clip.insertMany(mockClips);
      return res.json(mockClips);
    }

    res.json(clips);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving clips' });
  }
};
