// middleware/authmiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check for admin role
    if (req.user.roll !== 'admin') {
      return res.status(403).json({ error: 'Access denied: admin only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
