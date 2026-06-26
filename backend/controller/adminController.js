import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
export const createDoctor = async (req, res) => {
  try {
    const {
      fullName,
  email,
  password,
  phone,
  gender,
  age,
  address,
  specialization,
  experience,
  qualification,
  consultationFee,
  workingDays,
  startTime,
  endTime,
} = req.body;

    if (!fullName || !email || !password || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'fullName, email, password and specialization are required',
        data: {},
      });
    }

    if (experience !== undefined && experience < 0) {
      return res.status(400).json({
        success: false,
        message: 'Experience cannot be negative',
        data: {},
      });
    }

    if (consultationFee !== undefined && consultationFee <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Consultation fee must be greater than 0',
        data: {},
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
        data: {},
      });
    }

    const doctor = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      password,
      phone,
      role: 'doctor',
      gender,
      age,
      address,
      specialization,
      experience,
      qualification,
      consultationFee,
       workingDays,
  startTime,
  endTime,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: {
        doctor: {
          id: doctor._id,
          fullName: doctor.fullName,
          email: doctor.email,
          phone: doctor.phone,
          role: doctor.role,
          gender: doctor.gender,
          age: doctor.age,
          specialization: doctor.specialization,
          experience: doctor.experience,
          qualification: doctor.qualification,
          consultationFee: doctor.consultationFee,
          address: doctor.address,
          workingDays: doctor.workingDays,
startTime: doctor.startTime,
endTime: doctor.endTime,
          isActive: doctor.isActive,
          createdAt: doctor.createdAt,
        },
        token: generateToken(doctor._id, doctor.role),
      },
    });
  } catch (error) {
    console.error('createDoctor error:', error);
    console.log(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating doctor',
      data: { error: error.message },
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({
      status: 'pending',
    });

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard fetched successfully',
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard',
      data: { error: error.message },
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({
      role: 'patient',
      isActive: true,
    })
      .select('fullName email')
      .sort({ createdAt: -1 });

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
      data: {
        error: error.message,
      },
    });
  }
};
