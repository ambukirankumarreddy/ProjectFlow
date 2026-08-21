import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Authentication & Registration Pages
import { AuthPage } from './components/auth/AuthPage';

// Dashboards & Boards
import { DashboardHub } from './components/dashboard/DashboardHub';
import { PersonalDashboard } from './components/dashboard/PersonalDashboard';
import { KanbanBoard } from './components/boards/KanbanBoard';
import { ScrumBoard } from './components/boards/ScrumBoard';
import { GanttRoadmap } from './components/gantt/GanttRoadmap';

// Projects & Tasks
import { ProjectListView } from './components/projects/ProjectListView';
import { TaskListView } from './components/tasks/TaskListView';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { CreateProjectModal } from './components/projects/CreateProjectModal';

// Multidisciplinary Engineering & Manpower
import { ManpowerHub } from './components/manpower/ManpowerHub';
import { TimesheetView } from './components/timesheets/TimesheetView';
import { TraceabilityMatrix } from './components/requirements/TraceabilityMatrix';
import { QAHub } from './components/qa/QAHub';
import { BOMManagement } from './components/procurement/BOMManagement';
import { ProjectBudgetView } from './components/budget/ProjectBudgetView';
import { MeetingMinutesView } from './components/meetings/MeetingMinutesView';

// Real-Time Chat & Alert Escalations
import { ChatHub } from './components/chat/ChatHub';
import { FloatingChatDock } from './components/chat/FloatingChatDock';
import { AlertEscalationView } from './components/alerts/AlertEscalationView';
import { NotificationCentreModal } from './components/notifications/NotificationCentreModal';
import { NotificationSettingsModal } from './components/notifications/NotificationSettingsModal';
import { EmergencyBanner } from './components/notifications/EmergencyBanner';

// AI Hub & Drawer
import { AIAgentHub } from './components/ai/AIAgentHub';
import { AICopilotDrawer } from './components/ai/AICopilotDrawer';
import { AISafetyModal } from './components/ai/AISafetyModal';

// Administration & Security
import { OrgOnboardingWizard } from './components/admin/OrgOnboardingWizard';
import { WorkflowBuilder } from './components/admin/WorkflowBuilder';
import { AuditLogsView } from './components/admin/AuditLogsView';

import { Task } from './types';

export const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentView,
    setCurrentView,
    isNotificationCentreOpen,
    setIsNotificationCentreOpen,
    isNotificationSettingsOpen,
    setIsNotificationSettingsOpen
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  // If user is not signed in, show dedicated Auth & Registration Portal
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHub />;
      case 'my-work':
        return <PersonalDashboard />;
      case 'chat':
        return <ChatHub />;
      case 'projects':
        return <ProjectListView onOpenCreateProject={() => setIsCreateProjectOpen(true)} />;
      case 'tasks':
        return (
          <TaskListView
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onSelectTask={t => setSelectedTaskDetail(t)}
          />
        );
      case 'kanban':
        return (
          <KanbanBoard
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onSelectTask={t => setSelectedTaskDetail(t)}
          />
        );
      case 'scrum':
        return (
          <ScrumBoard
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onSelectTask={t => setSelectedTaskDetail(t)}
          />
        );
      case 'roadmap':
        return <GanttRoadmap />;
      case 'manpower':
      case 'resources':
        return <ManpowerHub />;
      case 'alert-escalations':
        return <AlertEscalationView />;
      case 'requirements':
        return <TraceabilityMatrix />;
      case 'qa':
        return <QAHub />;
      case 'procurement':
        return <BOMManagement />;
      case 'timesheets':
        return <TimesheetView />;
      case 'ai-copilot':
        return <AIAgentHub />;
      case 'meetings':
        return <MeetingMinutesView />;
      case 'budget':
        return <ProjectBudgetView />;
      case 'reports':
        return <AIAgentHub />;
      case 'workflow-builder':
        return <WorkflowBuilder />;
      case 'onboarding':
        return <OrgOnboardingWizard />;
      case 'audit-logs':
        return <AuditLogsView />;
      default:
        return <DashboardHub />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080d17] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onSelectView={setCurrentView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Emergency Alert Flashing Siren Banner */}
        <EmergencyBanner />

        {/* Top Navbar */}
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAICopilot={() => setIsAICopilotOpen(true)}
          onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderView()}
        </main>
      </div>

      {/* Persistent Floating Chat Dock (on every screen) */}
      <FloatingChatDock />

      {/* Global Modals & Drawers */}
      <NotificationCentreModal
        isOpen={isNotificationCentreOpen}
        onClose={() => setIsNotificationCentreOpen(false)}
      />
      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AICopilotDrawer isOpen={isAICopilotOpen} onClose={() => setIsAICopilotOpen(false)} />
      <CreateTaskModal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} />
      <CreateProjectModal isOpen={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} />
      <TaskDetailModal task={selectedTaskDetail} onClose={() => setSelectedTaskDetail(null)} />
      <AISafetyModal />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
