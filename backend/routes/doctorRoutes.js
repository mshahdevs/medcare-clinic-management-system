import express from 'express';
import {
  getAllDoctors,
  getSingleDoctor,
} from '../controller/doctorController.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getSingleDoctor);

export default router;
