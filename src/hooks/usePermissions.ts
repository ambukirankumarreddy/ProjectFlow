import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export interface Permissions {
  canManagePlatform: boolean; // Super Admin
  canManageOrg: boolean; // Super Admin, Org Admin
  canManageProjects: boolean; // Super Admin, Org Admin, PM
  canManageSprints: boolean; // Super Admin, Org Admin, PM, Team Lead
  canCreateTasks: boolean; // All except Client/Viewer
  canEditTask: boolean; // All except Client/Viewer
  canDeleteTask: boolean; // Super Admin, Org Admin, PM, Team Lead
  canApproveWork: boolean; // Super Admin, Org Admin, PM, Team Lead
  canLogTime: boolean; // Developer, Team Lead, PM, QA
  canManageTestCases: boolean; // QA, Team Lead, PM, Super Admin
  canViewBudget: boolean; // Super Admin, Org Admin, PM, Client (sanitized)
  canRunAIActions: boolean; // All except Client/Viewer
  canConfigureWorkflows: boolean; // Super Admin, Org Admin
  isClientViewOnly: boolean;
}

export const usePermissions = (): Permissions => {
  const { activeRole } = useApp();

  switch (activeRole) {
    case 'Super Admin':
      return {
        canManagePlatform: true,
        canManageOrg: true,
        canManageProjects: true,
        canManageSprints: true,
        canCreateTasks: true,
        canEditTask: true,
        canDeleteTask: true,
        canApproveWork: true,
        canLogTime: true,
        canManageTestCases: true,
        canViewBudget: true,
        canRunAIActions: true,
        canConfigureWorkflows: true,
        isClientViewOnly: false,
      };

    case 'Organization Admin':
      return {
        canManagePlatform: false,
        canManageOrg: true,
        canManageProjects: true,
        canManageSprints: true,
        canCreateTasks: true,
        canEditTask: true,
        canDeleteTask: true,
        canApproveWork: true,
        canLogTime: true,
        canManageTestCases: true,
        canViewBudget: true,
        canRunAIActions: true,
        canConfigureWorkflows: true,
        isClientViewOnly: false,
      };

    case 'Project Manager':
      return {
        canManagePlatform: false,
        canManageOrg: false,
        canManageProjects: true,
        canManageSprints: true,
        canCreateTasks: true,
        canEditTask: true,
        canDeleteTask: true,
        canApproveWork: true,
        canLogTime: true,
        canManageTestCases: true,
        canViewBudget: true,
        canRunAIActions: true,
        canConfigureWorkflows: false,
        isClientViewOnly: false,
      };

    case 'Team Lead':
      return {
        canManagePlatform: false,
        canManageOrg: false,
        canManageProjects: false,
        canManageSprints: true,
        canCreateTasks: true,
        canEditTask: true,
        canDeleteTask: true,
        canApproveWork: true,
        canLogTime: true,
        canManageTestCases: true,
        canViewBudget: false,
        canRunAIActions: true,
        canConfigureWorkflows: false,
        isClientViewOnly: false,
      };

    case 'Developer/Member':
      return {
        canManagePlatform: false,
        canManageOrg: false,
        canManageProjects: false,
        canManageSprints: false,
        canCreateTasks: true,
        canEditTask: true,
        canDeleteTask: false,
        canApproveWork: false,
        canLogTime: true,
        canManageTestCases: false,
        canViewBudget: false,
        canRunAIActions: true,
        canConfigureWorkflows: false,
        isClientViewOnly: false,
      };

    case 'QA/Reviewer':
      return {
        canManagePlatform: false,
        canManageOrg: false,
        canManageProjects: false,
        canManageSprints: false,
        canCreateTasks: true,
        canEditTask: true,
        canDeleteTask: false,
        canApproveWork: true,
        canLogTime: true,
        canManageTestCases: true,
        canViewBudget: false,
        canRunAIActions: true,
        canConfigureWorkflows: false,
        isClientViewOnly: false,
      };

    case 'Client/Viewer':
      return {
        canManagePlatform: false,
        canManageOrg: false,
        canManageProjects: false,
        canManageSprints: false,
        canCreateTasks: false,
        canEditTask: false,
        canDeleteTask: false,
        canApproveWork: false,
        canLogTime: false,
        canManageTestCases: false,
        canViewBudget: true,
        canRunAIActions: false,
        canConfigureWorkflows: false,
        isClientViewOnly: true,
      };

    case 'AI Agent':
      return {
        canManagePlatform: false,
        canManageOrg: false,
        canManageProjects: true,
        canManageSprints: true,
        canCreateTasks: true,
        canEditTask: true,
        canDeleteTask: false,
        canApproveWork: false,
        canLogTime: false,
        canManageTestCases: true,
        canViewBudget: true,
        canRunAIActions: true,
        canConfigureWorkflows: false,
        isClientViewOnly: false,
      };

    default:
      return {
        canManagePlatform: false,
        canManageOrg: false,
        canManageProjects: false,
        canManageSprints: false,
        canCreateTasks: false,
        canEditTask: false,
        canDeleteTask: false,
        canApproveWork: false,
        canLogTime: false,
        canManageTestCases: false,
        canViewBudget: false,
        canRunAIActions: false,
        canConfigureWorkflows: false,
        isClientViewOnly: true,
      };
  }
};
