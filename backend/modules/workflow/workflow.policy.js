import { Role } from "@prisma/client";

/**
 * Defines what each role can do per action
 */
export const WorkflowPolicy = {
  SUBMIT_STAGE: [Role.PROJECTMANAGER, Role.HEADOFOPS],
  APPROVE_STAGE: [Role.HEADOFOPS],
  REJECT_STAGE: [Role.HEADOFOPS],
  ESCALATE_STAGE: [Role.HEADOFOPS],
  VIEW_WORKFLOW: [Role.PROJECTMANAGER, Role.HEADOFOPS, Role.STAFF],
};