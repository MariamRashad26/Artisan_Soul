// import Clip from '../models/Clip.js';

// // @desc    Get all clips
// // @route   GET /api/clips
// // @access  Private
// export const getClips = async (req, res) => {
//   try {
//     const clips = await Clip.find()
//       .populate('order_id', 'orderId')
//       .populate('artisan_id', 'name')
//       .sort({ createdAt: -1 });
//     res.json(clips);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Create a new clip
// // @route   POST /api/clips
// // @access  Private
// export const createClip = async (req, res) => {
//   try {
//     const { order_id, artisan_id, video_url, thumbnail_url, duration, status } = req.body;
    
//     const clip = new Clip({
//       order_id,
//       artisan_id,
//       video_url,
//       thumbnail_url,
//       duration,
//       status
//     });

//     const createdClip = await clip.save();
    
//     const populatedClip = await Clip.findById(createdClip._id)
//       .populate('order_id', 'orderId')
//       .populate('artisan_id', 'name');
      
//     res.status(201).json(populatedClip);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @desc    Update a video clip
// // @route   PUT /api/clips/:id
// export const updateClip = async (req, res) => {
//   try {
//     const clip = await Clip.findById(req.params.id);
//     if (clip) {
//       clip.title = req.body.title || clip.title;
//       clip.video_url = req.body.video_url || clip.video_url;
//       clip.thumbnail_url = req.body.thumbnail_url || clip.thumbnail_url;
//       clip.duration = req.body.duration || clip.duration;
//       clip.status = req.body.status || clip.status;
      
//       const updatedClip = await clip.save();
//       const populatedClip = await Clip.findById(updatedClip._id)
//         .populate('order_id', 'orderId')
//         .populate('artisan_id', 'name');
//       res.json(populatedClip);
//     } else {
//       res.status(404).json({ message: 'Clip not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete a video clip
// // @route   DELETE /api/clips/:id
// export const deleteClip = async (req, res) => {
//   try {
//     const clip = await Clip.findById(req.params.id);
//     if (clip) {
//       await Clip.deleteOne({ _id: clip._id });
//       res.json({ message: 'Video clip removed' });
//     } else {
//       res.status(404).json({ message: 'Clip not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// import Clip from '../models/Clip.js';

// const populate = (query) =>
//   query.populate('order_id', 'orderId').populate('artisan_id', 'name');

// // GET /api/clips
// export const getClips = async (req, res) => {
//   try {
//     const clips = await populate(Clip.find().sort({ createdAt: -1 }));
//     res.json(clips);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// // GET /api/clips/:id
// export const getClipById = async (req, res) => {
//   try {
//     const clip = await populate(Clip.findById(req.params.id));
//     if (!clip) return res.status(404).json({ message: 'Clip not found' });
//     res.json(clip);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// // POST /api/clips
// export const createClip = async (req, res) => {
//   try {
//     const { order_id, artisan_id, title, tag, duration, video_url, thumbnail_url, status } = req.body;
//     const clip = await Clip.create({
//       order_id:      order_id || undefined,
//       artisan_id:    artisan_id || undefined,
//       title:         title || 'Workshop Clip',
//       tag:           tag || 'Stitching',
//       duration:      duration || '0:15',
//       video_url,
//       thumbnail_url: thumbnail_url || '',
//       status:        status || 'Pending Review'
//     });
//     res.status(201).json(await populate(Clip.findById(clip._id)));
//   } catch (err) { res.status(400).json({ message: err.message }); }
// };

// // PUT /api/clips/:id
// export const updateClip = async (req, res) => {
//   try {
//     const clip = await Clip.findById(req.params.id);
//     if (!clip) return res.status(404).json({ message: 'Clip not found' });

//     const fields = ['title', 'tag', 'duration', 'video_url', 'thumbnail_url', 'status', 'views'];
//     fields.forEach(f => { if (req.body[f] !== undefined) clip[f] = req.body[f]; });

//     await clip.save();
//     res.json(await populate(Clip.findById(clip._id)));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// // DELETE /api/clips/:id
// export const deleteClip = async (req, res) => {
//   try {
//     const clip = await Clip.findById(req.params.id);
//     if (!clip) return res.status(404).json({ message: 'Clip not found' });
//     await Clip.deleteOne({ _id: clip._id });
//     res.json({ message: 'Clip removed' });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };
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