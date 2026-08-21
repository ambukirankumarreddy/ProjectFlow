import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskPriority, WorkstreamType } from '../../types';
import { Badge } from '../common/Badge';
import {
  CheckSquare,
  Search,
  Plus,
  Filter,
  Play,
  Layers,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const TaskListView: React.FC<{ onOpenCreateTask: () => void; onSelectTask: (t: Task) => void }> = ({
  onOpenCreateTask,
  onSelectTask,
}) => {
  const { tasks, users, startTimer } = useApp();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const filteredTasks = tasks.filter(t => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.key.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === 'All' || t.status === selectedStatus;
    const matchStream = selectedStream === 'All' || t.workstream === selectedStream;
    const matchPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    return matchSearch && matchStatus && matchStream && matchPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Tasks & Engineering Work Items</span>
            <Badge variant="primary" size="sm">
              {filteredTasks.length} Items
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full enterprise work item tracking across all hardware, software, and simulation modules
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search key, title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Backlog">Backlog</option>
          <option value="Selected">Selected</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Testing">Testing</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </select>

        {/* Workstream Filter */}
        <select
          value={selectedStream}
          onChange={e => setSelectedStream(e.target.value)}
          className="p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="All">All Workstreams</option>
          <option value="Software">Software</option>
          <option value="3D Modelling">3D Modelling</option>
          <option value="Hardware">Hardware</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Electrical">Electrical</option>
          <option value="Testing">Testing</option>
          <option value="Integration">Integration</option>
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={e => setSelectedPriority(e.target.value)}
          className="p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="All">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Key</th>
                <th className="py-3 px-3">Title & Scope</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Workstream</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assignee</th>
                <th className="py-3 px-3">Points / Est</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No tasks match the active filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => {
                  const assignee = users.find(u => u.id === task.assigneeId);
                  return (
                    <tr
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-brand-400 whitespace-nowrap">
                        {task.key}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="font-semibold text-slate-200 group-hover:text-brand-300 truncate">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Due: {task.dueDate}</span>
                          <span>•</span>
                          <span>{task.checklist.length} checklist items</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                          {task.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <Badge variant="neutral" size="sm">
                          {task.workstream}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
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
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
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
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {assignee ? (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                            />
                            <span className="text-slate-300">{assignee.name.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        {task.storyPoints} pts ({task.estimatedHours}h)
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-brand-500 h-full rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">{task.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => startTimer(task)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          title="Start live stopwatch"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
