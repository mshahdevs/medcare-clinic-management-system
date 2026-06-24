import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

// import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

const PORT = process.env.PORT || 5000;

await connectDB();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://online-doctor-appointment-system-five.vercel.app/',
      'https://medcare-frontend-shah.vercel.app/',
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Medcare Clinic Management API is running',
    data: {},
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/patient', patientRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
