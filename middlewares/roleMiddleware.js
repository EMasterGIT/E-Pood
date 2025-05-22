module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.roll !== requiredRole) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};