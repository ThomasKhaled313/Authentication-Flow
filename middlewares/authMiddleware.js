const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'FAIL', message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ status: 'FAIL', message: 'Invalid or expired token' });
    }

    const currentUser = await User.findById(decoded.id).select('+password +passwordChangedAt');
    if (!currentUser) {
      return res.status(401).json({ status: 'FAIL', message: 'User no longer exists' });
    }


    if (currentUser.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < passwordChangedTimestamp) {
        return res.status(401).json({
          status: 'FAIL',
          message: 'Password changed recently. Please login again.'
        });
      }
    }

    req.user = { id: currentUser._id, email: currentUser.email, username: currentUser.username, role: currentUser.role };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
