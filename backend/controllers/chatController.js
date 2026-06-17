import Message from '../models/Message.js';

// @desc    Get messages — optionally filtered by thread_id
// @route   GET /api/chat?thread_id=<value>
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.thread_id) {
      filter.thread_id = req.query.thread_id;
    }
    const messages = await Message.find(filter)
      .populate('sender_id', 'name role')
      .populate('receiver_id', 'name role')
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all distinct threads (for Admin sidebar)
// @route   GET /api/chat/threads
// @access  Private
export const getThreads = async (req, res) => {
  try {
    const threads = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: {
        _id: '$thread_id',
        lastMessage: { $first: '$content' },
        lastTime: { $first: '$timestamp' },
        order_id: { $first: '$order_id' }
      }},
      { $sort: { lastTime: -1 } }
    ]);
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { sender_id, content, thread_id, order_id } = req.body;

    const message = new Message({
      sender_id,
      content,
      status: 'sent',
      thread_id: thread_id || 'global',
      order_id: order_id || null
    });

    const createdMessage = await message.save();
    const populatedMessage = await Message.findById(createdMessage._id)
      .populate('sender_id', 'name role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/chat/:id
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      await Message.deleteOne({ _id: message._id });
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
