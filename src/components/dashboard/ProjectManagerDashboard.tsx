import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/formatters';
import {
  FolderKanban,
  Repeat,
  AlertTriangle,
  Users,
  IndianRupee,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

export const ProjectManagerDashboard: React.FC = () => {
  const { selectedProject, tasks, sprints, users, budget, bomItems, setCurrentView } = useApp();

  const activeSprint = sprints.find(s => s.status === 'active') || sprints[0];
  const blockedTasks = tasks.filter(t => t.status === 'Blocked');
  const delayedTasks = tasks.filter(
    t => t.status !== 'Completed' && new Date(t.dueDate) < new Date('2026-08-22')
  );

  // Status breakdown
  const statusCounts = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#10b981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#0e8ce9' },
    { name: 'Review / QA', value: tasks.filter(t => t.status === 'Review' || t.status === 'Testing').length, color: '#f59e0b' },
    { name: 'Blocked', value: blockedTasks.length, color: '#ef4444' },
    { name: 'Backlog / Selected', value: tasks.filter(t => t.status === 'Backlog' || t.status === 'Selected').length, color: '#64748b' },
  ];

  // Workstream progress
  const workstreamData = selectedProject?.modules.map(m => ({
    name: m.name.length > 18 ? m.name.substring(0, 18) + '...' : m.name,
    stream: m.workstream,
    progress: m.progress,
    status: m.status,
  })) || [
    { name: '3D Assets', stream: '3D Modelling', progress: 75, status: 'In Progress' },
    { name: 'Physics Engine', stream: 'Software', progress: 60, status: 'In Progress' },
    { name: 'CAN Bus I/O', stream: 'Hardware', progress: 50, status: 'In Progress' },
    { name: 'Hydraulic Base', stream: 'Mechanical', progress: 35, status: 'Delayed' },
    { name: 'Wiring Harness', stream: 'Electrical', progress: 65, status: 'In Progress' },
  ];

  const budgetBurnPercent = Math.round(((budget.actualSpendINR || 0) / (budget.totalBudgetINR || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Project Summary */}
      <div className="glass-card p-6 rounded-2xl border bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-brand-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-400 font-extrabold text-xs border border-brand-500/30">
                {selectedProject?.key}
              </span>
              <h2 className="text-xl font-extrabold text-slate-100">
                {selectedProject?.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {selectedProject?.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Overall Progress
              </span>
              <span className="text-xl font-black text-brand-400">
                {selectedProject?.progress}%
              </span>
            </div>
            <div className="w-20 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedProject?.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Sprint Progress"
          value={`${activeSprint.completedPoints} / ${activeSprint.plannedPoints} pts`}
          subtitle={activeSprint.name}
          badgeText="Sprint Active"
          icon={Repeat}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
        />
        <MetricCard
          title="Project Health & Risk"
          value={`${100 - (selectedProject?.riskScore || 0)} / 100`}
          subtitle={`${selectedProject?.riskScore}% Risk Factor`}
          icon={ShieldAlert}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <MetricCard
          title="Blocked Deliverables"
          value={blockedTasks.length}
          subtitle={blockedTasks.length > 0 ? 'Hydraulic valve procurement lag' : 'No blockers'}
          icon={AlertTriangle}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
        <MetricCard
          title="Budget Utilization (INR)"
          value={formatINR(budget.actualSpendINR)}
          subtitle={`${budgetBurnPercent}% of ${formatINR(budget.totalBudgetINR)} consumed`}
          icon={IndianRupee}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
      </div>

      {/* AI Risk Prediction & Health Insight Card */}
      <div className="glass-card p-5 rounded-2xl border border-amber-500/40 bg-amber-950/20">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                FlowPilot AI Risk Forecast & Recovery Recommendation
              </h4>
              <Badge variant="warning" size="sm">
                Action Required
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {selectedProject?.aiHealthInsight ||
                'Mechanical motion platform is on critical path with a 6-day lag risk due to hydraulic valve delay. Recommended action: Parallelize electrical harness testing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Workstream Progress & Task Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Workstream Hierarchy Progress */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Multi-Disciplinary Workstream Delivery
              </h3>
              <p className="text-xs text-slate-400">
                Software, 3D Modelling, Hardware, Mechanical & Electrical streams
              </p>
            </div>
            <button
              onClick={() => setCurrentView('projects')}
              className="text-xs text-brand-400 hover:underline font-semibold"
            >
              View WBS Hierarchy
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {workstreamData.map((ws, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{ws.name}</span>
                    <Badge variant="neutral" size="sm">
                      {ws.stream}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300 font-mono">{ws.progress}%</span>
                    <Badge
                      variant={ws.status === 'Delayed' ? 'danger' : 'primary'}
                      size="sm"
                    >
                      {ws.status}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ws.status === 'Delayed'
                        ? 'bg-rose-500'
                        : ws.progress > 70
                        ? 'bg-emerald-500'
                        : 'bg-brand-500'
                    }`}
                    style={{ width: `${ws.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Task Status Donut */}
        <div className="glass-card p-5 rounded-2xl border flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">
              Task Status Distribution
            </h3>
            <p className="text-xs text-slate-400">Total {tasks.length} active work items</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
            {statusCounts.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-300">{s.name}</span>
                </div>
                <span className="font-bold text-slate-100 font-mono">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
