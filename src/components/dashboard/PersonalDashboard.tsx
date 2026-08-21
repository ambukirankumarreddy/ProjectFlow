import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Play,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Flame,
  CheckCircle
} from 'lucide-react';

export const PersonalDashboard: React.FC = () => {
  const { currentUser, tasks, timesheets, meetings, startTimer, setCurrentView, moveTaskStatus } = useApp();

  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  const myActiveTasks = myTasks.filter(t => t.status !== 'Completed');
  const myCompletedTasks = myTasks.filter(t => t.status === 'Completed');
  const overdueTasks = myActiveTasks.filter(t => new Date(t.dueDate) < new Date('2026-08-22'));

  const myTimesheets = timesheets.filter(ts => ts.userId === currentUser.id);
  const totalHoursThisWeek = myTimesheets.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with AI Greeting */}
      <div className="glass-card p-6 rounded-2xl border relative overflow-hidden bg-gradient-to-r from-brand-950/40 via-purple-950/20 to-slate-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/40 shadow-glow-brand"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-100">
                  Welcome back, {currentUser.name}
                </h2>
                <Badge variant="purple" size="sm">
                  {currentUser.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser.department} • {currentUser.designation} • {myActiveTasks.length} active assignments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('my-work')}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-2 transition-all"
            >
              <span>Focus Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assigned to Me"
          value={myActiveTasks.length}
          subtitle={`${myCompletedTasks.length} completed this cycle`}
          icon={CheckSquare}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
        />
        <MetricCard
          title="Hours Logged (Week)"
          value={`${totalHoursThisWeek.toFixed(1)}h`}
          subtitle="Target: 40h / week"
          change="+12% vs last week"
          isPositive={true}
          icon={Clock}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="Overdue / Critical"
          value={overdueTasks.length}
          subtitle={overdueTasks.length > 0 ? 'Requires immediate focus' : 'All deliverables on track'}
          icon={AlertCircle}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
        <MetricCard
          title="Productivity Score"
          value="94%"
          subtitle="Top 5% of engineering team"
          icon={Award}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Main Grid: Left Tasks & Right AI Daily Plan + Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Tasks with 1-click Timer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Priority Task Queue
            </h3>
            <button
              onClick={() => setCurrentView('tasks')}
              className="text-xs text-brand-400 hover:underline font-semibold"
            >
              View all tasks
            </button>
          </div>

          <div className="space-y-3">
            {myActiveTasks.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-slate-400">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-200">You are all caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No pending tasks assigned to you right now.</p>
              </div>
            ) : (
              myActiveTasks.map(task => (
                <div
                  key={task.id}
                  className="glass-card p-4 rounded-2xl border hover:border-brand-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="neutral" size="sm">
                        {task.key}
                      </Badge>
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
                      <span className="text-[11px] text-slate-400">
                        {task.workstream}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                      {task.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Due: {task.dueDate}</span>
                      <span>•</span>
                      <span>Est: {task.estimatedHours}h</span>
                      <span>•</span>
                      <span>Actual: {task.actualHours}h</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => startTimer(task)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Start stopwatch for this task"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>

                    <button
                      onClick={() => moveTaskStatus(task.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 text-xs font-semibold transition-colors"
                      title="Mark as completed"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: AI Daily Work Plan & Standup Notes */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20">
            <div className="flex items-center gap-2 pb-3 border-b border-purple-500/20">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
                AI Daily Work Plan
              </h3>
            </div>

            <div className="mt-3 space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-purple-500/20">
                <span className="font-bold text-amber-300 block mb-1">1. Morning Focus:</span>
                Complete remaining C# ballistics calculation equations to unlock QA test plan #tc-1.
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-purple-500/20">
                <span className="font-bold text-brand-300 block mb-1">2. Collaboration Sync:</span>
                Coordinate with David Chen regarding CAN Bus 200Hz joystick packets before 2:00 PM.
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-purple-500/20">
                <span className="font-bold text-emerald-300 block mb-1">3. Standup Note Prepared:</span>
                "Yesterday finished Runge-Kutta 4th order integrator. Today wrapping up thermal shader depth sorting."
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="glass-card p-5 rounded-2xl border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                Upcoming Meetings
              </h3>
            </div>

            <div className="mt-3 space-y-2.5">
              {meetings.slice(0, 2).map(m => (
                <div key={m.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="font-bold text-slate-200">{m.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{m.date}</span>
                    <span>•</span>
                    <span>{m.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
