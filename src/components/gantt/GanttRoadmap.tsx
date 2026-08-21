import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Milestone,
  Calendar,
  Layers,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  Filter,
  Eye
} from 'lucide-react';

export const GanttRoadmap: React.FC = () => {
  const { selectedProject, tasks, users } = useApp();
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [timeframe, setTimeframe] = useState<'weeks' | 'months'>('weeks');
  const [selectedStream, setSelectedStream] = useState<string>('All');

  const workstreams = [
    'All',
    '3D Modelling',
    'Software',
    'Hardware',
    'Mechanical',
    'Electrical',
    'Testing',
    'Integration'
  ];

  // Timeline spans from Aug 1, 2026 to Nov 30, 2026 (120-day project)
  const timelineWeeks = [
    { label: 'W1 (Aug 1)', date: '2026-08-01' },
    { label: 'W2 (Aug 8)', date: '2026-08-08' },
    { label: 'W3 (Aug 15)', date: '2026-08-15' },
    { label: 'W4 (Aug 22)', date: '2026-08-22' },
    { label: 'W5 (Aug 29)', date: '2026-08-29' },
    { label: 'W6 (Sep 5)', date: '2026-09-05' },
    { label: 'W7 (Sep 12)', date: '2026-09-12' },
    { label: 'W8 (Sep 19)', date: '2026-09-19' },
    { label: 'W9 (Sep 26)', date: '2026-09-26' },
    { label: 'W10 (Oct 3)', date: '2026-10-03' },
    { label: 'W11 (Oct 10)', date: '2026-10-10' },
    { label: 'W12 (Oct 17)', date: '2026-10-17' },
    { label: 'W13 (Oct 24)', date: '2026-10-24' },
    { label: 'W14 (Oct 31)', date: '2026-10-31' },
    { label: 'W15 (Nov 7)', date: '2026-11-07' },
    { label: 'W16 (Nov 14)', date: '2026-11-14' },
  ];

  const filteredTasks = tasks.filter(
    t => selectedStream === 'All' || t.workstream === selectedStream
  );

  // Helper to map date to timeline percentage (Aug 1 - Nov 30 = 120 days)
  const projectStartDate = new Date('2026-08-01').getTime();
  const projectTotalDays = 120;

  const getPositionStyles = (startDate: string, dueDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(dueDate).getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    const startOffsetDays = Math.max(0, Math.round((start - projectStartDate) / dayMs));
    const durationDays = Math.max(5, Math.round((end - start) / dayMs));

    const leftPercent = (startOffsetDays / projectTotalDays) * 100;
    const widthPercent = Math.min(100 - leftPercent, (durationDays / projectTotalDays) * 100);

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 5)}%`,
    };
  };

  const exportRoadmap = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Project Roadmap & Gantt Schedule</span>
            <Badge variant="purple" size="sm">
              Critical Path Active
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            120-Day baseline vs actual schedule for {selectedProject?.name}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Workstream Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedStream}
              onChange={e => setSelectedStream(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none pr-2 py-0.5 cursor-pointer"
            >
              {workstreams.map(w => (
                <option key={w} value={w} className="bg-slate-900 text-slate-200">
                  {w} {w === 'All' ? 'Streams' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Critical Path Toggle */}
          <button
            onClick={() => setShowCriticalPath(!showCriticalPath)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              showCriticalPath
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Critical Path</span>
          </button>

          {/* Export Roadmap */}
          <button
            onClick={exportRoadmap}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* Critical Path Alert */}
      {showCriticalPath && (
        <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              {tasks.some(t => t.priority === 'Critical' && t.status !== 'Completed') ? (
                <>
                  <strong>Critical Path Bottleneck:</strong> "
                  {tasks.find(t => t.priority === 'Critical' && t.status !== 'Completed')?.title}" (
                  {tasks.find(t => t.priority === 'Critical' && t.status !== 'Completed')?.key}) is on the critical chain. Immediate resolution advised.
                </>
              ) : (
                <>
                  <strong>Critical Chain Status:</strong> All active milestones and tasks are currently tracking within target delivery windows.
                </>
              )}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono text-[10px] font-bold">
            {tasks.some(t => t.priority === 'Critical' && t.status !== 'Completed') ? 'Slack: 0 Days' : 'Buffer Nominal'}
          </span>
        </div>
      )}

      {/* Gantt Matrix Container */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        {/* Timeline Header Scale */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 text-xs font-bold text-slate-400">
          <div className="w-80 p-3 border-r border-slate-800 shrink-0">
            Workstream & Task Hierarchy
          </div>
          <div className="flex-1 flex overflow-x-auto min-w-[700px]">
            {timelineWeeks.map((week, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[70px] p-2.5 text-center text-[10px] border-r border-slate-800/80 font-mono truncate"
              >
                {week.label}
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        <div className="divide-y divide-slate-800/60 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
          {filteredTasks.map(task => {
            const assignee = users.find(u => u.id === task.assigneeId);
            const pos = getPositionStyles(task.startDate, task.dueDate);
            const isCritical = task.priority === 'Critical';

            return (
              <div key={task.id} className="flex hover:bg-slate-800/30 transition-colors group">
                {/* Left Task Name Column */}
                <div className="w-80 p-3 border-r border-slate-800 shrink-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {task.key}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {task.workstream}
                    </Badge>
                    {isCritical && showCriticalPath && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-brand-300">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>{task.startDate}</span>
                    <span>→</span>
                    <span>{task.dueDate}</span>
                    {assignee && <span>• {assignee.name.split(' ')[0]}</span>}
                  </div>
                </div>

                {/* Right Timeline Bar Area */}
                <div className="flex-1 relative min-w-[700px] flex items-center px-2 py-3">
                  {/* Background grid vertical lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {timelineWeeks.map((_, i) => (
                      <div key={i} className="flex-1 border-r border-slate-800/40" />
                    ))}
                  </div>

                  {/* Gantt Bar Element */}
                  <div
                    className={`absolute h-7 rounded-lg flex items-center px-2 shadow-sm text-xs transition-all ${
                      task.status === 'Completed'
                        ? 'bg-emerald-600/80 border border-emerald-500 text-white'
                        : task.status === 'Blocked'
                        ? 'bg-rose-600/80 border border-rose-500 text-white animate-pulse'
                        : isCritical && showCriticalPath
                        ? 'bg-gradient-to-r from-amber-600 to-rose-600 border border-rose-400 text-white'
                        : 'bg-brand-600/80 border border-brand-400 text-white'
                    }`}
                    style={pos}
                    title={`${task.title} (${task.status}) - ${task.startDate} to ${task.dueDate}`}
                  >
                    {/* Inner progress fill */}
                    {task.progress > 0 && task.progress < 100 && (
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-white/20 rounded-l-lg pointer-events-none"
                        style={{ width: `${task.progress}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between w-full text-[10px] font-bold truncate">
                      <span className="truncate pr-1">{task.key}</span>
                      <span>{task.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
