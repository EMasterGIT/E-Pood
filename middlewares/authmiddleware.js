

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  console.log('JWT_SECRET (Auth Middleware):', process.env.JWT_SECRET);
  const token = req.headers['authorization']?.split(' ')[1];

  // If no token is provided, it's an authentication failure
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  try {
    // Verify the token using your JWT_SECRET
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    // This 'decoded' object contains { id: user.KasutajaID, email: user.Email, roll: user.Roll }
    req.user = decoded;

    // IMPORTANT: REMOVE THE ADMIN ROLE CHECK FROM HERE.
    // This middleware's job is just to authenticate.
    // Role-specific checks are handled by the 'requireRole' middleware.
    // if (req.user.roll !== 'admin') {
    //   return res.status(403).json({ error: 'Access denied: admin only' });
    // }

    // If token is valid, proceed to the next middleware or controller
    next();

  } catch (err) {
    // This catch block handles cases where the token is invalid, malformed, or expired
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};