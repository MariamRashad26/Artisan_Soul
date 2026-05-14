import Message from '../models/Message.js';

// @desc    Get all messages
// @route   GET /api/chat
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender_id', 'name role')
      .populate('receiver_id', 'name role')
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { sender_id, content } = req.body;
    
    const message = new Message({
      sender_id,
      content,
      status: 'sent'
    });

    const createdMessage = await message.save();
    
    // Populate sender info before returning
    const populatedMessage = await Message.findById(createdMessage._id).populate('sender_id', 'name role');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
