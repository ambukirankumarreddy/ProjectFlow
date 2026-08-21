import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, WorkstreamType } from '../../types';
import { Badge } from '../common/Badge';
import {
  Plus,
  Filter,
  Layers,
  Clock,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Play,
  Search,
  Sparkles
} from 'lucide-react';

export const KanbanBoard: React.FC<{ onOpenCreateTask: () => void; onSelectTask: (t: Task) => void }> = ({
  onOpenCreateTask,
  onSelectTask,
}) => {
  const { tasks, moveTaskStatus, users, startTimer } = useApp();
  const [selectedWorkstream, setSelectedWorkstream] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns: { id: TaskStatus; title: string; color: string; limit?: number }[] = [
    { id: 'Backlog', title: 'Backlog', color: 'border-slate-700 text-slate-400' },
    { id: 'Selected', title: 'Selected for Dev', color: 'border-cyan-500/40 text-cyan-300' },
    { id: 'In Progress', title: 'In Progress', color: 'border-brand-500/40 text-brand-300', limit: 4 },
    { id: 'Review', title: 'Code & 3D Review', color: 'border-purple-500/40 text-purple-300', limit: 3 },
    { id: 'Testing', title: 'HIL / QA Testing', color: 'border-amber-500/40 text-amber-300' },
    { id: 'Approved', title: 'Approved', color: 'border-emerald-500/40 text-emerald-300' },
    { id: 'Completed', title: 'Done', color: 'border-emerald-500 text-emerald-400' },
    { id: 'Blocked', title: 'Blocked', color: 'border-rose-500 text-rose-400' },
  ];

  const workstreams: string[] = [
    'All',
    'Software',
    '3D Modelling',
    'Hardware',
    'Mechanical',
    'Electrical',
    'Testing',
    'Integration'
  ];

  const filteredTasks = tasks.filter(t => {
    const matchWorkstream = selectedWorkstream === 'All' || t.workstream === selectedWorkstream;
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchWorkstream && matchSearch;
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, newStatus);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Agile Kanban Board</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30">
              Drag & Drop Enabled
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize flow, enforce WIP limits, and balance multi-disciplinary workstreams
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter cards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-44"
            />
          </div>

          {/* Workstream Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedWorkstream}
              onChange={e => setSelectedWorkstream(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none pr-2 py-0.5 cursor-pointer"
            >
              {workstreams.map(w => (
                <option key={w} value={w} className="bg-slate-900 text-slate-200">
                  {w} {w === 'All' ? 'Streams' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Create Task Button */}
          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar min-h-[calc(100vh-220px)]">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const isOverLimit = col.limit !== undefined && colTasks.length > col.limit;

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, col.id)}
              className={`w-72 shrink-0 rounded-2xl bg-[#0b1220]/80 border transition-all flex flex-col ${
                col.id === 'Blocked'
                  ? 'border-rose-900/60 bg-rose-950/10'
                  : 'border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${col.color}`}>
                    {col.title}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isOverLimit
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {colTasks.length} {col.limit ? `/ ${col.limit}` : ''}
                  </span>
                </div>

                {isOverLimit && (
                  <span className="text-[10px] text-rose-400 font-semibold" title="WIP Limit Exceeded">
                    WIP Exceeded!
                  </span>
                )}
              </div>

              {/* Card List */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
                {colTasks.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-[11px] text-slate-500">
                    Drop items here
                  </div>
                ) : (
                  colTasks.map(task => {
                    const assignee = users.find(u => u.id === task.assigneeId);
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id)}
                        onClick={() => onSelectTask(task)}
                        className="glass-card p-3 rounded-xl border border-slate-800 hover:border-brand-500/50 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg group space-y-2.5"
                      >
                        {/* Key, Workstream & Priority */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-brand-400">
                              {task.key}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                              {task.workstream}
                            </span>
                          </div>
                          <Badge
                            variant={
                              task.priority === 'Critical'
                                ? 'danger'
                                : task.priority === 'High'
                                ? 'warning'
                                : 'info'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-white leading-snug">
                          {task.title}
                        </h4>

                        {/* Progress Bar (if > 0) */}
                        {task.progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Progress</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-brand-500 h-full rounded-full"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Card Footer: Hours, Assignee, Stopwatch */}
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <span>{task.estimatedHours}h est</span>
                            {task.storyPoints > 0 && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                                {task.storyPoints} pts
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                startTimer(task);
                              }}
                              className="p-1 rounded-md hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 transition-colors"
                              title="Start Live Stopwatch"
                            >
                              <Play className="w-3 h-3" />
                            </button>

                            {assignee && (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                                title={assignee.name}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
