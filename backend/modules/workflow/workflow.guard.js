import { WorkflowPolicy } from "./workflow.policy.js";

/**
 * Enforces action-level permissions
 */
export const assertWorkflowPermission = (userRole, action) => {
  const allowedRoles = WorkflowPolicy[action];

  if (!allowedRoles) {
    throw new Error(`Unknown workflow action: ${action}`);
  }

  if (!allowedRoles.includes(userRole)) {
    throw new Error(
      `Access denied: ${userRole} cannot perform ${action}`
    );
  }

  return true;
};