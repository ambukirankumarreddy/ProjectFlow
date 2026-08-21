import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, Sprint } from '../../types';
import { Badge } from '../common/Badge';
import confetti from 'canvas-confetti';
import {
  Repeat,
  Sparkles,
  CheckCircle,
  Plus,
  AlertTriangle,
  Calendar,
  Flame,
  Award,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const ScrumBoard: React.FC<{ onOpenCreateTask: () => void; onSelectTask: (t: Task) => void }> = ({
  onOpenCreateTask,
  onSelectTask,
}) => {
  const { sprints, tasks, selectedProject, completeSprint, moveTaskStatus, users } = useApp();
  const [activeSprintId, setActiveSprintId] = useState<string>(
    sprints.find(s => s.status === 'active')?.id || sprints[0]?.id || 'sprint-2'
  );

  const currentSprint = sprints.find(s => s.id === activeSprintId) || sprints[0];
  const sprintTasks = tasks.filter(t => t.sprintId === activeSprintId);

  // Story points breakdown
  const totalPlannedPoints = sprintTasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const completedPoints = sprintTasks
    .filter(t => t.status === 'Completed')
    .reduce((acc, t) => acc + (t.storyPoints || 0), 0);

  const isOverloaded = totalPlannedPoints > currentSprint.capacity;

  // Dynamic sprint burndown data
  const remainingPoints = totalPlannedPoints - completedPoints;
  const burndownData = [
    { day: 'Sprint Start', ideal: totalPlannedPoints, actual: totalPlannedPoints },
    { day: 'Mid-Sprint', ideal: Math.round(totalPlannedPoints * 0.5), actual: Math.max(0, Math.round(totalPlannedPoints * 0.6)) },
    { day: 'Current', ideal: Math.round(totalPlannedPoints * 0.25), actual: remainingPoints },
    { day: 'Sprint Goal', ideal: 0, actual: 0 },
  ];

  const handleCompleteSprint = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    completeSprint(activeSprintId);
  };

  return (
    <div className="space-y-6">
      {/* Sprint Header Banner */}
      <div className="glass-card p-6 rounded-2xl border bg-gradient-to-r from-brand-950/40 via-slate-900/80 to-purple-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
                <Repeat className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-100">
                    {currentSprint.name}
                  </h2>
                  <Badge
                    variant={
                      currentSprint.status === 'active'
                        ? 'primary'
                        : currentSprint.status === 'completed'
                        ? 'success'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {currentSprint.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  <span className="font-semibold text-slate-300">Goal: </span>
                  {currentSprint.objective}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sprint Selector Dropdown */}
            <select
              value={activeSprintId}
              onChange={e => setActiveSprintId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {sprints.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status})
                </option>
              ))}
            </select>

            {/* Complete Sprint Button */}
            {currentSprint.status === 'active' && (
              <button
                onClick={handleCompleteSprint}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Sprint</span>
              </button>
            )}

            <button
              onClick={onOpenCreateTask}
              className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add User Story</span>
            </button>
          </div>
        </div>

        {/* Capacity Warning */}
        {isOverloaded && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>
              <strong>Capacity Overload Detected:</strong> Planned points ({totalPlannedPoints} pts) exceed team sprint capacity ({currentSprint.capacity} pts). FlowPilot recommends moving lower priority stories to Backlog.
            </span>
          </div>
        )}
      </div>

      {/* Story Point Metrics & Burndown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Sprint Velocity & Capacity Card */}
        <div className="glass-card p-5 rounded-2xl border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Flame className="w-4 h-4 text-brand-400" />
            Sprint Story Points & Velocity
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Story Points Delivered:</span>
                <span className="font-bold text-slate-200">
                  {completedPoints} / {totalPlannedPoints} pts
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full"
                  style={{
                    width: `${totalPlannedPoints > 0 ? (completedPoints / totalPlannedPoints) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Team Capacity Limit:</span>
                <span className="font-semibold text-slate-200">{currentSprint.capacity} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sprint Timeline:</span>
                <span className="font-semibold text-slate-200">
                  {currentSprint.startDate} → {currentSprint.endDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Assessment:</span>
                <Badge
                  variant={currentSprint.riskLevel === 'low' ? 'success' : 'warning'}
                  size="sm"
                >
                  {currentSprint.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </div>

            {/* AI Sprint Summary */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs space-y-1">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Velocity Forecast:
              </span>
              <p className="text-slate-300 text-[11px]">
                {currentSprint.aiSummary ||
                  'Current sprint velocity is tracking at 4.2 pts/day. Expected completion on Aug 28.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Live Burndown Chart */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                Sprint Burndown Chart
              </h3>
              <p className="text-xs text-slate-400">Story points remaining vs Ideal guideline</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-0.5 bg-slate-500 inline-block" /> Ideal
              </span>
              <span className="flex items-center gap-1 text-brand-400 font-bold">
                <span className="w-3 h-0.5 bg-brand-500 inline-block" /> Actual
              </span>
            </div>
          </div>

          <div className="h-56 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burndownData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 60]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#0e8ce9"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0e8ce9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sprint Backlog Table */}
      <div className="glass-card p-5 rounded-2xl border">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">
            Sprint Task Backlog ({sprintTasks.length} Work Items)
          </h3>
          <span className="text-xs text-slate-400">
            {sprintTasks.filter(t => t.status === 'Completed').length} / {sprintTasks.length} Done
          </span>
        </div>

        <div className="divide-y divide-slate-800/60 mt-2">
          {sprintTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No tasks assigned to this sprint yet. Use "Add User Story" or assign from Backlog.
            </div>
          ) : (
            sprintTasks.map(task => {
              const assignee = users.find(u => u.id === task.assigneeId);
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-slate-800/40 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge variant="neutral" size="sm">
                      {task.key}
                    </Badge>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-brand-300 truncate">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{task.workstream}</span>
                        <span>•</span>
                        <span>{task.type}</span>
                        {assignee && (
                          <>
                            <span>•</span>
                            <span>{assignee.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/20">
                      {task.storyPoints} pts
                    </span>

                    <Badge
                      variant={
                        task.status === 'Completed'
                          ? 'success'
                          : task.status === 'Blocked'
                          ? 'danger'
                          : task.status === 'In Progress'
                          ? 'primary'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
