export type UserRole =
  | 'Super Admin'
  | 'Organization Admin'
  | 'Project Manager'
  | 'Team Lead'
  | 'Developer/Member'
  | 'QA/Reviewer'
  | 'Client/Viewer'
  | 'AI Agent';

export type EmploymentType = 'Permanent' | 'Contract' | 'Consultant' | 'Trainee' | 'Intern';

export type ReportingType = 'Functional' | 'Project' | 'Administrative' | 'Temporary';

export interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectRole: string;
  projectLeadId: string;
  moduleLeadId?: string;
  allocationPercentage: number; // e.g. 70 for 70%
  plannedHours: number;
  startDate: string;
  endDate: string;
  billableStatus: boolean;
  hourlyRateINR: number;
  monthlyCostINR: number;
}

export interface User {
  id: string;
  employeeId: string; // e.g. "EF-2024-042"
  name: string;
  email: string;
  googleEmail?: string;
  googleId?: string;
  isGoogleVerified?: boolean;
  companyDomain?: string; // e.g. "edgeforce.in"
  twoFactorEnabled?: boolean;
  avatar: string;
  role: UserRole;
  department: string;
  designation: string;
  grade?: string; // e.g. "L4 - Senior Specialist"
  branch?: string; // e.g. "Bengaluru HQ"
  joiningDate?: string;
  employmentType?: EmploymentType;
  skills: string[];
  
  // 3-Tier Reporting Relationships
  functionalManagerId?: string; // Permanent Organization Reporting Manager
  departmentHeadId?: string; // Head of Department
  administrativeManagerId?: string; // Manager for Leave, Timesheets & Appraisals
  teamId?: string;
  directReporteeIds?: string[];

  // Financial Costing in Indian Rupees (INR)
  monthlySalaryINR: number; // e.g. 85000 (₹85,000 / month)
  hourlyCostINR: number; // e.g. 531 (₹531 / hr based on 160h/mo)
  dailyCostINR: number; // e.g. 4250 (₹4,250 / day based on 20d/mo)
  billableRateINR: number; // e.g. 1500 (₹1,500 / hr billed to client)
  
  // Multi-Project Allocations
  projectAllocations: ProjectAllocation[];
  
  availabilityHoursPerWeek: number;
  phone?: string;
  country?: string;
  timezone?: string;
  status: 'Active' | 'On Leave' | 'Busy' | 'Deactivated';
}

export interface Team {
  id: string;
  name: string;
  department: string;
  teamLeadId: string;
  parentTeamId?: string; // Supports nested sub-teams
  memberIds: string[];
  description?: string;
}

export type WorkstreamType =
  | 'Software'
  | '3D Modelling'
  | 'Hardware'
  | 'Mechanical'
  | 'Electrical'
  | 'Electronics'
  | 'Fabrication'
  | 'UI/UX'
  | 'AI Development'
  | 'Procurement'
  | 'Integration'
  | 'Testing'
  | 'Deployment';

export type MethodologyType = 'Scrum' | 'Kanban' | 'Waterfall' | 'Hybrid' | 'Custom';

export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ProjectStatus = 'Planning' | 'Active' | 'In Review' | 'On Hold' | 'Completed';

export interface ProjectModule {
  id: string;
  projectId: string;
  name: string;
  workstream: WorkstreamType;
  description: string;
  progress: number;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Delayed';
  leadId: string;
  targetCompletionDate: string;
  budgetINR?: number;
}

export interface Epic {
  id: string;
  projectId: string;
  moduleId: string;
  key: string;
  title: string;
  description: string;
  status: 'Backlog' | 'In Progress' | 'Done';
  progress: number;
  color?: string;
}

export type TaskType =
  | 'Epic'
  | 'User Story'
  | 'Task'
  | 'Subtask'
  | 'Bug'
  | 'Change Request'
  | 'Risk'
  | 'Issue'
  | 'Procurement Item'
  | 'Approval'
  | 'Milestone'
  | 'Test Case'
  | 'Meeting Action Item';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical' | 'Blocker';

export type TaskStatus =
  | 'Backlog'
  | 'Selected'
  | 'In Progress'
  | 'Review'
  | 'Testing'
  | 'Approved'
  | 'Completed'
  | 'Blocked';

