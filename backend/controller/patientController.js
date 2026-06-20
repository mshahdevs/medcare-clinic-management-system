import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const getPatientDashboard = async (req, res) => {
  try {
    const patient = req.user._id;

    const totalBooked = await Appointment.countDocuments({
      patient,
    });

    const pending = await Appointment.countDocuments({
      patient,
      status: 'pending',
    });

    const completed = await Appointment.countDocuments({
      patient,
      status: 'completed',
    });

    const upcoming = await Appointment.countDocuments({
      patient,
      status: { $in: ['pending', 'approved'] },
    });

    return res.status(200).json({
      success: true,
      message: 'Patient dashboard fetched successfully',
      data: {
        totalBooked,
        upcoming,
        pending,
        completed,
      },
    });
  } catch (error) {
    console.error('getPatientDashboard error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching patient dashboard',
      data: { error: error.message },
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({
      role: 'patient',
      isActive: true,
    }).select('-password');

    return res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('getAllPatients error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching patients',
      data: { error: error.message },
    });
  }
};
