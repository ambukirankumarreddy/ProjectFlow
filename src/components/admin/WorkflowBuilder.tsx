import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  GitFork,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Layers,
  Settings2,
  Lock,
  Plus
} from 'lucide-react';

export const WorkflowBuilder: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Review');

  const statuses = [
    { id: 'Backlog', label: 'Backlog', desc: 'New unprioritized items', color: 'border-slate-700 bg-slate-900 text-slate-300' },
    { id: 'Selected', label: 'Selected', desc: 'Committed for active sprint', color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300' },
    { id: 'In Progress', label: 'In Progress', desc: 'Under active engineering dev', color: 'border-brand-500/40 bg-brand-950/20 text-brand-300' },
    { id: 'Review', label: 'Review', desc: 'Code & 3D mesh peer review', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
    { id: 'Testing', label: 'Testing / HIL', desc: 'Hardware-in-loop verification', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
    { id: 'Approved', label: 'Approved', desc: 'Lead / Client sign-off', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
    { id: 'Completed', label: 'Completed', desc: 'Finalized and deployed', color: 'border-emerald-500 bg-emerald-950/30 text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Workflow Engine & Status Transitions</span>
            <Badge variant="purple" size="sm">
              Visual State Machine
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure stage-gate approvals, transition guard permissions, escalation SLAs, and mandatory field requirements
          </p>
        </div>
      </div>

      {/* Visual State Machine Flowchart */}
      <div className="glass-card p-6 rounded-3xl border space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <GitFork className="w-4 h-4 text-brand-400" />
          Default Simulator Engineering Workflow Flowchart
        </h3>

        {/* Flowchart Diagram */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 custom-scrollbar">
          {statuses.map((st, i) => {
            const isSelected = selectedStatus === st.id;
            return (
              <React.Fragment key={st.id}>
                <div
                  onClick={() => setSelectedStatus(st.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all min-w-[140px] text-center space-y-1 group ${
                    st.color
                  } ${
                    isSelected ? 'ring-2 ring-brand-400 shadow-glow-brand scale-105' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="text-xs font-extrabold">{st.label}</div>
                  <div className="text-[10px] opacity-75 line-clamp-1">{st.desc}</div>
                </div>

                {i < statuses.length - 1 && (
                  <div className="flex items-center text-slate-600 shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Special States (Blocked Loop) */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span>
              <strong>Blocked State Exception:</strong> Any task in "In Progress" or "Review" can transition to <strong>Blocked</strong> when hardware procurement is delayed, and seamlessly restore to "In Progress" upon resolution.
            </span>
          </div>
          <Badge variant="danger" size="sm">
            Bidirectional Transition
          </Badge>
        </div>
      </div>

      {/* Selected Status Transition Inspector */}
      <div className="glass-card p-6 rounded-3xl border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Transition Rules & Permissions for: <strong className="text-brand-400">[{selectedStatus}]</strong>
            </h3>
          </div>
          <Badge variant="primary" size="sm">
            Active Configuration
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 block">Required Approver Role:</span>
            <select className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs">
              <option>Team Lead & Project Manager</option>
              <option>QA Lead Only</option>
              <option>Client Technical Representative</option>
              <option>Any Project Member</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 block">Mandatory Fields on Transition:</span>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-brand-500" />
                <span>Actual Logged Hours</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-brand-500" />
                <span>Peer Review Sign-off</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-brand-500" />
                <span>Checklist Verification</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 block">Escalation SLA Rule:</span>
            <select className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs">
              <option>Escalate to PM after 24 hours inactive</option>
              <option>Escalate after 48 hours</option>
              <option>Send AI Notification to Team Lead</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
