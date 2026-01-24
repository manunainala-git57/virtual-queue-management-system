/*
ROLE-BASED AUTHORIZATION MIDDLEWARE
This middleware restricts access to routes based on user roles. It checks if the authenticated user's role
is included in the allowed roles for the route. If not, it responds with a 403 Forbidden status.
*/

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by authMiddleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};

module.exports = allowRoles;
