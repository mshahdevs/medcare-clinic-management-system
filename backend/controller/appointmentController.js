import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, appointmentTime, reason } = req.body;

    if (!doctor || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'doctor, appointmentDate and appointmentTime are required',
        data: {},
      });
    }

    const appointmentDateObj = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDateObj < today) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date cannot be in the past',
        data: {},
      });
    }

    const doctors = await User.findOne({
      _id: doctor,
      role: 'doctor',
      isActive: true,
    });

    if (!doctors) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        data: {},
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'pending',
    });

    await sendEmail({
      to: req.user.email,
      subject: 'Appointment Booked Successfully',
      html: `
  <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:40px 20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

      <div style="background:#0f766e; padding:25px; text-align:center;">
        <h1 style="color:#ffffff; margin:0;">🏥 MedCare</h1>
        <p style="color:#d1fae5; margin-top:8px;">
          Your Trusted Healthcare Platform
        </p>
      </div>

      <div style="padding:35px;">
        <h2 style="color:#111827; margin-bottom:20px;">
          Appointment Booked Successfully 🎉
        </h2>

        <p style="color:#4b5563; font-size:16px;">
          Hello <strong>${req.user.fullName}</strong>,
        </p>

        <p style="color:#4b5563; line-height:1.7;">
          Your appointment has been successfully booked. Here are the details:
        </p>

        <div style="
          background:#f9fafb;
          border-left:4px solid #0f766e;
          padding:20px;
          margin:25px 0;
          border-radius:8px;
        ">
          <p><strong>👨‍⚕️ Doctor:</strong> ${doctors.fullName}</p>
          <p><strong>📅 Date:</strong> ${appointmentDate}</p>
          <p><strong>⏰ Time:</strong> ${appointmentTime}</p>
          <p>
            <strong>📌 Status:</strong>
            <span style="
              background:#fef3c7;
              color:#92400e;
              padding:4px 10px;
              border-radius:20px;
              font-size:13px;
            ">
              Pending
            </span>
          </p>
        </div>

        <p style="color:#6b7280;">
          We will notify you once the doctor approves your appointment.
        </p>

        <div style="text-align:center; margin-top:30px;">
          <a href="${process.env.FRONTEND_URL}"
             style="
               background:#0f766e;
               color:white;
               text-decoration:none;
               padding:12px 24px;
               border-radius:8px;
               display:inline-block;
               font-weight:bold;
             ">
             View My Appointments
          </a>
        </div>
      </div>

      <div style="
        background:#f3f4f6;
        text-align:center;
        padding:20px;
        color:#6b7280;
        font-size:13px;
      ">
        © 2026 MedCare. All rights reserved.
      </div>

    </div>
  </div>
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
      message: 'Server error while booking appointment',
      data: { error: error.message },
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    // console.log('Current user:', req.user._id);
    const appointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate(
        'doctor',
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
      .populate('patient', 'fullName email phone')
      .populate('doctor', 'fullName specialization consultationFee')
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
      .populate('patient', 'fullName email')
      .populate('doctor', 'fullName');
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        data: {},
      });
    }

    appointment.status = status;

    await appointment.save();
    let badgeBg = '#d1fae5';
    let badgeColor = '#065f46';

    if (status === 'pending') {
      badgeBg = '#fef3c7';
      badgeColor = '#92400e';
    } else if (status === 'approved') {
      badgeBg = '#dbeafe';
      badgeColor = '#1e40af';
    } else if (status === 'completed') {
      badgeBg = '#d1fae5';
      badgeColor = '#065f46';
    } else if (status === 'cancelled') {
      badgeBg = '#fee2e2';
      badgeColor = '#b91c1c';
    }
    if (appointment.patient?.email) {
      await sendEmail({
        to: appointment.patient.email,
        subject: `Appointment ${status.toUpperCase()}`,
        html: `
  <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:40px 20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

      <div style="background:#0f766e; padding:25px; text-align:center;">
        <h1 style="color:#ffffff; margin:0;">🏥 MedCare</h1>
        <p style="color:#d1fae5; margin-top:8px;">Your Trusted Healthcare Platform</p>
      </div>

      <div style="padding:35px;">
        <h2 style="color:#111827;">Appointment Status Updated</h2>

        <p style="color:#4b5563; font-size:16px;">
          Hello <strong>${appointment.patient.fullName}</strong>,
        </p>

        <p style="color:#4b5563;">
          Your appointment status has been updated.
        </p>

        <div style="background:#f9fafb; border-left:4px solid #0f766e; padding:20px; margin:25px 0; border-radius:8px;">
          <p><strong>👨‍⚕️ Doctor:</strong> ${appointment.doctor?.fullName || 'Doctor'}</p>
          <p>
            <strong>📌 Status:</strong>
           <span
  style="
    background:${badgeBg};
    color:${badgeColor};
    padding:4px 10px;
    border-radius:20px;
    font-size:13px;
    font-weight:bold;
  "
>
  ${status.toUpperCase()}
</span>
          </p>
        </div>

        <p style="color:#6b7280;">
          Thank you for choosing MedCare.
        </p>
      </div>

      <div style="background:#f3f4f6; text-align:center; padding:20px; color:#6b7280; font-size:13px;">
        © 2026 MedCare. All rights reserved.
      </div>

    </div>
  </div>
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

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Sirf owner patient cancel kar sakta hai
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (
      appointment.status === 'completed' ||
      appointment.status === 'cancelled'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled',
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate('patient', 'fullName email phone gender age')
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
