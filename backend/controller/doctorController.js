import User from '../models/userModel.js';

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
    const doctor = await User.findById(req.params.id);
    console.log(doctor);
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
