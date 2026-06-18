import User from '../models/User.js';

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Profile not found`,
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: `Profile fetched successfully`,
      data: user,
    });
  } catch (error) {
    console.error('getMyProfile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching my profile',
      data: { error: error.message },
    });
  }
};
export const updateMyProfile = async (req, res) => {
  try {
    const blockedFields = ['email', 'password', 'role', 'isActive'];

    const hasBlockedField = blockedFields.some(
      (field) => req.body[field] !== undefined,
    );

    if (hasBlockedField) {
      return res.status(400).json({
        success: false,
        message:
          'You cannot update email, password, role or account status from this route',
        data: {},
      });
    }
    const allowedFields = ['fullName', 'phone', 'gender', 'age', 'address'];
    if (req.user.role === 'doctor') {
      allowedFields.push(
        'specialization',
        'experience',
        'qualification',
        'consultationFee',
      );
    }
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid profile fields provided for update',
        data: {},
      });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Profile not found`,
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: `Profile updated successfully`,
      data: user,
    });
  } catch (error) {
    console.error('updateMyProfile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while updating my profile',
      data: { error: error.message },
    });
  }
};
