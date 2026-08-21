import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Project,
  Task,
  TaskStatus,
  TaskPriority,
  WorkstreamType,
  Sprint,
  Epic,
  TimesheetEntry,
  Requirement,
  TestCase,
  Bug,
  ProcurementItem,
  ProjectBudget,
  Meeting,
  NotificationItem,
  AuditLog,
  AIActionPreview,
  ActiveTimer,
  Team,
  Conversation,
  ChatMessage,
  MessageAttachment,
  VoiceNote,
  NotificationPreferences,
  AlertEscalationRecord
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_EPICS,
  INITIAL_TASKS,
  INITIAL_SPRINTS,
  INITIAL_TIMESHEETS,
  INITIAL_REQUIREMENTS,
  INITIAL_TEST_CASES,
  INITIAL_BUGS,
  INITIAL_BOM,
  INITIAL_BUDGET,
  INITIAL_MEETINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TEAMS
} from '../data/mockData';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATION_PREFERENCES,
  INITIAL_NOTIFICATIONS_V2,
  INITIAL_ALERT_ESCALATIONS
} from '../data/mockChatData';
import { audioEngine, SoundEffectType } from '../utils/audioEngine';

interface OrgSettings {
  name: string;
  logo: string;
  industry: string;
  departments: string[];
  workingDays: string[];
  workingHours: string;
  defaultCurrency: 'INR';
  currencySymbol: '₹';
  financialYearStart: 'April';
  gstPercentage: number;
  companyDomain: string; // e.g. "edgeforce.in"
  enforceCompanyDomain: boolean;
  isConfigured: boolean;
}

