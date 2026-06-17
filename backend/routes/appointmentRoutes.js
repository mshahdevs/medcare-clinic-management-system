import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
} from '../controller/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);

export default router;
