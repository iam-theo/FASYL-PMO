import { Role } from "@prisma/client";

/**
 * Role hierarchy for PMO system
 * Higher number = higher authority
 */
const ROLE_LEVELS = {
  STAFF: 1,
  PROJECTMANAGER: 2,
  HEADOFOPS: 3,
};

/**
 * Central workflow RBAC guard (PMO system only)
 */
export const workflowGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      // =========================
      // AUTH CHECK
      // =========================
      if (!user?.role) {
        return res.status(401).json({
          message: "Unauthorized: user context missing",
        });
      }

      const userRole = user.role;

      // =========================
      // ROLE CHECK WITH HIERARCHY
      // =========================
      const hasAccess = allowedRoles.some((role) => {
        return (
          userRole === role ||
          (ROLE_LEVELS[userRole] &&
            ROLE_LEVELS[userRole] >= ROLE_LEVELS[role])
        );
      });

      if (!hasAccess) {
        return res.status(403).json({
          message: "Forbidden: insufficient workflow permissions",
          requiredRoles: allowedRoles,
          yourRole: userRole,
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