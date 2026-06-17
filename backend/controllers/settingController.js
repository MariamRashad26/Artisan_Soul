import Setting from '../models/Setting.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    // Return as key-value pairs for frontend convenience
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings (bulk)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // Expects an object of key:value pairs
    
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key }, 
        { value }, 
        { upsert: true, new: true }
      );
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
