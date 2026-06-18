import express from 'express';
import {
  bookAppointment,
  getAllAppointments,
  getDoctorAppointments,
  getMyAppointments,
  updateAppointmentStatus,
} from '../controller/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.get('/doctor/my', protect, authorize('doctor'), getDoctorAppointments);

router.put('/:id/status', protect, authorize('admin'), updateAppointmentStatus);

export default router;
