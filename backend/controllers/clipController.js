import Clip from '../models/Clip.js';

// @desc    Get all clips
// @route   GET /api/clips
// @access  Private
export const getClips = async (req, res) => {
  try {
    const clips = await Clip.find()
      .populate('order_id', 'orderId')
      .populate('artisan_id', 'name')
      .sort({ createdAt: -1 });
    res.json(clips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new clip
// @route   POST /api/clips
// @access  Private
export const createClip = async (req, res) => {
  try {
    const { order_id, artisan_id, video_url, thumbnail_url, duration, status } = req.body;
    
    const clip = new Clip({
      order_id,
      artisan_id,
      video_url,
      thumbnail_url,
      duration,
      status
    });

    const createdClip = await clip.save();
    
    const populatedClip = await Clip.findById(createdClip._id)
      .populate('order_id', 'orderId')
      .populate('artisan_id', 'name');
      
    res.status(201).json(populatedClip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
