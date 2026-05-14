import BespokeDesign from '../models/BespokeDesign.js';

export const getDesigns = async (req, res) => {
  try {
    const designs = await BespokeDesign.find({});
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDesign = async (req, res) => {
  try {
    const design = new BespokeDesign(req.body);
    const savedDesign = await design.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    const design = await BespokeDesign.findById(req.params.id);
    if (design) {
      await BespokeDesign.deleteOne({ _id: design._id });
      res.json({ message: 'Design removed' });
    } else {
      res.status(404).json({ message: 'Design not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
