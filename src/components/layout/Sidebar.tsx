import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Kanban,
  Repeat,
  Milestone,
  FileCheck2,
  Bug,
  Cpu,
  Users2,
  Clock,
  Sparkles,
  Video,
  DollarSign,
  BarChart3,
  Settings,
  GitFork,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  Layers,
  MessageSquare,
  AlertTriangle,
  Flame
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { tasks, bugs, bomItems, activeRole, conversations, alertEscalations } = useApp();

  const openTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const activeBugsCount = bugs.filter(b => b.status !== 'Completed').length;
  const pendingBOMCount = bomItems.filter(b => b.status === 'Requested' || b.status === 'Ordered').length;
  const totalUnreadChat = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const activeEscalationsCount = alertEscalations.filter(e => !e.isResolved).length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      title: 'Core Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard Hub', icon: LayoutDashboard },
        { id: 'my-work', label: 'My Work & Plan', icon: ListTodo },
        {
          id: 'chat',
          label: 'Chat & Channels',
          icon: MessageSquare,
          badge: totalUnreadChat,
          badgeColor: 'bg-brand-500 text-white font-bold',
        },
        { id: 'projects', label: 'Projects & Hierarchy', icon: FolderKanban },
        {
          id: 'tasks',
          label: 'All Tasks',
          icon: CheckSquare,
          badge: openTasksCount,
          badgeColor: 'bg-brand-500/20 text-brand-300',
        },
      ],
    },
    {
      title: 'Agile Delivery',
      items: [
        { id: 'kanban', label: 'Kanban Board', icon: Kanban },
        { id: 'scrum', label: 'Scrum & Sprints', icon: Repeat },
        { id: 'roadmap', label: 'Gantt Roadmap', icon: Milestone },
      ],
    },
    {
      title: 'Simulator & Engineering',
      items: [
        { id: 'manpower', label: 'Manpower & Org Tree', icon: Users2 },
        {
          id: 'alert-escalations',
          label: 'Alert Escalations',
          icon: AlertTriangle,
          badge: activeEscalationsCount,
          badgeColor: 'bg-rose-500/20 text-rose-300',
        },
        { id: 'requirements', label: 'RFP Traceability', icon: FileCheck2 },
        {
          id: 'qa',
          label: 'QA & Bug Tracker',
          icon: Bug,
          badge: activeBugsCount,
          badgeColor: 'bg-rose-500/20 text-rose-300',
        },
        {
          id: 'procurement',
          label: 'Procurement / BOM',
          icon: Cpu,
          badge: pendingBOMCount,
          badgeColor: 'bg-amber-500/20 text-amber-300',
        },
        { id: 'timesheets', label: 'Timesheets & Timer', icon: Clock },
      ],
    },
    {
      title: 'Intelligence & Insights',
      items: [
        { id: 'ai-copilot', label: 'AI Agent Hub', icon: Sparkles, badgeColor: 'bg-purple-500/20 text-purple-300' },
        { id: 'meetings', label: 'Meeting Minutes AI', icon: Video },
        { id: 'budget', label: 'Budget & Costing', icon: DollarSign },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Administration',
      items: [
        { id: 'workflow-builder', label: 'Workflow Engine', icon: GitFork },
        { id: 'onboarding', label: 'Org Onboarding', icon: Settings },
        { id: 'audit-logs', label: 'Audit & Security', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 border-r border-slate-800/80 bg-[#070d18] flex flex-col transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-brand shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="font-extrabold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
                <span>ProjectFlow</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gradient-to-r from-brand-500 to-purple-500 text-white font-black uppercase">
                  AI
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                Jira-Grade Enterprise Platform
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
        {navSections.map(section => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Role / Org Pill */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="truncate flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-slate-200 truncate">
                Role: {activeRole}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Audio & Real-Time Sync</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
