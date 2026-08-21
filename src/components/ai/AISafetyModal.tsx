import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  X,
  Sparkles,
  Layers,
  CheckSquare,
  Repeat
} from 'lucide-react';

export const AISafetyModal: React.FC = () => {
  const { pendingAIAction, setPendingAIAction, executePendingAIAction } = useApp();

  if (!pendingAIAction) return null;

  return (
    <Modal
      isOpen={!!pendingAIAction}
      onClose={() => setPendingAIAction(null)}
      title="AI Action Safety Verification & Approval"
      subtitle="Preview changes, confidence metrics, and target modifications before committing"
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Safety Header Badge */}
        <div className="p-3.5 rounded-2xl bg-brand-950/40 border border-brand-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-100">{pendingAIAction.title}</div>
              <div className="text-[11px] text-slate-400">Prompt: "{pendingAIAction.prompt}"</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">Confidence</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {pendingAIAction.confidence}%
            </span>
          </div>
        </div>

        {/* Safety Checks Checklist */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h4 className="font-bold text-slate-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Autonomous Safety Validations Passed:
          </h4>
          <ul className="space-y-1 text-[11px] text-slate-400 pl-6 list-disc">
            <li>Zero automatic data deletion (Destructive actions blocked by policy)</li>
            <li>Role-Based Access Control verified for active user</li>
            <li>Schedule conflict and dependency loop analysis completed</li>
            <li>Audit log entry staged for persistence</li>
          </ul>
        </div>

        {/* Proposed Changes Summary */}
        <div>
          <h4 className="font-bold uppercase text-[10px] tracking-wider text-slate-400 mb-2">
            Staged Database Changes:
          </h4>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-[11px]">
            {pendingAIAction.type === 'create_project' && (
              <div className="space-y-1 text-slate-300">
                <div>+ Insert 1 New Project: {pendingAIAction.proposedChanges.project?.name}</div>
                <div>+ Insert {pendingAIAction.proposedChanges.project?.modules?.length || 0} Workstream Modules</div>
                <div>+ Insert {pendingAIAction.proposedChanges.sprints?.length || 0} Sprints</div>
                <div>+ Insert {pendingAIAction.proposedChanges.tasks?.length || 0} Engineering Tasks</div>
              </div>
            )}
            {pendingAIAction.type === 'create_tasks' && (
              <div className="text-slate-300">
                + Batch insert {pendingAIAction.proposedChanges.tasks?.length || 0} Tasks
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setPendingAIAction(null)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Reject / Cancel
          </button>
          <button
            type="button"
            onClick={executePendingAIAction}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-2 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm & Execute Action</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
