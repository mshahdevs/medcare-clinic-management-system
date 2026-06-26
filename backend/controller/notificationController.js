import Notification from '../models/Notification.js';
import User from '../models/User.js';

// ================================
// Admin -> Send Notification
// ================================
export const sendNotification = async (req, res) => {
  try {
    const { patient, message } = req.body;

    if (!patient || !message) {
      return res.status(400).json({
        success: false,
        message: 'Patient and message are required',
        data: {},
      });
    }

    const patientUser = await User.findOne({
      _id: patient,
      role: 'patient',
      isActive: true,
    });

    if (!patientUser) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        data: {},
      });
    }

    const notification = await Notification.create({
      patient,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  } catch (error) {
    console.error('sendNotification error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while sending notification',
      data: {
        error: error.message,
      },
    });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('patient', 'fullName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error('getAllNotifications error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications',
      data: {
        error: error.message,
      },
    });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      patient: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error('getMyNotifications error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications',
      data: {
        error: error.message,
      },
    });
  }
};
