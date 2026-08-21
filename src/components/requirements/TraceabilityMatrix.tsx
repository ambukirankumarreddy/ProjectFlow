import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Requirement } from '../../types';
import { Badge } from '../common/Badge';
import {
  FileCheck2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const TraceabilityMatrix: React.FC = () => {
  const { requirements, addRequirement, updateRequirement, tasks, testCases, selectedProject } = useApp();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [rfpRef, setRfpRef] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<
    'Testing' | 'Inspection' | 'Analysis' | 'Demonstration'
  >('Testing');
  const [linkedTaskId, setLinkedTaskId] = useState('');
  const [linkedTestCaseId, setLinkedTestCaseId] = useState('');

  const filtered = requirements.filter(
    r =>
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.rfpReference.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfpRef || !description) return;

    const newReq: Requirement = {
      id: `req-${Date.now()}`,
      rfpReference: rfpRef,
      description,
      priority,
      ownerId: 'usr-1',
      acceptanceCriteria: acceptanceCriteria || 'Standard compliance verified.',
      linkedTaskId: linkedTaskId || undefined,
      linkedTestCaseId: linkedTestCaseId || undefined,
      verificationMethod,
      complianceStatus: 'Under Review',
    };

    addRequirement(newReq);
    setIsAddModalOpen(false);
    setRfpRef('');
    setDescription('');
    setAcceptanceCriteria('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Requirements & Traceability Matrix</span>
            <Badge variant="purple" size="sm">
              MIL-SPEC Audit Grade
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end traceability linking RFP contract requirements to engineering tasks, HIL test cases, and compliance verification evidence
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Requirement</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Requirements</span>
            <h4 className="text-lg font-bold text-slate-100">{requirements.length} RFP Clauses</h4>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Compliance Rate</span>
            <h4 className="text-lg font-bold text-emerald-400">
              {Math.round(
                (requirements.filter(r => r.complianceStatus === 'Compliant').length /
                  (requirements.length || 1)) *
                  100
              )}
              % Verified
            </h4>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Under Review / Partial</span>
            <h4 className="text-lg font-bold text-amber-400">
              {requirements.filter(r => r.complianceStatus !== 'Compliant').length} Pending HIL
            </h4>
          </div>
        </div>
      </div>

      {/* Traceability Table */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-brand-400" />
            Requirement Traceability Matrix (RTM)
          </h3>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search RFP clause..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Requirement / RFP Ref</th>
                <th className="py-3 px-4">Specification & Acceptance Criteria</th>
                <th className="py-3 px-4">Linked Task</th>
                <th className="py-3 px-4">Test Case (QA)</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Evidence / Telemetry</th>
                <th className="py-3 px-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(req => {
                const linkedTask = tasks.find(t => t.id === req.linkedTaskId);
                const linkedTC = testCases.find(tc => tc.id === req.linkedTestCaseId);

                return (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      <span className="font-bold text-purple-400 block">{req.rfpReference}</span>
                      <span className="text-[10px] text-slate-500">{req.priority} Priority</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-semibold text-slate-200 leading-snug">{req.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{req.acceptanceCriteria}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {linkedTask ? (
                        <div>
                          <span className="font-mono font-bold text-brand-400">
                            {linkedTask.key}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                            {linkedTask.title}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Unlinked</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {linkedTC ? (
                        <div>
                          <span className="font-semibold text-cyan-300 block truncate max-w-[140px]">
                            {linkedTC.title}
                          </span>
                          <Badge
                            variant={
                              linkedTC.executionStatus === 'passed'
                                ? 'success'
                                : linkedTC.executionStatus === 'failed'
                                ? 'danger'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {linkedTC.executionStatus}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-slate-500">Pending Test</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                        {req.verificationMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {req.evidence || 'Log file pending'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          req.complianceStatus === 'Compliant'
                            ? 'success'
                            : req.complianceStatus === 'Partial'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {req.complianceStatus}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Requirement Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Contract / RFP Requirement"
          subtitle="Map military specification to engineering WBS tasks & test plans"
          maxWidth="2xl"
        >
          <form onSubmit={handleAddRequirement} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">RFP Reference Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RFP-MIL-2024-005"
                  value={rfpRef}
                  onChange={e => setRfpRef(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Verification Method</label>
                <select
                  value={verificationMethod}
                  onChange={e => setVerificationMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="Testing">Testing (HIL / Simulation)</option>
                  <option value="Inspection">Inspection (Physical / Visual)</option>
                  <option value="Analysis">Analysis (FEA / Math Model)</option>
                  <option value="Demonstration">Demonstration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Requirement Description *</label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Specific operational, ballistics, latency, or environmental clause..."
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Acceptance Criteria</label>
              <textarea
                rows={2}
                value={acceptanceCriteria}
                onChange={e => setAcceptanceCriteria(e.target.value)}
                placeholder="Definitive numerical tolerances or standards..."
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Link to Task</label>
                <select
                  value={linkedTaskId}
                  onChange={e => setLinkedTaskId(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                >
                  <option value="">None (Unlinked)</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.key} - {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Link to Test Case</label>
                <select
                  value={linkedTestCaseId}
                  onChange={e => setLinkedTestCaseId(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                >
                  <option value="">None (Unlinked)</option>
                  {testCases.map(tc => (
                    <option key={tc.id} value={tc.id}>
                      {tc.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand"
              >
                Save Requirement
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