export interface TaskDependency {
  targetTaskId: string;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish';
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string;
  projectId: string;
  moduleId?: string;
  workstream: WorkstreamType;
  epicId?: string;
  parentTaskId?: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  reporterId: string;
  reviewerId?: string;
  sprintId?: string;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  storyPoints: number;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  labels: string[];
  dependencies: TaskDependency[];
  checklist: ChecklistItem[];
  acceptanceCriteria: string[];
  comments: Comment[];
  activityLog: ActivityLogItem[];
  customFields?: Record<string, string | number | boolean>;
  approvalStatus: 'none' | 'pending' | 'approved' | 'rejected';
  progress: number;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  objective: string;
  startDate: string;
  endDate: string;
  capacity: number; // in hours or points
  plannedPoints: number;
  completedPoints: number;
  status: 'planning' | 'active' | 'completed';
  riskLevel: 'low' | 'medium' | 'high';
  retrospectiveNotes?: string;
  aiSummary?: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  customer: string;
  projectManagerId: string;
  projectLeadId?: string;
  department: string;
  startDate: string;
  endDate: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  budgetINR: number; // in numeric INR (e.g. 54000000 for ₹5.4 Cr)
  gstPercentage: number; // e.g. 18
  currency: 'INR';
  methodology: MethodologyType;
  tags: string[];
  workstreams: WorkstreamType[];
  modules: ProjectModule[];
  progress: number;
  riskScore: number; // 0 to 100
  aiHealthInsight?: string;
}

export interface TimesheetEntry {
  id: string;
  userId: string;
  taskId: string;
  projectId: string;
  date: string;
  hours: number;
  billable: boolean;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approverId?: string;
}

export interface Requirement {
  id: string;
  rfpReference: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  ownerId: string;
  acceptanceCriteria: string;
  linkedModuleId?: string;
  linkedTaskId?: string;
  linkedTestCaseId?: string;
  verificationMethod: 'Testing' | 'Inspection' | 'Analysis' | 'Demonstration';
  complianceStatus: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Under Review';
  evidence?: string;
}

export interface TestCase {
  id: string;
  title: string;
  suite: string;
  module: string;
  steps: string[];
  expectedResult: string;
  executionStatus: 'passed' | 'failed' | 'blocked' | 'untested';
  defectId?: string;
  type: 'Unit' | 'Integration' | 'Regression' | 'Acceptance' | 'Hardware-in-the-Loop';
}

export interface Bug {
  id: string;
  key: string;
  title: string;
  environment: string;
  buildVersion: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  severity: 'Trivial' | 'Minor' | 'Major' | 'Critical' | 'Blocker';
  priority: TaskPriority;
  assignedDeveloperId: string;
  rootCause?: string;
  resolution?: string;
  retestStatus: 'Pending' | 'Retesting' | 'Verified' | 'Reopened';
  status: TaskStatus;
  projectId: string;
  taskId?: string;
}

export interface ProcurementItem {
  id: string;
  itemCode: string;
  description: string;
  category: 'Hardware' | 'Electrical' | 'Mechanical' | 'Software/License' | 'Raw Material' | 'Electronics' | 'Fabrication';
  requiredQty: number;
  availableQty: number;
  unitPriceINR: number; // in numeric INR
  currency: 'INR';
  vendor: string;
  poNumber?: string;
  deliveryDate: string;
  inspectionStatus: 'Pending' | 'Passed' | 'Failed' | 'In Transit';
  warrantyMonths: number;
  linkedProjectId: string;
  status: 'Requested' | 'Quotation Received' | 'Approved' | 'Ordered' | 'Delivered' | 'Allocated';
}

export interface ProjectBudget {
  projectId: string;
  currency: 'INR';
  totalBudgetINR: number; // e.g. ₹54,00,000
  softwareCostINR: number;
  aiDevelopmentCostINR: number;
  hardwareCostINR: number;
  mechanicalCostINR: number;
  electricalCostINR: number;
  procurementCostINR: number;
  manpowerCostINR: number;
  travelCostINR: number;
  contingencyINR: number;
  gstPercentage: number; // e.g. 18
  actualSpendINR: number;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  duration: string;
  attendees: string[];
  transcript: string;
  decisions: string[];
  actionItems: {
    id: string;
    taskTitle: string;
    assigneeId: string;
    dueDate: string;
    createdTaskId?: string;
  }[];
}

// ----------------------------------------------------
// REAL-TIME CHAT & MESSAGING DOMAIN MODELS
// ----------------------------------------------------

export type ConversationType =
  | 'direct'
  | 'project'
  | 'team'
  | 'department'
  | 'task'
  | 'group'
  | 'announcement'
  | 'ai'
  | 'client';

export type MessageType =
  | 'text'
  | 'image'
  | 'file'
  | 'voice'
  | 'task_link'
  | 'project_link'
  | 'system_event'
  | 'ai_response';

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'audio' | 'video' | 'cad';
  sizeBytes: number;
  url: string;
  previewUrl?: string;
}

