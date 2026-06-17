import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all artisans
// @route   GET /api/artisans
// @access  Private (admin)
export const getArtisans = asyncHandler(async (req, res) => {
  const artisans = await User.find({ role: 'artisan' }).select('-password');
  res.json(artisans);
});

// @desc    Add a new artisan
// @route   POST /api/artisans
// @access  Private (admin)
export const addArtisan = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  // Check duplicate across ALL users (not just artisans)
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'A user with that email already exists' });
  }

  const artisan = await User.create({
    name,
    email,
    password,
    role: 'artisan',
    isVerified: true, // admin-created artisans don't need email verification
  });

  // Safe way to exclude password — use toObject() + delete
  const artisanObj = artisan.toObject();
  delete artisanObj.password;
  delete artisanObj.verifyToken;
  delete artisanObj.verifyTokenExpiry;

  res.status(201).json(artisanObj);
});

// @desc    Update artisan details
// @route   PUT /api/artisans/:id
// @access  Private (admin)
export const updateArtisan = asyncHandler(async (req, res) => {
  // Whitelist only safe fields — never spread raw req.body
  const { name, email } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;

  const artisan = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  if (!artisan) {
    return res.status(404).json({ message: 'Artisan not found' });
  }
  res.json(artisan);
});

// @desc    Delete an artisan
// @route   DELETE /api/artisans/:id
// @access  Private (admin)
export const deleteArtisan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'Artisan not found' });
  }
  // Safety: only delete users with artisan role
  if (user.role !== 'artisan') {
    return res.status(403).json({ message: 'Cannot delete non-artisan users from this endpoint' });
  }
  await User.deleteOne({ _id: user._id });
  res.json({ message: 'Artisan removed' });
});
