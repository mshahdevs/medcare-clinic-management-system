import express from 'express';
import { createDoctor } from '../controller/adminController.js';

const router = express.Router();

router.post('/doctors', createDoctor);

export default router;
