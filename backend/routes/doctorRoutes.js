import express from 'express';
import {
  getAllDoctors,
  getDoctorDashboard,
  getSingleDoctor,
} from '../controller/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getSingleDoctor);
router.get(
  '/doctor/dashboard',
  protect,
  authorize('doctor'),
  getDoctorDashboard,
);

export default router;
