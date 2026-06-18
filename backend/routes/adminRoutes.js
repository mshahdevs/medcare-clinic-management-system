import express from 'express';
import { createDoctor, getDashboard } from '../controller/adminController.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/doctors', protect, authorize('admin'), createDoctor);
router.get('/dashboard', protect, authorize('admin'), getDashboard);
export default router;
