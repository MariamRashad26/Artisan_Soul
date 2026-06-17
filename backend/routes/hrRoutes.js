import express from 'express';
import { 
  getShifts, 
  logShift, 
  updateShift, 
  deleteShift, 
  getShiftById,
  getSalaries, 
  addSalary, 
  updateSalary, 
  deleteSalary,
  getSalaryById,
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from '../controllers/hrController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { artisan } from '../middleware/artisanMiddleware.js';

const router = express.Router();

// Shift Management
router.route('/shifts')
  .get(protect, getShifts)
  .post(protect, logShift);

router.route('/shifts/:id')
  .get(protect, artisan, getShiftById)
  .put(protect, artisan, updateShift)
  .delete(protect, admin, deleteShift);

// Salary & Payroll
router.route('/salaries')
  .get(protect, admin, getSalaries)
  .post(protect, admin, addSalary);

router.route('/salaries/:id')
  .get(protect, admin, getSalaryById)
  .put(protect, admin, updateSalary)
  .delete(protect, admin, deleteSalary);

// Attendance Module
router.route('/attendance')
  .get(protect, getAttendance)
  .post(protect, createAttendance);

router.route('/attendance/:id')
  .get(protect, getAttendanceById)
  .put(protect, updateAttendance)
  .delete(protect, admin, deleteAttendance);

export default router;