export interface VoiceNote {
  durationSeconds: number;
  waveform: number[]; // Array of 0-100 amplitude values for visual waveform render
  audioUrl: string;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface MessageReceipt {
  userId: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string; // 'usr-ai' for AI Assistant
  messageType: MessageType;
  text: string;
  replyToMessageId?: string;
  replyToSnippet?: {
    id: string;
    senderName: string;
    text: string;
  };
  attachments?: MessageAttachment[];
  voiceNote?: VoiceNote;
  reactions: MessageReaction[];
  pinned?: boolean;
  starredByUserIds?: string[];
  mentions?: string[]; // user IDs mentioned with @
  linkedTaskId?: string;
  linkedProjectId?: string;
  createdAt: string;
  editedAt?: string;
  deletedAt?: string;
  receipts?: MessageReceipt[];
  isForwarded?: boolean;
}

export interface ConversationMember {
  userId: string;
  role: 'admin' | 'member';
  mutedUntil?: string; // ISO string or 'forever'
  joinedAt: string;
}

export interface Conversation {
  id: string;
  organizationId?: string;
  type: ConversationType;
  name: string;
  description?: string;
  projectId?: string;
  taskId?: string;
  departmentId?: string;
  teamId?: string;
  avatar?: string;
  icon?: string;
  memberIds: string[];
  members?: ConversationMember[];
  isPrivate?: boolean;
  pinnedMessageIds?: string[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount?: number;
}

// ----------------------------------------------------
// NOTIFICATIONS & ALERT LEVELS DOMAIN MODELS
// ----------------------------------------------------

export type NotificationCategory =
  | 'tasks'
  | 'projects'
  | 'chat'
  | 'mentions'
  | 'approvals'
  | 'sprints'
  | 'meetings'
  | 'timesheets'
  | 'leave'
  | 'procurement'
  | 'budget'
  | 'risks'
  | 'system'
  | 'ai';

export type NotificationSeverity =
  | 'info'       // Blue - Soft tone
  | 'success'    // Green - Confirmation tone
  | 'warning'    // Amber - Warning tone
  | 'critical'   // Red - Strong alert tone
  | 'emergency'; // Dark Red - Repeating continuous siren

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: NotificationCategory;
  severity: NotificationSeverity;
  type?: 'task' | 'risk' | 'approval' | 'mention' | 'ai' | 'auth' | 'emergency';
  link?: string;
  referenceType?: 'task' | 'project' | 'chat' | 'procurement' | 'timesheet' | 'budget';
  referenceId?: string;
  isAcknowledged?: boolean;
  snoozedUntil?: string;
  soundEffect?: string;
}

export interface NotificationPreferences {
  masterVolume: number; // 0.0 to 1.0
  chatVolume: number; // 0.0 to 1.0
  alertVolume: number; // 0.0 to 1.0
  soundEnabled: boolean;
  soundOnlyForMentions: boolean;
  criticalAlertsOverrideDnd: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "07:00"
  dndActive: boolean;
  
  // Delivery channels
  inAppEnabled: boolean;
  browserDesktopEnabled: boolean;
  mobilePushEnabled: boolean;
  emailEnabled: boolean;
  
  // Privacy mode for desktop notifications (masks defense/sensitive details)
  privacyMode: boolean;
}

// ----------------------------------------------------
// ALERT ESCALATION HIERARCHY
// ----------------------------------------------------

export interface AlertEscalationRecord {
  id: string;
  taskId: string;
  taskKey: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  severity: NotificationSeverity;
  stage: 1 | 2 | 3 | 4 | 5; // 1: Assignee, 2: Team Lead, 3: Project Lead, 4: Delivery Head, 5: Managing Director
  stageLabel: string;
  escalatedToUserId: string;
  escalatedToUserName: string;
  escalatedToRole: string;
  triggeredAt: string;
  overdueDays: number;
  reason: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  isResolved: boolean;
  resolvedAt?: string;
}

export interface AIActionPreview {
  id: string;
  type: 'create_project' | 'create_tasks' | 'rebalance_resources' | 'generate_report' | 'extract_meeting' | 'manpower_plan';
  title: string;
  prompt: string;
  confidence: number;
  proposedChanges: any;
  executed: boolean;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface ActiveTimer {
  taskId: string;
  taskTitle: string;
  projectKey: string;
  startTime: number;
  isRunning: boolean;
  elapsedSeconds: number;
}

