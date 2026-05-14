import express from 'express';
import { getShifts, logShift, updateShift, getSalaries, addSalary } from '../controllers/hrController.js';

const router = express.Router();

router.route('/shifts')
  .get(getShifts)
  .post(logShift);

router.route('/shifts/:id')
  .put(updateShift);

router.route('/salaries')
  .get(getSalaries)
  .post(addSalary);

export default router;
