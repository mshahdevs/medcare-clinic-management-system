import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

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

    await sendEmail({
      to: req.user.email,
      subject: 'Appointment Booked Successfully',
      html: `
      <h2>Appointment Booked Successfully</h2>
      <p>Your appointment has been booked.</p>
      <p><strong>Doctor:</strong> ${doctor.fullName}</p>
      <p><strong>Date:</strong> ${appointmentDate}</p>
      <p><strong>Time:</strong> ${appointmentTime}</p>
      <p><strong>Status:</strong> Pending</p>
    `,
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
    // console.log('Current user:', req.user._id);
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

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'fullName email phone')
      .populate('doctorId', 'fullName specialization consultationFee')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'All appointments fetched successfully',
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('getAllAppointments error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments',
      data: { error: error.message },
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
        data: {},
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName email')
      .populate('doctorId', 'fullName');
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        data: {},
      });
    }

    appointment.status = status;

    await appointment.save();

    if (appointment.patientId?.email) {
      await sendEmail({
        to: appointment.patientId.email,
        subject: `Appointment ${status.toUpperCase()}`,
        html: `
      <h2>Appointment Status Updated</h2>
      <p>Hello ${appointment.patientId.fullName},</p>
      <p>Your appointment status has been updated.</p>
      <p><strong>Doctor:</strong> ${appointment.doctorId?.fullName || 'Doctor'}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p>Thank you for choosing MedCare.</p>
    `,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: appointment,
    });
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while updating appointment status',
      data: { error: error.message },
    });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
    })
      .populate('patientId', 'fullName email phone gender age')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Doctor appointments fetched successfully',
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('getDoctorAppointments error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor appointments',
      data: { error: error.message },
    });
  }
};
