/**
 * Middleware to restrict access based on user role(s).
 * @param  {...string} allowedRoles - e.g. 'admin', 'staff'
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to perform this action'
      });
    }

    next();
  };
};

module.exports = authorizeRole;
