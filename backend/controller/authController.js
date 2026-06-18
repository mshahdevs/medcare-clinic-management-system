import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const validRoles = ['admin', 'doctor', 'patient'];

export const registerUser = async (req, res) => {
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

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'fullName, email, password and role are required',
        data: {},
      });
    }

    // const normalizedRole = role ? String(role).toLowerCase() : 'patient';

    // if (!validRoles.includes(normalizedRole)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Role must be one of: ${validRoles.join(', ')}`,
    //     data: {},
    //   });
    // }

    // if (normalizedRole !== 'patient') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only patients can self-register',
    //     data: {},
    //   });
    // }

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

    const user = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      password,
      phone,
      role,
      gender,
      age,
      address,
      specialization: '',
      experience: 0,
      qualification: '',
      consultationFee: 0,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
          age: user.age,
          address: user.address,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.error('registerUser error:', error);
    console.log(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while registering user',
      data: { error: error.message },
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        data: {},
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password');

    // console.log(user);
    // console.log(user?.password);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: {},
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Contact support.',
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          gender: user.gender,
          age: user.age,
          address: user.address,
          specialization: user.specialization,
          experience: user.experience,
          qualification: user.qualification,
          consultationFee: user.consultationFee,
          isActive: user.isActive,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('loginUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while logging in',
      data: { error: error.message },
    });
  }
};
