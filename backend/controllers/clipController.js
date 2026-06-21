
import Clip from '../models/Clip.js';

const populate = (query) => 
  query.populate('order_id', 'orderId').populate('artisan_id', 'name');

// GET All Clips
export const getClips = async (req, res) => {
  try {
    const clips = await populate(Clip.find().sort({ createdAt: -1 }));
    res.json(clips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET Single Clip
export const getClipById = async (req, res) => {
  try {
    const clip = await populate(Clip.findById(req.params.id));
    if (!clip) return res.status(404).json({ message: 'Clip not found' });
    res.json(clip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE Clip
export const createClip = async (req, res) => {
  try {
    let videoUrl = '';
    let isYouTube = false;

    if (req.file) {
      videoUrl = `/uploads/clips/${req.file.filename}`;
    } else if (req.body.video_url) {
      videoUrl = req.body.video_url;
      isYouTube = req.body.isYouTube || 
                 videoUrl.includes('youtube.com') || 
                 videoUrl.includes('youtu.be');
    } else {
      return res.status(400).json({ message: 'No video provided' });
    }

    const clip = await Clip.create({
      title: req.body.title || 'Workshop Clip',
      tag: req.body.tag || 'Stitching',
      duration: req.body.duration || '0:20',
      video_url: videoUrl,
      thumbnail_url: req.body.thumbnail_url || videoUrl,
      status: req.body.status || 'Pending Review',
      isYouTube,
      uploadedBy: req.body.uploadedBy || 'artisan'
    });

    res.status(201).json(await populate(Clip.findById(clip._id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Clip
export const updateClip = async (req, res) => {
  try {
    const clip = await Clip.findById(req.params.id);
    if (!clip) return res.status(404).json({ message: 'Clip not found' });

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) clip[key] = req.body[key];
    });

    await clip.save();
    res.json(await populate(Clip.findById(clip._id)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE Clip
export const deleteClip = async (req, res) => {
  try {
    await Clip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Clip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};