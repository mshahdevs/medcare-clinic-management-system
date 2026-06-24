import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'doctor',
      isActive: true,
    }).select('-password');

    // console.log(doctors);
    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('getAllDoctors error:', error);
    console.log(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors',
      data: { error: error.message },
    });
  }
};

export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select(
      'fullName email phone specialization qualification consultationFee experience workingDays startTime endTime',
    );
    // console.log(doctor);
    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error('getSingleDoctor error:', error);
    console.log(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor',
      data: { error: error.message },
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      specialization,
      experience,
      qualification,
      consultationFee,
      workingDays,
      startTime,
      endTime,
    } = req.body;

    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    if (doctor.role !== 'doctor') {
      return res.status(400).json({
        success: false,
        message: 'User is not a doctor',
      });
    }

    doctor.fullName = fullName || doctor.fullName;
    doctor.phone = phone || doctor.phone;
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.qualification = qualification || doctor.qualification;
    doctor.consultationFee = consultationFee ?? doctor.consultationFee;

    doctor.workingDays = workingDays || doctor.workingDays;
    doctor.startTime = startTime || doctor.startTime;
    doctor.endTime = endTime || doctor.endTime;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('updateDoctor error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while updating doctor',
      data: {
        error: error.message,
      },
    });
  }
};
export const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = req.user._id;

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctor,
    });

    const pendingAppointments = await Appointment.countDocuments({
      doctor: doctor,
      status: 'pending',
    });

    const approvedAppointments = await Appointment.countDocuments({
      doctor: doctor,
      status: 'approved',
    });

    const completedAppointments = await Appointment.countDocuments({
      doctor: doctor,
      status: 'completed',
    });

    const cancelledAppointments = await Appointment.countDocuments({
      doctor: doctor,
      status: 'cancelled',
    });
    return res.status(200).json({
      success: true,
      message: 'Doctor dashboard fetched successfully',
      data: {
        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });
  } catch (error) {
    console.error('getDoctorDashboard error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor dashboard',
      data: { error: error.message },
    });
  }
};
