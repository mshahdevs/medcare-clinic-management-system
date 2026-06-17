import Appointment from '../database/Appointment.js';
import User from '../database/User.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      res.status(400).json({
        success: false,
        message: 'doctorId, appointmentDate and appointmentTime are required',
        data: {},
      });
    }
    const doctor = await User.findOne({
      _id: doctorId,
      role: 'doctor',
      isActive: true,
    });
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found',
        data: {},
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointment,
      },
    });
  } catch (error) {
    console.error('bookAppointment error:', error);
    console.log(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching appointment',
      data: { error: error.message },
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    console.log('Current user:', req.user._id);
    const appointments = await Appointment.find({
      patientId: req.user._id,
    })
      .populate(
        'doctorId',
        'fullName specialization qualification consultationFee phone',
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'My appointments fetched successfully',
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('getMyAppointments error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching my appointments',
      data: { error: error.message },
    });
  }
};