interface AppContextType {
  // Theme & Navigation
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string, bypass2FA?: boolean) => { success: boolean; message?: string; twoFactorRequired?: boolean; user?: User };
  loginWithGoogle: (googleProfile?: { name?: string; email?: string; imageUrl?: string; id?: string }) => { success: boolean; message?: string };
  registerOrganization: (data: any) => { success: boolean; message?: string };
  registerWithInvite: (data: any) => { success: boolean; message?: string };
  logout: () => void;

  // Users & RBAC
  currentUser: User;
  activeRole: UserRole;
  users: User[];
  teams: Team[];
  isGoogleAuthModalOpen: boolean;
  setIsGoogleAuthModalOpen: (open: boolean) => void;
  loginWithGoogleUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  updateUser: (user: User) => void;

  // Projects
  projects: Project[];
  selectedProjectId: string;
  selectedProject: Project | undefined;
  setSelectedProjectId: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  // Epics & Tasks
  epics: Epic[];
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  batchAddTasks: (tasks: Task[]) => void;
  duplicateTask: (taskId: string) => void;

  // Sprints
  sprints: Sprint[];
  addSprint: (sprint: Sprint) => void;
  updateSprint: (sprint: Sprint) => void;
  completeSprint: (sprintId: string) => void;

  // Timesheets & Live Timer
  timesheets: TimesheetEntry[];
  activeTimer: ActiveTimer | null;
  startTimer: (task: Task) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopAndLogTimer: (description?: string, billable?: boolean) => void;
  addTimesheetEntry: (entry: TimesheetEntry) => void;
  approveTimesheet: (id: string) => void;

  // QA, Requirements, Bugs
  requirements: Requirement[];
  addRequirement: (req: Requirement) => void;
  updateRequirement: (req: Requirement) => void;
  testCases: TestCase[];
  updateTestCaseStatus: (id: string, status: 'passed' | 'failed' | 'blocked' | 'untested') => void;
  bugs: Bug[];
  addBug: (bug: Bug) => void;
  updateBug: (bug: Bug) => void;

  // BOM & Budget in INR (₹)
  bomItems: ProcurementItem[];
  addBOMItem: (item: ProcurementItem) => void;
  updateBOMItemStatus: (id: string, status: ProcurementItem['status']) => void;
  budget: ProjectBudget;
  updateBudget: (budget: ProjectBudget) => void;

  // Meetings
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  extractAndCreateMeetingTasks: (meetingId: string) => void;

  // Notifications & Audit Logs
  notifications: NotificationItem[];
  notificationPreferences: NotificationPreferences;
  isNotificationCentreOpen: boolean;
  setIsNotificationCentreOpen: (open: boolean) => void;
  isNotificationSettingsOpen: boolean;
  setIsNotificationSettingsOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  snoozeNotification: (id: string, durationMinutes: number) => void;
  deleteNotification: (id: string) => void;
  triggerNotification: (item: Partial<NotificationItem>) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  auditLogs: AuditLog[];
  logAction: (action: string, target: string) => void;

  // Real-Time Chat System
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  minimizedChatIds: string[];
  toggleMinimizeChat: (conversationId: string) => void;
  closeMinimizedChat: (conversationId: string) => void;
  sendMessage: (
    conversationId: string,
    text: string,
    attachments?: MessageAttachment[],
    replyToMessageId?: string,
    voiceNote?: VoiceNote,
    mentions?: string[],
    linkedTaskId?: string,
    linkedProjectId?: string
  ) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  pinMessage: (conversationId: string, messageId: string) => void;
  starMessage: (messageId: string) => void;
  forwardMessage: (messageId: string, targetConversationId: string) => void;
  createConversation: (newConv: Partial<Conversation>) => string;
  convertMessageToTask: (
    message: ChatMessage,
    title: string,
    projectId: string,
    workstream: WorkstreamType,
    assigneeId: string,
    priority: TaskPriority
  ) => void;

  // Audio Engine & Emergency Alert
  isEmergencyAlarmActive: boolean;
  stopEmergencyAlarm: () => void;
  triggerEmergencyAlert: (title: string, message: string) => void;
  playNotificationSound: (effect: SoundEffectType) => void;
  unlockAudio: () => void;

  // Alert Escalation Hierarchy
  alertEscalations: AlertEscalationRecord[];
  triggerAlertEscalation: (taskId: string, reason?: string) => void;
  acknowledgeEscalation: (id: string) => void;
  resolveEscalation: (id: string) => void;

  // AI Sandbox & Safety
  pendingAIAction: AIActionPreview | null;
  setPendingAIAction: (action: AIActionPreview | null) => void;
  executePendingAIAction: () => void;

  // Org Settings
  orgSettings: OrgSettings;
  updateOrgSettings: (settings: Partial<OrgSettings>) => void;

  // Reset
  resetToDemoData: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr-admin-default',
  employeeId: 'ADM-001',
  name: 'Super Admin',
  email: 'admin@company.com',
  googleEmail: 'admin@company.com',
  isGoogleVerified: true,
  companyDomain: 'company.com',
  twoFactorEnabled: false,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  role: 'Super Admin',
  department: 'Executive Leadership',
  designation: 'Managing Director & Super Admin',
  grade: 'L7 - Executive Board',
  branch: 'Corporate Headquarters',
  joiningDate: '2026-01-01',
  employmentType: 'Permanent',
  skills: ['Strategic Leadership', 'Enterprise Planning'],
  monthlySalaryINR: 350000,
  hourlyCostINR: 2187,
  dailyCostINR: 17500,
  billableRateINR: 4500,
  availabilityHoursPerWeek: 40,
  projectAllocations: [],
  status: 'Active',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'projectflow_ai_enterprise_data';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Authentication & Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('projectflow_auth') === 'true';
  });

  // Users & RBAC & Teams
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('projectflow_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('projectflow_users');
    const parsed = saved ? JSON.parse(saved) : INITIAL_USERS;
    return parsed[0] || DEFAULT_USER;
  });
  const [activeRole, setActiveRole] = useState<UserRole>(() => currentUser?.role || 'Super Admin');
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);

  // Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projectflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => projects[0]?.id || '');

  // Epics & Tasks
  const [epics, setEpics] = useState<Epic[]>(INITIAL_EPICS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Sprints
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);

  // Timesheets & Timer
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(INITIAL_TIMESHEETS);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  // Requirements, QA, Bugs
  const [requirements, setRequirements] = useState<Requirement[]>(INITIAL_REQUIREMENTS);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [bugs, setBugs] = useState<Bug[]>(INITIAL_BUGS);

  // Procurement & Budget
  const [bomItems, setBomItems] = useState<ProcurementItem[]>(INITIAL_BOM);
  const [budget, setBudget] = useState<ProjectBudget>(INITIAL_BUDGET);

  // Meetings
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);

  // Notifications & Audit Logs
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS_V2);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(INITIAL_NOTIFICATION_PREFERENCES);
  const [isNotificationCentreOpen, setIsNotificationCentreOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Real-Time Chat System
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-dm-vikram');
  const [minimizedChatIds, setMinimizedChatIds] = useState<string[]>([]);

  // Audio Engine & Emergency Siren State
  const [isEmergencyAlarmActive, setIsEmergencyAlarmActive] = useState<boolean>(false);

  // Alert Escalation Records
  const [alertEscalations, setAlertEscalations] = useState<AlertEscalationRecord[]>(INITIAL_ALERT_ESCALATIONS);

  // AI Safety
  const [pendingAIAction, setPendingAIAction] = useState<AIActionPreview | null>(null);

  // Org Settings (Configured for Indian Enterprise & Edgeforce)
  const [orgSettings, setOrgSettings] = useState<OrgSettings>({
    name: 'Edgeforce Simulation & Aerospace Ltd.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    industry: 'Defense & Aerospace Simulation',
    departments: [
      'Unity Development',
      'AI Development',
      '3D Modelling',
      'UI/UX',
      'Quality Assurance',
      'Mechanical',
      'Electrical',
      'Electronics',
      'Hardware',
      'Procurement',
      'Project Management & Delivery'
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '09:30 - 18:30 IST (40 hrs/wk)',
    defaultCurrency: 'INR',
    currencySymbol: '₹',
    financialYearStart: 'April',
    gstPercentage: 18,
    companyDomain: 'edgeforce.in',
    enforceCompanyDomain: true,
    isConfigured: true,
  });

  // Sync Audio Preferences to WebAudioEngine Singleton
  useEffect(() => {
    audioEngine.setPreferences({
      masterVolume: notificationPreferences.masterVolume,
      chatVolume: notificationPreferences.chatVolume,
      alertVolume: notificationPreferences.alertVolume,
      isMuted: !notificationPreferences.soundEnabled,
      isDndActive: notificationPreferences.dndActive,
      soundOnlyForMentions: notificationPreferences.soundOnlyForMentions,
      quietHoursEnabled: notificationPreferences.quietHoursEnabled,
      quietHoursStart: notificationPreferences.quietHoursStart,
      quietHoursEnd: notificationPreferences.quietHoursEnd,
    });
  }, [notificationPreferences]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.sprints) setSprints(parsed.sprints);
        if (parsed.epics) setEpics(parsed.epics);
        if (parsed.timesheets) setTimesheets(parsed.timesheets);
        if (parsed.requirements) setRequirements(parsed.requirements);
        if (parsed.testCases) setTestCases(parsed.testCases);
        if (parsed.bugs) setBugs(parsed.bugs);
        if (parsed.bomItems) setBomItems(parsed.bomItems);
        if (parsed.budget) setBudget(parsed.budget);
        if (parsed.meetings) setMeetings(parsed.meetings);
        if (parsed.orgSettings) setOrgSettings(parsed.orgSettings);
        if (parsed.conversations) setConversations(parsed.conversations);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.notificationPreferences) setNotificationPreferences(parsed.notificationPreferences);
        if (parsed.alertEscalations) setAlertEscalations(parsed.alertEscalations);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  // Save to local storage on key state updates
  useEffect(() => {
    try {
      const stateToSave = {
        users,
        projects,
        tasks,
        sprints,
        epics,
        timesheets,
        requirements,
        testCases,
        bugs,
        bomItems,
        budget,
        meetings,
        orgSettings,
        conversations,
        messages,
        notifications,
        notificationPreferences,
        alertEscalations,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to persist state to localStorage', e);
    }
  }, [
    users,
    projects,
    tasks,
    sprints,
    epics,
    timesheets,
    requirements,
    testCases,
    bugs,
    bomItems,
    budget,
    meetings,
    orgSettings,
    conversations,
    messages,
    notifications,
    notificationPreferences,
    alertEscalations
  ]);

  // Live Timer tick
  useEffect(() => {
    let interval: any = null;
    if (activeTimer && activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer(prev => {
          if (!prev || !prev.isRunning) return prev;
          return {
            ...prev,
            elapsedSeconds: prev.elapsedSeconds + 1,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer?.isRunning]);

  // Toggle Theme
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Email / Password Login with Optional 2FA
  const loginWithEmail = (email: string, password: string, bypass2FA = false) => {
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      return {
        success: false,
        message: `Account '${email}' not found. Please register your organization or join with an invitation code.`,
      };
    }

    if ((matchedUser.role === 'Super Admin' || matchedUser.twoFactorEnabled) && !bypass2FA) {
      return { success: true, twoFactorRequired: true, user: matchedUser };
    }

    setCurrentUser(matchedUser);
    setActiveRole(matchedUser.role);
    setIsAuthenticated(true);
    localStorage.setItem('projectflow_auth', 'true');
    logAction(`User authenticated: ${matchedUser.name} (${matchedUser.email})`, 'Authentication Engine');
    audioEngine.playSound('approval_result');
    return { success: true, user: matchedUser };
  };

  // Google SSO Login
  const loginWithGoogle = (googleProfile?: { name?: string; email?: string; imageUrl?: string; id?: string }) => {
    if (googleProfile && googleProfile.email) {
      // Validate office domain if enforced
      if (orgSettings.enforceCompanyDomain && !googleProfile.email.toLowerCase().endsWith(`@${orgSettings.companyDomain.toLowerCase()}`)) {
        return {
          success: false,
          message: `Google Account domain does not match corporate domain @${orgSettings.companyDomain}`,
        };
      }

      // Find or create matching user
      let matched = users.find(u => u.email.toLowerCase() === googleProfile.email!.toLowerCase());
      if (!matched) {
        matched = {
          id: `usr-g-${Date.now()}`,
          employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
          name: googleProfile.name || 'Google User',
          email: googleProfile.email,
          googleEmail: googleProfile.email,
          isGoogleVerified: true,
          companyDomain: orgSettings.companyDomain,
          avatar: googleProfile.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: 'Developer/Member',
          department: 'Software',
          designation: 'Specialist Engineer',
          grade: 'L3 - Specialist',
          branch: 'Corporate HQ',
          joiningDate: new Date().toISOString().split('T')[0],
          employmentType: 'Permanent',
          skills: ['Engineering'],
          monthlySalaryINR: 95000,
          hourlyCostINR: 593,
          dailyCostINR: 4750,
          billableRateINR: 1800,
          availabilityHoursPerWeek: 40,
          projectAllocations: [],
          status: 'Active',
        };
        setUsers(prev => [...prev, matched!]);
      } else {
        matched = {
          ...matched,
          avatar: googleProfile.imageUrl || matched.avatar,
          isGoogleVerified: true,
          googleEmail: googleProfile.email,
        };
        updateUser(matched);
      }

      setCurrentUser(matched);
      setActiveRole(matched.role);
      setIsAuthenticated(true);
      localStorage.setItem('projectflow_auth', 'true');
      logAction(`Google SSO Verified: ${matched.name} (${googleProfile.email})`, 'Google OAuth 2.0');
      audioEngine.playSound('approval_result');
      return { success: true };
    }

    // Default Google User Fallback
    const defaultGoogleUser = users.find(u => u.isGoogleVerified) || users[0];
    setCurrentUser(defaultGoogleUser);
    setActiveRole(defaultGoogleUser.role);
    setIsAuthenticated(true);
    localStorage.setItem('projectflow_auth', 'true');
    logAction(`Google SSO Verified: ${defaultGoogleUser.name} (${defaultGoogleUser.googleEmail || defaultGoogleUser.email})`, 'Google OAuth 2.0');
    audioEngine.playSound('approval_result');
    return { success: true };
  };

  // One-Time Super Admin & Organization Registration (Starts with 100% clean data)
  const registerOrganization = (data: any) => {
    const newOrgDomain = (data.domain || 'edgeforce.in').replace('@', '').toLowerCase();
    const newSuperAdmin: User = {
      id: `usr-admin-${Date.now()}`,
      employeeId: 'ADM-001',
      name: data.adminName || 'Super Admin',
      email: data.adminEmail || `admin@${newOrgDomain}`,
      googleEmail: data.adminEmail,
      isGoogleVerified: true,
      companyDomain: newOrgDomain,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Super Admin',
      department: 'Executive Leadership',
      designation: 'Managing Director & Super Admin',
      grade: 'L6 - Executive',
      branch: 'Corporate HQ',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Permanent',
      skills: ['Strategic Leadership', 'Defense Programs'],
      monthlySalaryINR: 250000,
      hourlyCostINR: 1562,
      dailyCostINR: 12500,
      billableRateINR: 4500,
      availabilityHoursPerWeek: 40,
      twoFactorEnabled: true,
      projectAllocations: [],
      status: 'Active',
    };

    setOrgSettings(prev => ({
      ...prev,
      name: data.organizationName || 'New Organization',
      companyDomain: newOrgDomain,
      industry: data.industry || 'Defense & Aerospace Simulation',
      isConfigured: true,
    }));

    // Fresh Clean Workspace (zero dummy records)
    setUsers([newSuperAdmin]);
    setCurrentUser(newSuperAdmin);
    setActiveRole('Super Admin');
    setProjects([]);
    setTasks([]);
    setEpics([]);
    setSprints([]);
    setBomItems([]);
    setBugs([]);
    setRequirements([]);
    setTimesheets([]);
    setMeetings([]);
    setAlertEscalations([]);
    setConversations([
      {
        id: 'conv-general',
        type: 'announcement',
        name: '📢 Company Announcements',
        description: 'Official organization announcements channel',
        memberIds: [newSuperAdmin.id],
        isPrivate: false,
        createdAt: 'Just now',
        updatedAt: 'Just now',
      },
      {
        id: 'conv-ai-flowpilot',
        type: 'ai',
        name: 'FlowPilot AI Assistant',
        description: 'Autonomous AI workspace copilot',
        memberIds: [newSuperAdmin.id, 'usr-ai'],
        isPrivate: false,
        createdAt: 'Just now',
        updatedAt: 'Just now',
      }
    ]);

    setIsAuthenticated(true);
    localStorage.setItem('projectflow_auth', 'true');
    logAction(`Organization registered: ${data.organizationName} by ${data.adminName}`, 'Organization Setup');
    audioEngine.playSound('approval_result');
    return { success: true };
  };

  // Employee Onboarding via Invitation
  const registerWithInvite = (data: any) => {
    if (data.token !== 'EF-INVITE-2026' && !data.token.startsWith('INV-')) {
      return { success: false, message: 'Invalid invitation token code. Try demo code EF-INVITE-2026.' };
    }

    const newEmp: User = {
      id: `usr-emp-${Date.now()}`,
      employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      email: data.email,
      googleEmail: data.email,
      isGoogleVerified: true,
      companyDomain: orgSettings.companyDomain,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: data.role || 'Developer/Member',
      department: data.department || 'Software',
      designation: 'Specialist Engineer',
      grade: 'L3 - Specialist',
      branch: 'Main Office',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Permanent',
      skills: ['Development', 'Engineering'],
      functionalManagerId: data.functionalManagerId || undefined,
      departmentHeadId: data.functionalManagerId || undefined,
      administrativeManagerId: data.functionalManagerId || undefined,
      monthlySalaryINR: 95000,
      hourlyCostINR: 593,
      dailyCostINR: 4750,
      billableRateINR: 1800,
      availabilityHoursPerWeek: 40,
      projectAllocations: [],
      status: 'Active',
    };

    setUsers(prev => [...prev, newEmp]);
    setCurrentUser(newEmp);
    setActiveRole(newEmp.role);
    setIsAuthenticated(true);
    localStorage.setItem('projectflow_auth', 'true');
    logAction(`Employee onboarded via invitation: ${newEmp.name}`, 'HR Onboarding');
    audioEngine.playSound('approval_result');
    return { success: true };
  };

  // Sign Out & Google Session Revocation
  const logout = () => {
    // 1. Google Identity Services / GAPI Sign-out
    try {
      if (typeof window !== 'undefined') {
        const win = window as any;
        if (win.google?.accounts?.id) {
          win.google.accounts.id.disableAutoSelect();
        }
        if (win.gapi?.auth2) {
          const auth2 = win.gapi.auth2.getAuthInstance();
          if (auth2) {
            auth2.signOut().then(() => {
              console.log('Google Auth2 user signed out.');
            });
          }
        }
      }
    } catch (e) {
      console.warn('Google sign-out warning:', e);
    }

    // 2. Clear local session tokens & state
    setIsAuthenticated(false);
    localStorage.removeItem('projectflow_auth');
    localStorage.removeItem('projectflow_token');
    logAction(`User signed out: ${currentUser.name} (${currentUser.email})`, 'Authentication');
    audioEngine.playSound('direct_message');
  };

  // Legacy Google Login Simulator
  const loginWithGoogleUser = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsAuthenticated(true);
    localStorage.setItem('projectflow_auth', 'true');
    logAction(`Google SSO Verified: ${user.name} (${user.email})`, 'Google OAuth 2.0');
    setIsGoogleAuthModalOpen(false);
    audioEngine.playSound('direct_message');
  };

  // Switch Active User Role
  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    const matchedUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchedUser);
    logAction(`Switched active persona to [${role}]`, 'User Context');
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  // Projects
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setSelectedProjectId(project.id);
    logAction(`Created new project [${project.name}]`, `Project: ${project.key}`);
    audioEngine.playSound('approval_result');

    // Auto-create Project General Chat Channel
    const newChannel: Conversation = {
      id: `conv-proj-${project.id}`,
      type: 'project',
      name: `#${project.key.toLowerCase()}-general`,
      description: `${project.name} cross-disciplinary channel`,
      projectId: project.id,
      memberIds: [currentUser.id, 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-7'],
      isPrivate: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastMessage: {
        text: `Project ${project.name} initialized. Welcome team!`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        createdAt: 'Just now',
      },
    };
    setConversations(prev => [newChannel, ...prev]);
  };

  const updateProject = (project: Project) => {
    setProjects(prev => prev.map(p => (p.id === project.id ? project : p)));
    logAction(`Updated project settings [${project.name}]`, `Project: ${project.key}`);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProjectId === id && projects.length > 1) {
      const remaining = projects.filter(p => p.id !== id);
      setSelectedProjectId(remaining[0].id);
    }
    logAction(`Deleted project ID [${id}]`, 'Project Hub');
  };

  // Tasks
  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    logAction(`Created task [${task.key}: ${task.title}]`, `Project: ${task.projectId}`);
    audioEngine.playSound('task_assigned');

    // Auto-create Task Chat if priority is High or Critical
    if (task.priority === 'High' || task.priority === 'Critical') {
      const taskConv: Conversation = {
        id: `conv-task-${task.id}`,
        type: 'task',
        name: `Task: ${task.key} (${task.title.substring(0, 28)}...)`,
        description: `Dedicated discussion thread for ${task.key}`,
        taskId: task.id,
        projectId: task.projectId,
        memberIds: [task.assigneeId, task.reporterId, currentUser.id],
        isPrivate: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        lastMessage: {
          text: `Task created and assigned to ${users.find(u => u.id === task.assigneeId)?.name || 'assignee'}.`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          createdAt: 'Just now',
        },
      };
      setConversations(prev => [taskConv, ...prev]);
    }
  };

  const updateTask = (task: Task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
    logAction(`Updated task [${task.key}]`, `Task: ${task.key}`);
  };

  const deleteTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (target) {
      logAction(`Deleted task [${target.key}]`, `Project: ${target.projectId}`);
    }
  };

  const moveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated: Task = {
            ...t,
            status: newStatus,
            progress: newStatus === 'Completed' ? 100 : t.progress === 100 ? 50 : t.progress,
            activityLog: [
              {
                id: `act-${Date.now()}`,
                userId: currentUser.id,
                action: `Moved status from ${t.status} to ${newStatus}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              },
              ...t.activityLog,
            ],
          };
          return updated;
        }
        return t;
      })
    );

    logAction(`Updated task status to [${newStatus}]`, `Task ID: ${taskId}`);

    if (newStatus === 'Completed') {
      audioEngine.playSound('approval_result');
    } else if (newStatus === 'Blocked') {
      audioEngine.playSound('critical_risk');
      triggerAlertEscalation(taskId, 'Task marked as Blocked');
    } else {
      audioEngine.playSound('task_assigned');
    }
  };

  const batchAddTasks = (newTasks: Task[]) => {
    setTasks(prev => [...newTasks, ...prev]);
    logAction(`Batch added ${newTasks.length} tasks via AI Generator`, 'Task Engine');
    audioEngine.playSound('ai_recommendation');
  };

  const duplicateTask = (taskId: string) => {
    const existing = tasks.find(t => t.id === taskId);
    if (!existing) return;
    const duplicated: Task = {
      ...existing,
      id: `task-${Date.now()}`,
      key: `${existing.key}-COPY`,
      title: `${existing.title} (Copy)`,
      status: 'Backlog',
      progress: 0,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          action: 'Duplicated from ' + existing.key,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };
    addTask(duplicated);
  };

  // Sprints
  const addSprint = (sprint: Sprint) => {
    setSprints(prev => [...prev, sprint]);
    logAction(`Created sprint [${sprint.name}]`, `Project: ${sprint.projectId}`);
  };

  const updateSprint = (sprint: Sprint) => {
    setSprints(prev => prev.map(s => (s.id === sprint.id ? sprint : s)));
    logAction(`Updated sprint [${sprint.name}]`, `Sprint: ${sprint.id}`);
  };

  const completeSprint = (sprintId: string) => {
    setSprints(prev =>
      prev.map(s => (s.id === sprintId ? { ...s, status: 'completed' as const } : s))
    );
    logAction(`Completed sprint [${sprintId}]`, 'Sprint Manager');
    audioEngine.playSound('approval_result');
  };

  // Live Timer
  const startTimer = (task: Task) => {
    setActiveTimer({
      taskId: task.id,
      taskTitle: task.title,
      projectKey: task.key.split('-')[0] || 'PRJ',
      startTime: Date.now(),
      isRunning: true,
      elapsedSeconds: 0,
    });
    logAction(`Started live stopwatch on task [${task.key}]`, 'Timesheet Module');
  };

  const pauseTimer = () => {
    if (activeTimer) {
      setActiveTimer({ ...activeTimer, isRunning: false });
    }
  };

  const resumeTimer = () => {
    if (activeTimer) {
      setActiveTimer({ ...activeTimer, isRunning: true });
    }
  };

  const stopAndLogTimer = (description?: string, billable: boolean = true) => {
    if (!activeTimer) return;
    const hours = Number((activeTimer.elapsedSeconds / 3600).toFixed(2));
    const finalHours = hours > 0.05 ? hours : 0.25;

    const newEntry: TimesheetEntry = {
      id: `ts-${Date.now()}`,
      userId: currentUser.id,
      taskId: activeTimer.taskId,
      projectId: selectedProjectId,
      date: new Date().toISOString().split('T')[0],
      hours: finalHours,
      billable,
      description: description || `Live timer logged on ${activeTimer.taskTitle}`,
      status: 'submitted',
      approverId: currentUser.functionalManagerId || 'usr-1',
    };

    addTimesheetEntry(newEntry);

    // Update actual hours on task
    setTasks(prev =>
      prev.map(t =>
        t.id === activeTimer.taskId
          ? { ...t, actualHours: t.actualHours + finalHours }
          : t
      )
    );

    setActiveTimer(null);
    logAction(`Logged ${finalHours} hrs via Live Timer on task [${activeTimer.taskTitle}]`, 'Timesheet');
    audioEngine.playSound('approval_request');
  };

  const addTimesheetEntry = (entry: TimesheetEntry) => {
    setTimesheets(prev => [entry, ...prev]);
  };

  const approveTimesheet = (id: string) => {
    setTimesheets(prev =>
      prev.map(ts => (ts.id === id ? { ...ts, status: 'approved' as const } : ts))
    );
    logAction(`Approved timesheet entry [${id}]`, 'Timesheet Approvals');
    audioEngine.playSound('approval_result');
  };

  // Requirements, QA, Bugs
  const addRequirement = (req: Requirement) => {
    setRequirements(prev => [req, ...prev]);
    logAction(`Added requirement [${req.rfpReference}]`, 'Traceability Matrix');
  };

  const updateRequirement = (req: Requirement) => {
    setRequirements(prev => prev.map(r => (r.id === req.id ? req : r)));
  };

  const updateTestCaseStatus = (id: string, status: 'passed' | 'failed' | 'blocked' | 'untested') => {
    setTestCases(prev => prev.map(tc => (tc.id === id ? { ...tc, executionStatus: status } : tc)));
    logAction(`Updated test case [${id}] execution status to ${status}`, 'QA Engine');
    if (status === 'passed') audioEngine.playSound('approval_result');
    if (status === 'failed') audioEngine.playSound('critical_risk');
  };

  const addBug = (bug: Bug) => {
    setBugs(prev => [bug, ...prev]);
    logAction(`Logged new bug defect [${bug.key}: ${bug.title}]`, 'Bug Tracker');
    audioEngine.playSound('critical_risk');
  };

  const updateBug = (bug: Bug) => {
    setBugs(prev => prev.map(b => (b.id === bug.id ? bug : b)));
  };

  // BOM & Budget
  const addBOMItem = (item: ProcurementItem) => {
    setBomItems(prev => [item, ...prev]);
    logAction(`Added procurement BOM item [${item.itemCode}]`, 'Procurement Module');
  };

  const updateBOMItemStatus = (id: string, status: ProcurementItem['status']) => {
    setBomItems(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
    logAction(`Updated BOM item status [${id}] to ${status}`, 'Procurement');
  };

  const updateBudget = (updatedBudget: ProjectBudget) => {
    setBudget(updatedBudget);
    logAction(`Updated project budget parameters`, 'Financials');
  };

  // Meetings
  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
    logAction(`Created meeting record [${meeting.title}]`, 'Meeting Minutes');
    audioEngine.playSound('meeting_reminder');
  };

  const extractAndCreateMeetingTasks = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    const createdTasks: Task[] = [];
    const updatedActionItems = meeting.actionItems.map(item => {
      if (item.createdTaskId) return item;

      const newTaskId = `task-meet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newTaskKey = `${selectedProject?.key || 'PRJ'}-${Math.floor(100 + Math.random() * 900)}`;

      const newTask: Task = {
        id: newTaskId,
        key: newTaskKey,
        title: item.taskTitle,
        description: `Action item extracted from meeting: "${meeting.title}" on ${meeting.date}`,
        projectId: selectedProjectId,
        workstream: 'Integration',
        type: 'Meeting Action Item',
        priority: 'High',
        status: 'Selected',
        assigneeId: item.assigneeId,
        reporterId: currentUser.id,
        startDate: meeting.date,
        dueDate: item.dueDate,
        estimatedHours: 16,
        actualHours: 0,
        storyPoints: 5,
        labels: ['Meeting Action', 'AI Extracted'],
        dependencies: [],
        checklist: [{ id: `c-${Date.now()}`, text: 'Execute agreed meeting action', completed: false }],
        acceptanceCriteria: ['Action item delivered per meeting agreement'],
        comments: [],
        activityLog: [
          {
            id: `act-${Date.now()}`,
            userId: currentUser.id,
            action: `Extracted and created from meeting: ${meeting.title}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          },
        ],
        approvalStatus: 'none',
        progress: 0,
      };

      createdTasks.push(newTask);
      return { ...item, createdTaskId: newTaskId };
    });

    if (createdTasks.length > 0) {
      batchAddTasks(createdTasks);
      setMeetings(prev =>
        prev.map(m => (m.id === meetingId ? { ...m, actionItems: updatedActionItems } : m))
      );
      logAction(`Extracted and created ${createdTasks.length} tasks from meeting "${meeting.title}"`, 'AI Meeting Assistant');
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const snoozeNotification = (id: string, durationMinutes: number) => {
    const snoozeTime = new Date(Date.now() + durationMinutes * 60000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              read: true,
              snoozedUntil: snoozeTime,
            }
          : n
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const triggerNotification = (item: Partial<NotificationItem>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      category: item.category || 'system',
      severity: item.severity || 'info',
      title: item.title || 'System Notification',
      message: item.message || '',
      timestamp: 'Just now',
      read: false,
      referenceType: item.referenceType,
      referenceId: item.referenceId,
      soundEffect: item.soundEffect || 'direct_message',
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Play appropriate sound
    if (newNotif.severity === 'emergency') {
      audioEngine.playSound('emergency_alarm');
      setIsEmergencyAlarmActive(true);
    } else if (newNotif.severity === 'critical') {
      audioEngine.playSound('critical_risk');
    } else if (newNotif.severity === 'warning') {
      audioEngine.playSound('deadline_warning');
    } else if (newNotif.severity === 'success') {
      audioEngine.playSound('approval_result');
    } else {
      audioEngine.playSound('direct_message');
    }

    // Trigger Native Browser Desktop Notification if supported & enabled
    if (
      notificationPreferences.browserDesktopEnabled &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      const displayTitle = item.title || 'ProjectFlow AI Alert';
      const displayBody = notificationPreferences.privacyMode
        ? 'You have a new project notification (details protected by Privacy Mode).'
        : item.message || '';

      try {
        new Notification(displayTitle, {
          body: displayBody,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Desktop notification error:', e);
      }
    }
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => {
      const updated = { ...prev, ...prefs };
      return updated;
    });
  };

  // Real-Time Chat System
  const sendMessage = (
    conversationId: string,
    text: string,
    attachments?: MessageAttachment[],
    replyToMessageId?: string,
    voiceNote?: VoiceNote,
    mentions?: string[],
    linkedTaskId?: string,
    linkedProjectId?: string
  ) => {
    const replyTarget = replyToMessageId ? messages.find(m => m.id === replyToMessageId) : undefined;
    const replySnippet = replyTarget
      ? {
          id: replyTarget.id,
          senderName: users.find(u => u.id === replyTarget.senderId)?.name || 'User',
          text: replyTarget.text.substring(0, 80),
        }
      : undefined;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      messageType: voiceNote ? 'voice' : attachments && attachments.length > 0 ? 'file' : 'text',
      text: text.trim(),
      replyToMessageId,
      replyToSnippet: replySnippet,
      attachments,
      voiceNote,
      reactions: [],
      mentions,
      linkedTaskId,
      linkedProjectId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      receipts: [{ userId: currentUser.id, readAt: 'Just now' }],
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation lastMessage & timestamp
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              updatedAt: 'Just now',
              lastMessage: {
                text: text || (voiceNote ? '🎤 Voice Message' : '📎 Attachment'),
                senderId: currentUser.id,
                senderName: currentUser.name,
                createdAt: 'Just now',
              },
            }
          : c
      )
    );

    // Audio Playback
    if (mentions && mentions.length > 0) {
      audioEngine.playSound('mention');
    } else {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv?.type === 'direct') {
        audioEngine.playSound('direct_message');
      } else {
        audioEngine.playSound('channel_message');
      }
    }

    // AI Assistant Auto-Responder if chatting with FlowPilot AI
    if (conversationId === 'conv-ai-flowpilot') {
      setTimeout(() => {
        handleAIAssistantResponse(text);
      }, 700);
    }
  };

  const handleAIAssistantResponse = (userPrompt: string) => {
    const p = userPrompt.toLowerCase();
    let replyText = '';

    if (p.includes('overdue') || p.includes('late')) {
      const overdueList = tasks.filter(t => t.status === 'Blocked' || t.priority === 'Critical');
      replyText = `**FlowPilot Overdue & High-Risk Tasks Analysis:**\n\n- **BMP2-104 (Hydraulic Platform):** Blocked pending Moog Series 760 delivery.\n- **BMP2-102 (Ballistics Integrator):** Critical path testing ongoing.\n\nEscalation status: Team Lead & Hardware Head alerted.`;
    } else if (p.includes('cost') || p.includes('rupee') || p.includes('manpower') || p.includes('salary')) {
      replyText = `**Current Monthly Manpower Expenditure (INR):**\n\n- **Software & Simulation (3 Devs):** ₹3,10,000 / month\n- **3D Art & Terrain (2 Artists):** ₹2,45,000 / month\n- **Hardware & Embedded (2 Engineers):** ₹2,95,000 / month\n- **Mechanical & Motion (1 Lead):** ₹1,65,000 / month\n- **QA & HIL (1 Lead):** ₹1,45,000 / month\n- **Delivery Leadership:** ₹2,20,000 / month\n\n💰 **Total Program Manpower Run-Rate:** **₹13,80,000 / month** (₹1.38 Lakhs/mo under target cap).`;
    } else if (p.includes('overload') || p.includes('capacity')) {
      replyText = `**Multi-Project Workload Report:**\n\n- **Vikram Malhotra:** 100% (80% BMP-II + 20% Drone Swarm) 🟡 High\n- **Kavita Sharma:** 100% (70% BMP-II + 30% Drone Swarm) 🟡 High\n- **Elena Rostova:** 100% (100% BMP-II) 🟢 Optimal\n\nRecommendation: Rebalance Drone Swarm shader optimization to Trainee Arjun Das.`;
    } else if (p.includes('summarize') || p.includes('standup')) {
      replyText = `**Daily Stand-Up Synthesis for Delivery Head Sarah Jenkins:**\n\n1. **Completed:** C# 4th order ballistics trajectory verified with 0.3 mil military accuracy.\n2. **In Progress:** 24V MIL-DTL wiring harness continuity testing.\n3. **Blockers:** Moog proportional valve delivery tracked for Aug 22 (Bengaluru Cargo Hub).\n4. **Upcoming Milestone:** Full Cockpit HIL Integration (Sep 1).`;
    } else {
      replyText = `I have processed your query across the **Edgeforce Defense Simulation Knowledge Graph**.\n\nAll **9 workstreams** are active. Program Budget is healthy at **₹5.40 Crores (+18% GST)**. You can ask me to draft announcements, check employee reporting trees, or convert chat threads into tasks!`;
    }

    const aiMessage: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      conversationId: 'conv-ai-flowpilot',
      senderId: 'usr-ai',
      messageType: 'ai_response',
      text: replyText,
      reactions: [{ emoji: '💡', userIds: ['usr-1'] }],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, aiMessage]);
    audioEngine.playSound('ai_recommendation');
  };

  const editMessage = (messageId: string, newText: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
              ...m,
              text: newText,
              editedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : m
      )
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
              ...m,
              text: '🚫 This message was deleted by user.',
              deletedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : m
      )
    );
  };

  const reactToMessage = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== messageId) return m;

        const existingReaction = m.reactions.find(r => r.emoji === emoji);
        let updatedReactions = [...m.reactions];

        if (existingReaction) {
          if (existingReaction.userIds.includes(currentUser.id)) {
            // Remove user reaction
            updatedReactions = updatedReactions
              .map(r =>
                r.emoji === emoji
                  ? { ...r, userIds: r.userIds.filter(id => id !== currentUser.id) }
                  : r
              )
              .filter(r => r.userIds.length > 0);
          } else {
            // Add user to existing reaction
            updatedReactions = updatedReactions.map(r =>
              r.emoji === emoji ? { ...r, userIds: [...r.userIds, currentUser.id] } : r
            );
          }
        } else {
          // Add new emoji reaction
          updatedReactions.push({ emoji, userIds: [currentUser.id] });
        }

        return { ...m, reactions: updatedReactions };
      })
    );
  };

  const pinMessage = (conversationId: string, messageId: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, pinned: !m.pinned } : m))
    );
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        const currentPins = c.pinnedMessageIds || [];
        const updatedPins = currentPins.includes(messageId)
          ? currentPins.filter(id => id !== messageId)
          : [...currentPins, messageId];
        return { ...c, pinnedMessageIds: updatedPins };
      })
    );
  };

  const starMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== messageId) return m;
        const currentStars = m.starredByUserIds || [];
        const updatedStars = currentStars.includes(currentUser.id)
          ? currentStars.filter(id => id !== currentUser.id)
          : [...currentStars, currentUser.id];
        return { ...m, starredByUserIds: updatedStars };
      })
    );
  };

  const forwardMessage = (messageId: string, targetConversationId: string) => {
    const targetMsg = messages.find(m => m.id === messageId);
    if (!targetMsg) return;

    const forwarded: ChatMessage = {
      id: `msg-fwd-${Date.now()}`,
      conversationId: targetConversationId,
      senderId: currentUser.id,
      messageType: targetMsg.messageType,
      text: targetMsg.text,
      attachments: targetMsg.attachments,
      voiceNote: targetMsg.voiceNote,
      reactions: [],
      isForwarded: true,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, forwarded]);
    audioEngine.playSound('channel_message');
  };

  const createConversation = (newConv: Partial<Conversation>): string => {
    const id = `conv-cust-${Date.now()}`;
    const fullConv: Conversation = {
      id,
      type: newConv.type || 'group',
      name: newConv.name || 'New Conversation',
      description: newConv.description,
      projectId: newConv.projectId,
      taskId: newConv.taskId,
      departmentId: newConv.departmentId,
      teamId: newConv.teamId,
      memberIds: newConv.memberIds || [currentUser.id],
      isPrivate: newConv.isPrivate || false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: 'Just now',
    };

    setConversations(prev => [fullConv, ...prev]);
    setActiveConversationId(id);
    return id;
  };

  const toggleMinimizeChat = (conversationId: string) => {
    setMinimizedChatIds(prev =>
      prev.includes(conversationId)
        ? prev.filter(id => id !== conversationId)
        : [...prev.slice(-2), conversationId]
    );
  };

  const closeMinimizedChat = (conversationId: string) => {
    setMinimizedChatIds(prev => prev.filter(id => id !== conversationId));
  };

  const convertMessageToTask = (
    message: ChatMessage,
    title: string,
    projectId: string,
    workstream: WorkstreamType,
    assigneeId: string,
    priority: TaskPriority
  ) => {
    const targetProj = projects.find(p => p.id === projectId) || projects[0];
    const newTaskKey = `${targetProj.key}-${Math.floor(100 + Math.random() * 900)}`;

    const newTask: Task = {
      id: `task-chat-${Date.now()}`,
      key: newTaskKey,
      title: title.trim(),
      description: `Converted from chat message by ${users.find(u => u.id === message.senderId)?.name || 'User'}:\n\n"${message.text}"`,
      projectId,
      workstream,
      type: 'Task',
      priority,
      status: 'Selected',
      assigneeId,
      reporterId: currentUser.id,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: 24,
      actualHours: 0,
      storyPoints: 5,
      labels: ['Chat Converted', workstream],
      dependencies: [],
      checklist: [{ id: `c-${Date.now()}`, text: 'Execute requirement discussed in chat', completed: false }],
      acceptanceCriteria: ['Deliver requirement discussed in chat'],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          action: 'Converted from chat message',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
      approvalStatus: 'none',
      progress: 0,
    };

    addTask(newTask);

    // Send acknowledgement in the chat
    sendMessage(
      message.conversationId,
      `✅ Converted message into Task **${newTask.key}: ${newTask.title}** assigned to **${users.find(u => u.id === assigneeId)?.name}**.`,
      undefined,
      message.id
    );
  };

  // Emergency Siren Controls
  const triggerEmergencyAlert = (title: string, message: string) => {
    triggerNotification({
      category: 'system',
      severity: 'emergency',
      title: `🚨 EMERGENCY: ${title}`,
      message,
    });
  };

  const stopEmergencyAlarm = () => {
    audioEngine.stopEmergencyAlarm();
    setIsEmergencyAlarmActive(false);
  };

  const playNotificationSound = (effect: SoundEffectType) => {
    audioEngine.playSound(effect);
  };

  const unlockAudio = () => {
    audioEngine.unlockAudio();
  };

  // Alert Escalation Hierarchy Engine
  const triggerAlertEscalation = (taskId: string, reason?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const assignee = users.find(u => u.id === task.assigneeId);
    const teamLead = users.find(u => u.id === assignee?.functionalManagerId) || users[2];
    const projectLead = users.find(u => u.id === selectedProject?.projectManagerId) || users[1];

    const newEscalation: AlertEscalationRecord = {
      id: `esc-${Date.now()}`,
      taskId: task.id,
      taskKey: task.key,
      taskTitle: task.title,
      projectId: task.projectId,
      projectName: selectedProject?.name || 'Project',
      severity: 'critical',
      stage: 2, // Escalated to Team Lead
      stageLabel: 'Stage 2: Team Lead & Engineering Head',
      escalatedToUserId: teamLead.id,
      escalatedToUserName: teamLead.name,
      escalatedToRole: teamLead.designation,
      triggeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      overdueDays: 1,
      reason: reason || 'Task flagged as blocked or milestone buffer risk',
      isAcknowledged: false,
      isResolved: false,
    };

    setAlertEscalations(prev => [newEscalation, ...prev]);

    triggerNotification({
      category: 'risks',
      severity: 'critical',
      title: `⚠️ Alert Escalation: ${task.key} at Stage 2`,
      message: `Escalated to ${teamLead.name} (${teamLead.designation}) due to: ${newEscalation.reason}`,
      referenceType: 'task',
      referenceId: task.id,
      soundEffect: 'critical_risk',
    });
  };

  const acknowledgeEscalation = (id: string) => {
    setAlertEscalations(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              isAcknowledged: true,
              acknowledgedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              acknowledgedBy: currentUser.name,
            }
          : e
      )
    );
    logAction(`Acknowledged alert escalation ID [${id}]`, 'Alert Escalation Hub');
    audioEngine.playSound('approval_result');
  };

  const resolveEscalation = (id: string) => {
    setAlertEscalations(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              isResolved: true,
              resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : e
      )
    );
    logAction(`Resolved alert escalation ID [${id}]`, 'Alert Escalation Hub');
    audioEngine.playSound('approval_result');
  };

  const logAction = (action: string, target: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      target,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ipAddress: '103.24.88.' + Math.floor(10 + Math.random() * 80) + ' (Bengaluru)',
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // AI Safety Execution
  const executePendingAIAction = () => {
    if (!pendingAIAction) return;

    if (pendingAIAction.type === 'create_project' && pendingAIAction.proposedChanges?.project) {
      addProject(pendingAIAction.proposedChanges.project);
      if (pendingAIAction.proposedChanges.tasks?.length) {
        batchAddTasks(pendingAIAction.proposedChanges.tasks);
      }
      if (pendingAIAction.proposedChanges.sprints?.length) {
        pendingAIAction.proposedChanges.sprints.forEach((s: Sprint) => addSprint(s));
      }
    } else if (pendingAIAction.type === 'create_tasks' && pendingAIAction.proposedChanges?.tasks) {
      batchAddTasks(pendingAIAction.proposedChanges.tasks);
    }

    logAction(`Executed AI action: ${pendingAIAction.title}`, 'AI Agent Hub');
    setPendingAIAction(null);
  };

  // Org Settings
  const updateOrgSettings = (settings: Partial<OrgSettings>) => {
    setOrgSettings(prev => ({ ...prev, ...settings }));
    logAction('Updated organization onboarding settings', 'Administration');
  };

  // Reset Workspace & Session (Full Fresh Wipe)
  const resetToDemoData = () => {
    localStorage.removeItem('projectflow_auth');
    localStorage.removeItem('projectflow_users');
    localStorage.removeItem('projectflow_projects');
    localStorage.removeItem('projectflow_tasks');
    localStorage.removeItem('projectflow_org');
    localStorage.removeItem('projectflow_token');
    localStorage.removeItem('google_client_id');
    setIsAuthenticated(false);
    setUsers([]);
    setCurrentUser(DEFAULT_USER);
    setActiveRole('Super Admin');
    setProjects([]);
    setSelectedProjectId('');
    setEpics([]);
    setTasks([]);
    setSprints([]);
    setTimesheets([]);
    setRequirements([]);
    setTestCases([]);
    setBugs([]);
    setBomItems([]);
    setBudget({
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
    });
    setMeetings([]);
    setNotifications([]);
    setConversations([]);
    setMessages([]);
    setAlertEscalations([]);
    setAuditLogs([]);
    setActiveTimer(null);
    setIsEmergencyAlarmActive(false);
    audioEngine.stopEmergencyAlarm();
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
        isAuthenticated,
        loginWithEmail,
        loginWithGoogle,
        registerOrganization,
        registerWithInvite,
        logout,
        currentUser,
        activeRole,
        users,
        teams,
        isGoogleAuthModalOpen,
        setIsGoogleAuthModalOpen,
        loginWithGoogleUser,
        switchRole,
        updateUser,
        projects,
        selectedProjectId,
        selectedProject,
        setSelectedProjectId,
        addProject,
        updateProject,
        deleteProject,
        epics,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        batchAddTasks,
        duplicateTask,
        sprints,
        addSprint,
        updateSprint,
        completeSprint,
        timesheets,
        activeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopAndLogTimer,
        addTimesheetEntry,
        approveTimesheet,
        requirements,
        addRequirement,
        updateRequirement,
        testCases,
        updateTestCaseStatus,
        bugs,
        addBug,
        updateBug,
        bomItems,
        addBOMItem,
        updateBOMItemStatus,
        budget,
        updateBudget,
        meetings,
        addMeeting,
        extractAndCreateMeetingTasks,
        notifications,
        notificationPreferences,
        isNotificationCentreOpen,
        setIsNotificationCentreOpen,
        isNotificationSettingsOpen,
        setIsNotificationSettingsOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        snoozeNotification,
        deleteNotification,
        triggerNotification,
        updateNotificationPreferences,
        auditLogs,
        logAction,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        minimizedChatIds,
        toggleMinimizeChat,
        closeMinimizedChat,
        sendMessage,
        editMessage,
        deleteMessage,
        reactToMessage,
        pinMessage,
        starMessage,
        forwardMessage,
        createConversation,
        convertMessageToTask,
        isEmergencyAlarmActive,
        stopEmergencyAlarm,
        triggerEmergencyAlert,
        playNotificationSound,
        unlockAudio,
        alertEscalations,
        triggerAlertEscalation,
        acknowledgeEscalation,
        resolveEscalation,
        pendingAIAction,
        setPendingAIAction,
        executePendingAIAction,
        orgSettings,
        updateOrgSettings,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
