import jwt from 'jsonwebtoken';
import User from '../database/User.js';

export const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          data: {},
        });
      }

      req.user = user;
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'No token provided',
      data: {},
    });
  } catch (error) {
    console.error('AUTH ERROR:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Token failed or expired',
      data: {},
    });
  }
};
