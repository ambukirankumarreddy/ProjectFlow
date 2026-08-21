import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertEscalationRecord, NotificationSeverity } from '../../types';
import { Badge } from '../common/Badge';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Users2,
  Layers,
  ChevronRight,
  Flame,
  Zap,
  Volume2,
  RotateCcw
} from 'lucide-react';

export const AlertEscalationView: React.FC = () => {
  const {
    alertEscalations,
    acknowledgeEscalation,
    resolveEscalation,
    triggerAlertEscalation,
    triggerEmergencyAlert,
    tasks,
    users,
    currentUser,
    playNotificationSound,
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || 'task-1');
  const [escalationReason, setEscalationReason] = useState('Critical milestone buffer lag on Moog servo valves');

  const handleSimulateEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAlertEscalation(selectedTaskId, escalationReason);
  };

  const stages = [
    { stage: 1, title: 'Stage 1: Assigned Specialist', sla: '0-24 Hours', color: 'border-blue-500/40 bg-blue-950/20 text-blue-300' },
    { stage: 2, title: 'Stage 2: Disciplinary Team Lead', sla: '24-48 Hours', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
    { stage: 3, title: 'Stage 3: Principal Project Lead', sla: '48-72 Hours', color: 'border-orange-500/40 bg-orange-950/20 text-orange-300' },
    { stage: 4, title: 'Stage 4: Delivery Head & PM', sla: '72-96 Hours', color: 'border-rose-500/40 bg-rose-950/20 text-rose-300' },
    { stage: 5, title: 'Stage 5: Managing Director / MD', sla: '>96 Hours', color: 'border-red-600 bg-red-950/40 text-red-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Alert Escalation & Manpower Hierarchy Router</span>
            <Badge variant="danger" size="sm">
              5-Stage Chain
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated escalation of overdue tasks, milestone buffers, and simulator blockers through the 3-tier reporting tree
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              triggerEmergencyAlert(
                'Hydraulic Platform Pressure Cutoff Failure',
                'Moog 180-bar safety relief valve tripped during continuous firing simulation. Evacuate motion base.'
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-glow-rose flex items-center gap-1.5 transition-all"
          >
            <Flame className="w-4 h-4 animate-bounce" />
            <span>Simulate Emergency Siren</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Escalation Pipeline Visual Banner */}
      <div className="glass-card p-6 rounded-3xl border space-y-4 bg-[#090f1b]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Users2 className="w-4 h-4 text-brand-400" />
            <span>Manpower Hierarchy Escalation Pathway</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Automated SLA Thresholds</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {stages.map((st, i) => (
            <div
              key={st.stage}
              className={`p-3.5 rounded-2xl border text-xs space-y-1.5 relative ${st.color}`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{st.title}</span>
                {i < stages.length - 1 && (
                  <ChevronRight className="w-4 h-4 hidden sm:block text-slate-600 absolute -right-2.5 top-1/2 -translate-y-1/2 z-10" />
                )}
              </div>
              <p className="text-[10px] opacity-80">SLA Trigger: {st.sla}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Form & Active Escalations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Trigger Test Escalation (4 Cols) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border space-y-4 bg-[#090f1b]">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-slate-100">
              Simulate Hierarchy Escalation
            </h3>
          </div>

          <form onSubmit={handleSimulateEscalation} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Task</label>
              <select
                value={selectedTaskId}
                onChange={e => setSelectedTaskId(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
              >
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.key} - {t.title.substring(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Escalation Reason / Delay Lag
              </label>
              <textarea
                rows={2}
                value={escalationReason}
                onChange={e => setEscalationReason(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold shadow-glow-amber flex items-center justify-center gap-2 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Trigger Escalation Route</span>
            </button>
          </form>
        </div>

        {/* Right Active Escalations List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <span>Active Escalated Alerts</span>
              <Badge variant="warning" size="sm">
                {alertEscalations.filter(e => !e.isResolved).length} Active
              </Badge>
            </h3>
          </div>

          <div className="space-y-3">
            {alertEscalations.map(esc => (
              <div
                key={esc.id}
                className={`glass-card p-5 rounded-2xl border transition-all text-xs space-y-3 ${
                  esc.isResolved
                    ? 'border-emerald-500/30 bg-emerald-950/10 text-slate-400'
                    : esc.severity === 'critical'
                    ? 'border-rose-500/40 bg-rose-950/20 text-slate-200 shadow-sm'
                    : 'border-amber-500/40 bg-amber-950/20 text-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-400">{esc.taskKey}</span>
                    <span className="font-bold text-slate-100">{esc.taskTitle}</span>
                  </div>

                  <Badge variant={esc.isResolved ? 'success' : 'danger'} size="sm">
                    {esc.stageLabel}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Escalated To Authority:</span>
                    <span className="font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-brand-400" />
                      {esc.escalatedToUserName} ({esc.escalatedToRole})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Trigger Timestamp:</span>
                    <span className="font-mono text-slate-200 mt-0.5 block">{esc.triggeredAt}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-semibold">Reason:</span> {esc.reason}
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400">
                    {esc.isAcknowledged ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Acknowledged by {esc.acknowledgedBy} at {esc.acknowledgedAt}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Acknowledgment
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!esc.isAcknowledged && (
                      <button
                        onClick={() => acknowledgeEscalation(esc.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}

                    {!esc.isResolved && (
                      <button
                        onClick={() => resolveEscalation(esc.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
