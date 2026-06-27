import express from 'express';

import {
  sendNotification,
  getAllNotifications,
  getMyNotifications,
  markNotificationAsRead,
} from '../controller/notificationController.js';

import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), sendNotification);

router.get('/', protect, authorize('admin'), getAllNotifications);

router.get('/my', protect, authorize('patient'), getMyNotifications);
router.put('/:id/read', protect, authorize('patient'), markNotificationAsRead);

export default router;
