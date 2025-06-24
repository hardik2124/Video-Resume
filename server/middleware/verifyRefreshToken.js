import jwt from 'jsonwebtoken';

export const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
      }
      req.user = { userId: decoded.userId }; // attach decoded userId for controller use
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Token verification failed', error: error.message });
  }
};
