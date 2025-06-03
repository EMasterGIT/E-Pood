
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !req.user.roll) {
        return res.status(401).json({ error: 'Authentication required' });
      }
  
      if (!allowedRoles.includes(req.user.roll)) {
        return res.status(403).json({ error: `Access denied: ${allowedRoles.join(', ')} only` });
      }
  
      next();
    };
  };
  
  module.exports = requireRole;
  