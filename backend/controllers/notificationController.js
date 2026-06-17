import Notification from '../models/Notification.js';

// @desc    Get notifications for the logged-in user
//          - Admin users see all notifications targeted to 'admin' role
//          - Regular users see notifications targeted to their specific user ID
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      // Admin sees notifications targeted to admin role OR to them specifically
      query = {
        $or: [
          { recipientRole: 'admin' },
          { recipient: req.user._id }
        ]
      };
    } else {
      // Regular user/artisan sees only their own notifications
      query = { recipient: req.user._id };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, link, recipient, recipientRole, orderId } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type,
      link,
      recipient: recipient || null,
      recipientRole: recipientRole || null,
      orderId: orderId || null
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.read = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read for the current user
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query = { $or: [{ recipientRole: 'admin' }, { recipient: req.user._id }], read: false };
    } else {
      query = { recipient: req.user._id, read: false };
    }
    await Notification.updateMany(query, { $set: { read: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all notifications for the current user
// @route   DELETE /api/notifications
// @access  Private
export const clearAllNotifications = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query = { $or: [{ recipientRole: 'admin' }, { recipient: req.user._id }] };
    } else {
      query = { recipient: req.user._id };
    }
    await Notification.deleteMany(query);
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
