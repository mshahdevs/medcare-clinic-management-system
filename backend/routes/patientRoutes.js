import express from 'express';
import { authorize } from '../middleware/roleMiddleware.js';

import {
  getAllPatients,
  getPatientDashboard,
} from '../controller/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('patient'), getPatientDashboard);
router.get('/', getAllPatients);

export default router;
