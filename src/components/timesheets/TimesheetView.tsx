import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimesheetEntry } from '../../types';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { formatIndianDate, formatINR } from '../../utils/formatters';
import {
  Clock,
  Play,
  CheckCircle,
  Plus,
  Calendar,
  IndianRupee,
  Award,
  Check,
  X,
  FileText
} from 'lucide-react';

export const TimesheetView: React.FC = () => {
  const {
    timesheets,
    addTimesheetEntry,
    approveTimesheet,
    tasks,
    users,
    currentUser,
    startTimer,
    activeTimer,
    activeRole
  } = useApp();

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || '');
  const [manualHours, setManualHours] = useState('4.0');
  const [manualDate, setManualDate] = useState('2026-08-20');
  const [manualDesc, setManualDesc] = useState('');
  const [isBillable, setIsBillable] = useState(true);

  const canApprove =
    activeRole === 'Super Admin' ||
    activeRole === 'Organization Admin' ||
    activeRole === 'Project Manager' ||
    activeRole === 'Team Lead';

  const totalLoggedHours = timesheets.reduce((acc, curr) => acc + curr.hours, 0);
  const billableHours = timesheets
    .filter(ts => ts.billable)
    .reduce((acc, curr) => acc + curr.hours, 0);
  const pendingApprovalsCount = timesheets.filter(ts => ts.status === 'submitted').length;

  const handleCreateManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    const newEntry: TimesheetEntry = {
      id: `ts-${Date.now()}`,
      userId: currentUser.id,
      taskId: selectedTaskId,
      projectId: task.projectId,
      date: manualDate,
      hours: Number(manualHours) || 1,
      billable: isBillable,
      description: manualDesc || `Worked on ${task.title}`,
      status: 'submitted',
      approverId: currentUser.functionalManagerId || 'usr-1',
    };

    addTimesheetEntry(newEntry);
    setIsManualModalOpen(false);
    setManualDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Timesheets & Time Tracking</span>
            <Badge variant="primary" size="sm">
              Live Stopwatch Synced
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log engineering effort, manage multi-tier approvals, and track billable simulator milestones in Indian Rupees (₹)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Time Log</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Logged Time"
          value={`${totalLoggedHours.toFixed(1)}h`}
          subtitle="Across all active workstreams"
          icon={Clock}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
        />
        <MetricCard
          title="Billable Ratio"
          value={`${((billableHours / (totalLoggedHours || 1)) * 100).toFixed(0)}%`}
          subtitle={`${billableHours.toFixed(1)}h billable to client`}
          icon={IndianRupee}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          subtitle={canApprove ? 'Review timesheets below' : 'Awaiting PM review'}
          icon={Calendar}
          iconColor={pendingApprovalsCount > 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-800 border-slate-700'}
        />
        <MetricCard
          title="Avg Blended Rate"
          value="₹2,400 / hr"
          subtitle="Multi-stream specialist rate"
          icon={Award}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Timesheet Entries Table */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            Weekly Engineering Timesheet Logs
          </h3>
          <span className="text-xs text-slate-400 font-mono">{timesheets.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Date (DD/MM/YYYY)</th>
                <th className="py-3 px-4">Engineer</th>
                <th className="py-3 px-4">Task & Key</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Billable</th>
                <th className="py-3 px-4">Approval Status</th>
                {canApprove && <th className="py-3 px-4 text-right">Review Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {timesheets.map(ts => {
                const user = users.find(u => u.id === ts.userId);
                const task = tasks.find(t => t.id === ts.taskId);

                return (
                  <tr key={ts.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {formatIndianDate(ts.date)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                      {user ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <span className="font-semibold text-slate-200">{user.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Unknown</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                      <div className="font-mono font-bold text-brand-400">
                        {task?.key || 'PRJ-100'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {task?.title || 'General Engineering'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm font-sans">
                      <p className="line-clamp-2">{ts.description}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100 whitespace-nowrap">
                      {ts.hours.toFixed(1)} hrs
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                      <Badge variant={ts.billable ? 'success' : 'neutral'} size="sm">
                        {ts.billable ? 'Billable' : 'Internal'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                      <Badge
                        variant={
                          ts.status === 'approved'
                            ? 'success'
                            : ts.status === 'submitted'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {ts.status.toUpperCase()}
                      </Badge>
                    </td>
                    {canApprove && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-sans">
                        {ts.status === 'submitted' ? (
                          <button
                            onClick={() => approveTimesheet(ts.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">Verified</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Time Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsManualModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0d1527] border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" />
                Manual Timesheet Log
              </h3>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualEntry} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Task *</label>
                <select
                  value={selectedTaskId}
                  onChange={e => setSelectedTaskId(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                >
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.key} - {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={e => setManualDate(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hours Logged</label>
                  <input
                    type="number"
                    step="0.5"
                    value={manualHours}
                    onChange={e => setManualHours(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Accomplished</label>
                <textarea
                  value={manualDesc}
                  onChange={e => setManualDesc(e.target.value)}
                  rows={2}
                  placeholder="Detail changes, bugfixes, or deliverables..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billableManual"
                  checked={isBillable}
                  onChange={e => setIsBillable(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-brand-500"
                />
                <label htmlFor="billableManual" className="text-slate-300">
                  Billable to client
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand"
                >
                  Submit Timesheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
