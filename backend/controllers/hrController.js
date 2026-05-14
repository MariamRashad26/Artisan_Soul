import ShiftManagement from '../models/ShiftManagement.js';
import Salary from '../models/Salary.js';

// @desc    Get all shifts
// @route   GET /api/hr/shifts
// @access  Private/Admin
export const getShifts = async (req, res) => {
  try {
    const shifts = await ShiftManagement.find({}).populate('user_id', 'name email');
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log a shift
// @route   POST /api/hr/shifts
// @access  Private/Admin
export const logShift = async (req, res) => {
  try {
    const { user_id, shift_date, shift_type, clock_in, clock_out } = req.body;
    const shift = await ShiftManagement.create({
      user_id, shift_date, shift_type, clock_in, clock_out
    });
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update a shift
// @route   PUT /api/hr/shifts/:id
// @access  Private/Admin
export const updateShift = async (req, res) => {
  try {
    const { clock_out, status, total_hours } = req.body;
    const shift = await ShiftManagement.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    if (clock_out) shift.clock_out = clock_out;
    if (status) shift.status = status;
    if (total_hours !== undefined) shift.total_hours = total_hours;
    
    await shift.save();
    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get salaries
// @route   GET /api/hr/salaries
// @access  Private/Admin
export const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({}).populate('user_id', 'name role');
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add salary record
// @route   POST /api/hr/salaries
// @access  Private/Admin
export const addSalary = async (req, res) => {
  try {
    const { user_id, amount, month, status, payment_date } = req.body;
    const salary = await Salary.create({
      user_id, amount, month, status, payment_date
    });
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
