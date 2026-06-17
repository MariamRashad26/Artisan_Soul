// Middleware to ensure the user is an artisan (or admin)
export const artisan = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (req.user.role !== 'artisan' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Artisan access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
