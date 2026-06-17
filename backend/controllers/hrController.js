import ShiftManagement from '../models/ShiftManagement.js';
import Salary from '../models/Salary.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// @desc    Get all shifts
// @route   GET /api/hr/shifts
// @access  Private/Artisan/Admin
export const getShifts = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.user_id = req.user._id;
    }
    const shifts = await ShiftManagement.find(filter).populate('user_id', 'name email role');
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log a shift
// @route   POST /api/hr/shifts
// @access  Private/Artisan/Admin
export const logShift = async (req, res) => {
  try {
    const { user_id, shift_date, shift_type, clock_in, clock_out } = req.body;
    
    // Force user_id to be logged user unless admin
    const targetUserId = req.user.role === 'admin' ? user_id : req.user._id;

    const shift = await ShiftManagement.create({
      user_id: targetUserId, shift_date, shift_type, clock_in, clock_out
    });
    
    const populated = await ShiftManagement.findById(shift._id).populate('user_id', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a shift
// @route   PUT /api/hr/shifts/:id
// @access  Private/Artisan/Admin
export const updateShift = async (req, res) => {
  try {
    const { user_id, shift_date, shift_type, clock_in, clock_out, status, total_hours } = req.body;
    const shift = await ShiftManagement.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Auth check
    if (req.user.role !== 'admin' && shift.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this shift' });
    }

    if (user_id && req.user.role === 'admin') shift.user_id = user_id;
    if (shift_date) shift.shift_date = shift_date;
    if (shift_type) shift.shift_type = shift_type;
    if (clock_in !== undefined) shift.clock_in = clock_in;
    if (clock_out !== undefined) shift.clock_out = clock_out;
    if (status) shift.status = status;
    if (total_hours !== undefined) shift.total_hours = total_hours;

    // Automatically calculate total hours if clock_in and clock_out are present
    if (shift.clock_in && shift.clock_out) {
      const diffMs = new Date(shift.clock_out) - new Date(shift.clock_in);
      shift.total_hours = Math.max(0, parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2)));
    }
    
    await shift.save();
    const populated = await ShiftManagement.findById(shift._id).populate('user_id', 'name email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a shift
// @route   DELETE /api/hr/shifts/:id
// @access  Private/Admin
export const deleteShift = async (req, res) => {
  try {
    const shift = await ShiftManagement.findById(req.params.id);
    if (shift) {
      await ShiftManagement.deleteOne({ _id: shift._id });
      res.json({ message: 'Shift record removed' });
    } else {
      res.status(404).json({ message: 'Shift not found' });
    }
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

// @desc    Update a salary record
// @route   PUT /api/hr/salaries/:id
// @access  Private/Admin
export const updateSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (salary) {
      if (req.body.user_id) salary.user_id = req.body.user_id;
      salary.amount = req.body.amount !== undefined ? req.body.amount : salary.amount;
      if (req.body.month) salary.month = req.body.month;
      salary.status = req.body.status || salary.status;
      salary.payment_date = req.body.payment_date !== undefined ? req.body.payment_date : salary.payment_date;
      
      const updatedSalary = await salary.save();
      const populatedSalary = await Salary.findById(updatedSalary._id).populate('user_id', 'name role');
      res.json(populatedSalary);
    } else {
      res.status(404).json({ message: 'Salary record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a salary record
// @route   DELETE /api/hr/salaries/:id
// @access  Private/Admin
export const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (salary) {
      await Salary.deleteOne({ _id: salary._id });
      res.json({ message: 'Salary record removed' });
    } else {
      res.status(404).json({ message: 'Salary record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single shift by ID
// @route   GET /api/hr/shifts/:id
// @access  Private/Artisan/Admin
export const getShiftById = async (req, res) => {
  try {
    const shift = await ShiftManagement.findById(req.params.id).populate('user_id', 'name email role');
    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }
    
    // Auth check
    if (req.user.role !== 'admin' && shift.user_id._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this shift' });
    }

    res.json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single salary by ID
// @route   GET /api/hr/salaries/:id
// @access  Private/Admin
export const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate('user_id', 'name role');
    if (salary) {
      res.json({ success: true, data: salary });
    } else {
      res.status(404).json({ success: false, message: 'Salary not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all attendance records
// @route   GET /api/hr/attendance
// @access  Private/Artisan/Admin
export const getAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.user_id = req.user._id;
    }
    const attendance = await Attendance.find(filter).populate('user_id', 'name email role');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single attendance record by ID
// @route   GET /api/hr/attendance/:id
// @access  Private/Artisan/Admin
export const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('user_id', 'name email role');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Auth check
    if (req.user.role !== 'admin' && attendance.user_id._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this record' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Log attendance record
// @route   POST /api/hr/attendance
// @access  Private/Artisan/Admin
export const createAttendance = async (req, res) => {
  try {
    const { user_id, date, check_in, check_out, status } = req.body;
    
    // Force user_id to be logged user unless admin
    const targetUserId = req.user.role === 'admin' ? user_id : req.user._id;

    const existing = await Attendance.findOne({
      user_id: targetUserId,
      $or: [
        { check_out: null },
        { check_out: { $exists: false } }
      ]
    });
    
    if (existing) {
      return res.status(400).json({ message: 'You are already checked in.' });
    }

    const attendance = await Attendance.create({
      user_id: targetUserId,
      date: date || new Date(),
      check_in: check_in || new Date(),
      check_out,
      status: status || 'Present'
    });
    const populated = await Attendance.findById(attendance._id).populate('user_id', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update attendance record
// @route   PUT /api/hr/attendance/:id
// @access  Private/Artisan/Admin
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Auth check
    if (req.user.role !== 'admin' && attendance.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this record' });
    }

    if (req.body.user_id && req.user.role === 'admin') attendance.user_id = req.body.user_id;
    attendance.check_in = req.body.check_in !== undefined ? req.body.check_in : attendance.check_in;
    attendance.check_out = req.body.check_out !== undefined ? req.body.check_out : attendance.check_out;
    attendance.date = req.body.date || attendance.date;
    
    // Status Flow handling: if check_out is logged, status automatically upgrades to Completed
    if (req.body.status) {
      attendance.status = req.body.status;
    } else if (attendance.check_out) {
      attendance.status = 'Completed';
    } else {
      attendance.status = attendance.status || 'Present';
    }
    
    const updatedAttendance = await attendance.save();
    // If this attendance is now marked as Completed, also mark the matching shift as completed
    if (updatedAttendance.status === 'Completed') {
      // Find a shift for the same user on the same calendar day
      const shiftDate = new Date(updatedAttendance.date);
      const startOfDay = new Date(shiftDate);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(shiftDate);
      endOfDay.setHours(23,59,59,999);
      try {
        await ShiftManagement.updateMany(
          {
            user_id: updatedAttendance.user_id,
            shift_date: { $gte: startOfDay, $lte: endOfDay }
          },
          { $set: { status: 'completed' } }
        );
      } catch (e) {
        console.error('Failed to sync shift status:', e);
      }
    }
    const populated = await Attendance.findById(updatedAttendance._id).populate('user_id', 'name email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/hr/attendance/:id
// @access  Private/Admin
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (attendance) {
      await Attendance.deleteOne({ _id: attendance._id });
      res.json({ message: 'Attendance record removed' });
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
