import { Role } from "@prisma/client";

/**
 * Central workflow RBAC guard
 */
export const workflowGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
          required: allowedRoles,
          yourRole: user.role,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: "Workflow guard error",
        error: err.message,
      });
    }
  };
};