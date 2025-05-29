const requireRole = (requiredRole) => {
  return (req, res, next) => {
    // 1. Check if user is authenticated and role exists
    if (!req.user || !req.user.roll) { // Assuming 'roll' is the property set by your 'auth' middleware
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 2. Check if the user's role matches the required role
    if (req.user.roll !== requiredRole) {
      // FIX: Ensure the error message uses the actual requiredRole
      return res.status(403).json({ error: `Access denied: ${requiredRole} only` });
    }

    // If all checks pass, proceed to the next middleware/controller
    next();
  };
};

module.exports = requireRole;