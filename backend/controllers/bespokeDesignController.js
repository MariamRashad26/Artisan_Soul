import BespokeDesign from '../models/BespokeDesign.js';

export const getDesigns = async (req, res) => {
  try {
    const designs = await BespokeDesign.find({ user: req.user._id });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDesign = async (req, res) => {
  try {
    const design = new BespokeDesign({ ...req.body, user: req.user._id });
    const savedDesign = await design.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    const design = await BespokeDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    // Verify ownership
    if (design.user && design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this design' });
    }
    await BespokeDesign.deleteOne({ _id: design._id });
    res.json({ message: 'Design removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDesign = async (req, res) => {
  try {
    const design = await BespokeDesign.findById(req.params.id);
    if (design) {
      design.name = req.body.name || design.name;
      design.price = req.body.price !== undefined ? req.body.price : design.price;
      design.material = req.body.material || design.material;
      design.status = req.body.status || design.status;
      design.category = req.body.category || design.category;
      design.img = req.body.img || design.img;
      if (req.body.details) {
        design.details = { ...design.details, ...req.body.details };
      }
      
      const updatedDesign = await design.save();
      res.json(updatedDesign);
    } else {
      res.status(404).json({ message: 'Design not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
