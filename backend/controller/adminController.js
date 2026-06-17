import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
export const createDoctor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      role,
      gender,
      age,
      address,
      specialization,
      experience,
      qualification,
      consultationFee,
    } = req.body;

    if (!fullName || !email || !password || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'fullName, email, password and specialization are required',
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
