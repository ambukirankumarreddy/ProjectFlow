import {
  User,
  Project,
  Task,
  Sprint,
  TimesheetEntry,
  Requirement,
  TestCase,
  Bug,
  ProcurementItem,
  ProjectBudget,
  Meeting,
  NotificationItem,
  AuditLog,
  Epic,
  Team
} from '../types';

export const INITIAL_TEAMS: Team[] = [];

export const INITIAL_USERS: User[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_EPICS: Epic[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_SPRINTS: Sprint[] = [];

export const INITIAL_TIMESHEETS: TimesheetEntry[] = [];

export const INITIAL_REQUIREMENTS: Requirement[] = [];

export const INITIAL_TEST_CASES: TestCase[] = [];

export const INITIAL_BUGS: Bug[] = [];

export const INITIAL_BOM: ProcurementItem[] = [];

export const INITIAL_BUDGET: ProjectBudget = {
  projectId: '',
  currency: 'INR',
  totalBudgetINR: 0,
  softwareCostINR: 0,
  aiDevelopmentCostINR: 0,
  hardwareCostINR: 0,
  mechanicalCostINR: 0,
  electricalCostINR: 0,
  procurementCostINR: 0,
  manpowerCostINR: 0,
  travelCostINR: 0,
  contingencyINR: 0,
  gstPercentage: 18,
  actualSpendINR: 0,
};

export const INITIAL_MEETINGS: Meeting[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
