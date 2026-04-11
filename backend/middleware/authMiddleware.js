const { verifyToken } = require('../lib/jwt');

const protect = (req, res, next) => {
  try {
    // Support both cookie and Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    const decoded = verifyToken(token);
    req.user = decoded; // { id, name, email }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };
