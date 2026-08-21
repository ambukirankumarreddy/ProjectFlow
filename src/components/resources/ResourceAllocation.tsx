import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import {
  Users2,
  Cpu,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Award
} from 'lucide-react';

export const ResourceAllocation: React.FC = () => {
  const { users, tasks, selectedProject } = useApp();

  // Compute workload for each team member
  const userWorkload = users
    .filter(u => u.role !== 'Client/Viewer')
    .map(user => {
      const assignedTasks = tasks.filter(t => t.assigneeId === user.id && t.status !== 'Completed');
      const totalEstimatedHours = assignedTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
      const capacity = user.availabilityHoursPerWeek || 40;
      const utilization = Math.round((totalEstimatedHours / capacity) * 100);
      const isOverloaded = utilization > 115;

      return {
        ...user,
        assignedTasksCount: assignedTasks.length,
        totalEstimatedHours,
        utilization,
        isOverloaded,
      };
    });

  const overloadedCount = userWorkload.filter(u => u.isOverloaded).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Resource & Manpower Workload Balancing</span>
            <Badge variant="purple" size="sm">
              AI Powered
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Balance Unity developers, 3D artists, embedded hardware, mechanical and electrical engineering disciplines
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Engineering Headcount"
          value={userWorkload.length}
          subtitle="6 Multidisciplinary departments"
          icon={Users2}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
        />
        <MetricCard
          title="Overallocation Alerts"
          value={overloadedCount}
          subtitle={overloadedCount > 0 ? 'Workload rebalance advised' : 'All workloads optimal'}
          icon={AlertTriangle}
          iconColor={overloadedCount > 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}
        />
        <MetricCard
          title="Avg Team Utilization"
          value="87.4%"
          subtitle="Target: 80-95% efficiency"
          icon={Clock}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
        <MetricCard
          title="Bench Resource Capacity"
          value="45 hrs/wk"
          subtitle="Available for fast integration"
          icon={Award}
          iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />
      </div>

      {/* AI Workload Balancing Recommendation Card */}
      <div className="glass-card p-5 rounded-2xl border border-purple-500/40 bg-purple-950/20">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                FlowPilot Workload Optimization Engine
              </h4>
              <Badge variant="purple" size="sm">
                Optimization Available
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              <strong>Recommendation:</strong>{' '}
              {overloadedCount > 0
                ? `${userWorkload.find(u => u.isOverloaded)?.name} is currently allocated with high task load (${userWorkload.find(u => u.isOverloaded)?.assignedTasksCount} tasks). Consider rebalancing tasks to maintain sprint delivery velocity.`
                : 'All team members currently operate within nominal capacity limits. Resource distribution is optimal.'}
            </p>
          </div>
        </div>
      </div>

      {/* Team Allocation Table */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">
            Engineering Skill Matrix & Workload Allocation
          </h3>
          <span className="text-xs text-slate-400">
            Tracking {userWorkload.length} specialists
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Specialist & Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Core Skills</th>
                <th className="py-3 px-4">Assigned Tasks</th>
                <th className="py-3 px-4">Active Hours / Cap</th>
                <th className="py-3 px-4">Workload %</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userWorkload.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
                      />
                      <div>
                        <div className="font-bold text-slate-100">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{user.department}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {user.skills.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {user.assignedTasksCount} tasks
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                    {user.totalEstimatedHours}h / {user.availabilityHoursPerWeek}h
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            user.isOverloaded
                              ? 'bg-rose-500'
                              : user.utilization > 80
                              ? 'bg-emerald-500'
                              : 'bg-brand-500'
                          }`}
                          style={{ width: `${Math.min(user.utilization, 100)}%` }}
                        />
                      </div>
                      <span
                        className={`font-bold ${
                          user.isOverloaded ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {user.utilization}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        user.isOverloaded
                          ? 'danger'
                          : user.status === 'Active'
                          ? 'success'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {user.isOverloaded ? 'OVERALLOCATED' : user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
