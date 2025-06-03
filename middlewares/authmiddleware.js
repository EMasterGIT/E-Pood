

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  
  console.log('JWT_SECRET (Auth Middleware):', process.env.JWT_SECRET);
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('🔐 Bearer Token:', token);
  

  // Kui tokenit pole saadaval, tagasta 401 viga
  if (!token) {
    
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  try {
    // Tuvasta ja kontrolli JWT tokenit
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.user = decoded;

    
    next();

  } catch (err) {
    // Kui token on vigane või aegunud, tagasta 401 viga
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};