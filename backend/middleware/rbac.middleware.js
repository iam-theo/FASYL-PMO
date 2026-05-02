export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(401).json({
          message: "Unauthorized: no user role found",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
          requiredRoles: allowedRoles,
          userRole: user.role,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: "RBAC middleware error",
        error: err.message,
      });
    }
  };
};